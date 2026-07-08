import api, { setUser, getUser, clearUser, setStoredToken } from '../api';

export { getUser };

/* Validation du format identifiant */
export const validateIdentifiant = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const cleanedValue = value.replace(/\s/g, '');
  return emailRegex.test(value) || phoneRegex.test(cleanedValue);
};

/* Login */
export const login = async (identifiant, password) => {
  const response = await api.post('/auth/login', {
    identifiant,
    mot_de_passe: password
  });

  // Le backend renvoie une enveloppe { success, message, data: { token, refreshToken, utilisateur } }
  // On lit donc response.data.data (avec repli sur response.data pour un backend "plat")
  const payload = response.data?.data || response.data;
  const { utilisateur, accessToken, token: legacyToken } = payload;
  const theToken = accessToken || legacyToken; // compatibilité ancien et nouveau backend
  setUser(utilisateur);
  if (theToken) setStoredToken(theToken);
  return utilisateur;
};

/* Logout */
export const logout = async () => {
  try {
    await api.post('/auth/logout');
  } finally {
    clearUser();
  }
};

/* Gestion des erreurs API */
export const handleApiError = (error) => {
  if (error?.response) {
    switch (error.response.status) {
      case 401: return 'Identifiant ou mot de passe incorrect';
      case 400: return error.response.data?.message || 'Identifiant ou mot de passe incorrect';
      case 404: return 'Service d\'authentification introuvable';
      case 429: return 'Trop de tentatives. Réessayez dans 15 minutes.';
      case 500: return 'Erreur interne du serveur';
      default:  return error.response.data?.message || 'Erreur serveur, veuillez réessayer';
    }
  }
  if (error?.request) return 'Erreur réseau, vérifiez votre connexion internet';
  return 'Une erreur inattendue s\'est produite';
};

/* Validation du formulaire de login */
export const validateLoginForm = (identifiant, password) => {
  const errors = {};
  if (!identifiant.trim()) errors.identifiant = "L'identifiant est requis";
  else if (!validateIdentifiant(identifiant)) errors.identifiant = "Identifiant invalide";
  if (!password) errors.password = "Le mot de passe est requis";
  else if (password.length < 6) errors.password = "Minimum 6 caractères";
  return errors;
};
