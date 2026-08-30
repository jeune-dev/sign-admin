import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Users,
  FileText,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  ScrollText,
  Smartphone,
  History,
  UserCheck
} from 'lucide-react';
import SwalCustom from '../../../utils/swal.config';
import { logout as authLogout } from '../../../service/auth/authService';
import { useUser } from '../../../context/useUser';
import AccessDenied from '../../../components/AccessDenied';

// Import des composants
import Dashboard from './Dashboard';
import UsersList from './UsersList';
import DemandesInscriptionPage from './DemandesInscriptionPage';
import FacturesList from './FactureList';
import ContratsList from './ContratsList';
import AdminList from './AdminList';
import Profile from './Profile';
import AppVersionPage from './AppVersionPage';
import AuditLogPage from './AuditLogPage';

// Import logo et CSS
import logoImage from '../../../assets/images/logo.jpeg';
import '../../../assets/css/AdminDashboard.css';

// Menu items — `perm` = permission requise (null = toujours visible).
// `court` = libellé compact affiché dans la navbar (la barre est horizontale :
// chaque caractère coûte de la largeur), `label` reste le libellé complet,
// repris en title/aria et dans le menu mobile.
// `titre`/`sousTitre` = en-tête rendu par le shell. Les pages qui portent déjà
// leur propre en-tête sont marquées `enteteIntegree` pour ne pas l'afficher
// deux fois.
const TOUS_LES_MENUS = [
  { id: 'dashboard', label: 'Accueil', court: 'Accueil', icon: Home, perm: null, enteteIntegree: true },
  {
    id: 'users', label: 'Utilisateurs', court: 'Utilisateurs', icon: Users, perm: 'users',
    titre: 'Gestion des utilisateurs',
    sousTitre: 'Comptes de la plateforme, justificatifs et statut d’activation.'
  },
  {
    id: 'demandes', label: 'Demandes d’inscription', court: 'Demandes', icon: UserCheck, perm: 'users',
    titre: 'Demandes d’inscription',
    sousTitre: 'Confrontez les pièces déposées aux informations saisies avant de lever la limite de documents.'
  },
  {
    id: 'factures', label: 'Factures', court: 'Factures', icon: FileText, perm: 'factures',
    titre: 'Gestion des factures',
    sousTitre: 'Documents facturés par les professionnels de la plateforme.'
  },
  {
    id: 'contrats', label: 'Contrats', court: 'Contrats', icon: ScrollText, perm: 'contrats',
    titre: 'Gestion des contrats',
    sousTitre: 'Baux, contrats de travail et autres documents générés.'
  },
  {
    id: 'admins', label: 'Administrateurs', court: 'Admins', icon: Shield, perm: 'admins',
    titre: 'Gestion des administrateurs',
    sousTitre: 'Comptes admin et permissions associées.'
  },
  { id: 'app-version', label: 'Mises à jour app', court: 'Versions', icon: Smartphone, perm: 'admins', enteteIntegree: true },
  {
    id: 'audit-log', label: "Journal d'audit", court: 'Audit', icon: History, perm: 'admins',
    titre: "Journal d'audit",
    sousTitre: 'Historique des actions sensibles effectuées par les admins.'
  }
];

export default function AdminDashboard() {
  const [isMobile, setIsMobile] = useState(false);
  // Panneau de navigation mobile (la navbar ne peut pas tout afficher sous 900px)
  const [menuMobileOuvert, setMenuMobileOuvert] = useState(false);
  // Menu utilisateur (profil / déconnexion) ancré à droite de la navbar
  const [menuUserOuvert, setMenuUserOuvert] = useState(false);
  const refMenuUser = useRef(null);

  // Persisté en sessionStorage pour survivre à un rafraîchissement de page —
  // sans ça, F5 ramenait toujours sur "Accueil" quel que soit l'onglet actif.
  const [activeMenu, setActiveMenuState] = useState(
    () => sessionStorage.getItem('adminActiveMenu') || 'dashboard'
  );
  const setActiveMenu = (menu) => {
    sessionStorage.setItem('adminActiveMenu', menu);
    setActiveMenuState(menu);
  };

  // Utilisateur connecté — présence + rôle déjà garantis par <ProtectedRoute>.
  // Vient du contexte partagé : si Profile met à jour l'utilisateur (photo,
  // nom...), la navbar se rafraîchit immédiatement, sans reload.
  const { user: currentUser } = useUser();

  // Filtrage selon les permissions de l'admin connecté — modèle STRICT,
  // identique à requirePermission() côté backend (permission.middleware.js) :
  // permissions null/vide = AUCUN accès implicite, seul ['all'] donne accès total.
  const perms = currentUser?.permissions;
  const hasFullAccess = Array.isArray(perms) && perms.includes('all');
  const menuItems = TOUS_LES_MENUS.filter(
    (item) => !item.perm || hasFullAccess || (Array.isArray(perms) && perms.includes(item.perm))
  );

  // Détection mobile — le resize est débouncé (150ms) pour éviter de
  // déclencher un re-render de tout le dashboard à chaque pixel glissé
  // pendant un redimensionnement de fenêtre.
  useEffect(() => {
    const checkMobile = () => {
      const petitEcran = window.innerWidth <= 900;
      setIsMobile(petitEcran);
      // Repasser en grand écran doit refermer le panneau mobile, sinon il
      // restait ouvert par-dessus la navbar.
      if (!petitEcran) setMenuMobileOuvert(false);
    };
    checkMobile();

    let timeoutId;
    const debouncedCheckMobile = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkMobile, 150);
    };

    window.addEventListener('resize', debouncedCheckMobile);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', debouncedCheckMobile);
    };
  }, []);

  // Fermeture du menu utilisateur : clic à l'extérieur ou touche Échap.
  useEffect(() => {
    if (!menuUserOuvert) return;
    const surClicExterieur = (e) => {
      if (refMenuUser.current && !refMenuUser.current.contains(e.target)) {
        setMenuUserOuvert(false);
      }
    };
    const surEchap = (e) => {
      if (e.key === 'Escape') setMenuUserOuvert(false);
    };
    document.addEventListener('mousedown', surClicExterieur);
    document.addEventListener('keydown', surEchap);
    return () => {
      document.removeEventListener('mousedown', surClicExterieur);
      document.removeEventListener('keydown', surEchap);
    };
  }, [menuUserOuvert]);

  // Message après connexion
  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('adminJustLoggedIn');
    if (justLoggedIn === 'true') {
      SwalCustom.fire({
        icon: 'success',
        title: 'Connexion réussie !',
        text: "Bienvenue dans l'espace administrateur",
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      sessionStorage.removeItem('adminJustLoggedIn');
    }
  }, []);

  // Déconnexion
  const handleLogout = () => {
    setMenuUserOuvert(false);
    SwalCustom.fire({
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Déconnecter',
      cancelButtonText: 'Annuler',
    }).then((result) => {
      if (result.isConfirmed) {
        authLogout().finally(() => {
          window.location.href = '/sign/login';
        });
      }
    });
  };

  // Gestion clic menu
  const handleMenuClick = (menuId) => {
    setActiveMenu(menuId);
    setMenuMobileOuvert(false);
    setMenuUserOuvert(false);
  };

  if (!currentUser) return null;

  // Initiales pour l'avatar (si aucune photo de profil)
  const initials = `${currentUser.prenom?.[0] || ''}${currentUser.nom?.[0] || ''}`.toUpperCase() || 'AD';

  // L'onglet actif vient de sessionStorage : il peut désigner une rubrique que
  // l'admin n'a plus le droit de voir (permission retirée en cours de session,
  // ou valeur modifiée à la main). Le menu était filtré, mais pas le rendu du
  // contenu : la page s'affichait quand même. Le backend refuse les appels,
  // donc aucune donnée ne fuitait — mais l'écran se remplissait d'erreurs au
  // lieu de dire clairement que l'accès est refusé.
  // On résout l'onglet dans la liste FILTRÉE, seule source légitime.
  const menuActif = menuItems.find((m) => m.id === activeMenu);
  const rubriqueAutorisee = Boolean(menuActif) || activeMenu === 'profile';

  const avatar = (classe) =>
    currentUser.photoProfil ? (
      <img src={currentUser.photoProfil} alt="" className={`${classe}-img`} />
    ) : (
      <span className="user-avatar-initials">{initials}</span>
    );

  return (
    <div className="dashboard-container">
      {/* ===== NAVBAR ===== */}
      <header className="topnav">
        <div className="topnav-inner">
          {/* Marque */}
          <div className="topnav-brand">
            <div className="topnav-logo">
              <img src={logoImage} alt="Logo SIGNS" />
            </div>
            <span className="topnav-brand-text">SIGNS</span>
          </div>

          {/* Navigation principale — défile horizontalement plutôt que de
              passer à la ligne, pour que la hauteur de la barre reste fixe. */}
          <nav className="topnav-menu" aria-label="Navigation principale">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`topnav-link ${activeMenu === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
                title={item.label}
                aria-current={activeMenu === item.id ? 'page' : undefined}
              >
                <item.icon size={17} className="topnav-link-icon" />
                <span className="topnav-link-label">{item.court}</span>
              </button>
            ))}
          </nav>

          {/* Actions à droite : compte + burger mobile */}
          <div className="topnav-actions">
            <div className="topnav-user-wrap" ref={refMenuUser}>
              <button
                type="button"
                className={`topnav-user ${activeMenu === 'profile' ? 'active' : ''}`}
                onClick={() => setMenuUserOuvert((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={menuUserOuvert}
                title={`${currentUser.prenom} ${currentUser.nom}`}
              >
                <div className="topnav-avatar">{avatar('user-avatar')}</div>
                <div className="topnav-user-details">
                  <span className="topnav-user-name">
                    {currentUser.prenom} {currentUser.nom}
                  </span>
                  <span className="topnav-user-role">
                    {currentUser.role || 'Administrateur'}
                  </span>
                </div>
                <ChevronDown size={15} className={`topnav-caret ${menuUserOuvert ? 'open' : ''}`} />
              </button>

              {menuUserOuvert && (
                <div className="topnav-dropdown" role="menu">
                  <div className="topnav-dropdown-head">
                    <div className="topnav-avatar lg">{avatar('user-avatar')}</div>
                    <div>
                      <div className="topnav-user-name">
                        {currentUser.prenom} {currentUser.nom}
                      </div>
                      <div className="topnav-user-role">{currentUser.email}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    className="topnav-dropdown-item"
                    onClick={() => handleMenuClick('profile')}
                  >
                    <User size={16} /> Mon profil
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="topnav-dropdown-item danger"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} /> Déconnexion
                  </button>
                </div>
              )}
            </div>

            {isMobile && (
              <button
                type="button"
                className="topnav-burger"
                onClick={() => setMenuMobileOuvert((o) => !o)}
                aria-label={menuMobileOuvert ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={menuMobileOuvert}
              >
                {menuMobileOuvert ? <X size={20} /> : <Menu size={20} />}
              </button>
            )}
          </div>
        </div>

        {/* Panneau de navigation mobile */}
        {isMobile && menuMobileOuvert && (
          <nav className="topnav-mobile" aria-label="Navigation principale">
            {menuItems.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`topnav-mobile-link ${activeMenu === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        )}
      </header>

      {isMobile && menuMobileOuvert && (
        <div className="topnav-overlay" onClick={() => setMenuMobileOuvert(false)} />
      )}

      {/* ===== CONTENU ===== */}
      <main className="main-content">
        <div className="content-area">
          {/* En-tête de page rendu par le shell — uniquement pour les pages
              qui n'en portent pas déjà un (évite le titre en double). */}
          {rubriqueAutorisee && menuActif && !menuActif.enteteIntegree && (
            <div className="page-heading">
              <h1 className="page-heading-title">{menuActif.titre}</h1>
              {menuActif.sousTitre && (
                <p className="page-heading-subtitle">{menuActif.sousTitre}</p>
              )}
            </div>
          )}

          {!rubriqueAutorisee && (
            <AccessDenied message="Vous n'avez pas la permission d'accéder à cette rubrique." />
          )}

          {rubriqueAutorisee && (
            <>
          {activeMenu === 'dashboard' && <Dashboard />}
          {activeMenu === 'users' && <UsersList />}
          {activeMenu === 'demandes' && <DemandesInscriptionPage />}
          {activeMenu === 'factures' && <FacturesList />}
          {activeMenu === 'contrats' && <ContratsList />}
          {activeMenu === 'admins' && <AdminList />}
          {activeMenu === 'app-version' && <AppVersionPage />}
          {activeMenu === 'audit-log' && <AuditLogPage />}
          {activeMenu === 'profile' && <Profile />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
