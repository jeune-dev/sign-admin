import { Navigate } from 'react-router-dom';
import { getStoredToken } from '../service/api';
import { useUser } from '../context/useUser';

/**
 * Bloque l'accès à une route tant qu'un token + un utilisateur Admin actif
 * ne sont pas présents. La vérification définitive reste côté backend
 * (adminMiddleware exige role === 'Admin' + statut === 'actif') — ce garde
 * évite seulement d'afficher l'UI admin à un visiteur non authentifié.
 */
export default function ProtectedRoute({ children }) {
  const token = getStoredToken();
  const { user } = useUser();

  if (!token || !user || user.role !== 'Admin') {
    return <Navigate to="/sign/login" replace />;
  }

  return children;
}
