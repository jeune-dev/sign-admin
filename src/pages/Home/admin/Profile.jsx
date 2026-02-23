import React from 'react';
import { Shield } from 'lucide-react';

export default function Profile({ currentUser }) {
  return (
    <>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
        Mon profil
      </h2>
      <div className="profile-container">
        <div className="profile-cover" />
        <div className="profile-content">
          <div className="profile-avatar-large">
            {currentUser.prenom?.[0]}{currentUser.nom?.[0] || 'A'}
          </div>
          <div className="profile-name">{currentUser.prenom} {currentUser.nom}</div>
          <div className="profile-role">
            <Shield size={16} />
            {currentUser.role || 'Administrateur'}
          </div>

          <div className="profile-grid">
            <div className="profile-field">
              <div className="profile-label">Email</div>
              <div className="profile-value">{currentUser.email}</div>
            </div>
            <div className="profile-field">
              <div className="profile-label">Téléphone</div>
              <div className="profile-value">{currentUser.telephone || 'Non renseigné'}</div>
            </div>
            <div className="profile-field">
              <div className="profile-label">Date d'inscription</div>
              <div className="profile-value">{currentUser.dateInscription || 'Non renseignée'}</div>
            </div>
            <div className="profile-field">
              <div className="profile-label">Dernière connexion</div>
              <div className="profile-value">{new Date().toLocaleString('fr-FR')}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}