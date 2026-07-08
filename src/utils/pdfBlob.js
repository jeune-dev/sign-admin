import SwalCustom from './swal.config';

/** Ouvre un PDF (Blob récupéré depuis le backend) dans un nouvel onglet. */
export async function openPdfBlob(fetchBlob) {
  try {
    const blob = await fetchBlob();
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (err) {
    console.error("Erreur lors de l'ouverture du PDF :", err);
    SwalCustom.fire({ icon: 'error', title: 'Erreur', text: "Impossible d'ouvrir le PDF" });
  }
}

/** Télécharge un PDF (Blob récupéré depuis le backend) sous forme de fichier. */
export async function downloadPdfBlob(fetchBlob, filename) {
  try {
    const blob = await fetchBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } catch (err) {
    console.error('Erreur lors du téléchargement du PDF :', err);
    SwalCustom.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de télécharger le PDF' });
  }
}
