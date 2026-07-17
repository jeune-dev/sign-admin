import React from 'react';
import { History, ChevronLeft, ChevronRight } from 'lucide-react';
import AccessDenied from '../../../components/AccessDenied';
import { useServerList } from '../../../hooks/useServerList';
import { formatDate } from '../../../utils/format';
import { listerAuditLog } from '../../../service/admin/adminService';

import '../../../assets/css/factures.css';

const ACTION_LABELS = {
  'utilisateur.activer': 'Utilisateur activé',
  'utilisateur.desactiver': 'Utilisateur désactivé',
  'utilisateur.rejeter': 'Document rejeté',
  'utilisateur.supprimer': 'Utilisateur supprimé',
  'admin.creer': 'Administrateur créé',
  'admin.modifier_permissions': 'Permissions modifiées',
  'app_version.creer': 'Config mise à jour app créée',
  'app_version.modifier': 'Config mise à jour app modifiée',
  'app_version.supprimer': 'Config mise à jour app supprimée',
};

const ACTION_COLOR = {
  'utilisateur.activer': 'statut-payee',
  'utilisateur.desactiver': 'statut-en_attente',
  'utilisateur.rejeter': 'statut-en_attente',
  'utilisateur.supprimer': 'statut-en_attente',
  'admin.creer': 'statut-payee',
  'admin.modifier_permissions': 'statut-partiel',
  'app_version.creer': 'statut-payee',
  'app_version.modifier': 'statut-partiel',
  'app_version.supprimer': 'statut-en_attente',
};

function formatDetails(details) {
  if (!details || typeof details !== 'object') return '-';
  const parts = Object.entries(details)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k} : ${Array.isArray(v) ? v.join(', ') : v}`);
  return parts.length ? parts.join(' — ') : '-';
}

export default function AuditLogPage() {
  // Pagination gérée côté serveur — le backend (requirePermission('admins'))
  // est la seule source de vérité, comme les autres pages admin.
  const {
    items: logs, loading, accessDenied,
    page: currentPage, totalPages, total, nextPage, prevPage,
  } = useServerList(
    async ({ page, limit }) => {
      const res = await listerAuditLog({ page, limit });
      return { items: res.logs || [], pagination: res.pagination };
    },
    { limit: 20 }
  );

  if (loading) return <p>Chargement...</p>;
  if (accessDenied) return <AccessDenied message="Vous n'avez pas la permission de consulter le journal d'audit." />;

  return (
    <>
      <div className="montant-total-bar">
        <History size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
        {total} action{total > 1 ? 's' : ''} enregistrée{total > 1 ? 's' : ''}
      </div>

      <div className="table-container">
        {logs.length === 0 ? (
          <p className="no-results">Aucune action enregistrée.</p>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Administrateur</th>
                  <th>Action</th>
                  <th>Cible</th>
                  <th>Détails</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{formatDate(log.createdAt)}</td>
                    <td>
                      {log.adminNom || '-'}
                      {log.adminEmail && (
                        <div style={{ fontSize: 11, color: '#9ca3af' }}>{log.adminEmail}</div>
                      )}
                    </td>
                    <td>
                      <span className={`facture-statut-badge ${ACTION_COLOR[log.action] || 'statut-partiel'}`}>
                        {ACTION_LABELS[log.action] || log.action}
                      </span>
                    </td>
                    <td>
                      {log.cibleType ? `${log.cibleType} · ${log.cibleId || '-'}` : '-'}
                    </td>
                    <td style={{ fontSize: 12, color: '#4b5563' }}>{formatDetails(log.details)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="pagination-simple">
                <button onClick={prevPage} disabled={currentPage === 1} className="pagination-btn pagination-prev">
                  <ChevronLeft size={18} /> Précédent
                </button>
                <span className="pagination-info">
                  Page {currentPage} sur {totalPages}
                </span>
                <button onClick={nextPage} disabled={currentPage === totalPages} className="pagination-btn pagination-next">
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
