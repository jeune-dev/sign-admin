import React, { useState, useEffect } from 'react';
import { Check, X as XIcon, Eye, Plus, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';

import {
  listerAdmins,
  ajoutAdmins
} from '../../../service/admin/adminService';

import '../../../assets/css/ListeAdmin.css';

export default function AdminList() {

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 10 éléments par page

  const [newAdmin, setNewAdmin] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    mot_de_passe: ''
  });

  /* ===============================
     Charger liste admins
  =============================== */
  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await listerAdmins();
      const admins = response.admins || response.administrateurs || [];
      setUsersList(admins);
    } catch {
    Swal.fire('Erreur', 'Impossible de récupérer les administrateurs', 'error');
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     FILTRAGE RECHERCHE
  =============================== */
  const filteredUsers = usersList.filter(user => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return true;

    const telephone = user.telephone?.replace(/\s+/g, '') || '';

    return (
      user.nom?.toLowerCase().includes(search) ||
      user.prenom?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.role?.toLowerCase().includes(search) ||
      telephone.startsWith(search)
    );
  });

  // Réinitialiser la page à 1 lorsque la recherche change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Éléments à afficher sur la page courante
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Fonctions de pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  /* ===============================
     Ajouter administrateur
  =============================== */
  const handleAddAdmin = async (e) => {
    e.preventDefault();

    if (Object.values(newAdmin).some(v => !v.trim())) {
      Swal.fire('Erreur', 'Tous les champs sont obligatoires', 'error');
      return;
    }

    try {
      Swal.fire({
        title: 'Enregistrement...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      await ajoutAdmins({ ...newAdmin, role: "Admin" });

      Swal.close();
      setShowAddModal(false);

      setNewAdmin({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
        mot_de_passe: ''
      });

      await fetchAdmins();

      Swal.fire('Succès', 'Administrateur ajouté avec succès', 'success');

    } catch (error) {
      Swal.fire(
        'Erreur',
        error?.response?.data?.message ||
        "Impossible d’ajouter l’administrateur",
        'error'
      );
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <>
      <div className="page-header">
        <h2 className="title">Gestion des administrateurs</h2>
        <button className="btn-add-admin" onClick={() => setShowAddModal(true)}>
          <Plus size={16}/> Ajouter admin
        </button>
      </div>

      <div className="table-container">

        {/* 🔍 Recherche */}
        <div className="search-wrapper">
          <Search size={18} className="search-icon"/>
          <input
            type="text"
            placeholder="Rechercher nom, email, téléphone..."
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

        {/* ✅ SI LISTE VIDE */}
        {filteredUsers.length === 0 ? (
          <p className="no-results">Aucun administrateur trouvé.</p>
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.map(user => {
                  const isActif = user.statut === 'actif';

                  return (
                    <tr key={user.id}>
                      <td>{user.nom || '-'}</td>
                      <td>{user.prenom || '-'}</td>
                      <td>{user.email || '-'}</td>
                      <td>{user.telephone || '-'}</td>
                      <td>{user.role || '-'}</td>

                      <td>
                        <span className={isActif ? 'badge actif' : 'badge inactif'}>
                          {isActif ? <Check size={12}/> : <XIcon size={12}/>}
                          {isActif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>

                      <td className="actions">
                        <button className="btn-view" onClick={() => setSelectedUser(user)}>
                          <Eye size={16}/>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination simple - deux boutons */}
            {filteredUsers.length > itemsPerPage && (
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

      {/* MODAL DETAIL */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{selectedUser.nom} {selectedUser.prenom}</h3>
            <p><strong>Email :</strong> {selectedUser.email || '-'}</p>
            <p><strong>Téléphone :</strong> {selectedUser.telephone || '-'}</p>
            <p><strong>Adresse :</strong> {selectedUser.adresse || '-'}</p>
            <p><strong>Rôle :</strong> {selectedUser.role || '-'}</p>
            <p><strong>Statut :</strong> {selectedUser.statut || '-'}</p>
            <button className="close-btn" onClick={() => setSelectedUser(null)}>Fermer</button>
          </div>
        </div>
      )}

      {/* MODAL AJOUT */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Ajouter un administrateur</h3>

            <form onSubmit={handleAddAdmin} className="form-admin">
              {Object.keys(newAdmin).map((key) => (
                <input
                  key={key}
                  type={key === 'email' ? 'email' : key === 'mot_de_passe' ? 'password' : 'text'}
                  placeholder={key.replace('_',' ') + ' *'}
                  value={newAdmin[key]}
                  onChange={(e)=> setNewAdmin({...newAdmin, [key]: e.target.value})}
                />
              ))}

              <div className="modal-buttons">
                <button type="submit" className="btn-save">Enregistrer</button>
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>Annuler</button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}