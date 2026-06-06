import React, { useState, useEffect } from 'react';
import { Eye, Search, ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import SwalCustom from '../../../utils/swal.config';

import { listeFactures } from '../../../service/admin/adminService';

import '../../../assets/css/factures.css'; 

export default function FactureList() {
  const [factures, setFactures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFactures();
  }, []);

  const fetchFactures = async () => {
    try {
      const response = await listeFactures();
      const facturesData = response.factures || [];
      setFactures(facturesData);
    } catch {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de récupérer les factures' });
    } finally {
      setLoading(false);
    }
  };

  const filteredFactures = factures.filter(fact => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;

    return (
      fact.numero_facture?.toLowerCase().includes(search) ||
      fact.client?.nom?.toLowerCase().includes(search) ||
      fact.client?.prenom?.toLowerCase().includes(search) ||
      fact.professionnel?.nom?.toLowerCase().includes(search) ||
      fact.professionnel?.prenom?.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredFactures.length / itemsPerPage);
  const paginatedFactures = filteredFactures.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1);
  };

  const openPdf = (base64String) => {
    if (!base64String) {
      SwalCustom.fire({ icon: 'info', title: 'Information', text: 'Aucun PDF disponible pour cette facture' });
      return;
    }

    try {
      const binaryString = window.atob(base64String);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      window.open(url, '_blank');

      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: "Impossible d'ouvrir le PDF" });
    }
  };

  if (loading) return <p>Chargement...</p>;

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
      </div>

      <div className="table-container">
        {filteredFactures.length === 0 ? (
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedFactures.map((fact) => (
                  <tr key={fact.id}>
                    <td>{fact.numero_facture || '-'}</td>
                    <td>
                      {fact.date_execution
                        ? new Date(fact.date_execution).toLocaleDateString('fr-FR')
                        : '-'}
                    </td>
                    <td>
                      {fact.client
                        ? `${fact.client.prenom || ''} ${fact.client.nom || ''}`.trim() || '-'
                        : '-'}
                    </td>
                    <td>
                      {fact.professionnel
                        ? `${fact.professionnel.prenom || ''} ${fact.professionnel.nom || ''}`.trim() || '-'
                        : '-'}
                    </td>
                    <td className="actions">
                      <button
                        className="btn-view"
                        onClick={() => openPdf(fact.document_pdf)}
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
            {filteredFactures.length > itemsPerPage && (
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