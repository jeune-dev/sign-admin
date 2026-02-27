import React, { useState, useEffect } from 'react';
import { Users, Check, X as XIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import { utilisateurs } from '../../../service/admin/adminService'; // ton service API

export default function UsersList({ statusColors, onToggleStatus }) {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Récupération des utilisateurs depuis l'API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await utilisateurs(); // appel API
        setUsersList(data.utilisateurs || []); // adapte selon la structure renvoyée par ton backend
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de récupérer la liste des utilisateurs',
          confirmButtonColor: '#000'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Chargement des utilisateurs...</p>;
  if (!usersList.length) return <p>Aucun utilisateur trouvé.</p>;

  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Gestion des utilisateurs
      </h2>

      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">
            <Users size={18} /> Liste des utilisateurs
          </h3>
        </div>

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
            {usersList.map(user => (
              <tr key={user.id}>
                <td>{user.nom}</td>
                <td>{user.prenom}</td>
                <td>{user.email}</td>
                <td>{user.telephone}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{
                      background: statusColors[user.status]?.bg || '#f3f4f6',
                      color: statusColors[user.status]?.text || '#000',
                      borderColor: statusColors[user.status]?.border || '#e5e7eb'
                    }}
                  >
                    {user.status === 'actif' ? <Check size={12} /> : <XIcon size={12} />}
                    {user.status === 'actif' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td>
                  <button
                    className={`action-button ${user.status === 'actif' ? 'deactivate' : 'activate'}`}
                    onClick={() => onToggleStatus(user.id)}
                  >
                    {user.status === 'actif' ? <XIcon size={14} /> : <Check size={14} />}
                    {user.status === 'actif' ? 'Désactiver' : 'Activer'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}