import React, { useState } from 'react';
import {
  History, ChevronLeft, ChevronRight, Search, Download,
  LogIn, LogOut, ShieldAlert, UserCog, KeyRound, FileWarning,
} from 'lucide-react';
import AccessDenied from '../../../components/AccessDenied';
import { useServerList } from '../../../hooks/useServerList';
import { formatDateHeure } from '../../../utils/format';
import { listerAuditLog } from '../../../service/admin/adminService';
import { fetchAllPages } from '../../../utils/fetchAllPages';
import { exportToCsv } from '../../../utils/exportCsv';

import '../../../assets/css/factures.css';
import '../../../assets/css/AuditLog.css';

/*
 * Catalogue des actions tracées.
 *
 * `ton` classe l'action par nature plutôt que par gravité : c'est ce qu'on
 * cherche en parcourant un journal — distinguer d'un coup d'œil une connexion
 * d'une suppression. `famille` sert au filtre par regroupement.
 */
const ACTIONS = {
  // ── Accès au dashboard ────────────────────────────────────────────
  'admin.connexion':            { label: 'Connexion',                  ton: 'acces',   famille: 'admin.' },
  'admin.deconnexion':          { label: 'Déconnexion',                ton: 'neutre',  famille: 'admin.' },
  'admin.connexion_echouee':    { label: 'Connexion refusée',          ton: 'alerte',  famille: 'admin.' },

  // ── Compte de l'administrateur lui-même ───────────────────────────
  'admin.profil_modifie':       { label: 'Profil modifié',             ton: 'neutre',  famille: 'admin.' },
  'admin.mot_de_passe_change':  { label: 'Mot de passe changé',        ton: 'sensible', famille: 'admin.' },

  // ── Gestion des administrateurs ───────────────────────────────────
  'admin.creer':                { label: 'Administrateur créé',        ton: 'sensible', famille: 'admin.' },
  'admin.modifier_permissions': { label: 'Permissions modifiées',      ton: 'sensible', famille: 'admin.' },

  // ── Gestion des utilisateurs ──────────────────────────────────────
  'utilisateur.creer':          { label: 'Utilisateur créé',           ton: 'sensible', famille: 'utilisateur.' },
  'utilisateur.activer':        { label: 'Utilisateur activé',         ton: 'positif', famille: 'utilisateur.' },
  'utilisateur.desactiver':     { label: 'Utilisateur désactivé',      ton: 'alerte',  famille: 'utilisateur.' },
  'utilisateur.rejeter':        { label: 'Document rejeté',            ton: 'alerte',  famille: 'utilisateur.' },
  'utilisateur.supprimer':      { label: 'Utilisateur supprimé',       ton: 'alerte',  famille: 'utilisateur.' },

  // ── File de vérification d'identité ───────────────────────────────
  'demande_inscription.validee': { label: 'Inscription validée',       ton: 'positif', famille: 'demande_inscription.' },
  'demande_inscription.rejetee': { label: 'Inscription refusée',       ton: 'alerte',  famille: 'demande_inscription.' },

  // ── Justificatifs ─────────────────────────────────────────────────
  'justificatif.depot':         { label: 'Justificatif déposé',        ton: 'neutre',  famille: 'justificatif.' },
  'justificatif.consultation':  { label: 'Justificatif consulté',      ton: 'acces',   famille: 'justificatif.' },
  'justificatif.valide':        { label: 'Justificatif validé',        ton: 'positif', famille: 'justificatif.' },
  'justificatif.rejete':        { label: 'Justificatif refusé',        ton: 'alerte',  famille: 'justificatif.' },
  'justificatif.suppression':   { label: 'Justificatif supprimé',      ton: 'alerte',  famille: 'justificatif.' },
  'justificatif.purge_conservation': { label: 'Purge de conservation', ton: 'neutre',  famille: 'justificatif.' },

  // ── Autre partie ──────────────────────────────────────────────────
  'autre_partie.consultation':  { label: 'Autre partie consultée',     ton: 'acces',   famille: 'autre_partie.' },
  'autre_partie.invitation':    { label: 'Invitation envoyée',         ton: 'neutre',  famille: 'autre_partie.' },

  // ── Versions de l'application mobile ──────────────────────────────
  'app_version.creer':          { label: 'Version app créée',          ton: 'neutre',  famille: 'app_version.' },
  'app_version.modifier':       { label: 'Version app modifiée',       ton: 'neutre',  famille: 'app_version.' },
  'app_version.supprimer':      { label: 'Version app supprimée',      ton: 'alerte',  famille: 'app_version.' },
};

/* Regroupements proposés au filtre — familles d'abord, puis les accès. */
const FILTRES = [
  { valeur: '',                      label: 'Toutes les actions' },
  { valeur: 'admin.',                label: 'Administrateurs & connexions' },
  { valeur: 'admin.connexion',       label: '— Connexions réussies' },
  { valeur: 'admin.connexion_echouee', label: '— Connexions refusées' },
  { valeur: 'utilisateur.',          label: 'Utilisateurs' },
  { valeur: 'demande_inscription.',  label: 'Demandes d’inscription' },
  { valeur: 'justificatif.',         label: 'Justificatifs' },
  { valeur: 'autre_partie.',         label: 'Autres parties' },
  { valeur: 'app_version.',          label: 'Versions de l’app' },
];

const ICONES = {
  'admin.connexion': LogIn,
  'admin.deconnexion': LogOut,
  'admin.connexion_echouee': ShieldAlert,
  'admin.profil_modifie': UserCog,
  'admin.mot_de_passe_change': KeyRound,
};

/* Libellés lisibles pour les clés techniques de `details`. */
const CLES_DETAILS = {
  email: 'E-mail',
  motif: 'Motif',
  permissions: 'Permissions',
  champs: 'Champs',
  agent: 'Navigateur',
  ip: 'Adresse IP',
  photo: 'Photo',
  type: 'Type',
};

function decrire(action) {
  return ACTIONS[action] || { label: action, ton: 'neutre' };
}

/* L'IP est extraite pour sa propre colonne : c'est la donnée qu'on croise en
   cas de doute sur une connexion, elle mérite mieux qu'une fin de phrase. */
function separerDetails(details) {
  if (!details || typeof details !== 'object') return { ip: null, reste: [] };
  const { ip, ...autres } = details;
  const reste = Object.entries(autres)
    .filter(([, v]) => v !== undefined && v !== null && v !== '' &&
      !(Array.isArray(v) && v.length === 0))
    .map(([k, v]) => ({
      cle: CLES_DETAILS[k] || k,
      // `true` brut se lit mal dans une colonne destinee a un humain.
      valeur: Array.isArray(v) ? v.join(', ')
        : typeof v === 'boolean' ? (v ? 'Oui' : 'Non')
        : String(v),
    }));
  return { ip: ip || null, reste };
}

export default function AuditLogPage() {
  const [actionFilter, setActionFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Pagination + filtres gérés côté serveur — le backend
  // (requirePermission('admins')) est la seule source de vérité.
  const {
    items: logs, loading, accessDenied,
    page: currentPage, totalPages, total, nextPage, prevPage,
    search, setSearch,
  } = useServerList(
    async ({ page, limit, search: q }) => {
      const res = await listerAuditLog({
        page, limit, search: q, action: actionFilter, dateFrom, dateTo,
      });
      return { items: res.logs || [], pagination: res.pagination };
    },
    { limit: 25, extraDeps: [actionFilter, dateFrom, dateTo] }
  );

  const exporter = async () => {
    const tout = await fetchAllPages(
      (p) => listerAuditLog({ ...p, search, action: actionFilter, dateFrom, dateTo }),
      (res) => res.logs || []
    );
    exportToCsv('journal-audit', [
      { header: 'Date', value: (l) => formatDateHeure(l.createdAt) },
      { header: 'Administrateur', value: (l) => l.adminNom || '' },
      { header: 'E-mail', value: (l) => l.adminEmail || '' },
      { header: 'Action', value: (l) => decrire(l.action).label },
      { header: 'Code action', value: (l) => l.action },
      { header: 'Cible', value: (l) => [l.cibleType, l.cibleId].filter(Boolean).join(' ') },
      { header: 'Adresse IP', value: (l) => separerDetails(l.details).ip || '' },
      {
        header: 'Détails',
        value: (l) => separerDetails(l.details).reste
          .map((d) => `${d.cle} : ${d.valeur}`).join(' — '),
      },
    ], tout);
  };

  if (accessDenied) {
    return <AccessDenied message="Vous n'avez pas la permission de consulter le journal d'audit." />;
  }

  const filtreActif = Boolean(search || actionFilter || dateFrom || dateTo);

  return (
    <>
      {/* ── Filtres ── */}
      <div className="audit-toolbar">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Administrateur, e-mail, action ou identifiant de cible…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          {FILTRES.map((f) => (
            <option key={f.valeur || 'toutes'} value={f.valeur}>{f.label}</option>
          ))}
        </select>

        <input
          type="date" className="filter-select" value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)} title="À partir du"
        />
        <input
          type="date" className="filter-select" value={dateTo}
          onChange={(e) => setDateTo(e.target.value)} title="Jusqu’au"
        />

        {filtreActif && (
          <button
            className="btn-export"
            onClick={() => { setSearch(''); setActionFilter(''); setDateFrom(''); setDateTo(''); }}
          >
            Réinitialiser
          </button>
        )}

        <button className="btn-export" onClick={exporter} disabled={total === 0}>
          <Download size={16} /> <span>Exporter CSV</span>
        </button>
      </div>

      <div className="montant-total-bar">
        <History size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
        {total} action{total > 1 ? 's' : ''} enregistrée{total > 1 ? 's' : ''}
        {filtreActif ? ' pour ce filtre' : ''}
      </div>

      {/* ── Journal ── */}
      <div className="table-container">
        {loading ? (
          <p className="no-results">Chargement…</p>
        ) : logs.length === 0 ? (
          <p className="no-results">
            {filtreActif
              ? 'Aucune action ne correspond à ce filtre.'
              : 'Aucune action enregistrée.'}
          </p>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Administrateur</th>
                  <th>Action</th>
                  <th>Cible</th>
                  <th>Adresse IP</th>
                  <th>Détails</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const { label, ton } = decrire(log.action);
                  const Icone = ICONES[log.action];
                  const { ip, reste } = separerDetails(log.details);
                  return (
                    <tr key={log.id}>
                      <td className="audit-date">{formatDateHeure(log.createdAt)}</td>
                      <td>
                        <div className="cellule-personne">
                          <span className="cellule-personne-nom">{log.adminNom || '—'}</span>
                          {log.adminEmail && (
                            <span className="cellule-personne-email">{log.adminEmail}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className={`audit-action audit-action--${ton}`}>
                          {Icone ? <Icone size={13} /> : null}
                          {label}
                        </span>
                      </td>
                      <td className="audit-cible">
                        {log.cibleType ? (
                          <>
                            <span className="audit-cible-type">{log.cibleType}</span>
                            {log.cibleId && (
                              <span className="audit-cible-id" title={log.cibleId}>
                                {log.cibleId}
                              </span>
                            )}
                          </>
                        ) : '—'}
                      </td>
                      <td>
                        {ip
                          ? <code className="audit-ip">{ip}</code>
                          : <span className="cellule-vide">—</span>}
                      </td>
                      <td>
                        {reste.length === 0 ? (
                          <span className="cellule-vide">—</span>
                        ) : (
                          <div className="audit-details">
                            {reste.map((d) => (
                              <span key={d.cle} className="audit-detail">
                                <span className="audit-detail-cle">{d.cle}</span>
                                <span className="audit-detail-valeur" title={d.valeur}>
                                  {d.valeur}
                                </span>
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination-simple">
                <button onClick={prevPage} disabled={currentPage === 1} className="pagination-btn pagination-prev">
                  <ChevronLeft size={18} /> Précédent
                </button>
                <span className="pagination-info">Page {currentPage} sur {totalPages}</span>
                <button onClick={nextPage} disabled={currentPage === totalPages} className="pagination-btn pagination-next">
                  Suivant <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Rappel de portée : sans lui, l'absence d'une action pourrait se lire
          comme « rien ne s'est passé » plutôt que « ce n'est pas tracé ici ». */}
      <p className="audit-portee">
        <FileWarning size={13} />
        Ce journal trace les actions des comptes administrateurs. Les actions
        des utilisateurs de l’application mobile n’y figurent pas.
      </p>
    </>
  );
}
