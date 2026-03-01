import React, { useState, useEffect } from 'react';
import {
  Search,
  Bell,
  Menu,
  X,
  Home,
  Users,
  LogOut,
  User,
  ChevronDown,
  FileText,
  Shield
} from 'lucide-react';
import Swal from 'sweetalert2';
import { getUser, logout as authLogout } from '../../../service/auth/authService';

// Import des composants
import Dashboard from './Dashboard';
import UsersList from './UsersList';
import FacturesList from './Facturelist';
import AdminList from './AdminList';
import Profile from './Profile';

// Import logo et CSS
import logoImage from '../../../assets/images/logo.jpeg';
import '../../../assets/css/AdminDashboard.css';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');

  // 🔹 Utilisateur connecté
  const [currentUser] = useState(() => {
    const user = getUser();
    if (!user) {
      window.location.href = '/sign/login';
      return null;
    }
    return user;
  });

  // 🔹 Données Dashboard (temporaire)
  const [dashboardData] = useState({
    totalUsers: 12547,
    totalFactures: 880,
    totalInvoices: 45321,
    usersList: []
  });

  // 🔹 Menu Sidebar
  const menuItems = [
    { id: 'dashboard', label: 'Accueil', icon: Home },
    { id: 'users', label: 'Liste utilisateurs', icon: Users },
    { id: 'factures', label: 'Liste factures', icon: FileText },
    { id: 'admins', label: 'Liste administrateurs', icon: Shield }, 
    { id: 'profile', label: 'Profil administrateur', icon: User },
    { id: 'logout', label: 'Déconnexion', icon: LogOut }
  ];

  // 🔹 Message après connexion
  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('adminJustLoggedIn');
    if (justLoggedIn === 'true') {
      Swal.fire({
        icon: 'success',
        title: 'Connexion réussie !',
        text: "Bienvenue dans l'espace administrateur",
        timer: 3000,
        showConfirmButton: false
      });
      sessionStorage.removeItem('adminJustLoggedIn');
    }
  }, []);

  // 🔹 Déconnexion
  const handleLogout = () => {
    Swal.fire({
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        authLogout();
        window.location.href = '/sign/login';
      }
    });
  };

  // 🔹 Gestion clic menu
  const handleMenuClick = (menuId) => {
    if (menuId === 'logout') {
      handleLogout();
    } else {
      setActiveMenu(menuId);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="dashboard-container">

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-image">
              <img src={logoImage} alt="Logo" />
            </div>
            <div className="logo-text">SIGN APP</div>
          </div>

          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Menu */}
        <div className="sidebar-menu">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <item.icon size={20} className="menu-icon" />
              <span className="menu-label">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Utilisateur Sidebar */}
        <div className="user-section">
          <div className="user-avatar">
            {currentUser.prenom?.[0]}
            {currentUser.nom?.[0] || 'A'}
          </div>
          <div className="user-details-sidebar">
            <div className="user-name-sidebar">
              {currentUser.prenom} {currentUser.nom}
            </div>
            <div className="user-role-sidebar">
              {currentUser.role || 'Administrateur'}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="main-content">

        {/* Topbar */}
        <div className="topbar">
          <h1 className="page-title">
            {activeMenu === 'dashboard' && 'Accueil'}
            {activeMenu === 'users' && 'Liste utilisateurs'}
            {activeMenu === 'factures' && 'Liste factures'} 
            {activeMenu === 'admins' && 'Liste administrateurs'}
            {activeMenu === 'profile' && 'Mon profil'}
          </h1>
        </div>

        {/* Zone dynamique */}
        <div className="content-area">
          {activeMenu === 'dashboard' && (
            <Dashboard dashboardData={dashboardData} />
          )}

          {activeMenu === 'users' && (
            <UsersList />
          )}

         {activeMenu === 'factures' && (
            <FacturesList  />
          )}

          {activeMenu === 'admins' && (
            <AdminList />  
          )}

          {activeMenu === 'profile' && (
            <Profile currentUser={currentUser} />
          )}
        </div>

      </div>
    </div>
  );
}