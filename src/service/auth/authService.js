import api, { setUser, clearUser, setStoredToken } from '../api';

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

/* -------------------- Mot de passe oublié (admin) -------------------- */

/* Demande de lien de réinitialisation — le backend renvoie toujours le même
 * message générique, que le compte existe ou non (anti-énumération). */
export const forgotPasswordAdmin = async (email) => {
  const response = await api.post('/admin/auth/forgot-password', { email });
  return response.data?.message;
};

/* Réinitialisation effective à partir du token reçu par email */
export const resetPasswordAdmin = async (token, newPassword, confirmPassword) => {
  const response = await api.post('/admin/auth/reset-password', {
    token,
    newPassword,
    confirmPassword
  });
  return response.data?.message;
};

/* Validation email pour le formulaire "mot de passe oublié" */
export const validateForgotPasswordForm = (email) => {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) errors.email = "L'adresse email est requise";
  else if (!emailRegex.test(email)) errors.email = "Adresse email invalide";
  return errors;
};

/* Validation du formulaire de réinitialisation — doit refléter côté client
 * la politique backend (8+ car., maj, min, chiffre, caractère spécial). */
export const validateResetPasswordForm = (newPassword, confirmPassword) => {
  const errors = {};
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_\-+=[\]\\;'`~/]).{8,}$/;
  if (!newPassword) errors.newPassword = "Le mot de passe est requis";
  else if (!strongRegex.test(newPassword)) {
    errors.newPassword = "8 caractères min., avec majuscule, minuscule, chiffre et caractère spécial";
  }
  if (!confirmPassword) errors.confirmPassword = "Veuillez confirmer le mot de passe";
  else if (newPassword && confirmPassword !== newPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas";
  }
  return errors;
};
