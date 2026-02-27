import api from '../api';

/* Nombre d'indépendants */
export const nombreIndependant = async () => {
  try {
    const response = await api.get('/admin/nombre-independants');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* Nombre de professionnels */
export const nombreProfessionnelle = async () => {
  try {
    const response = await api.get('/admin/nombre-professionnels');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* Nombre de particuliers */
export const nombreParticulier = async () => {
  try {
    const response = await api.get('/admin/nombre-particuliers');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* Nombre de contrats */
export const nombreContrat = async () => {
  try {
    const response = await api.get('/admin/nombre-contrats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* Nombre total d'utilisateurs */
export const nombreUtilisateur = async () => {
  try {
    const response = await api.get('/admin/nombre-utilisateur');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* Nombre de factures */
export const nombreFacture = async () => {
  try {
    const response = await api.get('/admin/nombre-facture');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* Liste des utilisateurs */
export const listeUtilisateurs = async () => {
  try {
    const response = await api.get('/admin/liste-utilisateur');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* Activer utilisateur */
export const activerUtilisateur = async (id) => {
  try {
    const response = await api.patch(`/admin/activer-utilisateur/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* Désactiver utilisateur */
export const desactiverUtilisateur = async (id) => {
  try {
    const response = await api.patch(`/admin/desactiver-utilisateur/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};