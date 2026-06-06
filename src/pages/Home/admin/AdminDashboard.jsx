import React, { useState, useEffect } from 'react';
// En haut du fichier avec les autres imports
import adminAvatar from '../../../assets/images/admin-avatar.jpg';
import {
  Home,
  Users,
  FileText,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import SwalCustom from '../../../utils/swal.config';
import { getUser, logout as authLogout } from '../../../service/auth/authService';

// Import des composants
import Dashboard from './Dashboard';
import UsersList from './UsersList';
import FacturesList from './FactureList';
import AdminList from './AdminList';
import Profile from './Profile';

// Import logo et CSS
import logoImage from '../../../assets/images/logo.jpeg';
import '../../../assets/css/AdminDashboard.css';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // Utilisateur connecté
  const [currentUser] = useState(() => {
    const user = getUser();
    if (!user) {
      window.location.href = '/sign/login';
      return null;
    }
    return user;
  });

  // Données Dashboard (temporaire)
  const [dashboardData] = useState({
    totalUsers: 12547,
    totalFactures: 880,
    totalInvoices: 45321,
    usersList: []
  });

  // Menu items
  const menuItems = [
    { id: 'dashboard', label: 'Accueil', icon: Home },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'factures', label: 'Factures', icon: FileText },
    { id: 'admins', label: 'Administrateurs', icon: Shield },
    { id: 'profile', label: 'Mon profil', icon: User },
    { id: 'logout', label: 'Déconnexion', icon: LogOut }
  ];

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
    if (menuId === 'logout') {
      handleLogout();
    } else {
      setActiveMenu(menuId);
      if (isMobile) {
        setSidebarOpen(false);
      }
    }
  };

  if (!currentUser) return null;

  // Récupérer les initiales
  const getInitials = () => {
    const prenom = currentUser.prenom || '';
    const nom = currentUser.nom || '';
    if (prenom && nom) {
      return `${prenom[0]}${nom[0]}`.toUpperCase();
    }
    return 'AD';
  };

  // Tooltip pour sidebar réduite
  const MenuItemWithTooltip = ({ item, isActive, onClick }) => (
    <div className={`menu-item-wrapper ${!sidebarOpen ? 'collapsed' : ''}`}>
      <div
        className={`menu-item ${isActive ? 'active' : ''}`}
        onClick={() => onClick(item.id)}
      >
        <item.icon size={20} className="menu-icon" />
        {sidebarOpen && <span className="menu-label">{item.label}</span>}
      </div>
      {!sidebarOpen && (
        <div className="menu-tooltip">{item.label}</div>
      )}
    </div>
  );

  return (
    <div className="dashboard-container">
      {/* Overlay mobile */}
      {isMobile && sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Bouton toggle mobile */}
      {isMobile && !sidebarOpen && (
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
          <Menu size={24} />
        </button>
      )}

      {/* Bouton flèche à côté de la sidebar (UNIQUEMENT sur desktop) */}
      {!isMobile && (
        <button
          className="sidebar-float-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ left: sidebarOpen ? 280 : 20 }}
        >
          {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${!sidebarOpen ? 'collapsed' : ''} ${isMobile ? 'mobile' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-area">
            <div className="logo-icon">
              <img src={logoImage} alt="Logo" />
            </div>
            {sidebarOpen && <span className="logo-text">SIGN APP</span>}
            {!sidebarOpen && <span className="logo-text-mini">SIGN</span>}
          </div>
          {isMobile && (
            <button className="sidebar-close" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <MenuItemWithTooltip
              key={item.id}
              item={item}
              isActive={activeMenu === item.id}
              onClick={handleMenuClick}
            />
          ))}
        </nav>

 {/* Sidebar Footer avec PHOTO LOCALE */}
<div className="sidebar-footer">
  {sidebarOpen ? (
    <div className="user-info">
      <div className="user-avatar">
        <img 
          src={adminAvatar} 
          alt="Photo profil" 
          className="user-avatar-img"
        />
      </div>
      <div className="user-details">
        <div className="user-name">
          {currentUser.prenom} {currentUser.nom}
        </div>
        <div className="user-role">
          {currentUser.role || 'Administrateur'}
        </div>
      </div>
    </div>
  ) : (
    <div className="user-info-collapsed">
      <div className="user-avatar-mini">
        <img 
          src={adminAvatar} 
          alt="Photo profil" 
          className="user-avatar-img-mini"
        />
      </div>
    </div>
  )}
</div>
        {/* ===== FIN SIDEBAR FOOTER ===== */}
      </aside>

      {/* Contenu principal */}
      <main className="main-content">
        <div className="topbar">
          <h1 className="page-title">
            {activeMenu === 'dashboard' && 'Tableau de bord'}
            {activeMenu === 'users' && 'Gestion des utilisateurs'}
            {activeMenu === 'factures' && 'Gestion des factures'}
            {activeMenu === 'admins' && 'Gestion des administrateurs'}
            {activeMenu === 'profile' && 'Mon profil'}
          </h1>
        </div>

        <div className="content-area">
          {activeMenu === 'dashboard' && <Dashboard dashboardData={dashboardData} />}
          {activeMenu === 'users' && <UsersList />}
          {activeMenu === 'factures' && <FacturesList />}
          {activeMenu === 'admins' && <AdminList />}
          {activeMenu === 'profile' && <Profile currentUser={currentUser} />}
        </div>
      </main>
    </div>
  );
}