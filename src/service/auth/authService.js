import api, { setToken, setUser, clearAuth } from '../api';

/* Validation identifiant */
export const validateIdentifiant = (value) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const cleanedValue = value.replace(/\s/g, '');
  return emailRegex.test(value) || phoneRegex.test(cleanedValue);
};

/* Login */
export const login = async (identifiant, mot_de_passe) => {
  try {
    const response = await api.post('/auth/login', { identifiant, mot_de_passe });

    const { token, utilisateur } = response.data;
    setToken(token);
    setUser(utilisateur);

    return utilisateur;
  } catch (error) {
    throw handleApiError(error);
  }
};

/* Logout */
export const logout = () => clearAuth();

/* Error handler */
export const handleApiError = (error) => {
  if (error.response) {
    switch (error.response.status) {
      case 401: return 'Identifiant ou mot de passe incorrect';
      case 400: return 'Identifiant ou mot de passe incorrect';
      case 404: return 'Service d\'authentification introuvable';
      case 500: return 'Erreur interne du serveur';
      default: return error.response.data?.message || 'Erreur serveur, veuillez réessayer';
    }
  }
  if (error.request) return 'Erreur réseau, vérifiez votre connexion internet';
  return 'Identifiant ou mot de passe incorrect';
};

/* Form validation */
export const validateLoginForm = (identifiant, password) => {
  const errors = {};
  if (!identifiant.trim()) errors.identifiant = "L'identifiant est requis";
  else if (!validateIdentifiant(identifiant)) errors.identifiant = "Identifiant invalide";
  if (!password) errors.password = "Le mot de passe est requis";
  else if (password.length < 6) errors.password = "Minimum 6 caractères";
  return errors;
};

/* Récupérer utilisateur connecté */
export const getUser = () => {
  const user = localStorage.getItem('utilisateur');
  return user ? JSON.parse(user) : null;
};