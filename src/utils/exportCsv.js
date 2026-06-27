/**
 * Exporte une liste d'objets en fichier CSV téléchargeable.
 *
 * @param {string} filename  Nom du fichier (sans extension)
 * @param {Array<{header:string, value:Function}>} columns  Colonnes à exporter
 * @param {Array<Object>} rows  Données
 */
export function exportToCsv(filename, columns, rows) {
  const echappe = (val) => {
    const s = val === null || val === undefined ? '' : String(val);
    // Échappe les guillemets et entoure de guillemets si nécessaire
    if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };

  const enTetes = columns.map((c) => echappe(c.header)).join(';');
  const lignes = rows.map((row) =>
    columns.map((c) => echappe(c.value(row))).join(';')
  );

  // BOM UTF-8 pour qu'Excel reconnaisse les accents
  const contenu = '﻿' + [enTetes, ...lignes].join('\n');
  const blob = new Blob([contenu], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
