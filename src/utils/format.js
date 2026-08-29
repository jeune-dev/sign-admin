/** Formatage réutilisé par Dashboard, UsersList, FactureList, ContratsList. */
export const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

/**
 * Date ET heure — pour le journal d'audit, où « quand » veut dire à la minute
 * près : savoir qu'une connexion a eu lieu « le 29 août » ne sert à rien pour
 * recouper un incident. `formatDate` reste volontairement sans heure, les
 * listes de documents n'en ont pas besoin.
 */
export const formatDateHeure = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

export const formatNombre = (n) => {
  if (!n) return '0';
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
};
