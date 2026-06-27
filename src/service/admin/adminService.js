import api from '../api';

/* Nombre d'indépendants */
export const nombreIndependant = async () => {
  const response = await api.get('/admin/nombre-independants');
  return response.data;
};

/* Nombre de professionnels */
export const nombreProfessionnelle = async () => {
  const response = await api.get('/admin/nombre-professionnels');
  return response.data;
};

/* Nombre de particuliers */
export const nombreParticulier = async () => {
  const response = await api.get('/admin/nombre-particuliers');
  return response.data;
};

/* Nombre de contrats */
export const nombreContrat = async () => {
  const response = await api.get('/admin/nombre-contrats');
  return response.data;
};

/* Nombre total d'utilisateurs */
export const nombreUtilisateur = async () => {
  const response = await api.get('/admin/nombre-utilisateur');
  return response.data;
};

/* Liste des factures */
export const listeFactures = async () => {
  const response = await api.get('/admin/liste-factures');
  return response.data;
};

/* Nombre de factures */
export const nombreFacture = async () => {
  const response = await api.get('/admin/nombre-facture');
  return response.data;
};

/* Liste des utilisateurs */
export const listeUtilisateurs = async () => {
  const response = await api.get('/admin/liste-utilisateur');
  return response.data;
};

/* Liste des administrateurs */
export const listerAdmins = async () => {
  const response = await api.get('/admin/liste-admins');
  return response.data;
};

/* Ajouter des administrateurs */
export const ajoutAdmins = async (adminData) => {
  const response = await api.post('/admin/ajout-admins', adminData);
  return response.data;
};

/* Nombre d'administrateurs */
export const nombreAdmin = async () => {
  const response = await api.get('/admin/nombre-admins');
  return response.data;
};

/* Modifier les permissions d'un administrateur */
export const modifierPermissionsAdmin = async (id, permissions) => {
  const response = await api.patch(`/admin/admins/${id}/permissions`, { permissions });
  return response.data;
};

/* Activer utilisateur */
export const activerUtilisateur = async (id) => {
  const response = await api.patch(`/admin/activer-utilisateur/${id}`);
  return response.data;
};

/* Désactiver utilisateur */
export const desactiverUtilisateur = async (id) => {
  const response = await api.patch(`/admin/desactiver-utilisateur/${id}`);
  return response.data;
};

/* Supprimer un utilisateur (RGPD) */
export const supprimerUtilisateur = async (id) => {
  const response = await api.delete(`/admin/utilisateur/${id}`);
  return response.data;
};

/* ─── Contrats (endpoint admin unifié) ──────────────────────── */
export const listeContrats = async () => {
  const response = await api.get('/admin/liste-contrats?limit=1000');
  return response.data;
};

export const nombreContrats = async () => {
  const response = await api.get('/admin/nombre-contrats');
  return response.data;
};

/* ─── Statistiques globales du dashboard (endpoint agrégé) ──── */
export const statistiques = async () => {
  const response = await api.get('/admin/statistiques');
  return response.data;
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
