import React, { useState, useEffect } from 'react';
import { Users, Check, X as XIcon, Eye, Search, ChevronLeft, ChevronRight, UserCheck, UserX, Mail, Phone, MapPin, IdCard, Trash2, Download, ShieldCheck } from 'lucide-react';
import SwalCustom from '../../../utils/swal.config';
import AccessDenied from '../../../components/AccessDenied';
import { useServerList } from '../../../hooks/useServerList';
import { formatDate } from '../../../utils/format';
import { fetchAllPages } from '../../../utils/fetchAllPages';
import {
  listeUtilisateurs,
  activerUtilisateur,
  desactiverUtilisateur,
  rejeterUtilisateur,
  supprimerUtilisateur,
  listerJustificatifsUtilisateur,
  telechargerJustificatif,
  statuerJustificatif
} from '../../../service/admin/adminService';
import { exportToCsv } from '../../../utils/exportCsv';
import '../../../assets/css/listeUser.css';

const LIBELLES_JUSTIFICATIF = {
  // La pièce d'identité est déposée face par face : les deux sont exigées.
  cni_recto: 'CNI — recto',
  cni_verso: 'CNI — verso',
  passeport_recto: 'Passeport — page photo',
  passeport_verso: 'Passeport — page opposée',
  rccm: 'Document RCCM',
  ninea: 'Document NINEA',
};

const LIBELLES_STATUT_JUSTIFICATIF = {
  en_attente: 'En attente',
  valide: 'Validé',
  rejete: 'Refusé',
};

const COULEURS_STATUT_JUSTIFICATIF = {
  en_attente: '#b26a00',
  valide: '#1b7f4b',
  rejete: '#c62828',
};

const formatUserRow = (user) => ({
  ...user,
  statut: user.statut?.toLowerCase() || 'inactif'
});

export default function UsersList() {
  const [roleFilter, setRoleFilter] = useState('');
  const [statutFilter, setStatutFilter] = useState('');

  // Pagination + recherche gérées côté serveur — le backend
  // (requirePermission('users')) est la seule source de vérité : le menu
  // peut être trafiqué côté client, mais la donnée réelle n'est jamais
  // chargée ni affichée sans son feu vert.
  const {
    items: currentUsers, loading, accessDenied, reload,
    page: currentPage, totalPages, total, nextPage, prevPage,
    search: searchTerm, setSearch: setSearchTerm,
  } = useServerList(
    async ({ page, limit, search }) => {
      const res = await listeUtilisateurs({ page, limit, search, role: roleFilter, statut: statutFilter });
      return { items: (res.utilisateurs || []).map(formatUserRow), pagination: res.pagination };
    },
    { limit: 10, extraDeps: [roleFilter, statutFilter] }
  );

  const [selectedUser, setSelectedUser] = useState(null);

  // Justificatifs de l'utilisateur affiché (§ 12). Chargés à l'ouverture de
  // la fiche : ces pièces vivent dans un espace privé chiffré, on ne les
  // liste jamais dans le tableau général.
  const [justificatifs, setJustificatifs] = useState([]);
  const [chargementJustificatifs, setChargementJustificatifs] = useState(false);
  const [justificatifEnCours, setJustificatifEnCours] = useState(null);

  const [rejectTarget, setRejectTarget] = useState(null);
  const [rejectMotif, setRejectMotif] = useState('');
  const [rejecting, setRejecting] = useState(false);

  useEffect(() => {
    if (!selectedUser) {
      setJustificatifs([]);
      return;
    }
    let annule = false;
    setChargementJustificatifs(true);
    listerJustificatifsUtilisateur(selectedUser.id)
      .then((res) => {
        if (!annule) setJustificatifs(res?.justificatifs || []);
      })
      .catch(() => {
        if (!annule) setJustificatifs([]);
      })
      .finally(() => {
        if (!annule) setChargementJustificatifs(false);
      });
    return () => { annule = true; };
  }, [selectedUser]);

  /*
   * Ouvre un justificatif dans un nouvel onglet.
   * Le fichier n'a pas d'URL publique : on le récupère en Blob via la route
   * authentifiée, puis on crée une URL d'objet temporaire. Chaque ouverture
   * est journalisée côté serveur dans audit_log.
   */
  const ouvrirJustificatif = async (justificatif) => {
    setJustificatifEnCours(justificatif.id);
    let url;
    try {
      const blob = await telechargerJustificatif(justificatif.id);
      url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: 'Impossible d’ouvrir ce justificatif.' });
    } finally {
      setJustificatifEnCours(null);
      // Laisse au navigateur le temps d'ouvrir l'onglet avant de libérer l'URL.
      if (url) setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
  };

  const validerJustificatif = async (justificatif) => {
    try {
      await statuerJustificatif(justificatif.id, 'valide');
      setJustificatifs((liste) =>
        liste.map((j) => (j.id === justificatif.id ? { ...j, statut: 'valide', motif_rejet: null } : j))
      );
      await reload();
      SwalCustom.fire({ icon: 'success', title: 'Validé', text: 'Le justificatif a été validé.', timer: 2000, timerProgressBar: true, showConfirmButton: false });
    } catch (err) {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: err?.response?.data?.message || 'Impossible de valider ce justificatif' });
    }
  };

  const refuserJustificatif = async (justificatif) => {
    const { value: motif } = await SwalCustom.fire({
      title: 'Refuser ce justificatif',
      input: 'textarea',
      inputLabel: 'Motif du refus (communiqué à l’utilisateur)',
      inputPlaceholder: 'Ex. document illisible, informations non concordantes…',
      showCancelButton: true,
      confirmButtonText: 'Refuser',
      cancelButtonText: 'Annuler',
      inputValidator: (valeur) => (!valeur || !valeur.trim() ? 'Le motif est obligatoire' : undefined),
    });
    if (!motif) return;

    try {
      await statuerJustificatif(justificatif.id, 'rejete', motif.trim());
      setJustificatifs((liste) =>
        liste.map((j) => (j.id === justificatif.id ? { ...j, statut: 'rejete', motif_rejet: motif.trim() } : j))
      );
      SwalCustom.fire({ icon: 'success', title: 'Refusé', text: 'Le justificatif a été refusé.', timer: 2000, timerProgressBar: true, showConfirmButton: false });
    } catch (err) {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: err?.response?.data?.message || 'Impossible de refuser ce justificatif' });
    }
  };

  // Activer/Désactiver
  const handleToggleStatus = async (user) => {
    const isActif = user.statut === 'actif';
    const action = isActif ? 'désactiver' : 'activer';
    // Le participe passé est déclaré, pas fabriqué : accoler « é » à
    // l'infinitif donnait « activeré » / « désactiveré ».
    const participe = isActif ? 'désactivé' : 'activé';

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

      // Recharge depuis le serveur (source de vérité) plutôt qu'une mutation
      // locale optimiste, pour rester cohérent avec la pagination serveur.
      await reload();
      SwalCustom.fire({ icon: 'success', title: 'Succès', text: `Utilisateur ${participe} avec succès`, timer: 2500, timerProgressBar: true, showConfirmButton: false });
    } catch (err) {
      console.error('Erreur lors du changement de statut :', err);
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de modifier le statut' });
    }
  };

  // Rejeter un document d'identité (compte → 'inactif' avec motif)
  const openRejectModal = (user) => {
    setSelectedUser(null);
    setRejectMotif('');
    setRejectTarget(user);
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    const motif = rejectMotif.trim();
    if (!motif) {
      SwalCustom.fire({ icon: 'warning', title: 'Motif requis', text: 'Merci de préciser le motif du rejet.' });
      return;
    }
    setRejecting(true);
    try {
      await rejeterUtilisateur(rejectTarget.id, motif);
      setRejectTarget(null);
      setRejectMotif('');
      await reload();
      SwalCustom.fire({ icon: 'success', title: 'Rejeté', text: 'Le document a été rejeté et le compte désactivé.', timer: 2500, timerProgressBar: true, showConfirmButton: false });
    } catch (err) {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: err?.response?.data?.message || 'Impossible de rejeter ce compte' });
    } finally {
      setRejecting(false);
    }
  };

  // Supprimer (RGPD)
  const handleDelete = async (user) => {
    const result = await SwalCustom.fire({
      title: `Supprimer ${user.prenom} ${user.nom} ?`,
      text: "Cette action supprime définitivement le compte (RGPD).",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Supprimer',
      cancelButtonText: 'Annuler',
    });
    if (!result.isConfirmed) return;
    try {
      await supprimerUtilisateur(user.id);
      await reload();
      SwalCustom.fire({ icon: 'success', title: 'Supprimé', text: 'Utilisateur supprimé', timer: 2200, timerProgressBar: true, showConfirmButton: false });
    } catch (err) {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: err?.response?.data?.message || 'Suppression impossible' });
    }
  };

  // Export CSV — récupère TOUTES les pages correspondant à la recherche
  // active (pas seulement la page actuellement affichée à l'écran).
  const handleExport = async () => {
    const all = await fetchAllPages(
      (p) => listeUtilisateurs({ ...p, search: searchTerm }),
      (res) => (res.utilisateurs || []).map(formatUserRow)
    );
    exportToCsv('utilisateurs', [
      { header: 'Prénom', value: (u) => u.prenom },
      { header: 'Nom', value: (u) => u.nom },
      { header: 'Email', value: (u) => u.email },
      { header: 'Téléphone', value: (u) => u.telephone },
      { header: 'Rôle', value: (u) => u.role },
      { header: 'Statut', value: (u) => u.statut },
      { header: 'Vérifié', value: (u) => (u.compte_verifie ? 'Oui' : 'Non') },
      { header: 'Inscrit le', value: (u) => formatDate(u.createdAt) },
    ], all);
  };

  // NB : pas de `if (loading) return ...` ici. Un retour anticipe demontait
  // toute la page — champ de recherche compris — a chaque rechargement. Comme
  // la saisie declenche justement un rechargement, le champ etait recree apres
  // la premiere lettre et perdait le focus : il fallait recliquer dedans pour
  // taper la suivante. L'etat de chargement est donc rendu DANS la zone de
  // resultats, en laissant la barre de recherche montee.
  if (accessDenied) return <AccessDenied message="Vous n'avez pas la permission de gérer les utilisateurs." />;

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
        <select
          className="filter-select"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="">Tous les rôles</option>
          <option value="Particulier">Particulier</option>
          <option value="Independant">Indépendant</option>
          <option value="Professionnel">Professionnel</option>
        </select>
        <select
          className="filter-select"
          value={statutFilter}
          onChange={(e) => setStatutFilter(e.target.value)}
        >
          <option value="">Tous les statuts</option>
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
          <option value="en_attente_validation">En attente de validation</option>
          <option value="verifie">Vérifiés</option>
          <option value="non_verifie">Non vérifiés</option>
        </select>
        <div className="search-stats">
          {total} utilisateur{total > 1 ? 's' : ''}
        </div>
        <button className="btn-export" onClick={handleExport} disabled={total === 0}>
          <Download size={16} /> <span>Exporter CSV</span>
        </button>
      </div>

      {/* Tableau */}
      {loading ? (
        <div className="loading-spinner">Chargement des utilisateurs…</div>
      ) : currentUsers.length === 0 ? (
        <div className="no-results">
          <Users size={48} />
          <p>Aucun utilisateur trouvé</p>
        </div>
      ) : (
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
                const isPending = user.statut === 'en_attente_validation';
                return (
                  <tr key={user.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar-table">
                          {user.photoProfil ? (
                            <img src={user.photoProfil} alt="profil" />
                          ) : (
                            <span>{user.nom?.charAt(0)}{user.prenom?.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <div className="user-name-table">{user.prenom} {user.nom}</div>
                          {user.telephone && (
                            <div className="user-phone-table">{user.telephone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{user.email || '-'}</td>
                    <td>
                      <span className={`role-badge role-${(user.role || 'particulier').toLowerCase()}`}>
                        {user.role || 'Particulier'}
                      </span>
                    </td>
                    <td>
                      <div className="statut-cellule">
                        <span className={`status-badge ${isActif ? 'status-active' : isPending ? 'status-pending' : 'status-inactive'}`}>
                          {isActif ? <Check size={12} /> : isPending ? <IdCard size={12} /> : <XIcon size={12} />}
                          {isActif ? 'Actif' : isPending ? 'En attente de validation' : 'Inactif'}
                        </span>
                        {/* « Vérifié » n'est pas une valeur de statut mais un état
                            distinct : l'identité a été contrôlée par un admin, ce
                            qui lève la limite de documents. Il s'affiche EN PLUS
                            du statut — un compte vérifié peut être désactivé
                            ensuite, masquer l'un des deux tromperait. */}
                        {user.compte_verifie && (
                          <span className="badge-verifie" title="Identité vérifiée par un administrateur — limite de documents levée">
                            <ShieldCheck size={12} /> Vérifié
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Trois actions, quel que soit le statut : la colonne garde une
                        largeur constante. Le rejet d'un document d'identité reste
                        accessible depuis « Voir » (et depuis la page Demandes
                        d'inscription), il n'ajoute plus un 4e bouton ici. */}
                    <td className="actions-cell">
                      <button className="action-btn btn-view" onClick={() => setSelectedUser(user)} title="Voir détails">
                        <Eye size={16} />
                        <span>Voir</span>
                      </button>
                      <button
                        className={`action-btn ${isActif ? 'btn-disable' : 'btn-enable'}`}
                        onClick={() => handleToggleStatus(user)}
                        title={isActif ? 'Désactiver' : isPending ? 'Valider le document' : 'Activer'}
                      >
                        {isActif ? <UserX size={16} /> : <UserCheck size={16} />}
                        <span>{isActif ? 'Désactiver' : isPending ? 'Valider' : 'Activer'}</span>
                      </button>
                      <button className="action-btn btn-delete" onClick={() => handleDelete(user)} title="Supprimer (RGPD)">
                        <Trash2 size={16} />
                        <span>Supprimer</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={prevPage} disabled={currentPage === 1} className="pagination-btn">
            <ChevronLeft size={18} /> Précédent
          </button>
          <span className="pagination-info">
            Page {currentPage} sur {totalPages}
          </span>
          <button onClick={nextPage} disabled={currentPage === totalPages} className="pagination-btn">
            Suivant <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* MODAL - Version magnifique */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modern-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedUser(null)}>×</button>

            {/* Zone défilante : la modale est plafonnée à 90vh, sans elle tout
                ce qui dépassait — justificatifs compris — restait hors d'atteinte.
                Le bouton de fermeture et la barre d'actions restent en dehors,
                donc toujours visibles. */}
            <div className="modal-scrollable">
            <div className="modal-cover"></div>
            
            <div className="modal-avatar-wrapper">
              <div className="modal-avatar">
                {selectedUser.photoProfil ? (
                  <img src={selectedUser.photoProfil} alt="profil" />
                ) : (
                  <span>
                    {selectedUser.nom?.charAt(0) || ''}
                    {selectedUser.prenom?.charAt(0) || ''}
                  </span>
                )}
              </div>
              <div className="modal-status">
                <span className={`status-dot ${
                  selectedUser.statut === 'actif' ? 'active'
                    : selectedUser.statut === 'en_attente_validation' ? 'pending'
                    : 'inactive'
                }`}></span>
                {selectedUser.statut === 'actif' ? 'Actif'
                  : selectedUser.statut === 'en_attente_validation' ? 'En attente de validation'
                  : 'Inactif'}
              </div>
            </div>

            <h2 className="modal-name">{selectedUser.prenom} {selectedUser.nom}</h2>
            <p className="modal-role">{selectedUser.role || 'Utilisateur'}</p>

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
                <IdCard size={18} />
                <div>
                  <label>
                    {{
                      carte_identite: "N° carte d'identité",
                      permis: 'N° permis de conduire',
                      passeport: 'N° passeport',
                    }[selectedUser.type_document_identite] || 'CNI / NINA'}
                  </label>
                  <p>{selectedUser.carte_identite_national_num || '-'}</p>
                </div>
              </div>
            </div>

            {selectedUser.statut === 'inactif' && selectedUser.motif_rejet && (
              <div className="modal-info-item" style={{ marginTop: 8 }}>
                <XIcon size={18} />
                <div>
                  <label>Motif du rejet</label>
                  <p>{selectedUser.motif_rejet}</p>
                </div>
              </div>
            )}

            {selectedUser.document_identite_url && (
              <div className="modal-document-preview">
                <label>Photo du document</label>
                <a href={selectedUser.document_identite_url} target="_blank" rel="noopener noreferrer">
                  <img src={selectedUser.document_identite_url} alt="Document d'identité" />
                </a>
              </div>
            )}

            {/* Justificatifs déposés depuis l'application (§ 12).
                Stockés chiffrés dans un espace privé : ils s'ouvrent par la
                route authentifiée, jamais par une URL publique. */}
            <div className="modal-document-preview" style={{ marginTop: 12 }}>
              <label>Justificatifs transmis</label>
              {chargementJustificatifs ? (
                <p style={{ fontSize: 13, color: '#6b7280' }}>Chargement…</p>
              ) : justificatifs.length === 0 ? (
                <p style={{ fontSize: 13, color: '#6b7280' }}>
                  Aucun justificatif transmis pour l’instant.
                </p>
              ) : (
                justificatifs.map((justificatif) => (
                  <div
                    key={justificatif.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      flexWrap: 'wrap',
                      padding: '10px 0',
                      borderBottom: '1px solid #f1f1f1',
                    }}
                  >
                    <IdCard size={16} />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {LIBELLES_JUSTIFICATIF[justificatif.type] || justificatif.type}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 10,
                        color: COULEURS_STATUT_JUSTIFICATIF[justificatif.statut],
                        background: `${COULEURS_STATUT_JUSTIFICATIF[justificatif.statut]}1A`,
                      }}
                    >
                      {LIBELLES_STATUT_JUSTIFICATIF[justificatif.statut] || justificatif.statut}
                    </span>
                    <span style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                      <button
                        className="modal-btn modal-btn-secondary"
                        style={{ padding: '6px 12px', fontSize: 12 }}
                        disabled={justificatifEnCours === justificatif.id}
                        onClick={() => ouvrirJustificatif(justificatif)}
                      >
                        {justificatifEnCours === justificatif.id ? 'Ouverture…' : 'Ouvrir'}
                      </button>
                      {justificatif.statut !== 'valide' && (
                        <button
                          className="modal-btn modal-btn-success"
                          style={{ padding: '6px 12px', fontSize: 12 }}
                          onClick={() => validerJustificatif(justificatif)}
                        >
                          Valider
                        </button>
                      )}
                      {justificatif.statut !== 'rejete' && (
                        <button
                          className="modal-btn modal-btn-danger"
                          style={{ padding: '6px 12px', fontSize: 12 }}
                          onClick={() => refuserJustificatif(justificatif)}
                        >
                          Refuser
                        </button>
                      )}
                    </span>
                    {justificatif.motif_rejet && (
                      <p style={{ fontSize: 12, color: '#c62828', width: '100%', margin: 0 }}>
                        {justificatif.motif_rejet}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            </div>{/* fin modal-scrollable */}

            <div className="modal-actions">
              <button className="modal-btn modal-btn-secondary" onClick={() => setSelectedUser(null)}>
                Fermer
              </button>
              {selectedUser.statut === 'en_attente_validation' && (
                <button
                  className="modal-btn modal-btn-danger"
                  onClick={() => openRejectModal(selectedUser)}
                >
                  Rejeter le document
                </button>
              )}
              <button
                className={`modal-btn ${selectedUser.statut === 'actif' ? 'modal-btn-danger' : 'modal-btn-success'}`}
                onClick={() => {
                  setSelectedUser(null);
                  handleToggleStatus(selectedUser);
                }}
              >
                {selectedUser.statut === 'actif' ? 'Désactiver'
                  : selectedUser.statut === 'en_attente_validation' ? 'Valider le document'
                  : 'Activer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL - Rejet du document d'identité */}
      {rejectTarget && (
        <div className="modal-overlay" onClick={() => !rejecting && setRejectTarget(null)}>
          <div className="modern-modal" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => !rejecting && setRejectTarget(null)}>×</button>
            <h2 className="modal-name">Rejeter le document</h2>
            <p className="modal-role">
              {rejectTarget.prenom} {rejectTarget.nom} — {rejectTarget.email}
            </p>
            <div className="modal-divider"></div>
            <div style={{ padding: '0 8px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
                Motif du rejet
              </label>
              <textarea
                value={rejectMotif}
                onChange={(e) => setRejectMotif(e.target.value)}
                rows={4}
                placeholder="Ex : document illisible, informations incohérentes, photo non conforme..."
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ddd', resize: 'vertical' }}
              />
            </div>
            <div className="modal-actions">
              <button className="modal-btn modal-btn-secondary" onClick={() => setRejectTarget(null)} disabled={rejecting}>
                Annuler
              </button>
              <button className="modal-btn modal-btn-danger" onClick={handleReject} disabled={rejecting}>
                {rejecting ? 'Rejet en cours...' : 'Confirmer le rejet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}