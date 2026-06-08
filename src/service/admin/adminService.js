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

/* ─── Contrats (endpoint admin unifié) ──────────────────────── */
export const listeContrats = async () => {
  const response = await api.get('/admin/liste-contrats?limit=1000');
  return response.data;
};

export const nombreContrats = async () => {
  const response = await api.get('/admin/nombre-contrats');
  return response.data;
};
