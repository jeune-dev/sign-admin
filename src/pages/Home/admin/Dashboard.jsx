import { useEffect, useRef, useState } from "react";
import { statistiques } from "../../../service/admin/adminService";
import { formatDate, formatNombre } from "../../../utils/format";
import {
  Users, FileText, FileSignature, RefreshCw,
  TrendingUp, AlertCircle, FolderOpen
} from "lucide-react";

/* Couleurs réutilisées pour les répartitions */
const ROLE_COLORS = {
  Particulier:   "#10b981",
  Independant:   "#f59e0b",
  Professionnel: "#6366f1",
  Admin:         "#111827",
};

const TYPE_COLORS = [
  "#111827", "#6366f1", "#10b981", "#f59e0b", "#ef4444",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
];

/* État initial : tout à zéro pour éviter les undefined avant le chargement */
const EMPTY_STATS = {
  utilisateurs: { total: 0, actifs: 0, inactifs: 0, parRole: {}, nouveauxParMois: [] },
  contrats:     { total: 0, parType: [], parStatut: { signe: 0, en_attente: 0, autres: 0 }, nouveauxParMois: [] },
  factures:     { total: 0, nouveauxParMois: [] },
  documents:    { total: 0, nouveauxParMois: [] },
  recents:      { contrats: [], factures: [], utilisateurs: [] },
  periode:      { debut: null, fin: null },
};

/* ─── Petit graphique en barres (réutilise .chart-bars du CSS) ─── */
function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.valeur), 1);
  return (
    <div className="chart-bars">
      {data.map((d) => (
        <div key={d.mois} className="chart-bar" style={{ height: `${Math.max((d.valeur / max) * 100, 4)}%` }}>
          <span className="chart-bar-value">{d.valeur}</span>
          <span className="chart-bar-label">{d.mois}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── Badges de statut ─────────────────────────────────────── */
const STATUT_FACTURE = {
  payee:      { label: "Payée",      css: "active" },
  partiel:    { label: "Partiel",    css: "pending" },
  en_attente: { label: "En attente", css: "inactive" },
};
const STATUT_CONTRAT = {
  signe:      { label: "Signé",      css: "active" },
  en_attente: { label: "En attente", css: "pending" },
};

export default function Dashboard() {
  const [stats, setStats]     = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur]   = useState(false);
  // Période personnalisée — vide = comportement par défaut du backend
  // (6 derniers mois).
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo]     = useState("");

  // Identifie la requête la plus récente : ignore une réponse devenue
  // obsolète si la période a changé avant qu'elle ne revienne.
  const requestIdRef = useRef(0);

  const fetchStats = async () => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setErreur(false);
    try {
      const res = await statistiques({ dateFrom, dateTo });
      if (requestId !== requestIdRef.current) return;
      // L'endpoint renvoie l'objet stats directement dans `data` (déjà déballé par le service)
      if (res) setStats({ ...EMPTY_STATS, ...res });
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      console.error("Erreur lors de la récupération des statistiques :", error);
      setErreur(true);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  };

  // Debounce des changements de période — évite de relancer l'appel API à
  // chaque segment saisi dans les <input type="date"> (jour/mois/année).
  useEffect(() => {
    const t = setTimeout(() => { fetchStats(); }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFrom, dateTo]);

  const resetPeriode = () => { setDateFrom(""); setDateTo(""); };

  const { utilisateurs, contrats, factures, documents, recents, periode } = stats;
  const periodeLabel = (dateFrom && dateTo)
    ? `du ${periode.debut || dateFrom} au ${periode.fin || dateTo}`
    : "6 derniers mois";

  // KPIs orientés pilotage de la plateforme
  const kpis = [
    { label: "Utilisateurs",      value: formatNombre(utilisateurs.total), icon: Users,         sub: `${utilisateurs.actifs} actifs`,      color: "#6366f1" },
    { label: "Contrats générés",  value: formatNombre(contrats.total),     icon: FileSignature, sub: `${contrats.parStatut.signe} signés`,  color: "#8b5cf6" },
    { label: "Factures générées", value: formatNombre(factures.total),     icon: FileText,      sub: "documents clients",                  color: "#3b82f6" },
    { label: "Documents générés", value: formatNombre(documents.total),    icon: FolderOpen,    sub: "contrats + factures",                color: "#14b8a6" },
  ];

  const totalRoles = Object.values(utilisateurs.parRole).reduce((a, b) => a + b, 0) || 1;
  const maxType = Math.max(...contrats.parType.map((t) => t.valeur), 1);

  if (loading) {
    return (
      <div className="dash-loading">
        <div className="dash-spinner" />
        <span>Chargement des statistiques…</span>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      {/* ─── Header ─────────────────────────────────────────── */}
      <div className="dashboard-header">
        <div>
          <h2 className="header-title">Pilotage de la plateforme</h2>
          <p className="header-subtitle">Croissance des utilisateurs et activité documentaire</p>
        </div>
        <div className="filters-container">
          <input
            type="date"
            className="filter-select"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            title="Période — à partir de"
          />
          <input
            type="date"
            className="filter-select"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            title="Période — jusqu'à"
          />
          {(dateFrom || dateTo) && (
            <button className="refresh-btn" onClick={resetPeriode}>
              Réinitialiser
            </button>
          )}
          <button className="refresh-btn" onClick={fetchStats}>
            <RefreshCw size={16} />
            Actualiser
          </button>
        </div>
      </div>

      {erreur && (
        <div className="dash-error">
          <div className="dash-error-icon"><AlertCircle size={20} /></div>
          <div className="dash-error-text">
            <strong>Impossible de charger les statistiques</strong>
            <span>Le serveur n'a pas répondu. Réessayez ou vérifiez la connexion.</span>
          </div>
          <button className="dash-error-retry" onClick={fetchStats}>
            <RefreshCw size={15} /> Réessayer
          </button>
        </div>
      )}

      {/* ─── KPIs ───────────────────────────────────────────── */}
      <div className="kpis-grid">
        {kpis.map((kpi) => (
          <div className="kpi-card kpi-card--accent" key={kpi.label} style={{ "--accent": kpi.color }}>
            <div className="kpi-header">
              <div>
                <div className="kpi-value">{kpi.value}</div>
                <div className="kpi-label">{kpi.label}</div>
              </div>
              <div className="kpi-icon-wrapper" style={{ background: `${kpi.color}1a`, borderColor: `${kpi.color}33`, color: kpi.color }}>
                <kpi.icon size={24} />
              </div>
            </div>
            <div className="kpi-sub">{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* ─── Activité documentaire + répartition rôles ──────── */}
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-header">
            <span className="chart-title">Documents générés ({periodeLabel})</span>
            <FileText size={18} color="#14b8a6" />
          </div>
          <div className="chart-placeholder" style={{ background: "transparent" }}>
            <BarChart data={documents.nouveauxParMois} />
          </div>
        </div>

        <div className="repartition-card">
          <div className="repartition-header">
            <h3>Répartition des utilisateurs</h3>
          </div>
          <div className="repartition-list">
            {Object.entries(utilisateurs.parRole).map(([role, valeur]) => (
              <div className="repartition-item-col" key={role}>
                <div className="repartition-item-top">
                  <span className="repartition-label">
                    <span className="repartition-dot" style={{ background: ROLE_COLORS[role] || "#999" }} />
                    {role}
                  </span>
                  <span className="repartition-value">
                    <strong>{valeur}</strong>
                  </span>
                </div>
                <div className="repartition-bar-track">
                  <div className="repartition-bar-fill" style={{ width: `${(valeur / totalRoles) * 100}%`, background: ROLE_COLORS[role] || "#999" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Croissance utilisateurs + contrats par type ────── */}
      <div className="charts-grid">
        <div className="chart-container">
          <div className="chart-header">
            <span className="chart-title">Nouveaux utilisateurs ({periodeLabel})</span>
            <TrendingUp size={18} color="#10b981" />
          </div>
          <div className="chart-placeholder" style={{ background: "transparent" }}>
            <BarChart data={utilisateurs.nouveauxParMois} />
          </div>
        </div>

        <div className="repartition-card">
          <div className="repartition-header">
            <h3>Contrats par type</h3>
          </div>
          <div className="repartition-list">
            {contrats.parType.map((t, i) => (
              <div className="repartition-item-col" key={t.code}>
                <div className="repartition-item-top">
                  <span className="repartition-label">
                    <span className="repartition-dot" style={{ background: TYPE_COLORS[i % TYPE_COLORS.length] }} />
                    {t.label}
                  </span>
                  <span className="repartition-value"><strong>{t.valeur}</strong></span>
                </div>
                <div className="repartition-bar-track">
                  <div className="repartition-bar-fill" style={{ width: `${(t.valeur / maxType) * 100}%`, background: TYPE_COLORS[i % TYPE_COLORS.length] }} />
                </div>
              </div>
            ))}
            {contrats.parType.length === 0 && <p className="dash-empty">Aucun contrat</p>}
          </div>
        </div>
      </div>

      {/* ─── Activité récente ───────────────────────────────── */}
      <div className="recents-grid">
        {/* Derniers contrats */}
        <div className="table-container">
          <div className="table-header">
            <span className="table-title"><FileSignature size={18} /> Derniers contrats</span>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr><th>Numéro</th><th>Type</th><th>Statut</th><th>Date</th></tr>
              </thead>
              <tbody>
                {recents.contrats.map((c) => {
                  const s = STATUT_CONTRAT[c.statut] || { label: c.statut || "—", css: "pending" };
                  return (
                    <tr key={`${c.typeCode}-${c.id}`}>
                      <td className="user-name-cell">{c.numero_contrat || "—"}</td>
                      <td>{c.type}</td>
                      <td><span className={`status-badge ${s.css}`}>{s.label}</span></td>
                      <td className="user-email-cell">{formatDate(c.date || c.createdAt)}</td>
                    </tr>
                  );
                })}
                {recents.contrats.length === 0 && <tr><td colSpan={4} className="dash-empty">Aucun contrat récent</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dernières factures (sans montant — donnée client) */}
        <div className="table-container">
          <div className="table-header">
            <span className="table-title"><FileText size={18} /> Dernières factures</span>
          </div>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr><th>Numéro</th><th>Client</th><th>Statut</th><th>Date</th></tr>
              </thead>
              <tbody>
                {recents.factures.map((f) => {
                  const s = STATUT_FACTURE[f.statut] || { label: f.statut || "—", css: "pending" };
                  const client = f.client ? `${f.client.prenom || ""} ${f.client.nom || ""}`.trim() : "—";
                  return (
                    <tr key={f.id}>
                      <td className="user-name-cell">{f.numero_facture || "—"}</td>
                      <td className="user-email-cell">{client || "—"}</td>
                      <td><span className={`status-badge ${s.css}`}>{s.label}</span></td>
                      <td className="user-email-cell">{formatDate(f.createdAt)}</td>
                    </tr>
                  );
                })}
                {recents.factures.length === 0 && <tr><td colSpan={4} className="dash-empty">Aucune facture récente</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Derniers utilisateurs */}
      <div className="table-container" style={{ marginBottom: 32 }}>
        <div className="table-header">
          <span className="table-title"><Users size={18} /> Derniers utilisateurs inscrits</span>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr><th>Utilisateur</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Inscrit le</th></tr>
            </thead>
            <tbody>
              {recents.utilisateurs.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="user-info-cell">
                      <div className="user-avatar-small">
                        {`${(u.prenom || "")[0] || ""}${(u.nom || "")[0] || ""}`.toUpperCase() || "?"}
                      </div>
                      <div><div className="user-name-cell">{u.prenom} {u.nom}</div></div>
                    </div>
                  </td>
                  <td className="user-email-cell">{u.email}</td>
                  <td>
                    <span className={`role-badge ${
                      u.role === "Professionnel" ? "role-pro" :
                      u.role === "Independant" ? "role-indep" : "role-part"
                    }`}>{u.role}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${u.statut === "actif" ? "active" : "inactive"}`}>
                      {u.statut === "actif" ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="user-email-cell">{formatDate(u.createdAt)}</td>
                </tr>
              ))}
              {recents.utilisateurs.length === 0 && <tr><td colSpan={5} className="dash-empty">Aucun utilisateur récent</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
