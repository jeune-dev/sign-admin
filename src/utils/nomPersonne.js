/**
 * nomPersonne.js — Forme d'écriture des noms de personnes.
 *
 * Règle unique, la même que côté serveur (`utils/normaliserNom.js`) et que
 * dans l'application mobile :
 *
 *   • le PRÉNOM porte une majuscule initiale à chaque élément — « awa » et
 *     « AWA » deviennent « Awa », « jean-pierre » devient « Jean-Pierre » ;
 *   • le NOM DE FAMILLE s'écrit intégralement en capitales — « diop »
 *     devient « DIOP ».
 *
 * C'est la convention administrative française et ouest-africaine : sur un
 * contrat, elle lève l'ambiguïté entre le nom et le prénom.
 *
 * Le serveur normalise de toute façon à l'enregistrement. La mise en forme est
 * appliquée ici PENDANT LA SAISIE, pour que l'administrateur voie ce qui sera
 * réellement créé plutôt que de le découvrir dans la liste juste après.
 *
 * La saisie n'est pas rognée au fil de la frappe : couper les espaces
 * empêcherait de taper un prénom composé, le curseur restant bloqué avant la
 * seconde partie.
 */

/** Séparateurs qui, à l'intérieur d'un nom, ouvrent un nouvel élément. */
const SEPARATEURS = /[\s\-'’]/;

/** Prénom : majuscule initiale sur chaque élément, le reste en minuscules. */
export function normaliserPrenom(valeur) {
  if (!valeur) return valeur;

  let resultat = '';
  let debutElement = true;

  for (const caractere of String(valeur)) {
    if (SEPARATEURS.test(caractere)) {
      resultat += caractere;
      debutElement = true;
      continue;
    }
    resultat += debutElement ? caractere.toUpperCase() : caractere.toLowerCase();
    debutElement = false;
  }

  return resultat;
}

/** Nom de famille : tout en capitales. */
export function normaliserNomFamille(valeur) {
  if (!valeur) return valeur;
  return String(valeur).toUpperCase();
}
