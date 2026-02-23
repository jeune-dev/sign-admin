import React, { useState, useEffect } from 'react';
import {
  Search, Bell, Menu, X, Home, Users, LogOut, User,
  ChevronDown, Check, EyeOff
} from 'lucide-react';
import Swal from 'sweetalert2';
import { getUser, logout as authLogout } from '../../../service/auth/authService';

// Import des composants de pages
import Dashboard from './Dashboard';
import UsersList from './UsersList';
import Profile from './Profile';

// Import du logo et CSS
import logoImage from '../../../assets/images/logo.jpeg';
import '../../../assets/css/AdminDashboard.css';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifications] = useState(3);

  // Utilisateur connecté
  const [currentUser] = useState(() => {
    const user = getUser();
    if (!user) {
      window.location.href = '/login';
      return null;
    }
    return user;
  });

  // Données du dashboard (à remplacer par des appels API)
  const [dashboardData] = useState({
    totalUsers: 12547,
    totalFactures: 880,
    totalInvoices: 45321,
    monthlyStats: [
      { month: 'Jan', users: 245, factures: 45, invoices: 1876 },
      { month: 'Fév', users: 312, factures: 52, invoices: 2145 },
      // ... autres mois
    ],
    yearlyStats: [
      { year: '2020', users: 5234, factures: 245, invoices: 18765 },
      // ... autres années
    ],
    recentActiveUsers: [
      { id: 1, name: 'Alassane Gueye', email: 'alassane@entreprise.sn', lastActive: 'Il y a 5 min', status: 'online', role: 'Administrateur' },
      // ... autres
    ],
    usersList: [
      { id: 1, nom: 'Gueye', prenom: 'Alassane', email: 'alassane@entreprise.sn', telephone: '+221 77 123 45 67', role: 'Administrateur', status: 'actif', dateInscription: '15/01/2024' },
      // ... autres
    ]
  });

  const statusColors = {
    online: { bg: '#f3f4f6', text: '#000000', border: '#e5e7eb' },
    offline: { bg: '#f9fafb', text: '#666666', border: '#f3f4f6' },
    actif: { bg: '#f0fdf4', text: '#166534', border: '#dcfce7' },
    inactif: { bg: '#fef2f2', text: '#991b1b', border: '#fee2e2' }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Accueil', icon: Home },
    { id: 'users', label: 'Liste utilisateurs', icon: Users },
    { id: 'profile', label: 'Profil administrateur', icon: User },
    { id: 'logout', label: 'Déconnexion', icon: LogOut }
  ];

  useEffect(() => {
    const justLoggedIn = sessionStorage.getItem('adminJustLoggedIn');
    if (justLoggedIn === 'true') {
      Swal.fire({
        icon: 'success',
        title: 'Connexion réussie !',
        text: 'Bienvenue dans l\'espace administrateur',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        confirmButtonColor: '#000000',
        background: '#ffffff'
      });
      sessionStorage.removeItem('adminJustLoggedIn');
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Déconnexion',
      text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Oui, déconnecter',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#000000',
      cancelButtonColor: '#666666',
      background: '#ffffff'
    }).then((result) => {
      if (result.isConfirmed) {
        authLogout();
        window.location.href = '/login';
      }
    });
  };

  const handleMenuClick = (menuId) => {
    if (menuId === 'logout') {
      handleLogout();
    } else {
      setActiveMenu(menuId);
    }
  };

  const handleToggleUserStatus = (userId) => {
    const user = dashboardData.usersList.find(u => u.id === userId);
    const newStatus = user.status === 'actif' ? 'inactif' : 'actif';

    Swal.fire({
      title: `${newStatus === 'actif' ? 'Activer' : 'Désactiver'} l'utilisateur`,
      html: `
        <div style="text-align: left;">
          <p>Utilisateur : <strong>${user.prenom} ${user.nom}</strong></p>
          <p>Email : ${user.email}</p>
          <p>Rôle : ${user.role}</p>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: newStatus === 'actif' ? '#059669' : '#dc2626',
      cancelButtonColor: '#666666'
    }).then((result) => {
      if (result.isConfirmed) {
        // Ici vous feriez un appel API pour changer le statut
        // Pour l'exemple, on met juste à jour l'état local
        // setDashboardData(...)
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: `L'utilisateur a été ${newStatus === 'actif' ? 'activé' : 'désactivé'}`,
          timer: 2000,
          showConfirmButton: false
        });
      }
    });
  };

  if (!currentUser) return null;

  return (
    <div className="dashboard-container">
      {/* Overlay mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <div className={`sidebar ${!sidebarOpen ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-image">
              <img src={logoImage} alt="Sign App Logo" />
            </div>
            <div className="logo-text">SIGN APP</div>
          </div>
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <div className="sidebar-menu">
          {menuItems.map(item => (
            <div
              key={item.id}
              className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => handleMenuClick(item.id)}
            >
              <item.icon className="menu-icon" size={20} />
              <span className="menu-label">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="user-section">
          <div className="user-avatar">
            {currentUser.prenom?.[0]}{currentUser.nom?.[0] || 'A'}
          </div>
          <div className="user-details-sidebar">
            <div className="user-name-sidebar">{currentUser.prenom} {currentUser.nom}</div>
            <div className="user-role-sidebar">{currentUser.role || 'Administrateur'}</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="topbar">
          <h1 className="page-title">
            {activeMenu === 'dashboard' && 'Accueil'}
            {activeMenu === 'users' && 'Liste utilisateurs'}
            {activeMenu === 'profile' && 'Mon profil'}
          </h1>
          <div className="topbar-right">
            <div className="search-bar">
              <Search className="search-icon" size={20} />
              <input type="text" className="search-input" placeholder="Rechercher utilisateurs, factures..." />
            </div>
            <button className="notification-btn">
              <Bell size={20} />
              {notifications > 0 && <span className="notification-badge" />}
            </button>

            <div className="user-dropdown-container">
              <button
                className={`user-dropdown-trigger ${userDropdownOpen ? 'active' : ''}`}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className="user-info-topbar">
                  <div className="user-avatar">
                    {currentUser.prenom?.[0]}{currentUser.nom?.[0] || 'A'}
                  </div>
                  <div className="user-details-topbar">
                    <div className="user-name-topbar">{currentUser.prenom} {currentUser.nom}</div>
                    <div className="user-role-topbar">{currentUser.role || 'Administrateur'}</div>
                  </div>
                </div>
                <ChevronDown className={`dropdown-arrow ${userDropdownOpen ? 'open' : ''}`} size={18} />
              </button>

              <div className={`user-dropdown-menu ${userDropdownOpen ? 'open' : ''}`}>
                <div className="dropdown-header">
                  <div className="dropdown-user-name">{currentUser.prenom} {currentUser.nom}</div>
                  <div className="dropdown-user-email">{currentUser.email}</div>
                </div>
                <div className="dropdown-menu-items">
                  <div className="dropdown-item" onClick={() => setActiveMenu('profile')}>
                    <User size={18} />
                    <span>Mon profil</span>
                  </div>
                  <div className="dropdown-divider" />
                  <div className="dropdown-item" onClick={handleLogout}>
                    <LogOut size={18} />
                    <span>Déconnexion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="content-area">
          {activeMenu === 'dashboard' && (
            <Dashboard dashboardData={dashboardData} statusColors={statusColors} />
          )}
          {activeMenu === 'users' && (
            <UsersList
              usersList={dashboardData.usersList}
              statusColors={statusColors}
              onToggleStatus={handleToggleUserStatus}
            />
          )}
          {activeMenu === 'profile' && <Profile currentUser={currentUser} />}
        </div>
      </div>
    </div>
  );
}