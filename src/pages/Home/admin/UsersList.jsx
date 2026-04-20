import React, { useState, useEffect } from 'react';
import { Users, Check, X as XIcon, Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import {
  listeUtilisateurs,
  activerUtilisateur,
  desactiverUtilisateur
} from '../../../service/admin/adminService'; 
import '../../../assets/css/listeUser.css';

export default function UsersList() {

  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // 🔹 Charger utilisateurs
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
      } catch{
        Swal.fire('Erreur', 'Impossible de récupérer les utilisateurs', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔹 Filtrer les utilisateurs lors de la recherche
  useEffect(() => {
    if (usersList.length > 0) {
      const filtered = usersList.filter(user => {
        const searchLower = searchTerm.toLowerCase().trim();
        
        // Si le terme de recherche est vide, on garde tout
        if (searchLower === '') return true;
        
        // Recherche dans le nom
        const nomMatch = (user.nom?.toLowerCase() || '').includes(searchLower);
        
        // Recherche dans le prénom
        const prenomMatch = (user.prenom?.toLowerCase() || '').includes(searchLower);
        
        // Recherche dans l'email
        const emailMatch = (user.email?.toLowerCase() || '').includes(searchLower);
        
        // Recherche dans le rôle
        const roleMatch = (user.role?.toLowerCase() || '').includes(searchLower);
        
        // RECHERCHE TÉLÉPHONE - Vérifie si le numéro COMMENCE par les chiffres saisis
        const telephone = user.telephone?.replace(/\s+/g, '') || ''; // Enlève les espaces
        const searchDigits = searchTerm.replace(/\s+/g, ''); // Enlève les espaces du terme recherché
        const telephoneMatch = telephone.startsWith(searchDigits);
        
        return nomMatch || prenomMatch || emailMatch || roleMatch || telephoneMatch;
      });
      
      setFilteredUsers(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, usersList]);

  // 🔹 Activer / Désactiver utilisateur
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
          u.id === user.id
            ? { ...u, statut: isActif ? 'inactif' : 'actif' }
            : u
        )
      );

      Swal.fire('Succès', `Utilisateur ${action}`, 'success');
    } catch {
      Swal.fire('Erreur', 'Impossible de modifier le statut', 'error');
    }
  };

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  if (loading) return <p>Chargement des utilisateurs...</p>;

  return (
    <>

      <h2 className="title">Gestion des utilisateurs</h2>

      <div className="table-container">
        <div className="table-header">
          {/* 🔍 Barre de recherche */}
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
        </div>

        {filteredUsers.length === 0 ? (
          <p className="no-results">Aucun utilisateur trouvé.</p>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => {
                  const isActif = user.statut === 'actif';

                  return (
                    <tr key={user.id}>
                      <td>{user.nom || '-'}</td>
                      <td>{user.prenom || '-'}</td>
                      <td>{user.email || '-'}</td>
                      <td>{user.role || '-'}</td>
                      <td>
                        <span className={`badge ${isActif ? 'actif' : 'inactif'}`}>
                          {isActif ? <Check size={12}/> : <XIcon size={12}/>}
                          {isActif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="actions">
                        {/* Voir détails */}
                        <button className="btn-view" onClick={() => setSelectedUser(user)}>
                          <Eye size={16} />
                        </button>

                        {/* Activer/Désactiver */}
                        <button
                          className={isActif ? 'btn-disable' : 'btn-enable'}
                          onClick={() => handleToggleStatus(user)}
                        >
                          {isActif ? 'Désactiver' : 'Activer'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination simple - juste deux boutons */}
            {filteredUsers.length > usersPerPage && (
              <div className="pagination-simple">
                <button 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                  className="pagination-btn pagination-prev"
                >
                  <ChevronLeft size={18} /> Précédent
                </button>
                
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

      {/* ✅ MODAL utilisateur */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="avatar-container">
                {selectedUser.photoProfil ? (
                  <img src={selectedUser.photoProfil} alt="profil" className="avatar" />
                ) : (
                  <div className="avatar-placeholder">
                    {selectedUser.nom?.charAt(0) || ''}
                    {selectedUser.prenom?.charAt(0) || ''}
                  </div>
                )}
              </div>
              <h3>{selectedUser.nom} {selectedUser.prenom}</h3>
            </div>

            <div className="modal-content">
              <p><strong>Email :</strong> {selectedUser.email || '-'}</p>
              <p><strong>Téléphone :</strong> {selectedUser.telephone || '-'}</p>
              <p><strong>Adresse :</strong> {selectedUser.adresse || '-'}</p>
              <p><strong>Rôle :</strong> {selectedUser.role || '-'}</p>
              <p><strong>CNI :</strong> {selectedUser.carte_identite_national_num || '-'}</p>
              <p><strong>Statut :</strong> {selectedUser.statut || '-'}</p>
            </div>

            <button className="close-btn" onClick={() => setSelectedUser(null)}>Fermer</button>
          </div>
        </div>
      )}
    </>
  );
}