import React from 'react';
import { Users, Check, X as XIcon } from 'lucide-react';
import Swal from 'sweetalert2';

export default function UsersList({ usersList, statusColors, onToggleStatus }) {
  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Gestion des utilisateurs
      </h2>
      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">
            <Users size={18} />
            Liste des utilisateurs
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
                <td><span className="user-name">{user.nom}</span></td>
                <td>{user.prenom}</td>
                <td><span className="user-email">{user.email}</span></td>
                <td>{user.telephone}</td>
                <td>{user.role}</td>
                <td>
                  <span
                    className="status-badge"
                    style={{
                      background: statusColors[user.status].bg,
                      color: statusColors[user.status].text,
                      borderColor: statusColors[user.status].border
                    }}
                  >
                    {user.status === 'actif' ? <Check size={12} /> : <XIcon size={12} />}
                    {user.status === 'actif' ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td>
                  {user.status === 'actif' ? (
                    <button className="action-button deactivate" onClick={() => onToggleStatus(user.id)}>
                      <XIcon size={14} />
                      Désactiver
                    </button>
                  ) : (
                    <button className="action-button activate" onClick={() => onToggleStatus(user.id)}>
                      <Check size={14} />
                      Activer
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}