import { useState, useEffect, useCallback, useRef } from 'react';
import SwalCustom from '../utils/swal.config';

/**
 * Liste paginée + recherche gérées côté serveur — remplace le chargement
 * intégral de la liste suivi d'un `.slice()` côté client, qui ne passe pas
 * à l'échelle. Le backend (page/limit/search) est la seule source de vérité
 * sur les données affichées.
 *
 * @param {(params: {page:number, limit:number, search:string}) => Promise<{items: any[], pagination: object}>} fetchFn
 * @param {object} [opts]
 * @param {number} [opts.limit=20]
 * @param {number} [opts.debounceMs=400] - délai avant de relancer la recherche
 * @param {any[]} [opts.extraDeps=[]] - dépendances supplémentaires qui doivent
 *   déclencher un rechargement (ex: un filtre de type en plus de la recherche)
 */
export function useServerList(fetchFn, { limit = 20, debounceMs = 400, extraDeps = [] } = {}) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  // Debounce de la recherche pour ne pas déclencher une requête à chaque frappe.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), debounceMs);
    return () => clearTimeout(t);
  }, [search, debounceMs]);

  // Revenir à la page 1 à chaque nouvelle recherche ou changement de filtre.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { setPage(1); }, [debouncedSearch, ...extraDeps]);

  const reload = useCallback(async () => {
    setLoading(true);
    setAccessDenied(false);
    try {
      const result = await fetchFnRef.current({ page, limit, search: debouncedSearch });
      setItems(result.items || []);
      setPagination(result.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      if (err?.response?.status === 403) {
        setAccessDenied(true);
      } else {
        const msg = err?.response?.data?.message || err?.message || 'Une erreur est survenue';
        SwalCustom.fire({ icon: 'error', title: 'Erreur', text: msg });
      }
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, debouncedSearch, ...extraDeps]);

  useEffect(() => { reload(); }, [reload]);

  const totalPages = Math.max(1, pagination.totalPages || 1);
  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  return {
    items, setItems, loading, accessDenied, reload,
    page, totalPages, total: pagination.total || 0,
    nextPage, prevPage,
    search, setSearch,
  };
}
