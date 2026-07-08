import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, Edit, Key, Mail, Phone, MapPin,
  IdCard, X, Lock, AlertCircle, CheckCircle2, Camera, User as UserIcon
} from 'lucide-react';
import SwalCustom from '../../../utils/swal.config';
import { getMe, modifierProfil, changerMotDePasse } from '../../../service/account/accountService';
import { logout as authLogout } from '../../../service/auth/authService';
import { useUser } from '../../../context/useUser';
import '../../../assets/css/Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  // Contexte partagé : toute mise à jour ici (photo, nom...) se reflète
  // immédiatement dans la sidebar d'AdminDashboard.
  const { user, setUser, clearUser } = useUser();
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
        setUser(data); // met à jour le contexte + sessionStorage pour toute l'app
      }
    } catch (err) {
      // On garde l'utilisateur déjà en contexte si l'API échoue (fallback
      // voulu), mais on logue quand même la cause réelle pour ne pas masquer
      // un bug.
      console.error('Erreur lors du chargement du profil :', err);
    }
  }, [setUser]);

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
        setUser(updated);
      }
      setEditModalOpen(false);
      // Rechargement complet pour garantir que toute la page (et tous les
      // composants qui liraient l'utilisateur ailleurs) reflètent bien les
      // nouvelles données, sans dépendre uniquement du contexte React.
      await SwalCustom.fire({
        icon: 'success',
        title: 'Profil mis à jour',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      window.location.reload();
    } catch (err) {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: err?.response?.data?.message || 'Mise à jour impossible' });
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

      // Mesure de sécurité : un changement de mot de passe invalide la
      // session en cours. On déconnecte immédiatement et on renvoie vers
      // le login pour forcer une reconnexion avec le nouveau mot de passe.
      await SwalCustom.fire({
        icon: 'success',
        title: 'Mot de passe modifié',
        text: 'Veuillez vous reconnecter avec votre nouveau mot de passe.',
        timer: 2200,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      await authLogout();
      clearUser();
      navigate('/sign/login', { replace: true });
    } catch (err) {
      setPasswordError(err?.response?.data?.message || 'Changement impossible');
      setPasswordSaving(false);
    }
  };

  const getInitials = () => `${(user.prenom || '')[0] || ''}${(user.nom || '')[0] || ''}`.toUpperCase() || 'AD';
  const val = (v) => v || '—';
  const isActif = user.statut !== 'inactif';

  return (
    <div className="profile-page">
      <div className="profile-layout">

        {/* ─── SIDEBAR — carte d'identité ─── */}
        <aside className="profile-sidebar">
          <div className="sidebar-cover" />
          <div className="sidebar-avatar-wrap">
            <div className="sidebar-avatar">
              {user.photoProfil ? (
                <img src={user.photoProfil} alt="Photo de profil" onError={(e) => { e.target.style.display = 'none'; }} />
              ) : (
                <span>{getInitials()}</span>
              )}
            </div>
          </div>
          <div className="sidebar-identity">
            <h1>{user.prenom} {user.nom}</h1>
            <div className="sidebar-badges">
              <span className="badge badge-role"><Shield size={13} /> {user.role || 'Administrateur'}</span>
              <span className={`badge badge-status ${isActif ? '' : 'is-inactive'}`}>
                <span className="dot" /> {isActif ? 'Compte actif' : 'Compte inactif'}
              </span>
            </div>
          </div>
          <div className="sidebar-divider" />
          <div className="sidebar-actions">
            <button className="btn-action btn-edit-profile" onClick={ouvrirEdition}>
              <Edit size={17} /> Modifier le profil
            </button>
            <button className="btn-action btn-change-password" onClick={() => setPasswordModalOpen(true)}>
              <Key size={17} /> Changer le mot de passe
            </button>
          </div>
        </aside>

        {/* ─── CONTENU PRINCIPAL ─── */}
        <main className="profile-main">
          <section className="info-card">
            <div className="info-card-header">
              <div className="icon-wrap"><UserIcon size={17} /></div>
              <div>
                <h2>Informations personnelles</h2>
                <p>Les données associées à votre compte administrateur</p>
              </div>
            </div>
            <div className="info-grid">
              <div className="info-tile">
                <div className="info-icon"><Mail size={17} /></div>
                <div className="info-text"><label>Email</label><p>{val(user.email)}</p></div>
              </div>
              <div className="info-tile">
                <div className="info-icon"><Phone size={17} /></div>
                <div className="info-text"><label>Téléphone</label><p>{val(user.telephone)}</p></div>
              </div>
              <div className="info-tile">
                <div className="info-icon"><MapPin size={17} /></div>
                <div className="info-text"><label>Adresse</label><p>{val(user.adresse)}</p></div>
              </div>
              <div className="info-tile">
                <div className="info-icon"><IdCard size={17} /></div>
                <div className="info-text"><label>N° carte d'identité</label><p>{val(user.carte_identite_national_num)}</p></div>
              </div>
            </div>
          </section>

          <section className="info-card security-card">
            <div className="info-card-header">
              <div className="icon-wrap"><Lock size={17} /></div>
              <div>
                <h2>Sécurité du compte</h2>
                <p>Gérez l'accès et la protection de votre compte</p>
              </div>
            </div>
            <div className="security-row">
              <div className="security-row-text">
                <p className="title">Mot de passe</p>
                <p className="desc">Un changement de mot de passe entraîne une déconnexion immédiate de toutes vos sessions actives.</p>
              </div>
              <button className="btn-security" onClick={() => setPasswordModalOpen(true)}>
                <Key size={15} /> Changer
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* MODALE ÉDITION */}
      {editModalOpen && (
        <div className="modal-overlay" onClick={() => !saving && setEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Edit size={19} /> Modifier le profil</h3>
              <button className="modal-close" onClick={() => setEditModalOpen(false)}><X size={19} /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="avatar-upload-row">
                  <div className="avatar-upload-preview">
                    {photoFile ? (
                      <img src={URL.createObjectURL(photoFile)} alt="Aperçu" />
                    ) : user.photoProfil ? (
                      <img src={user.photoProfil} alt="Photo actuelle" />
                    ) : (
                      <span>{getInitials()}</span>
                    )}
                  </div>
                  <label className="avatar-upload-btn">
                    <Camera size={15} /> Changer la photo
                    <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
                  </label>
                </div>
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
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setEditModalOpen(false)} disabled={saving}>Annuler</button>
                <button type="submit" className="btn-save" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODALE MOT DE PASSE */}
      {passwordModalOpen && (
        <div className="modal-overlay" onClick={() => !passwordSaving && setPasswordModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><Lock size={19} /> Changer le mot de passe</h3>
              <button className="modal-close" onClick={() => setPasswordModalOpen(false)}><X size={19} /></button>
            </div>
            <form onSubmit={handlePasswordSubmit}>
              <div className="modal-body">
                <div className="form-hint">
                  <CheckCircle2 size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                  Pour votre sécurité, vous serez automatiquement déconnecté après ce changement et devrez vous reconnecter.
                </div>
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
                <button type="button" className="btn-cancel" onClick={() => setPasswordModalOpen(false)} disabled={passwordSaving}>Annuler</button>
                <button type="submit" className="btn-save" disabled={passwordSaving}>{passwordSaving ? 'Changement...' : 'Changer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
