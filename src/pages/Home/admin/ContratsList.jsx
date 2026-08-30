import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, FileText, Download,
         LayoutGrid, Briefcase, Handshake, Key, Banknote,
         PenLine, ShieldCheck, Lock, HardHat, Building2 } from 'lucide-react';
import SwalCustom from '../../../utils/swal.config';
import AccessDenied from '../../../components/AccessDenied';
import { useServerList } from '../../../hooks/useServerList';
import { formatDate } from '../../../utils/format';
import { openPdfBlob, downloadPdfBlob } from '../../../utils/pdfBlob';
import { fetchAllPages } from '../../../utils/fetchAllPages';
import { listeContrats, telechargerContratPdf } from '../../../service/admin/adminService';
import { exportToCsv } from '../../../utils/exportCsv';

import '../../../assets/css/factures.css';
import '../../../assets/css/contrats.css';

const TYPE_CONFIG = {
  prestation:      { label: 'Prestation',             Icon: Briefcase,   display: null },
  partenariat:     { label: 'Partenariat',             Icon: Handshake,   display: null },
  location:        { label: 'Location',                Icon: Key,         display: null },
  dette:           { label: 'Reconnaissance de dette', Icon: Banknote,    display: <>Reconnaissance<br />de dette</> },
  procuration:     { label: 'Procuration',             Icon: PenLine,     display: null },
  caution:         { label: 'Caution',                 Icon: ShieldCheck, display: null },
  confidentialite: { label: 'Confidentialité',         Icon: Lock,        display: null },
  travail:         { label: 'Travail',                 Icon: HardHat,     display: null },
  bail:            { label: 'Bail immobilier',         Icon: Building2,   display: null },
};

const STATUS_MAP = {
  en_attente:   { label: 'En attente', css: 'badge-pending' },
  signe:        { label: 'Signé',      css: 'badge-signed'  },
  Actif:        { label: 'Actif',      css: 'badge-signed'  },
  'Résilié':    { label: 'Résilié',    css: 'badge-resilie' },
  'Expiré':     { label: 'Expiré',     css: 'badge-expired' },
  'En attente': { label: 'En attente', css: 'badge-pending' },
};

function StatusBadge({ statut }) {
  const s = STATUS_MAP[statut] || { label: statut || '-', css: 'badge-default' };
  return <span className={`contrat-badge ${s.css}`}>{s.label}</span>;
}

export default function ContratsList() {
  const [typeFilter, setTypeFilter] = useState('all');

  // Pagination + recherche + filtre de type gérés côté serveur — le backend
  // (requirePermission('contrats')) est la seule source de vérité.
  const {
    items: paginated, loading, accessDenied,
    page: currentPage, totalPages, total, nextPage, prevPage,
    search: searchTerm, setSearch: setSearchTerm,
  } = useServerList(
    async ({ page, limit, search }) => {
      const res = await listeContrats({ page, limit, search, type: typeFilter });
      return { items: res.contrats || [], pagination: res.pagination };
    },
    { limit: 10, extraDeps: [typeFilter] }
  );

  // Récupère le PDF (flux binaire depuis R2 via le backend) sous forme de Blob.
  const recupererPdfBlob = (c) => telechargerContratPdf(c.typeCode, c.id);

  // Aperçu du PDF dans un nouvel onglet.
  const openPdf = (c) => {
    if (!c.contrat_pdf) {
      SwalCustom.fire({ icon: 'info', title: 'Information', text: 'Aucun PDF disponible pour ce contrat' });
      return;
    }
    openPdfBlob(() => recupererPdfBlob(c));
  };

  // Télécharge le PDF du contrat sous forme de fichier (et non simple aperçu).
  const downloadPdf = (c) => {
    if (!c.contrat_pdf) {
      SwalCustom.fire({ icon: 'info', title: 'Information', text: 'Aucun PDF disponible pour ce contrat' });
      return;
    }
    downloadPdfBlob(() => recupererPdfBlob(c), `${(c.numero_contrat || 'contrat').replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`);
  };

  // Export CSV — récupère TOUTES les pages correspondant à la recherche et
  // au filtre de type actifs (pas seulement la page affichée à l'écran).
  const handleExport = async () => {
    const all = await fetchAllPages(
      (p) => listeContrats({ ...p, search: searchTerm, type: typeFilter }),
      (res) => res.contrats || []
    );
    exportToCsv('contrats', [
      { header: 'N° Contrat', value: (c) => c.numero_contrat },
      { header: 'Type', value: (c) => c.type },
      { header: 'Créé par', value: (c) => nomComplet(c.partie1) },
      { header: 'E-mail créateur', value: (c) => c.partie1?.email || '' },
      { header: 'Autre partie', value: (c) => nomComplet(c.partie2) },
      { header: 'E-mail autre partie', value: (c) => c.partie2?.email || '' },
      { header: 'Statut', value: (c) => c.statut },
      { header: 'Date', value: (c) => formatDate(c.date) },
    ], all);
  };

  // NB : pas de `if (loading) return ...` ici. Un retour anticipe demontait
  // toute la page — champ de recherche compris — a chaque rechargement. Comme
  // la saisie declenche justement un rechargement, le champ etait recree apres
  // la premiere lettre et perdait le focus : il fallait recliquer dedans pour
  // taper la suivante. L'etat de chargement est donc rendu DANS la zone de
  // resultats, en laissant la barre de recherche montee.
  if (accessDenied) return <AccessDenied message="Vous n'avez pas la permission de gérer les contrats." />;

  return (
    <>
      {/* ── Recherche ── */}
      <div className="search-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="N° de contrat, type, nom, e-mail ou téléphone d’une partie…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button className="search-clear" onClick={() => setSearchTerm('')}>×</button>
        )}
        <button className="btn-export" onClick={handleExport} disabled={total === 0} title="Exporter en CSV">
          <Download size={16} /> <span>Exporter CSV</span>
        </button>
      </div>

      {/* ── Boxes de filtre par type ── */}
      <div className="type-boxes">
        <button
          className={`type-box type-box--all ${typeFilter === 'all' ? 'type-box--active' : ''}`}
          onClick={() => setTypeFilter('all')}
        >
          <LayoutGrid size={26} className="type-box-icon" />
          <span className="type-box-label">Tous</span>
        </button>

        {Object.entries(TYPE_CONFIG).map(([code, { label, Icon, display }]) => (
          <button
            key={code}
            className={`type-box type-box--${code} ${typeFilter === code ? 'type-box--active' : ''}`}
            onClick={() => setTypeFilter(code)}
          >
            <Icon size={26} className="type-box-icon" />
            <span className="type-box-label">{display ?? label}</span>
          </button>
        ))}
      </div>

      {/* ── Tableau ── */}
      <div className="table-container">
        {loading ? (
          <p className="no-results">Chargement…</p>
        ) : paginated.length === 0 ? (
          <p className="no-results">Aucun contrat trouvé.</p>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>N° Contrat</th>
                  <th>Type</th>
                  <th>Créé par</th>
                  <th>Autre partie</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((c) => (
                  <tr key={`${c.typeCode}-${c.id}`}>
                    <td>{c.numero_contrat || '-'}</td>
                    <td>
                      <span className={`type-badge type-${c.typeCode}`}>{c.type}</span>
                    </td>
                    <td><Personne personne={c.partie1} /></td>
                    <td><Personne personne={c.partie2} /></td>
                    <td>{formatDate(c.date)}</td>
                    <td><StatusBadge statut={c.statut} /></td>
                    <td className="actions">
                      <button
                        className="btn-view"
                        onClick={() => openPdf(c)}
                        title="Voir le contrat PDF"
                      >
                        <FileText size={16} />
                      </button>
                      <button
                        className="btn-view"
                        onClick={() => downloadPdf(c)}
                        title="Télécharger le PDF"
                      >
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination-simple">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="pagination-btn pagination-prev"
                >
                  <ChevronLeft size={18} /> Précédent
                </button>
                <span className="pagination-info">
                  Page {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="pagination-btn pagination-next"
                >
                  Suivant <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

/* `prenom nom` d'une personne, ou chaîne vide si rien d'exploitable. */
function nomComplet(personne) {
  if (!personne) return '';
  return `${personne.prenom || ''} ${personne.nom || ''}`.trim();
}

/* Identité sur deux lignes : le nom, puis l'e-mail en dessous — c'est par
   l'e-mail qu'on recoupe un compte, et il sert de clé de recherche. */
function Personne({ personne }) {
  const nom = nomComplet(personne);
  if (!nom && !personne?.email) return <span className="cellule-vide">-</span>;
  return (
    <div className="cellule-personne">
      <span className="cellule-personne-nom">{nom || '-'}</span>
      {personne?.email && (
        <a className="cellule-personne-email" href={`mailto:${personne.email}`} title={personne.email}>
          {personne.email}
        </a>
      )}
    </div>
  );
}
