import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
  withCredentials: true,
});

// ---------- Token + utilisateur en sessionStorage ----------
// Les deux partagent le même espace de stockage (durée de vie identique :
// effacés à la fermeture de l'onglet), pour éviter qu'un token expiré/absent
// coexiste avec un objet utilisateur périmé venant d'un onglet précédent.
const TOKEN_KEY = '_sign_at';
const TOKEN_EXP_KEY = '_sign_exp';
const USER_KEY = 'utilisateur';

const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
};

export const getStoredToken = () => sessionStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => {
  sessionStorage.setItem(TOKEN_KEY, token);
  const payload = decodeToken(token);
  if (payload?.exp) sessionStorage.setItem(TOKEN_EXP_KEY, payload.exp.toString());
};

export const clearStoredToken = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_EXP_KEY);
};

const isTokenExpired = () => {
  const exp = parseInt(sessionStorage.getItem(TOKEN_EXP_KEY) || '0', 10);
  // exp === 0 : pas de token connu → on ne déconnecte pas (cas backend non mis à jour)
  return exp > 0 && Date.now() > exp * 1000;
};

// ---------- Intercepteur requête : injecte le Bearer token ----------
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------- Logique de refresh silencieux ----------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(p => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    const isAuthRoute =
      original.url?.includes('/auth/refresh-token') ||
      original.url?.includes('/auth/login');

    if (error?.response?.status === 401 && !original._retry && !isAuthRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => api(original))
          .catch((err) => Promise.reject(err));
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshRes = await api.post('/auth/refresh-token');
        // Enveloppe backend : { success, message, data: { token, refreshToken } }
        const refreshPayload = refreshRes.data?.data || refreshRes.data;
        const newToken = refreshPayload?.accessToken || refreshPayload?.token;
        if (newToken) {
          setStoredToken(newToken);
        }
        processQueue(null);
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError);
        // Déconnexion UNIQUEMENT si le token JWT a réellement expiré
        // Si le token est encore valide (ou inconnu), on laisse l'app continuer
        if (isTokenExpired()) {
          clearUser();
          window.location.href = '/';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ---------- Helpers utilisateur ----------
export const setUser = (user) => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const user = sessionStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const clearUser = () => {
  sessionStorage.removeItem(USER_KEY);
  clearStoredToken();
};

export default api;
