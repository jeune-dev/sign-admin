import React, { useState } from 'react';
import { Users, Check, X as XIcon, Eye, Search, ChevronLeft, ChevronRight, UserCheck, UserX, Mail, Phone, MapPin, IdCard, Trash2, Download } from 'lucide-react';
import SwalCustom from '../../../utils/swal.config';
import AccessDenied from '../../../components/AccessDenied';
import { useServerList } from '../../../hooks/useServerList';
import { formatDate } from '../../../utils/format';
import { fetchAllPages } from '../../../utils/fetchAllPages';
import {
  listeUtilisateurs,
  activerUtilisateur,
  desactiverUtilisateur,
  supprimerUtilisateur
} from '../../../service/admin/adminService';
import { exportToCsv } from '../../../utils/exportCsv';
import '../../../assets/css/listeUser.css';

const formatUserRow = (user) => ({
  ...user,
  statut: user.statut?.toLowerCase() || 'inactif'
});

export default function UsersList() {
  // Pagination + recherche gérées côté serveur — le backend
  // (requirePermission('users')) est la seule source de vérité : le menu
  // peut être trafiqué côté client, mais la donnée réelle n'est jamais
  // chargée ni affichée sans son feu vert.
  const {
    items: currentUsers, loading, accessDenied, reload,
    page: currentPage, totalPages, total, nextPage, prevPage,
    search: searchTerm, setSearch: setSearchTerm,
  } = useServerList(
    async ({ page, limit, search }) => {
      const res = await listeUtilisateurs({ page, limit, search });
      return { items: (res.utilisateurs || []).map(formatUserRow), pagination: res.pagination };
    },
    { limit: 10 }
  );

  const [selectedUser, setSelectedUser] = useState(null);

  // Activer/Désactiver
  const handleToggleStatus = async (user) => {
    const isActif = user.statut === 'actif';
    const action = isActif ? 'désactiver' : 'activer';

    const result = await SwalCustom.fire({
      title: `Voulez-vous ${action} cet utilisateur ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
    });

    if (!result.isConfirmed) return;

    try {
      if (isActif) await desactiverUtilisateur(user.id);
      else await activerUtilisateur(user.id);

      // Recharge depuis le serveur (source de vérité) plutôt qu'une mutation
      // locale optimiste, pour rester cohérent avec la pagination serveur.
      await reload();
      SwalCustom.fire({ icon: 'success', title: 'Succès', text: `Utilisateur ${action}é avec succès`, timer: 2500, timerProgressBar: true, showConfirmButton: false });
    } catch (err) {
      console.error('Erreur lors du changement de statut :', err);
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de modifier le statut' });
    }
  };

  // Supprimer (RGPD)
  const handleDelete = async (user) => {
    const result = await SwalCustom.fire({
      title: `Supprimer ${user.prenom} ${user.nom} ?`,
      text: "Cette action supprime définitivement le compte (RGPD).",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    });
    if (!result.isConfirmed) return;
    try {
      await supprimerUtilisateur(user.id);
      await reload();
      SwalCustom.fire({ icon: 'success', title: 'Supprimé', text: 'Utilisateur supprimé', timer: 2200, timerProgressBar: true, showConfirmButton: false });
    } catch (err) {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: err?.response?.data?.message || 'Suppression impossible' });
    }
  };

  // Export CSV — récupère TOUTES les pages correspondant à la recherche
  // active (pas seulement la page actuellement affichée à l'écran).
  const handleExport = async () => {
    const all = await fetchAllPages(
      (p) => listeUtilisateurs({ ...p, search: searchTerm }),
      (res) => (res.utilisateurs || []).map(formatUserRow)
    );
    exportToCsv('utilisateurs', [
      { header: 'Prénom', value: (u) => u.prenom },
      { header: 'Nom', value: (u) => u.nom },
      { header: 'Email', value: (u) => u.email },
      { header: 'Téléphone', value: (u) => u.telephone },
      { header: 'Rôle', value: (u) => u.role },
      { header: 'Statut', value: (u) => u.statut },
      { header: 'Inscrit le', value: (u) => formatDate(u.createdAt) },
    ], all);
  };

  if (loading) return <div className="loading-spinner">Chargement des utilisateurs...</div>;
  if (accessDenied) return <AccessDenied message="Vous n'avez pas la permission de gérer les utilisateurs." />;

  return (
    <div className="userslist-container">
      {/* Barre de recherche */}
      <div className="search-section">
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom, email, téléphone ou rôle..."
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
        <div className="search-stats">
          {total} utilisateur{total > 1 ? 's' : ''}
        </div>
        <button className="btn-export" onClick={handleExport} disabled={total === 0}>
          <Download size={16} /> <span>Exporter CSV</span>
        </button>
      </div>

      {/* Tableau */}
      {currentUsers.length === 0 ? (
        <div className="no-results">
          <Users size={48} />
          <p>Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => {
                const isActif = user.statut === 'actif';
                const isPending = user.statut === 'en_attente_validation';
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-table">
                          {user.photoProfil ? (
                            <img src={user.photoProfil} alt="profil" />
                          ) : (
                            <span>{user.nom?.charAt(0)}{user.prenom?.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="user-name-table">{user.prenom} {user.nom}</div>
                          {user.telephone && (
                            <div className="user-phone-table">{user.telephone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{user.email || '-'}</td>
                    <td>
                      <span className={`role-badge role-${(user.role || 'particulier').toLowerCase()}`}>
                        {user.role || 'Particulier'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${isActif ? 'status-active' : isPending ? 'status-pending' : 'status-inactive'}`}>
                        {isActif ? <Check size={12} /> : isPending ? <IdCard size={12} /> : <XIcon size={12} />}
                        {isActif ? 'Actif' : isPending ? 'En attente de validation' : 'Inactif'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="action-btn btn-view" onClick={() => setSelectedUser(user)} title="Voir détails">
                        <Eye size={16} />
                        <span>Voir</span>
                      </button>
                      <button
                        className={`action-btn ${isActif ? 'btn-disable' : 'btn-enable'}`}
                        onClick={() => handleToggleStatus(user)}
                        title={isActif ? 'Désactiver' : isPending ? 'Valider le document' : 'Activer'}
                      >
                        {isActif ? <UserX size={16} /> : <UserCheck size={16} />}
                        <span>{isActif ? 'Désactiver' : isPending ? 'Valider' : 'Activer'}</span>
                      </button>
                      <button className="action-btn btn-delete" onClick={() => handleDelete(user)} title="Supprimer (RGPD)">
                        <Trash2 size={16} />
                        <span>Supprimer</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1} className="pagination-btn">
            <ChevronLeft size={18} /> Précédent
          </button>
          <span className="pagination-info">
            Page {currentPage} sur {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages} className="pagination-btn">
            Suivant <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* MODAL - Version magnifique */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modern-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedUser(null)}>×</button>
            
            <div className="modal-cover"></div>
            
            <div className="modal-avatar-wrapper">
              <div className="modal-avatar">
                {selectedUser.photoProfil ? (
                  <img src={selectedUser.photoProfil} alt="profil" />
                ) : (
                  <span>
                    {selectedUser.nom?.charAt(0) || ''}
                    {selectedUser.prenom?.charAt(0) || ''}
                  </span>
                )}
              </div>
              <div className="modal-status">
                <span className={`status-dot ${
                  selectedUser.statut === 'actif' ? 'active'
                    : selectedUser.statut === 'en_attente_validation' ? 'pending'
                    : 'inactive'
                }`}></span>
                {selectedUser.statut === 'actif' ? 'Actif'
                  : selectedUser.statut === 'en_attente_validation' ? 'En attente de validation'
                  : 'Inactif'}
              </div>
            </div>

            <h2 className="modal-name">{selectedUser.prenom} {selectedUser.nom}</h2>
            <p className="modal-role">{selectedUser.role || 'Utilisateur'}</p>

            <div className="modal-divider"></div>

            <div className="modal-info-grid">
              <div className="modal-info-item">
                <Mail size={18} />
                <div>
                  <label>Email</label>
                  <p>{selectedUser.email || '-'}</p>
                </div>
              </div>
              <div className="modal-info-item">
                <Phone size={18} />
                <div>
                  <label>Téléphone</label>
                  <p>{selectedUser.telephone || '-'}</p>
                </div>
              </div>
              <div className="modal-info-item">
                <MapPin size={18} />
                <div>
                  <label>Adresse</label>
                  <p>{selectedUser.adresse || '-'}</p>
                </div>
              </div>
              <div className="modal-info-item">
                <IdCard size={18} />
                <div>
                  <label>
                    {{
                      carte_identite: "N° carte d'identité",
                      permis: 'N° permis de conduire',
                      passeport: 'N° passeport',
                    }[selectedUser.type_document_identite] || 'CNI / NINA'}
                  </label>
                  <p>{selectedUser.carte_identite_national_num || '-'}</p>
                </div>
              </div>
            </div>

            {selectedUser.document_identite_url && (
              <div className="modal-document-preview">
                <label>Photo du document</label>
                <a href={selectedUser.document_identite_url} target="_blank" rel="noopener noreferrer">
                  <img src={selectedUser.document_identite_url} alt="Document d'identité" />
                </a>
              </div>
            )}

            <div className="modal-actions">
              <button className="modal-btn modal-btn-secondary" onClick={() => setSelectedUser(null)}>
                Fermer
              </button>
              <button
                className={`modal-btn ${selectedUser.statut === 'actif' ? 'modal-btn-danger' : 'modal-btn-success'}`}
                onClick={() => {
                  setSelectedUser(null);
                  handleToggleStatus(selectedUser);
                }}
              >
                {selectedUser.statut === 'actif' ? 'Désactiver'
                  : selectedUser.statut === 'en_attente_validation' ? 'Valider le document'
                  : 'Activer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}