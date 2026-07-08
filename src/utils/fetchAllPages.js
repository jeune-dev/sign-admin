/**
 * Récupère l'intégralité des résultats d'une liste paginée serveur, page par
 * page. Utilisé pour l'export CSV : l'export doit couvrir tous les résultats
 * correspondant au filtre actif, pas seulement la page actuellement affichée
 * à l'écran (conséquence de la pagination serveur).
 *
 * @param {(params: {page:number, limit:number}) => Promise<any>} fetchPage
 * @param {(rawResult: any) => any[]} extractItems
 * @param {{ limit?: number }} [opts]
 */
export async function fetchAllPages(fetchPage, extractItems, { limit = 100 } = {}) {
  let page = 1;
  let all = [];

  while (true) {
    const res = await fetchPage({ page, limit });
    const items = extractItems(res);
    all = all.concat(items);

    const totalPages = res?.pagination?.totalPages || 1;
    if (page >= totalPages || items.length === 0) break;
    page += 1;
  }

  return all;
}
