// import React, { useState, useEffect } from "react";
// import { 
//   Search, Bell, Menu, X, Home, FileText, Users, 
//   Settings, LogOut, User, Plus, CheckCircle, Clock, 
//   TrendingUp, Eye, Edit, MoreVertical,
//   FileSignature, ChevronDown, Upload, BarChart3,
//   Shield, CreditCard, Activity, Archive, AlertTriangle,
//   Download, Filter, Calendar, DollarSign, PieChart,
//   Lock, Database, MessageSquare, Globe, RefreshCw,
//   Mail, Phone, Users as UsersIcon, FilePlus,
//   FileCheck, FileX, Key, Headphones, Zap, TrendingDown,
//   ArrowUpRight, ArrowDownRight, Check, X as XIcon,
//   DownloadCloud, EyeOff, UserCheck, Settings as SettingsIcon,
//   Smartphone, Smartphone as SmartphoneIcon, Wallet
// } from "lucide-react";
// import Swal from 'sweetalert2';

// // Import du logo
// import logoImage from "../../assets/images/logo.jpeg";

// export default function AdminDashboard() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [activeMenu, setActiveMenu] = useState("dashboard");
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const [notifications, setNotifications] = useState(3);

//   // ============ DONNÉES ADMIN ============
//   const [adminData] = useState({
//     name: "Admin Système",
//     email: "admin@signapp.com",
//     role: "Super Administrateur",
//     avatar: "SA",
//     phone: "+221 77 123 45 67",
//     createdAt: "01/01/2024",
//     lastLogin: new Date().toLocaleString('fr-FR')
//   });

//   // ============ DONNÉES ============
//   const [dashboardData, setDashboardData] = useState({
//     // KPIs pour les cards
//     totalUsers: 12547,
//     totalContracts: 880,
//     totalInvoices: 45321,
    
//     // Liste des utilisateurs
//     usersList: [
//       { id: 1, nom: "Gueye", prenom: "Alassane", email: "alassane@entreprise.sn", telephone: "+221 77 123 45 67", role: "Administrateur", status: "actif", dateInscription: "15/01/2024" },
//       { id: 2, nom: "Thiam", prenom: "Ibnou", email: "ibnou@tech.sn", telephone: "+221 78 234 56 78", role: "Independant", status: "actif", dateInscription: "20/01/2024" },
//       { id: 3, nom: "Beye", prenom: "Balla", email: "balla@legal.sn", telephone: "+221 76 345 67 89", role: "Particulier", status: "inactif", dateInscription: "05/02/2024" },
//       { id: 4, nom: "Diao", prenom: "Aboubekrine", email: "aboubekrine@startup.sn", telephone: "+221 77 456 78 90", role: "Professionnel", status: "actif", dateInscription: "12/02/2024" }
//     ]
//   });

//   // ============ MENU SIMPLIFIÉ (4 ITEMS SEULEMENT) ============
//   const menuItems = [
//     { id: "dashboard", label: "Accueil", icon: Home, color: "#ffffff" },
//     { id: "users", label: "Liste utilisateurs", icon: Users, color: "#ffffff" },
//     { id: "profile", label: "Profil administrateur", icon: User, color: "#ffffff" },
//     { id: "logout", label: "Déconnexion", icon: LogOut, color: "#ffffff" }
//   ];

//   // ============ COULEURS STATUT ============
//   const statusColors = {
//     "actif": { bg: "#f0fdf4", text: "#166534", border: "#dcfce7" },
//     "inactif": { bg: "#fef2f2", text: "#991b1b", border: "#fee2e2" }
//   };

//   // ============ FONCTIONNALITÉ 1: MESSAGE DE CONNEXION ============
//   useEffect(() => {
//     const justLoggedIn = sessionStorage.getItem('adminJustLoggedIn');
//     if (justLoggedIn === 'true') {
//       Swal.fire({
//         icon: 'success',
//         title: 'Connexion réussie !',
//         text: 'Bienvenue dans l\'espace administrateur',
//         timer: 3000,
//         timerProgressBar: true,
//         showConfirmButton: true,
//         confirmButtonText: 'OK',
//         confirmButtonColor: '#000000',
//         background: '#ffffff'
//       });
//       sessionStorage.removeItem('adminJustLoggedIn');
//     }
//   }, []);

//   // ============ FONCTIONNALITÉ 5: DÉCONNEXION ============
//   const handleLogout = () => {
//     Swal.fire({
//       title: 'Déconnexion',
//       text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
//       icon: 'question',
//       showCancelButton: true,
//       confirmButtonText: 'Oui, déconnecter',
//       cancelButtonText: 'Annuler',
//       confirmButtonColor: '#000000',
//       cancelButtonColor: '#666666',
//       background: '#ffffff'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         window.location.href = '/login';
//       }
//     });
//   };

//   // ============ FONCTIONNALITÉ 4: ACTIVER/DÉSACTIVER UTILISATEUR ============
//   const handleToggleUserStatus = (userId) => {
//     const user = dashboardData.usersList.find(u => u.id === userId);
//     const newStatus = user.status === 'actif' ? 'inactif' : 'actif';
    
//     Swal.fire({
//       title: `${newStatus === 'actif' ? 'Activer' : 'Désactiver'} l'utilisateur`,
//       html: `
//         <div style="text-align: left;">
//           <p>Utilisateur : <strong>${user.prenom} ${user.nom}</strong></p>
//           <p>Email : ${user.email}</p>
//           <p>Rôle : ${user.role}</p>
//         </div>
//       `,
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonText: 'Confirmer',
//       cancelButtonText: 'Annuler',
//       confirmButtonColor: newStatus === 'actif' ? '#059669' : '#dc2626',
//       cancelButtonColor: '#666666'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setDashboardData(prev => ({
//           ...prev,
//           usersList: prev.usersList.map(u => 
//             u.id === userId ? { ...u, status: newStatus } : u
//           )
//         }));

//         Swal.fire({
//           icon: 'success',
//           title: 'Succès',
//           text: `L'utilisateur a été ${newStatus === 'actif' ? 'activé' : 'désactivé'}`,
//           timer: 2000,
//           showConfirmButton: false
//         });
//       }
//     });
//   };

//   // ============ GESTIONNAIRE DE MENU ============
//   const handleMenuClick = (menuId) => {
//     if (menuId === 'logout') {
//       handleLogout();
//     } else {
//       setActiveMenu(menuId);
//     }
//   };

//   // ============ FORMATAGE ============
//   const formatNumber = (num) => {
//     if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
//     if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
//     return num.toString();
//   };

//   return (
//     <>
//       <style>
//         {`
//         /* ====== VARIABLES CSS ====== */
//         :root {
//           --primary-color: #000000;
//           --sidebar-bg: #000000;
//           --sidebar-text: #ffffff;
//           --card-bg: #ffffff;
//           --card-border: #e5e7eb;
//           --text-primary: #000000;
//           --text-secondary: #666666;
//           --hover-bg: #f9fafb;
//         }

//         * {
//           box-sizing: border-box;
//           margin: 0;
//           padding: 0;
//         }
        
//         body, html {
//           font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//           width: 100%;
//           height: 100%;
//           background: #f9fafb;
//           color: var(--text-primary);
//         }

//         .dashboard-container {
//           display: flex;
//           width: 100vw;
//           height: 100vh;
//           overflow: hidden;
//         }

//         /* ====== SIDEBAR ====== */
//         .sidebar {
//           width: ${sidebarOpen ? '280px' : '80px'};
//           background: var(--sidebar-bg);
//           border-right: 1px solid #333333;
//           display: flex;
//           flex-direction: column;
//           transition: all 0.3s ease;
//           z-index: 40;
//         }

//         .sidebar-header {
//           padding: 24px;
//           border-bottom: 1px solid #333333;
//           display: flex;
//           align-items: center;
//           justify-content: ${sidebarOpen ? 'space-between' : 'center'};
//           min-height: 80px;
//         }

//         .logo-container {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           opacity: ${sidebarOpen ? '1' : '0'};
//           width: ${sidebarOpen ? 'auto' : '0'};
//           overflow: hidden;
//           transition: all 0.3s ease;
//         }

//         .logo-image {
//           width: 44px;
//           height: 44px;
//           border-radius: 10px;
//           overflow: hidden;
//           background: #ffffff;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .logo-image img {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .logo-text {
//           font-size: 22px;
//           font-weight: 800;
//           color: #ffffff;
//         }

//         .menu-toggle {
//           background: rgba(255, 255, 255, 0.1);
//           border: 1px solid #333333;
//           color: #ffffff;
//           cursor: pointer;
//           padding: 8px;
//           border-radius: 8px;
//           width: 40px;
//           height: 40px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .menu-toggle:hover {
//           background: rgba(255, 255, 255, 0.2);
//         }

//         .sidebar-menu {
//           flex: 1;
//           padding: 20px 0;
//           overflow-y: auto;
//         }

//         .menu-item {
//           display: flex;
//           align-items: center;
//           gap: 14px;
//           padding: 16px 20px;
//           color: #cccccc;
//           cursor: pointer;
//           margin: 0 12px 6px 12px;
//           border-radius: 8px;
//           font-size: 15px;
//           font-weight: 500;
//           transition: all 0.2s ease;
//         }

//         .menu-item:hover {
//           background: rgba(255, 255, 255, 0.12);
//           color: #ffffff;
//         }

//         .menu-item.active {
//           background: rgba(255, 255, 255, 0.15);
//           color: #ffffff;
//           border-left: 4px solid #ffffff;
//           font-weight: 700;
//         }

//         .menu-icon {
//           width: 20px;
//           height: 20px;
//           flex-shrink: 0;
//         }

//         .menu-label {
//           font-size: 15px;
//           white-space: nowrap;
//           opacity: ${sidebarOpen ? '1' : '0'};
//           width: ${sidebarOpen ? 'auto' : '0'};
//           overflow: hidden;
//           transition: all 0.3s ease;
//         }

//         .user-section {
//           padding: 20px;
//           border-top: 1px solid #333333;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin: 12px;
//           border-radius: 10px;
//           background: rgba(255, 255, 255, 0.05);
//         }

//         .user-avatar {
//           width: 44px;
//           height: 44px;
//           background: #ffffff;
//           border-radius: 10px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: #000000;
//           font-weight: 700;
//           font-size: 16px;
//           flex-shrink: 0;
//         }

//         .user-details-sidebar {
//           opacity: ${sidebarOpen ? '1' : '0'};
//           width: ${sidebarOpen ? 'auto' : '0'};
//           overflow: hidden;
//           transition: all 0.3s ease;
//         }

//         .user-name-sidebar {
//           font-size: 15px;
//           font-weight: 700;
//           color: #ffffff;
//           white-space: nowrap;
//         }

//         .user-role-sidebar {
//           font-size: 13px;
//           color: rgba(255, 255, 255, 0.7);
//           white-space: nowrap;
//         }

//         /* ====== MAIN CONTENT ====== */
//         .main-content {
//           flex: 1;
//           display: flex;
//           flex-direction: column;
//           overflow: hidden;
//           background: #f9fafb;
//         }

//         .topbar {
//           background: #ffffff;
//           border-bottom: 1px solid var(--card-border);
//           padding: 0 28px;
//           height: 72px;
//           display: flex;
//           align-items: center;
//           justify-content: space-between;
//           z-index: 30;
//           flex-shrink: 0;
//         }

//         .page-title {
//           font-size: 22px;
//           font-weight: 800;
//           color: var(--text-primary);
//         }

//         .topbar-right {
//           display: flex;
//           align-items: center;
//           gap: 20px;
//         }

//         .notification-btn {
//           background: none;
//           border: none;
//           color: var(--text-secondary);
//           cursor: pointer;
//           padding: 8px;
//           border-radius: 8px;
//           position: relative;
//           width: 44px;
//           height: 44px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .notification-btn:hover {
//           background: var(--hover-bg);
//         }

//         .notification-badge {
//           position: absolute;
//           top: 6px;
//           right: 6px;
//           width: 10px;
//           height: 10px;
//           background: #000000;
//           border-radius: 50%;
//           border: 2px solid #ffffff;
//         }

//         .user-dropdown-container {
//           position: relative;
//         }

//         .user-dropdown-trigger {
//           display: flex;
//           align-items: center;
//           gap: 10px;
//           padding: 8px 12px;
//           border-radius: 8px;
//           background: transparent;
//           border: 1px solid transparent;
//           cursor: pointer;
//         }

//         .user-dropdown-trigger:hover {
//           background: var(--hover-bg);
//         }

//         .user-info-topbar {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//         }

//         .user-details-topbar {
//           text-align: right;
//         }

//         .user-name-topbar {
//           font-size: 15px;
//           font-weight: 700;
//           color: var(--text-primary);
//         }

//         .user-role-topbar {
//           font-size: 13px;
//           color: var(--text-secondary);
//         }

//         .dropdown-arrow {
//           color: var(--text-secondary);
//           transition: transform 0.3s ease;
//         }

//         .dropdown-arrow.open {
//           transform: rotate(180deg);
//         }

//         .user-dropdown-menu {
//           position: absolute;
//           top: calc(100% + 8px);
//           right: 0;
//           width: 260px;
//           background: #ffffff;
//           border-radius: 12px;
//           border: 1px solid var(--card-border);
//           box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
//           z-index: 1000;
//           overflow: hidden;
//           display: ${userDropdownOpen ? 'block' : 'none'};
//         }

//         .dropdown-header {
//           padding: 20px;
//           border-bottom: 1px solid var(--card-border);
//           background: var(--hover-bg);
//         }

//         .dropdown-user-name {
//           font-size: 16px;
//           font-weight: 800;
//           color: var(--text-primary);
//         }

//         .dropdown-user-email {
//           font-size: 14px;
//           color: var(--text-secondary);
//         }

//         .dropdown-menu-items {
//           padding: 8px 0;
//         }

//         .dropdown-item {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding: 12px 20px;
//           color: var(--text-secondary);
//           font-size: 14px;
//           cursor: pointer;
//           transition: all 0.2s ease;
//         }

//         .dropdown-item:hover {
//           background: var(--hover-bg);
//           color: var(--text-primary);
//         }

//         .dropdown-divider {
//           height: 1px;
//           background: var(--card-border);
//           margin: 8px 20px;
//         }

//         .content-area {
//           flex: 1;
//           overflow-y: auto;
//           padding: 28px;
//         }

//         /* ====== FONCTIONNALITÉ 3: CARDS 3 PAR LIGNE ====== */
//         .cards-grid {
//           display: grid;
//           grid-template-columns: repeat(3, 1fr);
//           gap: 24px;
//           margin-bottom: 32px;
//         }

//         .stat-card {
//           background: #ffffff;
//           border-radius: 16px;
//           padding: 24px;
//           border: 1px solid var(--card-border);
//           transition: all 0.3s ease;
//         }

//         .stat-card:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
//           border-color: #000000;
//         }

//         .stat-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: flex-start;
//           margin-bottom: 16px;
//         }

//         .stat-icon {
//           width: 56px;
//           height: 56px;
//           border-radius: 12px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: #000000;
//           color: #ffffff;
//         }

//         .stat-value {
//           font-size: 36px;
//           font-weight: 900;
//           color: var(--text-primary);
//           margin-bottom: 8px;
//         }

//         .stat-label {
//           font-size: 16px;
//           font-weight: 600;
//           color: var(--text-secondary);
//         }

//         /* ====== FONCTIONNALITÉ 4: TABLEAU DES UTILISATEURS ====== */
//         .table-container {
//           background: #ffffff;
//           border-radius: 16px;
//           border: 1px solid var(--card-border);
//           overflow: hidden;
//         }

//         .table-header {
//           padding: 20px 24px;
//           border-bottom: 1px solid var(--card-border);
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           background: #f9fafb;
//         }

//         .table-title {
//           font-size: 18px;
//           font-weight: 800;
//           color: var(--text-primary);
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }

//         .data-table {
//           width: 100%;
//           border-collapse: collapse;
//         }

//         .data-table th {
//           padding: 16px 20px;
//           text-align: left;
//           font-size: 13px;
//           font-weight: 700;
//           color: var(--text-secondary);
//           text-transform: uppercase;
//           background: #f9fafb;
//           border-bottom: 1px solid var(--card-border);
//         }

//         .data-table td {
//           padding: 16px 20px;
//           border-bottom: 1px solid #f3f4f6;
//           font-size: 14px;
//         }

//         .data-table tr:last-child td {
//           border-bottom: none;
//         }

//         .data-table tr:hover td {
//           background: var(--hover-bg);
//         }

//         .user-avatar-small {
//           width: 40px;
//           height: 40px;
//           background: #000000;
//           border-radius: 8px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: #ffffff;
//           font-weight: 700;
//           font-size: 16px;
//         }

//         .user-name {
//           font-weight: 700;
//           color: var(--text-primary);
//         }

//         .user-email {
//           font-size: 13px;
//           color: var(--text-secondary);
//         }

//         .status-badge {
//           padding: 6px 12px;
//           border-radius: 16px;
//           font-size: 13px;
//           font-weight: 700;
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//         }

//         .action-button {
//           padding: 8px 16px;
//           border: none;
//           border-radius: 8px;
//           font-size: 13px;
//           font-weight: 600;
//           cursor: pointer;
//           transition: all 0.2s ease;
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//         }

//         .action-button.activate {
//           background: #f0fdf4;
//           color: #166534;
//           border: 1px solid #dcfce7;
//         }

//         .action-button.activate:hover {
//           background: #166534;
//           color: #ffffff;
//         }

//         .action-button.deactivate {
//           background: #fef2f2;
//           color: #991b1b;
//           border: 1px solid #fee2e2;
//         }

//         .action-button.deactivate:hover {
//           background: #991b1b;
//           color: #ffffff;
//         }

//         /* ====== FONCTIONNALITÉ 5: PROFIL ADMIN ====== */
//         .profile-container {
//           background: #ffffff;
//           border-radius: 16px;
//           border: 1px solid var(--card-border);
//           overflow: hidden;
//         }

//         .profile-cover {
//           height: 100px;
//           background: linear-gradient(135deg, #000000 0%, #333333 100%);
//         }

//         .profile-content {
//           padding: 0 32px 32px;
//           margin-top: -50px;
//         }

//         .profile-avatar-large {
//           width: 100px;
//           height: 100px;
//           background: #ffffff;
//           border-radius: 20px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           color: #000000;
//           font-size: 40px;
//           font-weight: 800;
//           border: 4px solid white;
//           box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
//           margin-bottom: 20px;
//         }

//         .profile-name {
//           font-size: 28px;
//           font-weight: 900;
//           color: var(--text-primary);
//           margin-bottom: 8px;
//         }

//         .profile-role {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           padding: 8px 16px;
//           background: #f3f4f6;
//           border-radius: 30px;
//           font-size: 14px;
//           font-weight: 600;
//           margin-bottom: 24px;
//         }

//         .profile-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 24px;
//         }

//         .profile-field {
//           margin-bottom: 16px;
//         }

//         .profile-label {
//           font-size: 13px;
//           font-weight: 700;
//           color: var(--text-secondary);
//           text-transform: uppercase;
//           margin-bottom: 8px;
//         }

//         .profile-value {
//           font-size: 16px;
//           font-weight: 600;
//           color: var(--text-primary);
//           padding: 12px 16px;
//           background: #f9fafb;
//           border-radius: 8px;
//           border: 1px solid var(--card-border);
//         }

//         .sidebar-overlay {
//           display: none;
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: rgba(0, 0, 0, 0.5);
//           z-index: 45;
//         }

//         @media (max-width: 1200px) {
//           .sidebar {
//             position: fixed;
//             left: ${sidebarOpen ? '0' : '-280px'};
//             height: 100vh;
//           }
//           .sidebar-overlay {
//             display: ${sidebarOpen ? 'block' : 'none'};
//           }
//           .cards-grid {
//             grid-template-columns: repeat(2, 1fr);
//           }
//         }

//         @media (max-width: 768px) {
//           .cards-grid {
//             grid-template-columns: 1fr;
//           }
//           .profile-grid {
//             grid-template-columns: 1fr;
//           }
//           .user-details-topbar {
//             display: none;
//           }
//         }
//         `}
//       </style>

//       <div className="dashboard-container">
//         {/* Overlay mobile */}
//         {sidebarOpen && (
//           <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
//         )}

//         {/* ====== SIDEBAR ====== */}
//         <div className="sidebar">
//           <div className="sidebar-header">
//             <div className="logo-container">
//               <div className="logo-image">
//                 <img src={logoImage} alt="Sign App Logo" />
//               </div>
//               <div className="logo-text">SIGN APP</div>
//             </div>
//             <button 
//               className="menu-toggle"
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//             >
//               {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
//             </button>
//           </div>

//           {/* MENU SIMPLIFIÉ - 4 ITEMS SEULEMENT */}
//           <div className="sidebar-menu">
//             {menuItems.map(item => (
//               <div
//                 key={item.id}
//                 className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
//                 onClick={() => handleMenuClick(item.id)}
//               >
//                 <item.icon className="menu-icon" size={20} />
//                 <span className="menu-label">{item.label}</span>
//               </div>
//             ))}
//           </div>

//           <div className="user-section">
//             <div className="user-avatar">
//               {adminData.avatar}
//             </div>
//             <div className="user-details-sidebar">
//               <div className="user-name-sidebar">{adminData.name}</div>
//               <div className="user-role-sidebar">{adminData.role}</div>
//             </div>
//           </div>
//         </div>

//         {/* ====== MAIN CONTENT ====== */}
//         <div className="main-content">
//           <div className="topbar">
//             <h1 className="page-title">
//               {activeMenu === "dashboard" && "Accueil"}
//               {activeMenu === "users" && "Liste utilisateurs"}
//               {activeMenu === "profile" && "Mon profil"}
//             </h1>
//             <div className="topbar-right">
//               <button className="notification-btn">
//                 <Bell size={20} />
//                 {notifications > 0 && <span className="notification-badge" />}
//               </button>
              
//               <div className="user-dropdown-container">
//                 <button 
//                   className={`user-dropdown-trigger ${userDropdownOpen ? 'active' : ''}`}
//                   onClick={() => setUserDropdownOpen(!userDropdownOpen)}
//                 >
//                   <div className="user-info-topbar">
//                     <div className="user-avatar">
//                       {adminData.avatar}
//                     </div>
//                     <div className="user-details-topbar">
//                       <div className="user-name-topbar">{adminData.name}</div>
//                       <div className="user-role-topbar">{adminData.role}</div>
//                     </div>
//                   </div>
//                   <ChevronDown className={`dropdown-arrow ${userDropdownOpen ? 'open' : ''}`} size={18} />
//                 </button>
                
//                 <div className="user-dropdown-menu">
//                   <div className="dropdown-header">
//                     <div className="dropdown-user-name">{adminData.name}</div>
//                     <div className="dropdown-user-email">{adminData.email}</div>
//                   </div>
//                   <div className="dropdown-menu-items">
//                     <div className="dropdown-item" onClick={() => setActiveMenu("profile")}>
//                       <User size={18} />
//                       <span>Mon profil</span>
//                     </div>
//                     <div className="dropdown-divider" />
//                     <div className="dropdown-item" onClick={handleLogout}>
//                       <LogOut size={18} />
//                       <span>Déconnexion</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="content-area">
//             {/* ====== PAGE ACCUEIL - 3 CARDS ====== */}
//             {activeMenu === "dashboard" && (
//               <>
//                 <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
//                   Vue d'ensemble
//                 </h2>
//                 <div className="cards-grid">
//                   <div className="stat-card">
//                     <div className="stat-header">
//                       <div className="stat-icon">
//                         <Users size={28} />
//                       </div>
//                     </div>
//                     <div className="stat-value">{formatNumber(dashboardData.totalUsers)}</div>
//                     <div className="stat-label">Nombre d'utilisateurs</div>
//                   </div>
                  
//                   <div className="stat-card">
//                     <div className="stat-header">
//                       <div className="stat-icon">
//                         <FileText size={28} />
//                       </div>
//                     </div>
//                     <div className="stat-value">{formatNumber(dashboardData.totalContracts)}</div>
//                     <div className="stat-label">Nombre de contrats</div>
//                   </div>
                  
//                   <div className="stat-card">
//                     <div className="stat-header">
//                       <div className="stat-icon">
//                         <DollarSign size={28} />
//                       </div>
//                     </div>
//                     <div className="stat-value">{formatNumber(dashboardData.totalInvoices)}</div>
//                     <div className="stat-label">Nombre de factures</div>
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* ====== PAGE UTILISATEURS - TABLEAU AVEC ACTIVER/DÉSACTIVER ====== */}
//             {activeMenu === "users" && (
//               <>
//                 <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
//                   Gestion des utilisateurs
//                 </h2>
//                 <div className="table-container">
//                   <div className="table-header">
//                     <h3 className="table-title">
//                       <Users size={18} />
//                       Liste des utilisateurs
//                     </h3>
//                   </div>
//                   <table className="data-table">
//                     <thead>
//                       <tr>
//                         <th>Nom</th>
//                         <th>Prénom</th>
//                         <th>Email</th>
//                         <th>Téléphone</th>
//                         <th>Rôle</th>
//                         <th>Date d'inscription</th>
//                         <th>Statut</th>
//                         <th>Actions</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {dashboardData.usersList.map(user => (
//                         <tr key={user.id}>
//                           <td><span className="user-name">{user.nom}</span></td>
//                           <td>{user.prenom}</td>
//                           <td><span className="user-email">{user.email}</span></td>
//                           <td>{user.telephone}</td>
//                           <td>{user.role}</td>
//                           <td>{user.dateInscription}</td>
//                           <td>
//                             <span 
//                               className="status-badge"
//                               style={{
//                                 background: statusColors[user.status].bg,
//                                 color: statusColors[user.status].text,
//                                 borderColor: statusColors[user.status].border
//                               }}
//                             >
//                               {user.status === "actif" ? <Check size={12} /> : <XIcon size={12} />}
//                               {user.status === "actif" ? "Actif" : "Inactif"}
//                             </span>
//                           </td>
//                           <td>
//                             {user.status === "actif" ? (
//                               <button className="action-button deactivate" onClick={() => handleToggleUserStatus(user.id)}>
//                                 <XIcon size={14} />
//                                 Désactiver
//                               </button>
//                             ) : (
//                               <button 
//                                 className="action-button activate"
//                                 onClick={() => handleToggleUserStatus(user.id)}
//                               >
//                                 <Check size={14} />
//                                 Activer
//                               </button>
//                             )}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </>
//             )}

//             {/* ====== PAGE PROFIL ====== */}
//             {activeMenu === "profile" && (
//               <>
//                 <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
//                   Mon profil
//                 </h2>
//                 <div className="profile-container">
//                   <div className="profile-cover" />
//                   <div className="profile-content">
//                     <div className="profile-avatar-large">
//                       {adminData.avatar}
//                     </div>
//                     <div className="profile-name">{adminData.name}</div>
//                     <div className="profile-role">
//                       <Shield size={16} />
//                       {adminData.role}
//                     </div>
                    
//                     <div className="profile-grid">
//                       <div className="profile-field">
//                         <div className="profile-label">Email</div>
//                         <div className="profile-value">{adminData.email}</div>
//                       </div>
//                       <div className="profile-field">
//                         <div className="profile-label">Téléphone</div>
//                         <div className="profile-value">{adminData.phone}</div>
//                       </div>
//                       <div className="profile-field">
//                         <div className="profile-label">Date d'inscription</div>
//                         <div className="profile-value">{adminData.createdAt}</div>
//                       </div>
//                       <div className="profile-field">
//                         <div className="profile-label">Dernière connexion</div>
//                         <div className="profile-value">{adminData.lastLogin}</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


import React, { useState } from "react";
import { 
  Search, Bell, Menu, X, Home, FileText, Users, BarChart3, 
  Settings, LogOut, User, Plus, CheckCircle, Clock, 
  TrendingUp, DollarSign, Download, Eye, Edit, MoreVertical,
  FileSignature, Calendar, Shield, Mail, Phone, MapPin
} from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");

  // Données simulées pour le dashboard
  const [dashboardData, setDashboardData] = useState({
    user: {
      name: "Alexandre Martin",
      email: "alex.martin@entreprise.com",
      role: "Administrateur",
      avatar: "AM"
    },
    stats: {
      totalContracts: 247,
      signedContracts: 189,
      pendingSignatures: 42,
      expiredContracts: 16,
      totalClients: 89,
      revenue: 125430
    },
    recentContracts: [
      { id: 1, client: "TechCorp SARL", type: "Service", status: "signé", date: "15/03/2024", value: 12500 },
      { id: 2, client: "InnovDesign", type: "Partnership", status: "en attente", date: "14/03/2024", value: 8500 },
      { id: 3, client: "Global Logistics", type: "NDA", status: "signé", date: "12/03/2024", value: 0 },
      { id: 4, client: "StartUp XYZ", type: "Service", status: "en attente", date: "10/03/2024", value: 3200 },
      { id: 5, client: "LegalFirm Inc", type: "Consulting", status: "expiré", date: "05/03/2024", value: 5600 }
    ],
    quickActions: [
      { id: 1, title: "Nouveau contrat", icon: Plus, color: "bg-blue-500" },
      { id: 2, title: "Modèles", icon: FileText, color: "bg-green-500" },
      { id: 3, title: "Inviter client", icon: Users, color: "bg-purple-500" },
      { id: 4, title: "Rapports", icon: BarChart3, color: "bg-orange-500" }
    ]
  });

  const menuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: Home },
    { id: "contracts", label: "Contrats", icon: FileText },
    { id: "clients", label: "Clients", icon: Users },
    { id: "analytics", label: "Analytiques", icon: BarChart3 },
    { id: "templates", label: "Modèles", icon: FileSignature },
    { id: "calendar", label: "Calendrier", icon: Calendar }
  ];

  const userMenuItems = [
    { id: "profile", label: "Mon profil", icon: User },
    { id: "settings", label: "Paramètres", icon: Settings },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "help", label: "Aide & Support", icon: Mail },
    { id: "logout", label: "Déconnexion", icon: LogOut }
  ];

  const statusColors = {
    "signé": "bg-green-100 text-green-800",
    "en attente": "bg-yellow-100 text-yellow-800",
    "expiré": "bg-red-100 text-red-800"
  };

  return (
    <>
      <style>
        {`
        /* ====== Reset et base ====== */
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body, html {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          width: 100%;
          height: 100%;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow: hidden;
        }

        /* ====== Layout principal ====== */
        .dashboard-container {
          display: flex;
          width: 100vw;
          height: 100vh;
          background: #f8fafc;
          overflow: hidden;
        }

        /* ====== Sidebar ====== */
        .sidebar {
          width: ${sidebarOpen ? '280px' : '80px'};
          background: white;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
          z-index: 40;
          position: relative;
        }

        /* Logo et toggle */
        .sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: ${sidebarOpen ? 'space-between' : 'center'};
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: ${sidebarOpen ? '1' : '0'};
          width: ${sidebarOpen ? 'auto' : '0'};
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #073257 0%, #0a3a83 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 20px;
        }

        .logo-text {
          font-size: 22px;
          font-weight: 800;
          color: #073257;
          letter-spacing: -0.5px;
        }

        .menu-toggle {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .menu-toggle:hover {
          background: #f1f5f9;
          color: #073257;
        }

        /* Menu principal */
        .sidebar-menu {
          flex: 1;
          padding: 20px 0;
          overflow-y: auto;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          color: #64748b;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          border-left: 3px solid transparent;
        }

        .menu-item:hover {
          background: #f1f5f9;
          color: #073257;
        }

        .menu-item.active {
          background: #f1f5f9;
          color: #073257;
          border-left-color: #073257;
          font-weight: 600;
        }

        .menu-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .menu-label {
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
          opacity: ${sidebarOpen ? '1' : '0'};
          width: ${sidebarOpen ? 'auto' : '0'};
          overflow: hidden;
          transition: all 0.3s ease;
        }

        /* Section utilisateur */
        .user-section {
          padding: 20px;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
          flex-shrink: 0;
        }

        .user-details {
          opacity: ${sidebarOpen ? '1' : '0'};
          width: ${sidebarOpen ? 'auto' : '0'};
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .user-name {
          font-size: 14px;
          font-weight: 600;
          color: #1e293b;
          white-space: nowrap;
        }

        .user-role {
          font-size: 12px;
          color: #64748b;
          white-space: nowrap;
        }

        .user-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 0;
          color: #64748b;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .user-menu-item:hover {
          color: #073257;
        }

        .user-menu-icon {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
        }

        /* ====== Main content ====== */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Topbar */
        .topbar {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 30px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 30;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .page-title {
          font-size: 24px;
          font-weight: 700;
          color: #1e293b;
        }

        .search-bar {
          position: relative;
          width: 400px;
        }

        .search-input {
          width: 100%;
          padding: 10px 16px 10px 42px;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 14px;
          color: #1e293b;
          background: #f8fafc;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #073257;
          background: white;
          box-shadow: 0 0 0 3px rgba(7, 50, 87, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          width: 18px;
          height: 18px;
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .notification-btn {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          position: relative;
          transition: all 0.2s;
        }

        .notification-btn:hover {
          background: #f1f5f9;
          color: #073257;
        }

        .notification-badge {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .mobile-menu-toggle:hover {
          background: #f1f5f9;
          color: #073257;
        }

        /* Content area */
        .content-area {
          flex: 1;
          overflow-y: auto;
          padding: 30px;
        }

        /* Welcome section */
        .welcome-section {
          background: linear-gradient(135deg, #073257 0%, #0a3a83 100%);
          border-radius: 16px;
          padding: 30px;
          color: white;
          margin-bottom: 30px;
        }

        .welcome-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .welcome-subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin-bottom: 20px;
        }

        .welcome-stats {
          display: flex;
          gap: 30px;
          flex-wrap: wrap;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content h3 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 2px;
        }

        .stat-content p {
          font-size: 14px;
          opacity: 0.8;
        }

        /* Stats grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s;
          cursor: pointer;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border-color: #cbd5e1;
        }

        .stat-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-card .stat-icon-wrapper {
          background: #f1f5f9;
          color: #073257;
        }

        .stat-card.signed .stat-icon-wrapper {
          background: #d1fae5;
          color: #10b981;
        }

        .stat-card.pending .stat-icon-wrapper {
          background: #fef3c7;
          color: #f59e0b;
        }

        .stat-card.clients .stat-icon-wrapper {
          background: #e0e7ff;
          color: #6366f1;
        }

        .stat-card.revenue .stat-icon-wrapper {
          background: #fce7f3;
          color: #ec4899;
        }

        .stat-card-value {
          font-size: 32px;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .stat-card-label {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 8px;
        }

        .stat-card-trend {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 600;
        }

        .trend-up {
          color: #10b981;
        }

        .trend-down {
          color: #ef4444;
        }

        /* Quick actions */
        .quick-actions {
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .action-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          border: 2px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          transition: all 0.3s;
          cursor: pointer;
          text-align: center;
        }

        .action-card:hover {
          transform: translateY(-4px);
          border-color: #073257;
          box-shadow: 0 10px 25px rgba(7, 50, 87, 0.1);
        }

        .action-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 24px;
        }

        .action-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
        }

        .action-desc {
          font-size: 13px;
          color: #64748b;
          line-height: 1.4;
        }

        /* Recent contracts table */
        .recent-contracts {
          background: white;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }

        .table-header {
          padding: 24px;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .table-title {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }

        .view-all {
          color: #073257;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .view-all:hover {
          text-decoration: underline;
        }

        .contracts-table {
          width: 100%;
          border-collapse: collapse;
        }

        .contracts-table th {
          padding: 16px 24px;
          text-align: left;
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .contracts-table td {
          padding: 20px 24px;
          border-bottom: 1px solid #f1f5f9;
          font-size: 14px;
        }

        .contracts-table tr:last-child td {
          border-bottom: none;
        }

        .contracts-table tr:hover {
          background: #f8fafc;
        }

        .client-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .client-avatar {
          width: 36px;
          height: 36px;
          background: #f1f5f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #64748b;
          font-size: 14px;
        }

        .client-name {
          font-weight: 600;
          color: #1e293b;
        }

        .contract-type {
          color: #64748b;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .contract-value {
          font-weight: 700;
          color: #1e293b;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .table-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: #f1f5f9;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .table-btn:hover {
          background: #e2e8f0;
          color: #073257;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .sidebar {
            position: fixed;
            left: ${sidebarOpen ? '0' : '-280px'};
            height: 100vh;
            z-index: 50;
          }

          .mobile-menu-toggle {
            display: block;
          }

          .search-bar {
            width: 300px;
          }
        }

        @media (max-width: 768px) {
          .topbar {
            padding: 0 20px;
          }

          .content-area {
            padding: 20px;
          }

          .search-bar {
            display: none;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .contracts-table {
            display: block;
            overflow-x: auto;
          }

          .welcome-stats {
            flex-direction: column;
            gap: 20px;
          }
        }

        /* ====== Styles de curseur ====== */
        button, 
        .menu-item,
        .action-card,
        .stat-card,
        .view-all,
        .table-btn {
          cursor: pointer;
        }

        /* ====== Styles pour les textes NON-cliquables ====== */
        .logo-text,
        .user-name,
        .user-role,
        .page-title,
        .section-title,
        .table-title,
        .stat-card-value,
        .stat-card-label,
        .action-title,
        .action-desc,
        .client-name,
        .contract-type,
        .contract-value,
        th,
        .status-badge,
        .welcome-title,
        .welcome-subtitle {
          cursor: default !important;
          user-select: none;
        }

        /* ====== Focus visible pour l'accessibilité ====== */
        button:focus-visible,
        input:focus-visible {
          outline: 2px solid rgba(7, 50, 87, 0.5);
          outline-offset: 2px;
        }

        /* Overlay pour mobile */
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 45;
        }

        @media (max-width: 1200px) {
          .sidebar-overlay {
            display: ${sidebarOpen ? 'block' : 'none'};
          }
        }
        `}
      </style>

      <div className="dashboard-container">
        {/* Overlay pour mobile */}
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="logo-container">
              <div className="logo-icon">S</div>
              <div className="logo-text">Sign</div>
            </div>
            <button 
              className="menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <div className="sidebar-menu">
            {menuItems.map(item => (
              <div
                key={item.id}
                className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
                onClick={() => setActiveMenu(item.id)}
              >
                <item.icon className="menu-icon" size={20} />
                <span className="menu-label">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="user-section">
            <div className="user-info">
              <div className="user-avatar">
                {dashboardData.user.avatar}
              </div>
              <div className="user-details">
                <div className="user-name">{dashboardData.user.name}</div>
                <div className="user-role">{dashboardData.user.role}</div>
              </div>
            </div>
            {userMenuItems.map(item => (
              <div key={item.id} className="user-menu-item">
                <item.icon className="user-menu-icon" size={16} />
                <span className="menu-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="main-content">
          {/* Topbar */}
          <div className="topbar">
            <div className="topbar-left">
              <button 
                className="mobile-menu-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu size={20} />
              </button>
              <h1 className="page-title">Tableau de bord</h1>
              <div className="search-bar">
                <Search className="search-icon" size={18} />
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Rechercher contrats, clients..."
                />
              </div>
            </div>
            <div className="topbar-right">
              <button className="notification-btn">
                <Bell size={20} />
                <span className="notification-badge"></span>
              </button>
              <div className="user-info" style={{ cursor: 'pointer' }}>
                <div className="user-avatar">
                  {dashboardData.user.avatar}
                </div>
                <div className="user-details">
                  <div className="user-name">{dashboardData.user.name}</div>
                  <div className="user-role">{dashboardData.user.role}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="content-area">
            {/* Welcome section */}
            <div className="welcome-section">
              <h2 className="welcome-title">Bienvenue, {dashboardData.user.name} 👋</h2>
              <p className="welcome-subtitle">
                Gérez vos contrats, suivez les signatures et simplifiez votre workflow
              </p>
              <div className="welcome-stats">
                <div className="stat-item">
                  <div className="stat-icon">
                    <FileText size={20} />
                  </div>
                  <div className="stat-content">
                    <h3>{dashboardData.stats.totalContracts}</h3>
                    <p>Contrats au total</p>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <CheckCircle size={20} />
                  </div>
                  <div className="stat-content">
                    <h3>{dashboardData.stats.signedContracts}</h3>
                    <p>Contrats signés</p>
                  </div>
                </div>
                <div className="stat-item">
                  <div className="stat-icon">
                    <Users size={20} />
                  </div>
                  <div className="stat-content">
                    <h3>{dashboardData.stats.totalClients}</h3>
                    <p>Clients actifs</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="stats-grid">
              <div className="stat-card signed">
                <div className="stat-card-header">
                  <div>
                    <div className="stat-card-value">{dashboardData.stats.signedContracts}</div>
                    <div className="stat-card-label">Contrats signés</div>
                    <div className="stat-card-trend trend-up">
                      <TrendingUp size={12} />
                      <span>+12% ce mois</span>
                    </div>
                  </div>
                  <div className="stat-icon-wrapper">
                    <CheckCircle size={24} />
                  </div>
                </div>
              </div>

              <div className="stat-card pending">
                <div className="stat-card-header">
                  <div>
                    <div className="stat-card-value">{dashboardData.stats.pendingSignatures}</div>
                    <div className="stat-card-label">En attente de signature</div>
                    <div className="stat-card-trend trend-down">
                      <TrendingUp size={12} />
                      <span>-5% ce mois</span>
                    </div>
                  </div>
                  <div className="stat-icon-wrapper">
                    <Clock size={24} />
                  </div>
                </div>
              </div>

              <div className="stat-card clients">
                <div className="stat-card-header">
                  <div>
                    <div className="stat-card-value">{dashboardData.stats.totalClients}</div>
                    <div className="stat-card-label">Clients</div>
                    <div className="stat-card-trend trend-up">
                      <TrendingUp size={12} />
                      <span>+8% ce mois</span>
                    </div>
                  </div>
                  <div className="stat-icon-wrapper">
                    <Users size={24} />
                  </div>
                </div>
              </div>

              <div className="stat-card revenue">
                <div className="stat-card-header">
                  <div>
                    <div className="stat-card-value">{dashboardData.stats.revenue.toLocaleString()}€</div>
                    <div className="stat-card-label">Chiffre d'affaires</div>
                    <div className="stat-card-trend trend-up">
                      <TrendingUp size={12} />
                      <span>+18% ce mois</span>
                    </div>
                  </div>
                  <div className="stat-icon-wrapper">
                    <DollarSign size={24} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="quick-actions">
              <h2 className="section-title">
                <Plus size={20} />
                Actions rapides
              </h2>
              <div className="actions-grid">
                {dashboardData.quickActions.map(action => (
                  <div key={action.id} className="action-card">
                    <div className={`action-icon ${action.color}`}>
                      <action.icon size={24} />
                    </div>
                    <div>
                      <div className="action-title">{action.title}</div>
                      <div className="action-desc">
                        {action.id === 1 && "Créez un nouveau contrat personnalisé"}
                        {action.id === 2 && "Utilisez nos modèles prédéfinis"}
                        {action.id === 3 && "Invitez un nouveau client à signer"}
                        {action.id === 4 && "Générez des rapports détaillés"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent contracts table */}
            <div className="recent-contracts">
              <div className="table-header">
                <h2 className="table-title">Contrats récents</h2>
                <div className="view-all">
                  <span>Voir tout</span>
                  <Eye size={16} />
                </div>
              </div>
              <table className="contracts-table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Type</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Valeur</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboardData.recentContracts.map(contract => (
                    <tr key={contract.id}>
                      <td>
                        <div className="client-info">
                          <div className="client-avatar">
                            {contract.client.charAt(0)}
                          </div>
                          <div>
                            <div className="client-name">{contract.client}</div>
                            <div className="contract-type">{contract.type}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contract-type">{contract.type}</div>
                      </td>
                      <td>
                        <span className={`status-badge ${statusColors[contract.status]}`}>
                          {contract.status === "signé" && <CheckCircle size={12} />}
                          {contract.status === "en attente" && <Clock size={12} />}
                          {contract.status === "expiré" && <X size={12} />}
                          {contract.status}
                        </span>
                      </td>
                      <td>{contract.date}</td>
                      <td>
                        <div className="contract-value">
                          {contract.value > 0 ? `${contract.value.toLocaleString()}€` : "Gratuit"}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="table-btn" title="Voir">
                            <Eye size={16} />
                          </button>
                          <button className="table-btn" title="Éditer">
                            <Edit size={16} />
                          </button>
                          <button className="table-btn" title="Plus d'options">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}