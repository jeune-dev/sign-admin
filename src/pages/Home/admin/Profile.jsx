import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, Edit, Key, Mail, Phone, MapPin, Calendar,
  IdCard, X, Lock, AlertCircle
} from 'lucide-react';
import SwalCustom from '../../../utils/swal.config';
import { getMe, modifierProfil, changerMotDePasse } from '../../../service/account/accountService';
import { setUser } from '../../../service/api';

export default function Profile({ currentUser = {} }) {
  const [user, setUserState] = useState(currentUser || {});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const [editForm, setEditForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', adresse: '', carte_identite_national_num: '',
  });
  const [photoFile, setPhotoFile] = useState(null);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '',
  });

  // Charge le profil réel depuis l'API
  const charger = useCallback(async () => {
    try {
      const data = await getMe();
      if (data) {
        setUserState(data);
        setUser(data); // met à jour le localStorage pour toute l'app
      }
    } catch {
      /* on garde currentUser passé en prop si l'API échoue */
    }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  const ouvrirEdition = () => {
    setEditForm({
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      telephone: user.telephone || '',
      adresse: user.adresse || '',
      carte_identite_national_num: user.carte_identite_national_num || '',
    });
    setPhotoFile(null);
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      ['nom', 'prenom', 'email', 'telephone', 'adresse', 'carte_identite_national_num'].forEach((k) => {
        if (editForm[k] !== undefined) fd.append(k, editForm[k]);
      });
      if (photoFile) fd.append('photoProfil', photoFile);

      const res = await modifierProfil(fd);
      const updated = res?.utilisateur || res?.data?.utilisateur;
      if (updated) {
        setUserState(updated);
        setUser(updated);
      }
      setEditModalOpen(false);
      SwalCustom.fire({ icon: 'success', title: 'Profil mis à jour', timer: 2000, timerProgressBar: true, showConfirmButton: false });
    } catch (err) {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: err?.response?.data?.message || 'Mise à jour impossible' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Les nouveaux mots de passe ne correspondent pas');
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setPasswordSaving(true);
    try {
      await changerMotDePasse(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      SwalCustom.fire({ icon: 'success', title: 'Mot de passe modifié', timer: 2000, timerProgressBar: true, showConfirmButton: false });
    } catch (err) {
      setPasswordError(err?.response?.data?.message || 'Changement impossible');
    } finally {
      setPasswordSaving(false);
    }
  };

  const getInitials = () => `${(user.prenom || '')[0] || ''}${(user.nom || '')[0] || ''}`.toUpperCase() || 'AD';
  const val = (v) => v || '—';

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-cover"></div>

        <div className="profile-header">
          <div className="profile-avatar">
            {user.photoProfil ? (
              <img src={user.photoProfil} alt="profil" onError={(e) => { e.target.style.display = 'none'; }} />
            ) : (
              <span>{getInitials()}</span>
            )}
          </div>
          <div className="profile-info-header">
            <h2>{user.prenom} {user.nom}</h2>
            <div className="profile-role">
              <Shield size={16} />
              <span>{user.role || 'Administrateur'}</span>
            </div>
          </div>
        </div>

        <div className="profile-info-grid">
          <div className="info-card">
            <div className="info-icon"><Mail size={18} /></div>
            <div className="info-content"><label>EMAIL</label><p>{val(user.email)}</p></div>
          </div>
          <div className="info-card">
            <div className="info-icon"><Phone size={18} /></div>
            <div className="info-content"><label>TÉLÉPHONE</label><p>{val(user.telephone)}</p></div>
          </div>
          <div className="info-card">
            <div className="info-icon"><MapPin size={18} /></div>
            <div className="info-content"><label>ADRESSE</label><p>{val(user.adresse)}</p></div>
          </div>
          <div className="info-card">
            <div className="info-icon"><IdCard size={18} /></div>
            <div className="info-content"><label>N° CARTE D'IDENTITÉ</label><p>{val(user.carte_identite_national_num)}</p></div>
          </div>
          <div className="info-card">
            <div className="info-icon"><Shield size={18} /></div>
            <div className="info-content"><label>RÔLE</label><p>{val(user.role)}</p></div>
          </div>
          <div className="info-card">
            <div className="info-icon"><Calendar size={18} /></div>
            <div className="info-content"><label>STATUT</label><p>{user.statut === 'inactif' ? 'Inactif' : 'Actif'}</p></div>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn-edit" onClick={ouvrirEdition}>
            <Edit size={18} /> Modifier le profil
          </button>
          <button className="btn-password" onClick={() => setPasswordModalOpen(true)}>
            <Key size={18} /> Changer mot de passe
          </button>
        </div>
      </div>

      {/* MODALE ÉDITION */}
      {editModalOpen && (
        <div className="modal-overlay" onClick={() => setEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Edit size={20} /> Modifier le profil</h3>
              <button className="modal-close" onClick={() => setEditModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group"><label>Prénom</label>
                  <input type="text" name="prenom" value={editForm.prenom} onChange={handleEditChange} required /></div>
                <div className="form-group"><label>Nom</label>
                  <input type="text" name="nom" value={editForm.nom} onChange={handleEditChange} required /></div>
                <div className="form-group"><label>Email</label>
                  <input type="email" name="email" value={editForm.email} onChange={handleEditChange} required /></div>
                <div className="form-group"><label>Téléphone</label>
                  <input type="tel" name="telephone" value={editForm.telephone} onChange={handleEditChange} /></div>
                <div className="form-group"><label>Adresse</label>
                  <input type="text" name="adresse" value={editForm.adresse} onChange={handleEditChange} /></div>
                <div className="form-group"><label>N° Carte d'identité</label>
                  <input type="text" name="carte_identite_national_num" value={editForm.carte_identite_national_num} onChange={handleEditChange} /></div>
                <div className="form-group"><label>Photo de profil</label>
                  <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setEditModalOpen(false)}>Annuler</button>
                <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE MOT DE PASSE */}
      {passwordModalOpen && (
        <div className="modal-overlay" onClick={() => setPasswordModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Lock size={20} /> Changer le mot de passe</h3>
              <button className="modal-close" onClick={() => setPasswordModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="modal-body">
                {passwordError && (
                  <div className="error-message"><AlertCircle size={16} /> {passwordError}</div>
                )}
                <div className="form-group"><label>Mot de passe actuel</label>
                  <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} required /></div>
                <div className="form-group"><label>Nouveau mot de passe</label>
                  <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} required /></div>
                <div className="form-group"><label>Confirmer le mot de passe</label>
                  <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordChange} required /></div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setPasswordModalOpen(false)}>Annuler</button>
                <button type="submit" className="btn-save" disabled={passwordSaving}>{passwordSaving ? 'Changement...' : 'Changer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STYLES INTÉGRÉS */}
      <style>{`
        .profile-container { padding: 24px; max-width: 1000px; margin: 0 auto; }
        .profile-card { background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
        .profile-cover { height: 100px; background: linear-gradient(135deg, #0a0a0a 0%, #2a2a2a 100%); }
        .profile-header { display: flex; align-items: center; padding: 0 32px 24px 32px; margin-top: -50px; gap: 24px; }
        .profile-avatar { width: 100px; height: 100px; background: white; border-radius: 28px; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: 800; color: #1a1a1a; box-shadow: 0 8px 24px rgba(0,0,0,0.12); border: 4px solid white; overflow: hidden; }
        .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .profile-info-header { margin-top: 50px; }
        .profile-info-header h2 { font-size: 24px; font-weight: 800; color: #1f2937; margin: 0 0 8px 0; }
        .profile-role { display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: #f3f4f6; border-radius: 30px; font-size: 13px; font-weight: 600; color: #374151; }
        .profile-info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; padding: 0 32px 24px; }
        .info-card { display: flex; align-items: flex-start; gap: 14px; padding: 16px; background: #f9fafb; border-radius: 16px; transition: all 0.2s ease; }
        .info-card:hover { background: #f3f4f6; transform: translateY(-2px); }
        .info-icon { width: 40px; height: 40px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #1a1a1a; flex-shrink: 0; }
        .info-content { flex: 1; min-width: 0; }
        .info-content label { font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 6px; }
        .info-content p { font-size: 15px; font-weight: 600; color: #1f2937; margin: 0; word-break: break-word; }
        .profile-actions { display: flex; gap: 16px; padding: 20px 32px 32px; border-top: 1px solid #e5e7eb; background: #ffffff; }
        .btn-edit, .btn-password { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 12px 20px; border-radius: 14px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s ease; border: none; }
        .btn-edit { background: white; color: #1f2937; border: 1px solid #e5e7eb; }
        .btn-edit:hover { background: #f9fafb; transform: translateY(-2px); }
        .btn-password { background: #1a1a1a; color: white; }
        .btn-password:hover { background: #333; transform: translateY(-2px); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 24px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #e5e7eb; }
        .modal-header h3 { display: flex; align-items: center; gap: 10px; margin: 0; font-size: 18px; font-weight: 700; }
        .modal-close { background: #f3f4f6; border: none; border-radius: 10px; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .modal-close:hover { background: #e5e7eb; }
        .modal-body { padding: 24px; }
        .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px 24px; border-top: 1px solid #e5e7eb; background: #f9fafb; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-size: 13px; font-weight: 600; color: #374151; }
        .form-group input { width: 100%; padding: 12px 14px; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 14px; }
        .form-group input:focus { outline: none; border-color: #1a1a1a; box-shadow: 0 0 0 3px rgba(0,0,0,0.05); }
        .btn-cancel { padding: 10px 20px; background: white; border: 1px solid #e5e7eb; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-save { padding: 10px 24px; background: #1a1a1a; color: white; border: none; border-radius: 12px; font-size: 14px; font-weight: 600; cursor: pointer; }
        .btn-save:hover:not(:disabled) { background: #333; }
        .btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
        .error-message { display: flex; align-items: center; gap: 8px; padding: 12px; background: #fef2f2; border-radius: 12px; color: #dc2626; font-size: 13px; margin-bottom: 20px; }
        @media (max-width: 768px) {
          .profile-container { padding: 16px; }
          .profile-header { flex-direction: column; text-align: center; padding: 0 20px 20px 20px; }
          .profile-info-header { margin-top: 0; }
          .profile-info-grid { grid-template-columns: 1fr; padding: 0 20px 20px; }
          .profile-actions { flex-direction: column; padding: 20px; }
          .profile-avatar { width: 80px; height: 80px; font-size: 28px; }
          .profile-info-header h2 { font-size: 20px; }
        }
      `}</style>
    </div>
  );
}
