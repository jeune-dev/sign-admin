import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  UserCheck, UserX, Clock, FileWarning, Users as UsersIcon,
  Search, ChevronLeft, ChevronRight, Eye, Check, X as XIcon, IdCard,
  ZoomIn, ZoomOut, RotateCw, ExternalLink, Copy, AlertTriangle, Inbox,
  Loader2, FileText, ShieldAlert,
} from 'lucide-react';

import SwalCustom from '../../../utils/swal.config';
import AccessDenied from '../../../components/AccessDenied';
import { useServerList } from '../../../hooks/useServerList';
import { formatDate } from '../../../utils/format';
import {
  listerDemandesInscription,
  statsDemandesInscription,
  detailDemandeInscription,
  validerDemandeInscription,
  rejeterDemandeInscription,
  telechargerJustificatif,
} from '../../../service/admin/adminService';
import '../../../assets/css/listeUser.css';
import '../../../assets/css/DemandesInscription.css';

/* Vocabulaire de la file de validation, aligné sur le backend. */
const STATUTS = {
  en_attente: { label: 'En attente', couleur: '#b26a00', fond: '#fff4e5' },
  incomplet: { label: 'Profil incomplet', couleur: '#6b7280', fond: '#f3f4f6' },
  validee: { label: 'Validée', couleur: '#1b7f4b', fond: '#e8f5ee' },
  rejetee: { label: 'Refusée', couleur: '#c62828', fond: '#fdecec' },
};

const LIBELLES_JUSTIFICATIF = {
  document_inscription: 'Pièce déposée à l’inscription',
  cni_recto: 'CNI — recto',
  cni_verso: 'CNI — verso',
  passeport_recto: 'Passeport — page photo',
  passeport_verso: 'Passeport — page opposée',
  rccm: 'Document RCCM',
  ninea: 'Document NINEA',
};

/* Onglets de la file. `cle` = valeur envoyée au backend, `stat` = compteur
   correspondant renvoyé par /stats. */
const ONGLETS = [
  { cle: 'en_attente', label: 'En attente', stat: 'en_attente' },
  { cle: 'incomplet', label: 'Profil incomplet', stat: 'incompletes' },
  { cle: 'validee', label: 'Validées', stat: 'validees' },
  { cle: 'rejetee', label: 'Refusées', stat: 'rejetees' },
  { cle: '', label: 'Toutes', stat: 'total' },
];

/* Motifs de refus prêts à cocher : les mêmes reviennent en boucle, les
   retaper à chaque fois coûte du temps et produit des messages incohérents
   d'un admin à l'autre. Le texte libre reste là pour le cas particulier. */
const MOTIFS_COURANTS = [
  'La photo de la pièce est illisible ou floue',
  'La pièce d’identité est expirée',
  'Le nom sur la pièce ne correspond pas aux informations saisies',
  'Le numéro de pièce saisi ne correspond pas au document',
  'Le verso de la pièce est manquant',
  'Le document fourni n’est pas une pièce officielle',
  'Le document d’entreprise (RCCM ou NINEA) est manquant',
];

/* Couleur de la pastille d'état d'une pièce. */
const COULEUR_ETAT_PIECE = {
  valide: '#1b7f4b',
  rejete: '#c62828',
  en_attente: '#b26a00',
};

export default function DemandesInscriptionPage() {
  const [statutFilter, setStatutFilter] = useState('en_attente');
  const [stats, setStats] = useState(null);
  const [selection, setSelection] = useState(null);
  const [chargementDetail, setChargementDetail] = useState(false);

  const {
    items: demandes, loading, accessDenied, reload,
    page, totalPages, total, nextPage, prevPage,
    search, setSearch,
  } = useServerList(
    async ({ page: p, limit, search: q }) => {
      const res = await listerDemandesInscription({
        page: p, limit, search: q, statut: statutFilter,
      });
      return { items: res.demandes || [], pagination: res.pagination };
    },
    { limit: 10, extraDeps: [statutFilter] }
  );

  const chargerStats = useCallback(async () => {
    try {
      setStats(await statsDemandesInscription());
    } catch {
      setStats(null);
    }
  }, []);

  useEffect(() => { chargerStats(); }, [chargerStats]);

  /* Recharge la liste ET les compteurs : une décision change les deux. */
  const rafraichir = async () => {
    await Promise.all([reload(), chargerStats()]);
  };

  const ouvrirFiche = async (demande) => {
    setChargementDetail(true);
    setSelection(demande);
    try {
      setSelection(await detailDemandeInscription(demande.id));
    } catch {
      SwalCustom.fire({ icon: 'error', title: 'Erreur', text: 'Impossible de charger la fiche.' });
      setSelection(null);
    } finally {
      setChargementDetail(false);
    }
  };

  const valider = async (demande) => {
    const confirmation = await SwalCustom.fire({
      title: `Valider le compte de ${demande.prenom} ${demande.nom} ?`,
      text: "La limite de documents sera levée et l'utilisateur recevra un e-mail de confirmation.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Valider',
      cancelButtonText: 'Annuler',
    });
    if (!confirmation.isConfirmed) return;

    try {
      await validerDemandeInscription(demande.id);
      setSelection(null);
      await rafraichir();
      SwalCustom.fire({
        icon: 'success', title: 'Compte validé',
        text: 'L’utilisateur a été prévenu par e-mail.',
        timer: 2500, timerProgressBar: true, showConfirmButton: false,
      });
    } catch (err) {
      SwalCustom.fire({
        icon: 'error', title: 'Erreur',
        text: err?.response?.data?.message || 'Impossible de valider cette demande',
      });
    }
  };

  /* Le motif composé arrive déjà prêt depuis la fiche (ou la boîte de
     dialogue rapide de la liste) : il part tel quel dans l'e-mail. */
  const rejeter = async (demande, motif) => {
    try {
      await rejeterDemandeInscription(demande.id, motif.trim());
      setSelection(null);
      await rafraichir();
      SwalCustom.fire({
        icon: 'success', title: 'Demande refusée',
        text: 'Le motif a été envoyé à l’utilisateur.',
        timer: 2500, timerProgressBar: true, showConfirmButton: false,
      });
    } catch (err) {
      SwalCustom.fire({
        icon: 'error', title: 'Erreur',
        text: err?.response?.data?.message || 'Impossible de refuser cette demande',
      });
    }
  };

  /* Refus direct depuis la liste — sans avoir ouvert la fiche. Le champ libre
     suffit ici : le tri fin se fait dans la fiche, pièces sous les yeux. */
  const rejeterDepuisListe = async (demande) => {
    const { value: motif } = await SwalCustom.fire({
      title: 'Refuser la demande',
      input: 'textarea',
      inputLabel: 'Motif du refus (envoyé à l’utilisateur par e-mail)',
      inputPlaceholder: 'Ex. la photo de la CNI est illisible…',
      showCancelButton: true,
      confirmButtonText: 'Refuser',
      cancelButtonText: 'Annuler',
      inputValidator: (v) => (!v || v.trim().length < 3 ? 'Le motif est obligatoire' : undefined),
    });
    if (!motif) return;
    await rejeter(demande, motif);
  };

  if (accessDenied) return <AccessDenied />;

  const badge = (statut) => {
    const s = STATUTS[statut] || STATUTS.incomplet;
    return (
      <span className="di-badge" style={{ color: s.couleur, background: s.fond }}>
        {s.label}
      </span>
    );
  };

  return (
    <div className="di-page">
      {/* ── Indicateurs ─────────────────────────────────────────────── */}
      {stats && (
        <div className="di-kpis">
          <Kpi icon={Clock} libelle="En attente" valeur={stats.en_attente} couleur="#b26a00" />
          <Kpi icon={UserCheck} libelle="Validées" valeur={stats.validees} couleur="#1b7f4b" />
          <Kpi icon={UserX} libelle="Refusées" valeur={stats.rejetees} couleur="#c62828" />
          <Kpi icon={FileWarning} libelle="Profil incomplet" valeur={stats.incompletes} couleur="#6b7280" />
          <Kpi icon={UsersIcon} libelle="Comptes au total" valeur={stats.total} couleur="#111827" />
        </div>
      )}

      {stats && (
        <div className="di-quota">
          <AlertTriangle size={16} />
          <span>
            Tant qu’un compte n’est pas validé, il peut créer {stats.quota_contrats} contrat
            {stats.quota_contrats > 1 ? 's' : ''} et {stats.quota_factures} facture
            {stats.quota_factures > 1 ? 's' : ''}. La validation lève cette limite.
          </span>
        </div>
      )}

      {/* ── Filtres ─────────────────────────────────────────────────── */}
      <div className="di-toolbar">
        <div className="di-tabs">
          {ONGLETS.map((o) => (
            <button
              key={o.cle || 'toutes'}
              type="button"
              className={`di-tab ${statutFilter === o.cle ? 'active' : ''}`}
              onClick={() => setStatutFilter(o.cle)}
            >
              {o.label}
              {stats && stats[o.stat] != null && (
                <span className="di-tab-compteur">{stats[o.stat]}</span>
              )}
            </button>
          ))}
        </div>

        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Nom, e-mail ou téléphone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Liste ───────────────────────────────────────────────────── */}
      {loading ? (
        <div className="loading-spinner">Chargement…</div>
      ) : demandes.length === 0 ? (
        <div className="di-etat-vide">
          <Inbox size={30} />
          <strong>Aucune demande dans cette file</strong>
          <span>Rien à vérifier avec ce filtre pour le moment.</span>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Contact</th>
                <th>Profil</th>
                <th>Pièces</th>
                <th>Statut</th>
                <th>Inscrit le</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar-table">{initiales(d)}</div>
                      <div>
                        <div className="user-name-table">{d.prenom} {d.nom}</div>
                        <div className="di-sous-ligne">
                          {d.role}{d.nomEntreprise ? ` · ${d.nomEntreprise}` : ''}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13 }}>{d.email}</div>
                    <div className="di-sous-ligne">{d.telephone}</div>
                  </td>
                  <td>{d.profil_complet ? 'Complet' : 'Incomplet'}</td>
                  <td>
                    {/* Le survol détaille quelles pièces ont été fournies :
                        le nombre seul ne dit pas s'il manque le verso. */}
                    <span
                      className={`di-pieces ${!d.justificatifs?.length ? 'vide' : ''}`}
                      title={d.justificatifs?.length
                        ? d.justificatifs
                            .map((j) => LIBELLES_JUSTIFICATIF[j.type] || j.type)
                            .join(' · ')
                        : 'Aucune pièce transmise — la demande ne peut pas être vérifiée'}
                    >
                      <IdCard size={15} />
                      {d.justificatifs?.length || 0}
                    </span>
                  </td>
                  <td>{badge(d.statutDemande)}</td>
                  <td style={{ fontSize: 13 }}>{formatDate(d.inscrit_le)}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="action-btn btn-view" title="Examiner la demande"
                        onClick={() => ouvrirFiche(d)}>
                        <Eye size={16} />
                      </button>
                      {d.statutDemande !== 'validee' && (
                        <button className="action-btn btn-view" title="Valider"
                          onClick={() => valider(d)}>
                          <Check size={16} />
                        </button>
                      )}
                      {d.statutDemande !== 'rejetee' && (
                        <button className="action-btn btn-delete" title="Refuser"
                          onClick={() => rejeterDepuisListe(d)}>
                          <XIcon size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button className="pagination-btn" onClick={prevPage} disabled={page <= 1}>
            <ChevronLeft size={18} /> Précédent
          </button>
          <span className="pagination-info">
            Page {page} / {totalPages} — {total} demande{total > 1 ? 's' : ''}
          </span>
          <button className="pagination-btn" onClick={nextPage} disabled={page >= totalPages}>
            Suivant <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* ── Fiche de revue ──────────────────────────────────────────── */}
      {selection && (
        <FicheRevue
          demande={selection}
          chargement={chargementDetail}
          badge={badge}
          onFermer={() => setSelection(null)}
          onValider={() => valider(selection)}
          onRejeter={(motif) => rejeter(selection, motif)}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Fiche de revue — pièce déposée à gauche, informations saisies à droite.
   ═══════════════════════════════════════════════════════════════════════ */
function FicheRevue({ demande, chargement, badge, onFermer, onValider, onRejeter }) {
  // Le serveur fusionne déjà les deux dépôts (document déposé à l'inscription
  // + pièces du circuit de vérification) dans `justificatifs` : les compter ou
  // les afficher part de la même liste, elles ne peuvent plus diverger.
  const pieces = useMemo(() => demande.justificatifs || [], [demande.justificatifs]);
  const [indexPiece, setIndexPiece] = useState(0);
  const [modeRefus, setModeRefus] = useState(false);
  const [envoiRefus, setEnvoiRefus] = useState(false);

  // Fermeture au clavier — une fiche plein écran doit pouvoir se quitter
  // sans viser la croix.
  useEffect(() => {
    const surEchap = (e) => { if (e.key === 'Escape') onFermer(); };
    document.addEventListener('keydown', surEchap);
    return () => document.removeEventListener('keydown', surEchap);
  }, [onFermer]);

  const pieceActive = pieces[indexPiece] || null;

  const confirmerRefus = async (motif) => {
    setEnvoiRefus(true);
    try {
      await onRejeter(motif);
    } finally {
      setEnvoiRefus(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onFermer}>
      <div className="di-review" onClick={(e) => e.stopPropagation()}>
        {/* En-tête */}
        <div className="di-review-head">
          <div className="di-review-avatar">{initiales(demande)}</div>
          <div className="di-review-identite">
            <div className="di-review-nom">
              {demande.prenom} {demande.nom}
              {badge(demande.statutDemande)}
            </div>
            <div className="di-review-contact">
              {demande.email} · {demande.telephone || 'téléphone non renseigné'}
              {demande.inscrit_le ? ` · inscrit le ${formatDate(demande.inscrit_le)}` : ''}
            </div>
          </div>
          <button className="di-review-fermer" onClick={onFermer} aria-label="Fermer">
            <XIcon size={18} />
          </button>
        </div>

        {chargement ? (
          <div className="di-viewer-message">
            <Loader2 size={22} className="di-spin" />
            Chargement de la fiche…
          </div>
        ) : (
          <>
            <div className="di-review-body">
              <Visionneuse
                pieces={pieces}
                indexPiece={indexPiece}
                setIndexPiece={setIndexPiece}
                piece={pieceActive}
              />
              <InformationsSaisies demande={demande} />
            </div>

            {/* Barre de décision */}
            {!modeRefus && (
              <div className="di-review-foot">
                <span className="di-foot-note">
                  {pieces.length === 0
                    ? 'Aucune pièce transmise — la demande ne peut pas être vérifiée.'
                    : `${pieces.length} pièce${pieces.length > 1 ? 's' : ''} à confronter aux informations saisies.`}
                </span>
                <button className="di-btn di-btn-neutre" onClick={onFermer}>
                  Fermer
                </button>
                {demande.statutDemande !== 'rejetee' && (
                  <button className="di-btn di-btn-refus" onClick={() => setModeRefus(true)}>
                    <XIcon size={16} /> Refuser
                  </button>
                )}
                {demande.statutDemande !== 'validee' && (
                  <button className="di-btn di-btn-valide" onClick={onValider}>
                    <Check size={16} /> Valider le compte
                  </button>
                )}
              </div>
            )}

            {modeRefus && (
              <PanneauRefus
                envoi={envoiRefus}
                onAnnuler={() => setModeRefus(false)}
                onConfirmer={confirmerRefus}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ── Volet gauche : la pièce ──────────────────────────────────────────── */
function Visionneuse({ pieces, indexPiece, setIndexPiece, piece }) {
  // Les pièces sont chiffrées côté serveur : elles se récupèrent en Blob via
  // la route authentifiée. Le cache évite de retélécharger — et de rejournaliser
  // une consultation — quand on fait des allers-retours entre deux pièces.
  const cache = useRef(new Map());

  useEffect(() => {
    const urls = cache.current;
    return () => {
      urls.forEach((r) => URL.revokeObjectURL(r.url));
      urls.clear();
    };
  }, []);

  return (
    <div className="di-viewer">
      {/* Sélecteur de pièce */}
      {pieces.length > 0 && (
        <div className="di-viewer-tabs">
          {pieces.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={`di-piece-tab ${i === indexPiece ? 'active' : ''}`}
              onClick={() => setIndexPiece(i)}
            >
              <span
                className="di-piece-etat"
                style={{ background: COULEUR_ETAT_PIECE[p.statut] || '#9ca3af' }}
                title={p.statut
                  ? `Pièce ${p.statut}`
                  : 'Déposée à l’inscription — pas encore soumise au circuit de validation'}
              />
              {LIBELLES_JUSTIFICATIF[p.type] || p.type}
            </button>
          ))}
        </div>
      )}

      {/* La `key` remonte le composant à chaque changement de pièce : zoom et
          rotation repartent de zéro sans avoir à les réinitialiser à la main. */}
      <PieceAffichee key={piece?.id || 'aucune'} piece={piece} cache={cache} />
    </div>
  );
}

/* Affichage d'une pièce : téléchargement, rendu et outils de lecture. */
function PieceAffichee({ piece, cache }) {
  // Une pièce portant déjà une `url` (le document d'inscription) s'affiche
  // directement : rien à déchiffrer, donc rien à télécharger.
  const directe = piece?.url
    ? { url: piece.url, mime: piece.url.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/*' }
    : null;
  const dejaCharge = directe || (piece ? cache.current.get(piece.id) : null);

  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  // État initial calculé au montage : une pièce déjà en cache s'affiche
  // immédiatement, sans repasser par un écran de chargement.
  const [ressource, setRessource] = useState(dejaCharge || null);
  const [etat, setEtat] = useState(
    !piece ? 'vide' : dejaCharge ? 'pret' : 'chargement'
  );

  useEffect(() => {
    if (!piece || dejaCharge) return undefined;


    let annule = false;
    telechargerJustificatif(piece.id)
      .then((blob) => {
        if (annule) return;
        const r = { url: URL.createObjectURL(blob), mime: blob.type || '' };
        cache.current.set(piece.id, r);
        setRessource(r);
        setEtat('pret');
      })
      .catch(() => {
        if (!annule) setEtat('erreur');
      });

    return () => { annule = true; };
  }, [piece, dejaCharge, cache]);

  const estPdf = ressource?.mime.includes('pdf');

  return (
    <>
      <div className="di-viewer-stage">
        {etat === 'vide' && (
          <div className="di-viewer-message">
            <ShieldAlert size={30} />
            <span>
              Aucune pièce transmise.<br />
              L’identité ne peut pas être vérifiée en l’état.
            </span>
          </div>
        )}
        {etat === 'chargement' && (
          <div className="di-viewer-message">
            <Loader2 size={22} className="di-spin" />
            Déchiffrement de la pièce…
          </div>
        )}
        {etat === 'erreur' && (
          <div className="di-viewer-message erreur">
            <AlertTriangle size={26} />
            Impossible d’ouvrir cette pièce.
          </div>
        )}
        {etat === 'pret' && ressource && (
          estPdf ? (
            <object className="di-viewer-pdf" data={ressource.url} type="application/pdf">
              <div className="di-viewer-message">
                <FileText size={26} />
                Aperçu PDF indisponible dans ce navigateur.
              </div>
            </object>
          ) : (
            <img
              className="di-viewer-image"
              src={ressource.url}
              alt={LIBELLES_JUSTIFICATIF[piece?.type] || 'Justificatif'}
              style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
            />
          )
        )}
      </div>

      {/* Outils — le zoom et la rotation servent à lire un numéro sur une
          photo prise de travers, cas le plus fréquent. */}
      <div className="di-viewer-toolbar">
        <button className="di-outil" disabled={!ressource || estPdf}
          onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
          title="Dézoomer">
          <ZoomOut size={15} />
        </button>
        <span className="di-zoom-niveau">{Math.round(zoom * 100)} %</span>
        <button className="di-outil" disabled={!ressource || estPdf}
          onClick={() => setZoom((z) => Math.min(4, +(z + 0.25).toFixed(2)))}
          title="Zoomer">
          <ZoomIn size={15} />
        </button>
        <button className="di-outil" disabled={!ressource || estPdf}
          onClick={() => setRotation((r) => (r + 90) % 360)}
          title="Pivoter">
          <RotateCw size={15} />
        </button>
        <button className="di-outil" disabled={!ressource}
          onClick={() => { setZoom(1); setRotation(0); }}>
          Réinitialiser
        </button>
        <button
          className="di-outil di-outil-fin"
          disabled={!ressource}
          onClick={() => window.open(ressource.url, '_blank', 'noopener,noreferrer')}
        >
          <ExternalLink size={15} /> Plein écran
        </button>
      </div>
    </>
  );
}

/* ── Volet droit : ce que le client a saisi ───────────────────────────── */
function InformationsSaisies({ demande }) {
  const typePiece =
    demande.type_document_identite === 'passeport' ? 'Passeport'
      : demande.type_document_identite === 'carte_identite' ? 'CNI'
        : null;

  return (
    <div className="di-facts">
      {demande.motif_rejet && (
        <div className="di-motif-precedent">
          <XIcon size={16} />
          <div>
            <strong>Refus précédent</strong>
            <div>{demande.motif_rejet}</div>
          </div>
        </div>
      )}

      <div className="di-facts-groupe">
        <div className="di-facts-titre">Identité à vérifier</div>
        <Fait libelle="Type de pièce" valeur={typePiece} />
        <Fait libelle="N° de pièce" valeur={demande.carte_identite_national_num} cle />
        <Fait libelle="NIN" valeur={demande.nin} cle />
      </div>

      <div className="di-facts-groupe">
        <div className="di-facts-titre">Coordonnées</div>
        <Fait libelle="E-mail" valeur={demande.email} />
        <Fait libelle="Téléphone" valeur={demande.telephone} />
        <Fait libelle="Ville" valeur={demande.ville} />
        <Fait libelle="Adresse" valeur={demande.adresse} />
      </div>

      <div className="di-facts-groupe">
        <div className="di-facts-titre">Entreprise</div>
        <Fait libelle="Raison sociale" valeur={demande.nomEntreprise} />
        <Fait libelle="RCCM" valeur={demande.rc} cle />
        <Fait libelle="NINEA" valeur={demande.ninea} cle />
        <Fait libelle="Adresse" valeur={demande.adresseEntreprise} />
        <Fait libelle="Téléphone" valeur={demande.telephoneEntreprise} />
        <Fait libelle="E-mail" valeur={demande.emailEntreprise} />
      </div>

      <div className="di-facts-groupe">
        <div className="di-facts-titre">Compte</div>
        <Fait libelle="Rôle" valeur={demande.role} />
        <Fait libelle="E-mail vérifié" valeur={demande.email_verifie ? 'Oui' : 'Non'} />
        <Fait libelle="Profil complet" valeur={demande.profil_complet ? 'Oui' : 'Non'} />
        <Fait libelle="Statut du compte" valeur={demande.statutCompte} />
      </div>
    </div>
  );
}

/* Un champ saisi. `cle` = donnée à confronter caractère par caractère à la
   pièce : elle est mise en avant et copiable. */
function Fait({ libelle, valeur, cle = false }) {
  const [copie, setCopie] = useState(false);

  const copier = async () => {
    try {
      await navigator.clipboard.writeText(String(valeur));
      setCopie(true);
      setTimeout(() => setCopie(false), 1500);
    } catch {
      /* Le presse-papiers peut être refusé (page non sécurisée) : la valeur
         reste sélectionnable à la main, on n'alerte pas pour si peu. */
    }
  };

  const renseigne = valeur !== null && valeur !== undefined && String(valeur).trim() !== '';

  return (
    <div className={`di-fact ${cle && renseigne ? 'cle' : ''}`}>
      <div className="di-fact-libelle">{libelle}</div>
      <div className={`di-fact-valeur ${renseigne ? '' : 'vide'}`}>
        {renseigne ? String(valeur) : 'non renseigné'}
        {cle && renseigne && (
          <button className="di-copier" onClick={copier}
            title={copie ? 'Copié' : 'Copier'}>
            {copie ? <Check size={13} /> : <Copy size={13} />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Panneau de refus ─────────────────────────────────────────────────── */
function PanneauRefus({ envoi, onAnnuler, onConfirmer }) {
  const [coches, setCoches] = useState([]);
  const [libre, setLibre] = useState('');

  const basculer = (motif) => {
    setCoches((c) => (c.includes(motif) ? c.filter((m) => m !== motif) : [...c, motif]));
  };

  /* Le motif est inséré tel quel dans le corps HTML de l'e-mail : un seul
     paragraphe, car les retours à la ligne n'y seraient pas rendus. */
  const motifFinal = useMemo(() => {
    // Seul le premier motif garde sa majuscule : les suivants s'enchaînent
    // après un point-virgule et doivent se lire comme une phrase continue.
    const liste = coches
      .map((m, i) => (i === 0 ? m : m.charAt(0).toLowerCase() + m.slice(1)))
      .join(' ; ');
    const complement = libre.trim();
    if (liste && complement) return `${liste}. ${complement}`;
    return liste || complement;
  }, [coches, libre]);

  const valide = motifFinal.trim().length >= 3;

  return (
    <div className="di-reject">
      <div className="di-reject-titre">
        <XIcon size={17} /> Refuser la demande
      </div>
      <p className="di-reject-aide">
        Le motif est envoyé tel quel à l’utilisateur par e-mail : c’est ce qui lui
        indique quoi corriger avant de redéposer sa pièce.
      </p>

      <div className="di-reject-motifs">
        {MOTIFS_COURANTS.map((m) => (
          <button
            key={m}
            type="button"
            className={`di-motif-chip ${coches.includes(m) ? 'active' : ''}`}
            onClick={() => basculer(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <textarea
        className="di-reject-textarea"
        placeholder="Précision libre (facultatif) — ex. la photo est trop sombre pour lire la date de naissance."
        value={libre}
        onChange={(e) => setLibre(e.target.value)}
      />

      {valide && (
        <div className="di-reject-apercu">
          <div className="di-reject-apercu-titre">Message reçu par l’utilisateur</div>
          {motifFinal}
        </div>
      )}

      <div className="di-reject-actions">
        <button className="di-btn di-btn-neutre" onClick={onAnnuler} disabled={envoi}>
          Annuler
        </button>
        <button
          className="di-btn di-btn-refus"
          disabled={!valide || envoi}
          onClick={() => onConfirmer(motifFinal)}
        >
          {envoi ? 'Envoi…' : 'Confirmer le refus'}
        </button>
      </div>
    </div>
  );
}

/* ── Petits composants ────────────────────────────────────────────────── */
function Kpi({ icon: Icone, libelle, valeur, couleur }) {
  return (
    <div className="di-kpi">
      <div className="di-kpi-icone" style={{ background: `${couleur}1A`, color: couleur }}>
        <Icone size={20} />
      </div>
      <div>
        <div className="di-kpi-valeur">{valeur ?? '—'}</div>
        <div className="di-kpi-libelle">{libelle}</div>
      </div>
    </div>
  );
}

function initiales(personne) {
  return `${personne.prenom?.[0] || ''}${personne.nom?.[0] || ''}`.toUpperCase() || '?';
}
