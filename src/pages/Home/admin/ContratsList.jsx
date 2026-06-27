import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, FileText, Download,
         LayoutGrid, Briefcase, Handshake, Key, Banknote,
         PenLine, ShieldCheck, Lock, HardHat, Building2 } from 'lucide-react';
import SwalCustom from '../../../utils/swal.config';
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
  const [contrats, setContrats]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [searchTerm, setSearchTerm]   = useState('');
  const [typeFilter, setTypeFilter]   = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => { fetchContrats(); }, []);

  const fetchContrats = async () => {
    try {
      const res = await listeContrats();
      setContrats(res.contrats || []);
    } catch {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de récupérer les contrats' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setCurrentPage(1); }, [searchTerm, typeFilter]);

  const filtered = contrats.filter((c) => {
    const s = searchTerm.toLowerCase().trim();
    const matchType   = typeFilter === 'all' || c.typeCode === typeFilter;
    const matchSearch = !s
      || c.numero_contrat?.toLowerCase().includes(s)
      || c.type?.toLowerCase().includes(s);
    return matchType && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated  = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Récupère le PDF (flux binaire depuis R2 via le backend) sous forme de Blob.
  const recupererPdfBlob = (c) => telechargerContratPdf(c.typeCode, c.id);

  // Aperçu du PDF dans un nouvel onglet.
  const openPdf = async (c) => {
    if (!c.contrat_pdf) {
      SwalCustom.fire({ icon: 'info', title: 'Information', text: 'Aucun PDF disponible pour ce contrat' });
      return;
    }
    try {
      const blob = await recupererPdfBlob(c);
      const url  = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: "Impossible d'ouvrir le PDF" });
    }
  };

  // Télécharge le PDF du contrat sous forme de fichier (et non simple aperçu).
  const downloadPdf = async (c) => {
    if (!c.contrat_pdf) {
      SwalCustom.fire({ icon: 'info', title: 'Information', text: 'Aucun PDF disponible pour ce contrat' });
      return;
    }
    try {
      const blob = await recupererPdfBlob(c);
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `${(c.numero_contrat || 'contrat').replace(/[^a-zA-Z0-9-]/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de télécharger le PDF' });
    }
  };

  const handleExport = () => {
    exportToCsv('contrats', [
      { header: 'N° Contrat', value: (c) => c.numero_contrat },
      { header: 'Type', value: (c) => c.type },
      { header: 'Statut', value: (c) => c.statut },
      { header: 'Date', value: (c) => c.date ? new Date(c.date).toLocaleDateString('fr-FR') : '' },
    ], filtered);
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <>
      {/* ── Recherche ── */}
      <div className="search-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher par numéro de contrat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button className="search-clear" onClick={() => setSearchTerm('')}>×</button>
        )}
        <button className="btn-export" onClick={handleExport} disabled={filtered.length === 0} title="Exporter en CSV">
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
        {filtered.length === 0 ? (
          <p className="no-results">Aucun contrat trouvé.</p>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>N° Contrat</th>
                  <th>Type</th>
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
                    <td>
                      {c.date
                        ? new Date(c.date).toLocaleDateString('fr-FR')
                        : '-'}
                    </td>
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

            {filtered.length > itemsPerPage && (
              <div className="pagination-simple">
                <button
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                  className="pagination-btn pagination-prev"
                >
                  <ChevronLeft size={18} /> Précédent
                </button>
                <span className="pagination-info">
                  Page {currentPage} sur {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
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
