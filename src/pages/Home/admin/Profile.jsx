import React, { useState } from 'react';
import { Shield, Edit, Key, X } from 'lucide-react';

export default function Profile({ currentUser = {} }) {
  // État des modales
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Données du formulaire d'édition
  const [editForm, setEditForm] = useState({
    nom: currentUser.nom || '',
    prenom: currentUser.prenom || '',
    email: currentUser.email || '',
    adresse: currentUser.adresse || '',
    telephone: currentUser.telephone || '',
    photoProfil: currentUser.photoProfil || '',
    carte_identite_national_num: currentUser.carte_identite_national_num || '',
  });

  // Données du formulaire de mot de passe
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Gestionnaires d'ouverture/fermeture
  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);
  const openPasswordModal = () => setPasswordModalOpen(true);
  const closePasswordModal = () => setPasswordModalOpen(false);

  // Mise à jour du formulaire d'édition
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission du formulaire d'édition
  const handleEditSubmit = (e) => {
    e.preventDefault();
    // Ici, vous enverriez les données à votre API
    console.log('Profil mis à jour :', editForm);
    closeEditModal();
  };

  // Mise à jour du formulaire de mot de passe
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  // Soumission du changement de mot de passe
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Vérification que les deux nouveaux mots de passe correspondent
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }
    // Ici, vous enverriez les données à votre API
    console.log('Mot de passe changé');
    closePasswordModal();
  };

  // Valeurs par défaut pour l'affichage
  const user = {
    nom: currentUser.nom || 'Doe',
    prenom: currentUser.prenom || 'John',
    email: currentUser.email || 'john.doe@example.com',
    adresse: currentUser.adresse || 'Non renseignée',
    telephone: currentUser.telephone || 'Non renseigné',
    photoProfil: currentUser.photoProfil || '',
    carte_identite_national_num: currentUser.carte_identite_national_num || 'Non renseigné',
    role: currentUser.role || 'Administrateur',
    dateInscription: currentUser.dateInscription || '01/01/2024',
  };

  return (
    <>
      <div className="profile-card">
        <div className="profile-cover" />

        <div className="profile-header">
          <div className="profile-avatar">
            {user.photoProfil ? (
              <img src={user.photoProfil} alt={`${user.prenom} ${user.nom}`} />
            ) : (
              <span>{user.prenom[0]}{user.nom[0]}</span>
            )}
          </div>
          <div className="profile-title">
            <h3>{user.prenom} {user.nom}</h3>
            <div className="profile-role">
              <Shield size={16} />
              <span>{user.role}</span>
            </div>
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-row">
            <div className="detail-label">Email</div>
            <div className="detail-value">{user.email}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Téléphone</div>
            <div className="detail-value">{user.telephone}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Adresse</div>
            <div className="detail-value">{user.adresse}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">N° carte d'identité</div>
            <div className="detail-value">{user.carte_identite_national_num}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Date d'inscription</div>
            <div className="detail-value">{user.dateInscription}</div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Dernière connexion</div>
            <div className="detail-value">{new Date().toLocaleString('fr-FR')}</div>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={openEditModal} className="btn btn-outline">
            <Edit size={16} />
            Modifier le profil
          </button>
          <button onClick={openPasswordModal} className="btn btn-outline">
            <Key size={16} />
            Modifier le mot de passe
          </button>
        </div>
      </div>

      {/* Modale d'édition du profil */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Modifier le profil</h3>
              <button onClick={closeEditModal} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    value={editForm.prenom}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    name="nom"
                    value={editForm.nom}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={editForm.telephone}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group">
                  <label>Adresse</label>
                  <input
                    type="text"
                    name="adresse"
                    value={editForm.adresse}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group">
                  <label>Photo de profil (URL)</label>
                  <input
                    type="url"
                    name="photoProfil"
                    value={editForm.photoProfil}
                    onChange={handleEditChange}
                    placeholder="https://exemple.com/photo.jpg"
                  />
                </div>
                <div className="form-group">
                  <label>N° carte d'identité nationale</label>
                  <input
                    type="text"
                    name="carte_identite_national_num"
                    value={editForm.carte_identite_national_num}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closeEditModal} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale de changement de mot de passe */}
      {passwordModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Changer le mot de passe</h3>
              <button onClick={closePasswordModal} className="modal-close">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Mot de passe actuel</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nouveau mot de passe</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Confirmer le nouveau mot de passe</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" onClick={closePasswordModal} className="btn btn-secondary">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  Changer le mot de passe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        /* Conteneur principal */
        .profile-card {
          max-width: 600px;
          margin: 0 auto;
          background: #fff;
          border: 1px solid #e0e0e0;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        .profile-cover {
          height: 80px;
          background: linear-gradient(145deg, #f5f5f5, #eaeaea);
        }

        .profile-header {
          display: flex;
          align-items: center;
          padding: 0 24px 20px 24px;
          margin-top: -40px;
        }

        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #fff;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: 600;
          color: #333;
          overflow: hidden;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-title {
          margin-left: 20px;
        }

        .profile-title h3 {
          margin: 0;
          font-size: 20px;
          font-weight: 700;
          color: #111;
        }

        .profile-role {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          color: #555;
          font-size: 14px;
        }

        .profile-details {
          padding: 0 24px 24px 24px;
        }

        .detail-row {
          display: flex;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          width: 160px;
          font-weight: 500;
          color: #666;
        }

        .detail-value {
          flex: 1;
          color: #222;
          word-break: break-word;
        }

        .profile-actions {
          display: flex;
          gap: 12px;
          padding: 0 24px 24px 24px;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 40px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: 1px solid transparent;
        }

        .btn-outline {
          background: transparent;
          border-color: #ccc;
          color: #333;
        }

        .btn-outline:hover {
          background: #f5f5f5;
          border-color: #999;
        }

        .btn-primary {
          background: #111;
          color: #fff;
        }

        .btn-primary:hover {
          background: #333;
        }

        .btn-secondary {
          background: #f0f0f0;
          color: #333;
        }

        .btn-secondary:hover {
          background: #e0e0e0;
        }

        /* Modales */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: #fff;
          border-radius: 16px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #eee;
        }

        .modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #888;
          padding: 4px;
        }

        .modal-close:hover {
          color: #333;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #eee;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 6px;
          font-weight: 500;
          color: #444;
          font-size: 14px;
        }

        .form-group input {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #888;
        }
      `}</style>
    </>
  );
}