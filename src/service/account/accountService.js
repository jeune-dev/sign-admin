import api from '../api';

/* Récupère le profil de l'utilisateur connecté */
export const getMe = async () => {
  const response = await api.get('/account/me');
  // { utilisateur }
  return response.data?.utilisateur || response.data?.data?.utilisateur || null;
};

/* Modifie les informations personnelles (multipart : peut inclure photoProfil) */
export const modifierProfil = async (formData) => {
  const response = await api.put('/account/modifier-info-personnelles', formData);
  return response.data;
};

/* Change le mot de passe — le backend attend { oldPassword, newPassword } */
export const changerMotDePasse = async (oldPassword, newPassword) => {
  const response = await api.put('/account/change-password', { oldPassword, newPassword });
  return response.data;
};
