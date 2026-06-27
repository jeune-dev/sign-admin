import React, { useState, useEffect } from 'react';
import {
  Check,
  X as XIcon,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Phone,
  UserCheck,
  UserX,
  MapPin,
  CreditCard,
  Shield,
  Plus,
  KeyRound,
  Lock
} from 'lucide-react';
import SwalCustom from '../../../utils/swal.config';
import {
  listerAdmins,
  activerUtilisateur,
  desactiverUtilisateur,
  ajoutAdmins,
  modifierPermissionsAdmin
} from '../../../service/admin/adminService';
import "../../../assets/css/ListeAdmin.css";

/* Catalogue des permissions attribuables à un administrateur (doit matcher le backend) */
const PERMISSIONS_CATALOGUE = [
  { key: 'users',    label: 'Utilisateurs', desc: 'Voir et gérer les utilisateurs' },
  { key: 'contrats', label: 'Contrats',     desc: 'Consulter les contrats et leurs PDF' },
  { key: 'factures', label: 'Factures',     desc: 'Consulter les factures et leurs PDF' },
  { key: 'admins',   label: 'Administrateurs', desc: 'Créer et gérer les administrateurs' },
];

const FORM_VIDE = {
  nom: '', prenom: '', email: '', mot_de_passe: '',
  telephone: '', adresse: '', carte_identite_national_num: '',
};

export default function UsersList() {
  const [usersList, setUsersList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [imgErrors, setImgErrors] = useState({});

  // ── Création d'un administrateur ──
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(FORM_VIDE);
  const [permissions, setPermissions] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // ── Modification des permissions ──
  const [permsAdmin, setPermsAdmin] = useState(null);
  const [permsSelection, setPermsSelection] = useState([]);
  const [savingPerms, setSavingPerms] = useState(false);

  const ouvrirPermissions = (admin) => {
    setPermsAdmin(admin);
    setPermsSelection(Array.isArray(admin.permissions) ? admin.permissions : []);
  };

  const togglePermSelection = (key) => {
    setPermsSelection(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);
  };

  const handleSavePermissions = async () => {
    if (!permsAdmin) return;
    setSavingPerms(true);
    try {
      const res = await modifierPermissionsAdmin(permsAdmin.id, permsSelection);
      const updated = res?.admin;
      setUsersList(prev => prev.map(u => u.id === permsAdmin.id
        ? { ...u, permissions: updated ? updated.permissions : (permsSelection.length ? permsSelection : null) }
        : u));
      setPermsAdmin(null);
      SwalCustom.fire({ icon: 'success', title: 'Permissions mises à jour', timer: 2000, timerProgressBar: true, showConfirmButton: false });
    } catch (err) {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: err?.response?.data?.message || 'Mise à jour impossible' });
    } finally {
      setSavingPerms(false);
    }
  };

  const chargerAdmins = async () => {
    try {
      const data = await listerAdmins();
      const formatted = (data.admins || []).map(user => ({
        ...user,
        statut: user.statut?.toLowerCase() || 'inactif'
      }));
      setUsersList(formatted);
      setFilteredUsers(formatted);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.message || 'Erreur inconnue';
      if (status === 401) {
        SwalCustom.fire({ icon: 'warning', title: 'Session expirée', text: 'Veuillez vous reconnecter. (' + msg + ')' });
      } else if (!err?.response) {
        SwalCustom.fire({ icon: 'warning', title: 'Connexion impossible', text: 'Le serveur ne répond pas. Attendez 30s puis rechargez la page.' });
      } else {
        SwalCustom.fire({ icon: 'error', title: 'Erreur ' + (status || ''), text: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const togglePermission = (key) => {
    setPermissions(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);
  };

  const resetCreateForm = () => {
    setForm(FORM_VIDE);
    setPermissions([]);
    setPhotoFile(null);
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    if (!form.nom.trim() || !form.prenom.trim() || !form.email.trim() || !form.mot_de_passe) {
      SwalCustom.fire({ icon: 'warning', title: 'Champs requis', text: 'Nom, prénom, email et mot de passe sont obligatoires.' });
      return;
    }
    if (form.mot_de_passe.length < 8) {
      SwalCustom.fire({ icon: 'warning', title: 'Mot de passe trop court', text: 'Le mot de passe doit contenir au moins 8 caractères.' });
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('nom', form.nom.trim());
      fd.append('prenom', form.prenom.trim());
      fd.append('email', form.email.trim());
      fd.append('mot_de_passe', form.mot_de_passe);
      if (form.telephone.trim()) fd.append('telephone', form.telephone.trim());
      if (form.adresse.trim()) fd.append('adresse', form.adresse.trim());
      if (form.carte_identite_national_num.trim()) fd.append('carte_identite_national_num', form.carte_identite_national_num.trim());
      fd.append('permissions', JSON.stringify(permissions));
      if (photoFile) fd.append('photoProfil', photoFile);

      await ajoutAdmins(fd);
      SwalCustom.fire({ icon: 'success', title: 'Administrateur créé', text: `${form.prenom} ${form.nom} a été ajouté avec succès.`, timer: 2500, timerProgressBar: true, showConfirmButton: false });
      setShowCreate(false);
      resetCreateForm();
      await chargerAdmins();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Impossible de créer l'administrateur";
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  // Charger utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await listerAdmins();
        const formatted = (data.admins || []).map(user => ({
          ...user,
          statut: user.statut?.toLowerCase() || 'inactif'
        }));
        setUsersList(formatted);
        setFilteredUsers(formatted);
      } catch (err) {
        const status = err?.response?.status;
        const msg = err?.response?.data?.message || err?.message || 'Erreur inconnue';
        if (status === 401) {
          SwalCustom.fire({ icon: 'warning', title: 'Session expirée', text: 'Veuillez vous reconnecter. (' + msg + ')' });
        } else if (!err?.response) {
          SwalCustom.fire({ icon: 'warning', title: 'Connexion impossible', text: 'Le serveur ne répond pas. Attendez 30s puis rechargez la page.' });
        } else {
          SwalCustom.fire({ icon: 'error', title: 'Erreur ' + (status || ''), text: msg });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Filtrer
  useEffect(() => {
    if (usersList.length > 0) {
      const filtered = usersList.filter(user => {
        const searchLower = searchTerm.toLowerCase().trim();
        if (searchLower === '') return true;
        const nomMatch = (user.nom?.toLowerCase() || '').includes(searchLower);
        const prenomMatch = (user.prenom?.toLowerCase() || '').includes(searchLower);
        const emailMatch = (user.email?.toLowerCase() || '').includes(searchLower);
        const roleMatch = (user.role?.toLowerCase() || '').includes(searchLower);
        const telephone = user.telephone?.replace(/\s+/g, '') || '';
        const searchDigits = searchTerm.replace(/\s+/g, '');
        const telephoneMatch = telephone.startsWith(searchDigits);
        return nomMatch || prenomMatch || emailMatch || roleMatch || telephoneMatch;
      });
      setFilteredUsers(filtered);
      setCurrentPage(1);
    }
  }, [searchTerm, usersList]);

  // Activer/Désactiver
  const handleToggleStatus = async (user) => {
    const isActif = user.statut === 'actif';
    const action = isActif ? 'désactiver' : 'activer';

    const result = await SwalCustom.fire({
      title: `Voulez-vous ${action} cet utilisateur ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
    });

    if (!result.isConfirmed) return;

    try {
      if (isActif) await desactiverUtilisateur(user.id);
      else await activerUtilisateur(user.id);

      setUsersList(prev =>
        prev.map(u =>
          u.id === user.id ? { ...u, statut: isActif ? 'inactif' : 'actif' } : u
        )
      );
      SwalCustom.fire({ icon: 'success', title: 'Succès', text: `Utilisateur ${action}é avec succès`, timer: 2500, timerProgressBar: true, showConfirmButton: false });
    } catch {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de modifier le statut' });
    }
  };

  // Récupérer les initiales pour l'avatar
  const getInitials = (prenom, nom) => {
    return `${prenom?.charAt(0) || ''}${nom?.charAt(0) || ''}`.toUpperCase();
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) return <div className="loading-spinner">Chargement des utilisateurs...</div>;

  return (
    <div className="userslist-container">
      {/* Barre de recherche */}
      <div className="search-section">
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
        <div className="search-stats">
          {filteredUsers.length} administrateur{filteredUsers.length > 1 ? 's' : ''}
        </div>
        <button className="btn-add-admin" onClick={() => { resetCreateForm(); setShowCreate(true); }}>
          <Plus size={18} />
          <span>Ajouter un administrateur</span>
        </button>
      </div>

      {/* Tableau */}
      {filteredUsers.length === 0 ? (
        <div className="no-results">
          <Users size={48} />
          <p>Aucun utilisateur trouvé</p>
        </div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th className="actions-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map(user => {
                  const isActif = user.statut === 'actif';
                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="user-info-cell">
                          <div className="user-avatar">
                            {user.photoProfil && !imgErrors[`row-${user.id}`] ? (
                              <img
                                src={user.photoProfil}
                                alt="profil"
                                onError={() => setImgErrors(prev => ({ ...prev, [`row-${user.id}`]: true }))}
                              />
                            ) : (
                              <span>{getInitials(user.prenom, user.nom)}</span>
                            )}
                          </div>
                          <div className="user-details-cell">
                            <div className="user-name-cell">
                              {user.prenom} {user.nom}
                            </div>
                            {user.telephone && (
                              <div className="user-phone-cell">
                                <Phone size={12} />
                                {user.telephone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="user-email-cell">
                        <Mail size={12} />
                        {user.email || '-'}
                      </td>
                      <td>
                        <span className={`role-badge role-${(user.role || 'particulier').toLowerCase()}`}>
                          {user.role || 'Particulier'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${isActif ? 'status-active' : 'status-inactive'}`}>
                          {isActif ? <Check size={12} /> : <XIcon size={12} />}
                          {isActif ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button className="action-btn btn-view" onClick={() => setSelectedUser(user)} title="Voir détails">
                          <Eye size={16} />
                          <span>Voir</span>
                        </button>
                        <button className="action-btn btn-perms" onClick={() => ouvrirPermissions(user)} title="Modifier les permissions">
                          <KeyRound size={16} />
                          <span>Permissions</span>
                        </button>
                        <button
                          className={`action-btn ${isActif ? 'btn-disable' : 'btn-enable'}`}
                          onClick={() => handleToggleStatus(user)}
                          title={isActif ? 'Désactiver' : 'Activer'}
                        >
                          {isActif ? <UserX size={16} /> : <UserCheck size={16} />}
                          <span>{isActif ? 'Désactiver' : 'Activer'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredUsers.length > usersPerPage && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                <ChevronLeft size={18} /> Précédent
              </button>
              <span className="pagination-info">
                Page {currentPage} sur {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Suivant <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* MODAL DÉTAILS */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modern-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedUser(null)}>
              <XIcon size={16} />
            </button>

            <div className="modal-scrollable">
            <div className="modal-cover"></div>

            <div className="modal-avatar-wrapper">
              <div className="modal-avatar">
                {selectedUser.photoProfil && !imgErrors[`avatar-${selectedUser.id}`] ? (
                  <img
                    src={selectedUser.photoProfil}
                    alt="profil"
                    onError={() => setImgErrors(prev => ({ ...prev, [`avatar-${selectedUser.id}`]: true }))}
                  />
                ) : (
                  <span>{getInitials(selectedUser.prenom, selectedUser.nom)}</span>
                )}
              </div>
              <div className="modal-status">
                <span className={`status-dot ${selectedUser.statut === 'actif' ? 'active' : 'inactive'}`}></span>
                {selectedUser.statut === 'actif' ? 'Actif' : 'Inactif'}
              </div>
            </div>

            <h2 className="modal-name">{selectedUser.prenom} {selectedUser.nom}</h2>
            <p className="modal-role">
              <Shield size={13} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
              {selectedUser.role || 'Administrateur'}
            </p>

            <div className="modal-divider"></div>

            <div className="modal-info-grid">
              <div className="modal-info-item">
                <Mail size={18} />
                <div>
                  <label>Email</label>
                  <p>{selectedUser.email || '-'}</p>
                </div>
              </div>
              <div className="modal-info-item">
                <Phone size={18} />
                <div>
                  <label>Téléphone</label>
                  <p>{selectedUser.telephone || '-'}</p>
                </div>
              </div>
              <div className="modal-info-item">
                <MapPin size={18} />
                <div>
                  <label>Adresse</label>
                  <p>{selectedUser.adresse || '-'}</p>
                </div>
              </div>
              <div className="modal-info-item">
                <CreditCard size={18} />
                <div>
                  <label>N° CNI</label>
                  <p>{selectedUser.carte_identite_national_num || '-'}</p>
                </div>
              </div>
              <div className="modal-info-item">
                <Shield size={18} />
                <div>
                  <label>Statut du compte</label>
                  <p style={{ color: selectedUser.statut === 'actif' ? '#15803d' : '#b91c1c', fontWeight: 700 }}>
                    {selectedUser.statut === 'actif' ? '● Actif' : '● Inactif'}
                  </p>
                </div>
              </div>
              <div className="modal-info-item">
                <KeyRound size={18} />
                <div>
                  <label>Permissions</label>
                  {(!selectedUser.permissions || selectedUser.permissions.length === 0) ? (
                    <p style={{ fontWeight: 700, color: '#1e40af' }}>Accès complet (super-admin)</p>
                  ) : (
                    <div className="perm-badges">
                      {selectedUser.permissions.map(p => {
                        const meta = PERMISSIONS_CATALOGUE.find(x => x.key === p);
                        return <span key={p} className="perm-badge">{meta ? meta.label : p}</span>;
                      })}
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-info-item modal-photo-item">
                <div className="modal-photo-preview">
                  {selectedUser.photoProfil && !imgErrors[`photo-${selectedUser.id}`] ? (
                    <img
                      src={selectedUser.photoProfil}
                      alt="Photo de profil"
                      onError={() => setImgErrors(prev => ({ ...prev, [`photo-${selectedUser.id}`]: true }))}
                    />
                  ) : (
                    <div className="modal-no-photo">
                      <span>{getInitials(selectedUser.prenom, selectedUser.nom)}</span>
                      <small>Aucune photo enregistrée</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
            </div>{/* fin modal-scrollable */}

            <div className="modal-actions">
              <button className="modal-btn modal-btn-secondary" onClick={() => setSelectedUser(null)}>
                Fermer
              </button>
              <button
                className={`modal-btn ${selectedUser.statut === 'actif' ? 'modal-btn-danger' : 'modal-btn-success'}`}
                onClick={() => {
                  setSelectedUser(null);
                  handleToggleStatus(selectedUser);
                }}
              >
                {selectedUser.statut === 'actif' ? 'Désactiver' : 'Activer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CRÉATION D'ADMIN */}
      {showCreate && (
        <div className="modal-overlay" onClick={() => !submitting && setShowCreate(false)}>
          <div className="modern-modal create-admin-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => !submitting && setShowCreate(false)}>
              <XIcon size={16} />
            </button>

            <form onSubmit={handleCreateAdmin} className="modal-scrollable create-admin-form">
              <div className="create-admin-head">
                <div className="create-admin-icon"><Shield size={22} /></div>
                <div>
                  <h2 className="modal-name" style={{ margin: 0 }}>Nouvel administrateur</h2>
                  <p className="create-admin-sub">Renseignez les informations et attribuez les permissions</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label>Prénom *</label>
                  <input name="prenom" value={form.prenom} onChange={handleFormChange} placeholder="Prénom" />
                </div>
                <div className="form-field">
                  <label>Nom *</label>
                  <input name="nom" value={form.nom} onChange={handleFormChange} placeholder="Nom" />
                </div>
                <div className="form-field">
                  <label>Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleFormChange} placeholder="email@exemple.com" />
                </div>
                <div className="form-field">
                  <label>Mot de passe *</label>
                  <input name="mot_de_passe" type="password" value={form.mot_de_passe} onChange={handleFormChange} placeholder="Min. 8 caractères" />
                </div>
                <div className="form-field">
                  <label>Téléphone</label>
                  <input name="telephone" value={form.telephone} onChange={handleFormChange} placeholder="77 000 00 00" />
                </div>
                <div className="form-field">
                  <label>N° CNI</label>
                  <input name="carte_identite_national_num" value={form.carte_identite_national_num} onChange={handleFormChange} placeholder="N° carte d'identité" />
                </div>
                <div className="form-field form-field--full">
                  <label>Adresse</label>
                  <input name="adresse" value={form.adresse} onChange={handleFormChange} placeholder="Adresse" />
                </div>
                <div className="form-field form-field--full">
                  <label>Photo de profil</label>
                  <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
                </div>
              </div>

              <div className="permissions-section">
                <div className="permissions-title">
                  <KeyRound size={16} />
                  <span>Permissions attribuées</span>
                </div>
                <p className="permissions-hint">
                  Sélectionnez les sections accessibles. Aucune sélection = accès complet (super-admin).
                </p>
                <div className="permissions-grid">
                  {PERMISSIONS_CATALOGUE.map(perm => {
                    const actif = permissions.includes(perm.key);
                    return (
                      <button
                        type="button"
                        key={perm.key}
                        className={`permission-card ${actif ? 'permission-card--active' : ''}`}
                        onClick={() => togglePermission(perm.key)}
                      >
                        <div className="permission-check">{actif ? <Check size={14} /> : <Lock size={14} />}</div>
                        <div>
                          <div className="permission-label">{perm.label}</div>
                          <div className="permission-desc">{perm.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="modal-btn modal-btn-secondary" onClick={() => setShowCreate(false)} disabled={submitting}>
                  Annuler
                </button>
                <button type="submit" className="modal-btn modal-btn-success" disabled={submitting}>
                  {submitting ? 'Création…' : "Créer l'administrateur"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL MODIFICATION DES PERMISSIONS */}
      {permsAdmin && (
        <div className="modal-overlay" onClick={() => !savingPerms && setPermsAdmin(null)}>
          <div className="modern-modal create-admin-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => !savingPerms && setPermsAdmin(null)}>
              <XIcon size={16} />
            </button>
            <div className="modal-scrollable create-admin-form">
              <div className="create-admin-head">
                <div className="create-admin-icon"><KeyRound size={22} /></div>
                <div>
                  <h2 className="modal-name" style={{ margin: 0 }}>Permissions de {permsAdmin.prenom} {permsAdmin.nom}</h2>
                  <p className="create-admin-sub">Choisissez les sections accessibles à cet administrateur</p>
                </div>
              </div>

              <div className="permissions-section" style={{ borderTop: 'none', paddingTop: 0, marginTop: 8 }}>
                <p className="permissions-hint">
                  Aucune sélection = accès complet (super-admin).
                </p>
                <div className="permissions-grid">
                  {PERMISSIONS_CATALOGUE.map(perm => {
                    const actif = permsSelection.includes(perm.key);
                    return (
                      <button
                        type="button"
                        key={perm.key}
                        className={`permission-card ${actif ? 'permission-card--active' : ''}`}
                        onClick={() => togglePermSelection(perm.key)}
                      >
                        <div className="permission-check">{actif ? <Check size={14} /> : <Lock size={14} />}</div>
                        <div>
                          <div className="permission-label">{perm.label}</div>
                          <div className="permission-desc">{perm.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="modal-btn modal-btn-secondary" onClick={() => setPermsAdmin(null)} disabled={savingPerms}>
                  Annuler
                </button>
                <button type="button" className="modal-btn modal-btn-success" onClick={handleSavePermissions} disabled={savingPerms}>
                  {savingPerms ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}