import { ShieldAlert } from 'lucide-react';

/**
 * Affiché à la place du contenu d'une section quand le backend renvoie 403
 * (permission manquante). Le frontend ne décide jamais lui-même de l'accès :
 * il se contente de refléter fidèlement le refus déjà décidé côté serveur
 * (voir permission.middleware.js → requirePermission()).
 */
export default function AccessDenied({ message }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '64px 24px',
        textAlign: 'center',
        color: '#6b7280',
      }}
    >
      <ShieldAlert size={48} color="#ef4444" />
      <h3 style={{ margin: 0, color: '#111827' }}>Accès refusé</h3>
      <p style={{ margin: 0, maxWidth: 420 }}>
        {message || "Vous n'avez pas la permission d'accéder à cette section. Contactez un administrateur si vous pensez qu'il s'agit d'une erreur."}
      </p>
    </div>
  );
}
