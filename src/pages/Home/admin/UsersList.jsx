import React, { useState, useEffect } from 'react';
import { Users, Check, X as XIcon, Eye } from 'lucide-react';
import Swal from 'sweetalert2';
import {
  listeUtilisateurs,
  activerUtilisateur,
  desactiverUtilisateur
} from '../../../service/admin/adminService';
import '../../../assets/css/listeUser.css';

export default function UsersList() {

  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

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
      } catch (error) {
        Swal.fire('Erreur', 'Impossible de récupérer les utilisateurs', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔹 Activer / Désactiver
  const handleToggleStatus = async (user) => {

    const isActif = user.statut === 'actif';
    const action = isActif ? 'désactiver' : 'activer';

    const result = await Swal.fire({
      title: `Voulez-vous ${action} cet utilisateur ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Oui`,
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

  if (loading) return <p>Chargement...</p>;

  return (
    <>
      <h2 className="title">Gestion des utilisateurs</h2>

      <div className="table-container">

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
            {usersList.map(user => {
              const isActif = user.statut === 'actif';

              return (
                <tr key={user.id}>
                  <td>{user.nom}</td>
                  <td>{user.prenom}</td>
                  <td>{user.email}</td>
                  <td>{user.telephone}</td>
                  <td>{user.role}</td>

                  <td>
                    <span className={isActif ? 'badge actif' : 'badge inactif'}>
                      {isActif ? <Check size={12}/> : <XIcon size={12}/>}
                      {isActif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>

                  <td className="actions">

                    {/* 👁️ bouton voir */}
                    <button
                      className="btn-view"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Eye size={16} />
                    </button>

                    {/* activer/desactiver */}
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
      </div>

      {/* ✅ MODAL */}
{selectedUser && (
  <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
    <div className="modal" onClick={e => e.stopPropagation()}>

      {/* PHOTO + NOM */}
      <div className="modal-header">

        <div className="avatar-container">
          {selectedUser.photoProfil ? (
            <img
              src={selectedUser.photoProfil}
              alt="profil"
              className="avatar"
            />
          ) : (
            <div className="avatar-placeholder">
              {selectedUser.nom.charAt(0)}
              {selectedUser.prenom.charAt(0)}
            </div>
          )}
        </div>

        <h3>
          {selectedUser.nom} {selectedUser.prenom}
        </h3>

      </div>

      <div className="modal-content">
        <p><strong>Email :</strong> {selectedUser.email}</p>
        <p><strong>Téléphone :</strong> {selectedUser.telephone}</p>
        <p><strong>Adresse :</strong> {selectedUser.adresse}</p>
        <p><strong>Rôle :</strong> {selectedUser.role}</p>
        <p><strong>CNI :</strong> {selectedUser.carte_identite_national_num}</p>
        <p><strong>Statut :</strong> {selectedUser.statut}</p>
      </div>

      <button
        className="close-btn"
        onClick={() => setSelectedUser(null)}
      >
        Fermer
      </button>

    </div>
  </div>
)}
    </>
  );
}