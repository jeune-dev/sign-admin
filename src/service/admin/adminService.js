import api from '../api';

/*
 * Le backend renvoie toutes ses réponses dans une enveloppe :
 *   { success, message, data: <payload> }
 * Les composants consomment directement le payload (res.utilisateurs, res.contrats,
 * res.stats, res.total…). On déballe donc `data` ici, comme le font déjà
 * authService et accountService. Repli sur le corps brut si l'enveloppe est absente
 * (réponse « plate » ou flux binaire type Blob).
 */
const unwrap = (response) => {
  const body = response.data;
  if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
    return body.data;
  }
  return body;
};

/* Nombre d'indépendants */
export const nombreIndependant = async () => {
  const response = await api.get('/admin/nombre-independants');
  return unwrap(response);
};

/* Nombre de professionnels */
export const nombreProfessionnelle = async () => {
  const response = await api.get('/admin/nombre-professionnels');
  return unwrap(response);
};

/* Nombre de particuliers */
export const nombreParticulier = async () => {
  const response = await api.get('/admin/nombre-particuliers');
  return unwrap(response);
};

/* Nombre de contrats */
export const nombreContrat = async () => {
  const response = await api.get('/admin/nombre-contrats');
  return unwrap(response);
};

/* Nombre total d'utilisateurs */
export const nombreUtilisateur = async () => {
  const response = await api.get('/admin/nombre-utilisateur');
  return unwrap(response);
};

/* Liste des factures */
export const listeFactures = async () => {
  const response = await api.get('/admin/liste-factures');
  return unwrap(response);
};

/* Nombre de factures */
export const nombreFacture = async () => {
  const response = await api.get('/admin/nombre-facture');
  return unwrap(response);
};

/* Liste des utilisateurs */
export const listeUtilisateurs = async () => {
  const response = await api.get('/admin/liste-utilisateur');
  return unwrap(response);
};

/* Liste des administrateurs */
export const listerAdmins = async () => {
  const response = await api.get('/admin/liste-admins');
  return unwrap(response);
};

/* Ajouter des administrateurs */
export const ajoutAdmins = async (adminData) => {
  const response = await api.post('/admin/ajout-admins', adminData);
  return unwrap(response);
};

/* Nombre d'administrateurs */
export const nombreAdmin = async () => {
  const response = await api.get('/admin/nombre-admins');
  return unwrap(response);
};

/* Modifier les permissions d'un administrateur */
export const modifierPermissionsAdmin = async (id, permissions) => {
  const response = await api.patch(`/admin/admins/${id}/permissions`, { permissions });
  return unwrap(response);
};

/* Activer utilisateur */
export const activerUtilisateur = async (id) => {
  const response = await api.patch(`/admin/activer-utilisateur/${id}`);
  return unwrap(response);
};

/* Désactiver utilisateur */
export const desactiverUtilisateur = async (id) => {
  const response = await api.patch(`/admin/desactiver-utilisateur/${id}`);
  return unwrap(response);
};

/* Supprimer un utilisateur (RGPD) */
export const supprimerUtilisateur = async (id) => {
  const response = await api.delete(`/admin/utilisateur/${id}`);
  return unwrap(response);
};

/* ─── Contrats (endpoint admin unifié) ──────────────────────── */
export const listeContrats = async () => {
  const response = await api.get('/admin/liste-contrats?limit=1000');
  return unwrap(response);
};

export const nombreContrats = async () => {
  const response = await api.get('/admin/nombre-contrats');
  return unwrap(response);
};

/* ─── Statistiques globales du dashboard (endpoint agrégé) ──── */
export const statistiques = async () => {
  const response = await api.get('/admin/statistiques');
  return unwrap(response);
};

/* ─── Téléchargement / aperçu des PDF (flux binaire depuis R2) ─── */
export const telechargerContratPdf = async (type, id) => {
  const response = await api.get(`/admin/contrat-pdf/${type}/${id}`, { responseType: 'blob' });
  return response.data; // Blob application/pdf
};

export const telechargerFacturePdf = async (id) => {
  const response = await api.get(`/admin/facture-pdf/${id}`, { responseType: 'blob' });
  return response.data; // Blob application/pdf
};
