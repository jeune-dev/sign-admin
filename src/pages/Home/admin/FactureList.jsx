import React, { useRef, useState } from 'react';
import { Eye, Search, ChevronLeft, ChevronRight, FileText, Download } from 'lucide-react';
import SwalCustom from '../../../utils/swal.config';
import AccessDenied from '../../../components/AccessDenied';
import { useServerList } from '../../../hooks/useServerList';
import { formatDate, formatNombre } from '../../../utils/format';
import { openPdfBlob } from '../../../utils/pdfBlob';
import { fetchAllPages } from '../../../utils/fetchAllPages';

import { listeFactures, telechargerFacturePdf } from '../../../service/admin/adminService';
import { exportToCsv } from '../../../utils/exportCsv';

import '../../../assets/css/factures.css';

export default function FactureList() {
  const [statutFilter, setStatutFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [montantTotal, setMontantTotal] = useState(0);
  // Ignore le montant total d'une réponse devenue obsolète (filtre changé
  // entre-temps) — même protection anti-race que useServerList pour items/pagination.
  const montantRequestIdRef = useRef(0);

  // Pagination + recherche gérées côté serveur — le backend
  // (requirePermission('factures')) est la seule source de vérité.
  const {
    items: paginatedFactures, loading, accessDenied,
    page: currentPage, totalPages, total, nextPage, prevPage,
    search: searchTerm, setSearch: setSearchTerm,
  } = useServerList(
    async ({ page, limit, search }) => {
      const requestId = ++montantRequestIdRef.current;
      const res = await listeFactures({ page, limit, search, statut: statutFilter, dateFrom, dateTo });
      if (requestId === montantRequestIdRef.current) setMontantTotal(res.montantTotal || 0);
      return { items: res.factures || [], pagination: res.pagination };
    },
    { limit: 10, extraDeps: [statutFilter, dateFrom, dateTo] }
  );

  const openPdf = (fact) => {
    if (!fact.document_pdf) {
      SwalCustom.fire({ icon: 'info', title: 'Information', text: 'Aucun PDF disponible pour cette facture' });
      return;
    }
    openPdfBlob(() => telechargerFacturePdf(fact.id));
  };

  // Export CSV — récupère TOUTES les pages correspondant à la recherche
  // active (pas seulement la page actuellement affichée à l'écran).
  const handleExport = async () => {
    const all = await fetchAllPages(
      (p) => listeFactures({ ...p, search: searchTerm, statut: statutFilter, dateFrom, dateTo }),
      (res) => res.factures || []
    );
    exportToCsv('factures', [
      { header: 'N° Facture', value: (f) => f.numero_facture },
      { header: 'Client', value: (f) => f.client ? `${f.client.prenom || ''} ${f.client.nom || ''}`.trim() : '' },
      { header: 'Professionnel', value: (f) => f.professionnel ? `${f.professionnel.prenom || ''} ${f.professionnel.nom || ''}`.trim() : '' },
      { header: 'Montant', value: (f) => f.montant },
      { header: 'Statut', value: (f) => f.statut },
      { header: "Date d'exécution", value: (f) => formatDate(f.date_execution) },
    ], all);
  };

  if (loading) return <p>Chargement...</p>;
  if (accessDenied) return <AccessDenied message="Vous n'avez pas la permission de gérer les factures." />;

  return (
    <>
      {/* Search bar */}
      <div className="search-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          placeholder="Rechercher par numéro, client ou professionnel..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button className="search-clear" onClick={() => setSearchTerm('')}>
            ×
          </button>
        )}
        <select
          className="filter-select"
          value={statutFilter}
          onChange={(e) => setStatutFilter(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="partiel">Partiel</option>
          <option value="payee">Payée</option>
        </select>
        <input
          type="date"
          className="filter-select"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          title="Date d'exécution — à partir de"
        />
        <input
          type="date"
          className="filter-select"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          title="Date d'exécution — jusqu'à"
        />
        <button className="btn-export" onClick={handleExport} disabled={total === 0} title="Exporter en CSV">
          <Download size={16} /> <span>Exporter CSV</span>
        </button>
      </div>

      <div className="montant-total-bar">
        Montant total (filtré) : <strong>{formatNombre(montantTotal)} FCFA</strong>
      </div>

      <div className="table-container">
        {paginatedFactures.length === 0 ? (
          <p className="no-results">Aucune facture trouvée.</p>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>N° Facture</th>
                  <th>Date d'exécution</th>
                  <th>Client</th>
                  <th>Professionnel</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedFactures.map((fact) => (
                  <tr key={fact.id}>
                    <td>{fact.numero_facture || '-'}</td>
                    <td>{formatDate(fact.date_execution)}</td>
                    <td>
                      {fact.client
                        ? `${fact.client.prenom || ''} ${fact.client.nom || ''}`.trim() || '-'
                        : (fact.client_prenom || fact.client_nom)
                          ? `${fact.client_prenom || ''} ${fact.client_nom || ''}`.trim()
                          : '-'}
                      {!fact.client && (fact.client_prenom || fact.client_nom) && (
                        <span className="client-non-inscrit-badge" title="Client non inscrit sur l'application">
                          {' '}(non inscrit)
                        </span>
                      )}
                    </td>
                    <td>
                      {fact.professionnel
                        ? `${fact.professionnel.prenom || ''} ${fact.professionnel.nom || ''}`.trim() || '-'
                        : '-'}
                    </td>
                    <td>{formatNombre(fact.montant)} FCFA</td>
                    <td>
                      <span className={`facture-statut-badge statut-${fact.statut}`}>
                        {fact.statut === 'payee' ? 'Payée' : fact.statut === 'partiel' ? 'Partiel' : 'En attente'}
                      </span>
                    </td>
                    <td className="actions">
                      <button
                        className="btn-view"
                        onClick={() => openPdf(fact)}
                        title="Voir la facture PDF"
                      >
                        <FileText size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
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