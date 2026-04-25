import React, { useState } from 'react';
import adminPhoto from '../../../assets/images/admin-avatar.jpg';
import { 
  Shield, Edit, Key, Mail, Phone, MapPin, Calendar, 
  User, IdCard, LogIn, X, Save, Lock, AlertCircle
} from 'lucide-react';

export default function Profile({ currentUser = {} }) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Données utilisateur avec valeurs par défaut
  const user = {
    nom: currentUser?.nom || 'THIAM',
    prenom: currentUser?.prenom || 'Ibnou',
    email: currentUser?.email || 'ibnouthiam69@gmail.com',
    adresse: currentUser?.adresse || 'Dakar, Sénégal',
    telephone: currentUser?.telephone || '779990000',
    photoProfil: adminPhoto,  // ← Force l'utilisation de ta photo locale
    carte_identite_national_num: currentUser?.carte_identite_national_num || '00040040781111',
    role: currentUser?.role || 'Administrateur',
    dateInscription: currentUser?.dateInscription || '15 Mars 2024',
  };

  // Formulaire d'édition
  const [editForm, setEditForm] = useState({
    nom: user.nom,
    prenom: user.prenom,
    email: user.email,
    telephone: user.telephone,
    adresse: user.adresse,
    carte_identite_national_num: user.carte_identite_national_num,
  });

  // Formulaire mot de passe
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const getInitials = () => {
    return `${user.prenom[0]}${user.nom[0]}`.toUpperCase();
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };
  

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Profil mis à jour :', editForm);
    setSaving(false);
    setEditModalOpen(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    setPasswordSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Mot de passe changé');
    setPasswordSaving(false);
    setPasswordModalOpen(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="profile-container">
      {/* Carte principale */}
      <div className="profile-card">
        {/* Bandeau */}
        <div className="profile-cover"></div>

        {/* En-tête avec avatar */}
        <div className="profile-header">
          <div className="profile-avatar">
            {user.photoProfil ? (
              <img src={user.photoProfil} alt="profil" />
            ) : (
              <span>{getInitials()}</span>
            )}
          </div>
          <div className="profile-info-header">
            <h2>{user.prenom} {user.nom}</h2>
            <div className="profile-role">
              <Shield size={16} />
              <span>{user.role}</span>
            </div>
          </div>
        </div>

        {/* Grille d'informations */}
        <div className="profile-info-grid">
          <div className="info-card">
            <div className="info-icon">
              <Mail size={18} />
            </div>
            <div className="info-content">
              <label>EMAIL</label>
              <p>{user.email}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <Phone size={18} />
            </div>
            <div className="info-content">
              <label>TÉLÉPHONE</label>
              <p>{user.telephone}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <MapPin size={18} />
            </div>
            <div className="info-content">
              <label>ADRESSE</label>
              <p>{user.adresse}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <IdCard size={18} />
            </div>
            <div className="info-content">
              <label>N° CARTE D'IDENTITÉ</label>
              <p>{user.carte_identite_national_num}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <Calendar size={18} />
            </div>
            <div className="info-content">
              <label>DATE D'INSCRIPTION</label>
              <p>{user.dateInscription}</p>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon">
              <LogIn size={18} />
            </div>
            <div className="info-content">
              <label>DERNIÈRE CONNEXION</label>
              <p>{new Date().toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="profile-actions">
          <button className="btn-edit" onClick={() => setEditModalOpen(true)}>
            <Edit size={18} />
            Modifier le profil
          </button>
          <button className="btn-password" onClick={() => setPasswordModalOpen(true)}>
            <Key size={18} />
            Changer mot de passe
          </button>
        </div>
      </div>

      {/* MODALE ÉDITION */}
      {editModalOpen && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Edit size={20} />
                Modifier le profil
              </h3>
              <button className="modal-close" onClick={() => setEditModalOpen(false)}>
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
                  <label>N° Carte d'identité</label>
                  <input
                    type="text"
                    name="carte_identite_national_num"
                    value={editForm.carte_identite_national_num}
                    onChange={handleEditChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setEditModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE MOT DE PASSE */}
      {passwordModalOpen && (
        <div className="modal-overlay" onClick={() => setPasswordModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Lock size={20} />
                Changer le mot de passe
              </h3>
              <button className="modal-close" onClick={() => setPasswordModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="modal-body">
                {passwordError && (
                  <div className="error-message">
                    <AlertCircle size={16} />
                    {passwordError}
                  </div>
                )}
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
                  <label>Confirmer le mot de passe</label>
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
                <button type="button" className="btn-cancel" onClick={() => setPasswordModalOpen(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-save" disabled={passwordSaving}>
                  {passwordSaving ? 'Changement...' : 'Changer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STYLES INTÉGRÉS */}
      <style>{`
        .profile-container {
          padding: 24px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .profile-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        .profile-cover {
          height: 100px;
         
        }

        .profile-header {
          display: flex;
          align-items: center;
          padding: 0 32px 24px 32px;
          margin-top: -50px;
          gap: 24px;
        }

        .profile-avatar {
          width: 100px;
          height: 100px;
          background: white;
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 36px;
          font-weight: 800;
          color: #1a1a1a;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          border: 4px solid white;
          overflow: hidden;
        }

        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-info-header h2 {
          font-size: 24px;
          font-weight: 800;
          color: #dfe2e7;
          margin: 0 0 8px 0;
        }

        .profile-role {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 14px;
          background: #f3f4f6;
          border-radius: 30px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .profile-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          padding: 0 32px 24px;
        }

        .info-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 16px;
          transition: all 0.2s ease;
        }

        .info-card:hover {
          background: #f3f4f6;
          transform: translateY(-2px);
        }

        .info-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1a1a1a;
          flex-shrink: 0;
        }

        .info-content {
          flex: 1;
        }

        .info-content label {
          font-size: 11px;
          font-weight: 700;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 6px;
        }

        .info-content p {
          font-size: 15px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }

        .profile-actions {
          display: flex;
          gap: 16px;
          padding: 20px 32px 32px;
          border-top: 1px solid #e5e7eb;
          background: #ffffff;
        }

        .btn-edit, .btn-password {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 12px 20px;
          border-radius: 14px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .btn-edit {
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
        }

        .btn-edit:hover {
          background: #f9fafb;
          transform: translateY(-2px);
        }

        .btn-password {
          background: #1a1a1a;
          color: white;
        }

        .btn-password:hover {
          background: #333;
          transform: translateY(-2px);
        }

        /* MODALE */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 24px;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
          animation: modalSlideIn 0.2s ease;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0;
          font-size: 18px;
          font-weight: 700;
        }

        .modal-close {
          background: #f3f4f6;
          border: none;
          border-radius: 10px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: #e5e7eb;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid #e5e7eb;
          background: #f9fafb;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
        }

        .form-group input {
          width: 100%;
          padding: 12px 14px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .form-group input:focus {
          outline: none;
          border-color: #1a1a1a;
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.05);
        }

        .btn-cancel {
          padding: 10px 20px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-save {
          padding: 10px 24px;
          background: #1a1a1a;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-save:hover:not(:disabled) {
          background: #333;
        }

        .btn-save:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .error-message {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          background: #fef2f2;
          border-radius: 12px;
          color: #dc2626;
          font-size: 13px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .profile-container {
            padding: 16px;
          }
          
          .profile-header {
            flex-direction: column;
            text-align: center;
            padding: 0 20px 20px 20px;
          }
          
          .profile-info-grid {
            grid-template-columns: 1fr;
            padding: 0 20px 20px;
          }
          
          .profile-actions {
            flex-direction: column;
            padding: 20px;
          }
          
          .profile-avatar {
            width: 80px;
            height: 80px;
            font-size: 28px;
          }
          
          .profile-info-header h2 {
            font-size: 20px;
          }
        }
      `}</style>
    </div>
  );
}