import React, { useState, useEffect } from 'react';
import {
  Check,
  X as XIcon,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Phone,
  UserCheck,
  UserX
} from 'lucide-react';
import Swal from 'sweetalert2';
import {
  listeUtilisateurs,
  activerUtilisateur,
  desactiverUtilisateur
} from '../../../service/admin/adminService';
import "../../../assets/css/ListeAdmin.css";

export default function UsersList() {
  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // Charger utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await listeUtilisateurs();
        const formatted = (data.utilisateurs || []).map(user => ({
          ...user,
          statut: user.statut?.toLowerCase() || 'inactif'
        }));
        setUsersList(formatted);
        setFilteredUsers(formatted);
      } catch {
        Swal.fire('Erreur', 'Impossible de récupérer les utilisateurs', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filtrer
  useEffect(() => {
    if (usersList.length > 0) {
      const filtered = usersList.filter(user => {
        const searchLower = searchTerm.toLowerCase().trim();
        if (searchLower === '') return true;
        const nomMatch = (user.nom?.toLowerCase() || '').includes(searchLower);
        const prenomMatch = (user.prenom?.toLowerCase() || '').includes(searchLower);
        const emailMatch = (user.email?.toLowerCase() || '').includes(searchLower);
        const roleMatch = (user.role?.toLowerCase() || '').includes(searchLower);
        const telephone = user.telephone?.replace(/\s+/g, '') || '';
        const searchDigits = searchTerm.replace(/\s+/g, '');
        const telephoneMatch = telephone.startsWith(searchDigits);
        return nomMatch || prenomMatch || emailMatch || roleMatch || telephoneMatch;
      });
      setFilteredUsers(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, usersList]);

  // Activer/Désactiver
  const handleToggleStatus = async (user) => {
    const isActif = user.statut === 'actif';
    const action = isActif ? 'désactiver' : 'activer';

    const result = await Swal.fire({
      title: `Voulez-vous ${action} cet utilisateur ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#000'
    });

    if (!result.isConfirmed) return;

    try {
      if (isActif) await desactiverUtilisateur(user.id);
      else await activerUtilisateur(user.id);

      setUsersList(prev =>
        prev.map(u =>
          u.id === user.id ? { ...u, statut: isActif ? 'inactif' : 'actif' } : u
        )
      );
      Swal.fire('Succès', `Utilisateur ${action}`, 'success');
    } catch {
      Swal.fire('Erreur', 'Impossible de modifier le statut', 'error');
    }
  };

  // Récupérer les initiales pour l'avatar
  const getInitials = (prenom, nom) => {
    return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) return <div className="loading-spinner">Chargement des utilisateurs...</div>;

  return (
    <div className="userslist-container">
      {/* En-tête */}
      <div className="userslist-header">
        <div className="header-icon">
          <Users size={28} />
        </div>
        <div>
          <h1 className="userslist-title">Liste des utilisateurs</h1>
          <p className="userslist-subtitle">Gérez tous les utilisateurs de la plateforme</p>
        </div>
      </div>

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
          {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? 's' : ''}
        </div>
      </div>

      {/* Tableau */}
      {filteredUsers.length === 0 ? (
        <div className="no-results">
          <Users size={48} />
          <p>Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <>
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
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info-cell">
                          <div className="user-avatar">
                            {user.photoProfil ? (
                              <img src={user.photoProfil} alt="profil" />
                            ) : (
                              <span>{getInitials(user.prenom, user.nom)}</span>
                            )}
                          </div>
                          <div className="user-details-cell">
                            <div className="user-name-cell">
                              {user.prenom} {user.nom}
                            </div>
                            {user.telephone && (
                              <div className="user-phone-cell">
                                <Phone size={12} />
                                {user.telephone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="user-email-cell">
                        <Mail size={12} />
                        {user.email || '-'}
                      </td>
                      <td>
                        <span className={`role-badge role-${(user.role || 'particulier').toLowerCase()}`}>
                          {user.role || 'Particulier'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${isActif ? 'status-active' : 'status-inactive'}`}>
                          {isActif ? <Check size={12} /> : <XIcon size={12} />}
                          {isActif ? 'Actif' : 'Inactif'}
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
                          title={isActif ? 'Désactiver' : 'Activer'}
                        >
                          {isActif ? <UserX size={16} /> : <UserCheck size={16} />}
                          <span>{isActif ? 'Désactiver' : 'Activer'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > usersPerPage && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <ChevronLeft size={18} /> Précédent
              </button>
              <span className="pagination-info">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Suivant <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* MODAL DÉTAILS */}
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
                  <span>{getInitials(selectedUser.prenom, selectedUser.nom)}</span>
                )}
              </div>
              <div className="modal-status">
                <span className={`status-dot ${selectedUser.statut === 'actif' ? 'active' : 'inactive'}`}></span>
                {selectedUser.statut === 'actif' ? 'Actif' : 'Inactif'}
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
            </div>

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
                {selectedUser.statut === 'actif' ? 'Désactiver' : 'Activer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}