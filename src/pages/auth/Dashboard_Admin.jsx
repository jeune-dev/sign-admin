import React, { useState, useEffect } from "react";
import { 
  Search, Bell, Menu, X, Home, FileText, Users, 
  Settings, LogOut, User, Plus, CheckCircle, Clock, 
  TrendingUp, Eye, Edit, MoreVertical,
  FileSignature, ChevronDown, Upload, BarChart3,
  Shield, CreditCard, Activity, Archive, AlertTriangle,
  Download, Filter, Calendar, DollarSign, PieChart,
  Lock, Database, MessageSquare, Globe, RefreshCw,
  Mail, Phone, Users as UsersIcon, FilePlus,
  FileCheck, FileX, Key, Headphones, Zap, TrendingDown,
  ArrowUpRight, ArrowDownRight, Check, X as XIcon,
  DownloadCloud, EyeOff, UserCheck, Settings as SettingsIcon,
  Smartphone, Smartphone as SmartphoneIcon, Wallet
} from "lucide-react";
import Swal from 'sweetalert2';

// Import du logo
import logoImage from "../../assets/images/logo.jpeg";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("Mois");
  const [selectedChartData, setSelectedChartData] = useState("users");
  const [activeTab, setActiveTab] = useState("users");
  const [notifications, setNotifications] = useState(3);

  // ============ DONNÉES ADMIN ============
  const [adminData] = useState({
    name: "Admin Système",
    email: "admin@signapp.com",
    role: "Super Administrateur",
    avatar: "SA",
    phone: "+221 77 123 45 67",
    createdAt: "01/01/2024",
    lastLogin: new Date().toLocaleString('fr-FR')
  });

  // ============ DONNÉES DASHBOARD ============
  const [dashboardData, setDashboardData] = useState({
    // KPIs simplifiés pour l'accueil (3 seulement)
    totalUsers: 12547,
    totalFactures: 880,      // Renommé de totalContracts à totalFactures
    totalInvoices: 45321,

    // Statistiques mensuelles (12 mois)
    monthlyStats: [
      { month: "Jan", users: 245, factures: 45, invoices: 1876 },
      { month: "Fév", users: 312, factures: 52, invoices: 2145 },
      { month: "Mar", users: 289, factures: 48, invoices: 1987 },
      { month: "Avr", users: 356, factures: 61, invoices: 2456 },
      { month: "Mai", users: 412, factures: 68, invoices: 2876 },
      { month: "Juin", users: 387, factures: 58, invoices: 2456 },
      { month: "Juil", users: 456, factures: 72, invoices: 3123 },
      { month: "Août", users: 398, factures: 63, invoices: 2765 },
      { month: "Sep", users: 434, factures: 71, invoices: 2987 },
      { month: "Oct", users: 467, factures: 75, invoices: 3245 },
      { month: "Nov", users: 489, factures: 79, invoices: 3456 },
      { month: "Déc", users: 512, factures: 84, invoices: 3789 }
    ],

    // Statistiques annuelles (5 ans)
    yearlyStats: [
      { year: "2020", users: 5234, factures: 245, invoices: 18765 },
      { year: "2021", users: 7234, factures: 389, invoices: 25432 },
      { year: "2022", users: 9567, factures: 567, invoices: 32456 },
      { year: "2023", users: 11234, factures: 723, invoices: 39876 },
      { year: "2024", users: 12547, factures: 880, invoices: 45321 }
    ],

    // Derniers utilisateurs actifs
    recentActiveUsers: [
      { id: 1, name: "Alassane Gueye", email: "alassane@entreprise.sn", lastActive: "Il y a 5 min", status: "online", role: "Administrateur" },
      { id: 2, name: "Ibnou Thiam", email: "ibnou@tech.sn", lastActive: "Il y a 12 min", status: "online", role: "Professionnel" },
      { id: 3, name: "Balla Beye", email: "balla@legal.sn", lastActive: "Il y a 25 min", status: "offline", role: "Particulier" },
      { id: 4, name: "Aboubekrine Diao", email: "aboubekrine@startup.sn", lastActive: "Il y a 1h", status: "online", role: "Independant" }
    ],

    // Documents les plus utilisés
    popularDocuments: [
      { id: 1, name: "Contrat de Service", count: 4521, category: "Services", color: "#000000" },
      { id: 2, name: "NDA Standard", count: 3876, category: "Confidentialité", color: "#333333" },
      { id: 3, name: "Contrat de Travail", count: 2987, category: "RH", color: "#666666" },
      { id: 4, name: "Devis Commercial", count: 2456, category: "Commercial", color: "#999999" },
      { id: 5, name: "Convention de Partenariat", count: 1876, category: "Partnership", color: "#cccccc" }
    ],

    // Liste des utilisateurs (pour la page users)
    usersList: [
      { id: 1, nom: "Gueye", prenom: "Alassane", email: "alassane@entreprise.sn", telephone: "+221 77 123 45 67", role: "Administrateur", status: "actif", dateInscription: "15/01/2024" },
      { id: 2, nom: "Thiam", prenom: "Ibnou", email: "ibnou@tech.sn", telephone: "+221 78 234 56 78", role: "Independant", status: "actif", dateInscription: "20/01/2024" },
      { id: 3, nom: "Beye", prenom: "Balla", email: "balla@legal.sn", telephone: "+221 76 345 67 89", role: "Particulier", status: "inactif", dateInscription: "05/02/2024" },
      { id: 4, nom: "Diao", prenom: "Aboubekrine", email: "aboubekrine@startup.sn", telephone: "+221 77 456 78 90", role: "Professionnel", status: "actif", dateInscription: "12/02/2024" }
    ]
  });

  // ============ MENU SIMPLIFIÉ (4 ITEMS) ============
  const menuItems = [
    { id: "dashboard", label: "Accueil", icon: Home, color: "#ffffff" },
    { id: "users", label: "Liste utilisateurs", icon: Users, color: "#ffffff" },
    { id: "profile", label: "Profil administrateur", icon: User, color: "#ffffff" },
    { id: "logout", label: "Déconnexion", icon: LogOut, color: "#ffffff" }
  ];

  // ============ CONFIGURATIONS ============
  const periodOptions = [
    { id: "Mois", label: "Mensuelle" },
    { id: "Annee", label: "Annuelle" }
  ];

  const tabOptions = [
    { id: "users", label: "Utilisateurs", icon: UsersIcon, color: "#000000" },
    { id: "factures", label: "Factures", icon: FileText, color: "#000000" }
  ];

  // Configuration des 3 KPIs seulement
  const kpiConfigs = [
    { key: "totalUsers", label: "Utilisateurs Totaux", icon: Users, color: "#000000", trend: "+12%" },
    { key: "totalFactures", label: "Factures Générées", icon: FileText, color: "#000000", trend: "+15%" },
    { key: "totalInvoices", label: "Montant Total (kFCFA)", icon: DollarSign, color: "#000000", trend: "+22%" }
  ];

  const statusColors = {
    "online": { bg: "#f3f4f6", text: "#000000", border: "#e5e7eb", icon: "#000000" },
    "offline": { bg: "#f9fafb", text: "#666666", border: "#f3f4f6", icon: "#666666" },
    "actif": { bg: "#f0fdf4", text: "#166534", border: "#dcfce7" },
    "inactif": { bg: "#fef2f2", text: "#991b1b", border: "#fee2e2" }
  };

  // ============ FONCTIONNALITÉS ============
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
        window.location.href = '/login';
      }
    });
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
        setDashboardData(prev => ({
          ...prev,
          usersList: prev.usersList.map(u => 
            u.id === userId ? { ...u, status: newStatus } : u
          )
        }));

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

  const handleMenuClick = (menuId) => {
    if (menuId === 'logout') {
      handleLogout();
    } else {
      setActiveMenu(menuId);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(amount);
  };

  const getKPIValue = (key) => {
    if (key === "totalInvoices") {
      return `${formatNumber(dashboardData[key] / 1000)}K FCFA`;
    }
    return formatNumber(dashboardData[key]);
  };

  // Obtenir les données du graphique selon la période sélectionnée
  const getChartData = () => {
    if (selectedPeriod === "Mois") {
      return dashboardData.monthlyStats.map(stat => ({
        label: stat.month,
        value: selectedChartData === "users" ? stat.users : 
               selectedChartData === "factures" ? stat.factures : 
               stat.invoices / 1000 // Pour les invoices en milliers
      }));
    } else {
      return dashboardData.yearlyStats.map(stat => ({
        label: stat.year,
        value: selectedChartData === "users" ? stat.users : 
               selectedChartData === "factures" ? stat.factures : 
               stat.invoices / 1000
      }));
    }
  };

  // Obtenir la valeur maximale pour l'échelle du graphique
  const getMaxValue = () => {
    const data = getChartData();
    return Math.max(...data.map(d => d.value)) * 1.1; // 10% de marge
  };

  return (
    <>
      <style>
        {`
        /* ====== VARIABLES CSS ====== */
        :root {
          --primary-color: #000000;
          --sidebar-bg: #000000;
          --sidebar-text: #ffffff;
          --card-bg: #ffffff;
          --card-border: #e5e7eb;
          --text-primary: #000000;
          --text-secondary: #666666;
          --hover-bg: #f9fafb;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body, html {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          width: 100%;
          height: 100%;
          background: #f9fafb;
          color: var(--text-primary);
        }

        .dashboard-container {
          display: flex;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
        }

        /* ====== SIDEBAR ====== */
        .sidebar {
          width: ${sidebarOpen ? '280px' : '80px'};
          background: var(--sidebar-bg);
          border-right: 1px solid #333333;
          display: flex;
          flex-direction: column;
          transition: all 0.3s ease;
          z-index: 40;
        }

        .sidebar-header {
          padding: 24px;
          border-bottom: 1px solid #333333;
          display: flex;
          align-items: center;
          justify-content: ${sidebarOpen ? 'space-between' : 'center'};
          min-height: 80px;
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

        .logo-image {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          overflow: hidden;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .logo-text {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
        }

        .menu-toggle {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid #333333;
          color: #ffffff;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .sidebar-menu {
          flex: 1;
          padding: 20px 0;
          overflow-y: auto;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px 20px;
          color: #cccccc;
          cursor: pointer;
          margin: 0 12px 6px 12px;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
        }

        .menu-item.active {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border-left: 4px solid #ffffff;
          font-weight: 700;
        }

        .menu-icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
        }

        .menu-label {
          font-size: 15px;
          white-space: nowrap;
          opacity: ${sidebarOpen ? '1' : '0'};
          width: ${sidebarOpen ? 'auto' : '0'};
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .user-section {
          padding: 20px;
          border-top: 1px solid #333333;
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 12px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.05);
        }

        .user-avatar {
          width: 44px;
          height: 44px;
          background: #ffffff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000000;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }

        .user-details-sidebar {
          opacity: ${sidebarOpen ? '1' : '0'};
          width: ${sidebarOpen ? 'auto' : '0'};
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .user-name-sidebar {
          font-size: 15px;
          font-weight: 700;
          color: #ffffff;
          white-space: nowrap;
        }

        .user-role-sidebar {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          white-space: nowrap;
        }

        /* ====== MAIN CONTENT ====== */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #f9fafb;
        }

        .topbar {
          background: #ffffff;
          border-bottom: 1px solid var(--card-border);
          padding: 0 28px;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 30;
          flex-shrink: 0;
        }

        .page-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .search-bar {
          position: relative;
          width: 350px;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 44px;
          border: 1px solid var(--card-border);
          border-radius: 8px;
          font-size: 15px;
          color: var(--text-primary);
          background: #ffffff;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .notification-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          position: relative;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-btn:hover {
          background: var(--hover-bg);
        }

        .notification-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 10px;
          height: 10px;
          background: #000000;
          border-radius: 50%;
          border: 2px solid #ffffff;
        }

        .user-dropdown-container {
          position: relative;
        }

        .user-dropdown-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
        }

        .user-dropdown-trigger:hover {
          background: var(--hover-bg);
        }

        .user-info-topbar {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-details-topbar {
          text-align: right;
        }

        .user-name-topbar {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .user-role-topbar {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .dropdown-arrow {
          color: var(--text-secondary);
          transition: transform 0.3s ease;
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        .user-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 260px;
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid var(--card-border);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          z-index: 1000;
          overflow: hidden;
          display: ${userDropdownOpen ? 'block' : 'none'};
        }

        .dropdown-header {
          padding: 20px;
          border-bottom: 1px solid var(--card-border);
          background: var(--hover-bg);
        }

        .dropdown-user-name {
          font-size: 16px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .dropdown-user-email {
          font-size: 14px;
          color: var(--text-secondary);
        }

        .dropdown-menu-items {
          padding: 8px 0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: var(--text-secondary);
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .dropdown-item:hover {
          background: var(--hover-bg);
          color: var(--text-primary);
        }

        .dropdown-divider {
          height: 1px;
          background: var(--card-border);
          margin: 8px 20px;
        }

        .content-area {
          flex: 1;
          overflow-y: auto;
          padding: 28px;
        }

        /* ====== DASHBOARD STYLES ====== */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px;
        }

        .header-title {
          font-size: 28px;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .header-subtitle {
          font-size: 16px;
          color: var(--text-secondary);
        }

        .filters-container {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .period-selector {
          display: flex;
          gap: 4px;
          background: #ffffff;
          border: 1px solid var(--card-border);
          border-radius: 8px;
          padding: 4px;
        }

        .period-btn {
          padding: 8px 16px;
          border: none;
          background: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .period-btn:hover {
          background: var(--hover-bg);
        }

        .period-btn.active {
          background: #000000;
          color: #ffffff;
        }

        .refresh-btn {
          padding: 10px 16px;
          border: 1px solid var(--card-border);
          background: #ffffff;
          border-radius: 8px;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
        }

        .refresh-btn:hover {
          background: var(--hover-bg);
        }

        .tabs-navigation {
          display: flex;
          gap: 6px;
          margin-bottom: 28px;
          border-bottom: 2px solid var(--card-border);
        }

        .tab-btn {
          padding: 14px 24px;
          border: none;
          background: none;
          font-size: 15px;
          font-weight: 700;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 3px solid transparent;
          margin-bottom: -2px;
        }

        .tab-btn:hover {
          color: var(--text-primary);
        }

        .tab-btn.active {
          color: var(--text-primary);
          border-bottom-color: #000000;
        }

        .kpis-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 28px;
        }

        .kpi-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid var(--card-border);
          transition: all 0.3s ease;
        }

        .kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .kpi-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--hover-bg);
          color: var(--text-primary);
          border: 1px solid var(--card-border);
        }

        .kpi-value {
          font-size: 32px;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .kpi-label {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 12px;
        }

        .kpi-trend {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          padding: 6px 12px;
          border-radius: 16px;
          background: var(--hover-bg);
          width: fit-content;
        }

        .trend-up {
          color: #000000;
        }

        .trend-down {
          color: #666666;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
          margin-bottom: 28px;
        }

        .chart-container {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid var(--card-border);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .chart-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .chart-selector {
          padding: 8px 16px;
          border: 1px solid var(--card-border);
          border-radius: 6px;
          background: #ffffff;
          color: var(--text-secondary);
          font-size: 14px;
          cursor: pointer;
        }

        .chart-placeholder {
          height: 280px;
          background: #f9fafb;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          position: relative;
          overflow: hidden;
        }

        .chart-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 240px;
          padding: 20px 0;
          gap: 12px;
          width: 100%;
        }

        .chart-bar {
          flex: 1;
          background: #000000;
          border-radius: 8px 8px 0 0;
          min-width: 28px;
          position: relative;
          transition: transform 0.3s ease;
        }

        .chart-bar:hover {
          transform: translateY(-8px);
          background: linear-gradient(to top, #000000, #333333);
        }

        .chart-bar-label {
          position: absolute;
          bottom: -28px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .chart-bar-value {
          position: absolute;
          top: -32px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          background: #ffffff;
          padding: 6px 8px;
          border-radius: 6px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .chart-bar:hover .chart-bar-value {
          opacity: 1;
        }

        .tables-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 28px;
        }

        .table-container {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid var(--card-border);
          overflow: hidden;
        }

        .table-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--card-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f9fafb;
        }

        .table-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .view-all {
          color: var(--primary-color);
          font-size: 14px;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th {
          padding: 16px 20px;
          text-align: left;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          background: #f9fafb;
          border-bottom: 1px solid var(--card-border);
        }

        .data-table td {
          padding: 16px 20px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px;
        }

        .data-table tr:last-child td {
          border-bottom: none;
        }

        .data-table tr:hover td {
          background: var(--hover-bg);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar-small {
          width: 40px;
          height: 40px;
          background: #000000;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #ffffff;
          font-size: 16px;
          flex-shrink: 0;
        }

        .user-name {
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }

        .user-email {
          font-size: 13px;
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          border: 1px solid transparent;
          min-width: 80px;
          justify-content: center;
          white-space: nowrap;
        }

        .action-button {
          padding: 8px 16px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .action-button.activate {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #dcfce7;
        }

        .action-button.activate:hover {
          background: #166534;
          color: #ffffff;
        }

        .action-button.deactivate {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fee2e2;
        }

        .action-button.deactivate:hover {
          background: #991b1b;
          color: #ffffff;
        }

        /* ====== CARDS 3 PAR LIGNE ====== */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 24px;
          border: 1px solid var(--card-border);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
          border-color: #000000;
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000000;
          color: #ffffff;
        }

        .stat-value {
          font-size: 36px;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        /* ====== PROFIL ADMIN ====== */
        .profile-container {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid var(--card-border);
          overflow: hidden;
        }

        .profile-cover {
          height: 100px;
          background: linear-gradient(135deg, #000000 0%, #333333 100%);
        }

        .profile-content {
          padding: 0 32px 32px;
          margin-top: -50px;
        }

        .profile-avatar-large {
          width: 100px;
          height: 100px;
          background: #ffffff;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000000;
          font-size: 40px;
          font-weight: 800;
          border: 4px solid white;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .profile-name {
          font-size: 28px;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .profile-role {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: #f3f4f6;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 24px;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        .profile-field {
          margin-bottom: 16px;
        }

        .profile-label {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .profile-value {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-primary);
          padding: 12px 16px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid var(--card-border);
        }

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
          .sidebar {
            position: fixed;
            left: ${sidebarOpen ? '0' : '-280px'};
            height: 100vh;
          }
          .sidebar-overlay {
            display: ${sidebarOpen ? 'block' : 'none'};
          }
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .kpis-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
          .kpis-grid {
            grid-template-columns: 1fr;
          }
          .profile-grid {
            grid-template-columns: 1fr;
          }
          .user-details-topbar {
            display: none;
          }
          .charts-grid {
            grid-template-columns: 1fr;
          }
          .search-bar {
            display: none;
          }
        }
        `}
      </style>

      <div className="dashboard-container">
        {/* Overlay mobile */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ====== SIDEBAR ====== */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="logo-container">
              <div className="logo-image">
                <img src={logoImage} alt="Sign App Logo" />
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

          {/* MENU SIMPLIFIÉ - 4 ITEMS SEULEMENT */}
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
              {adminData.avatar}
            </div>
            <div className="user-details-sidebar">
              <div className="user-name-sidebar">{adminData.name}</div>
              <div className="user-role-sidebar">{adminData.role}</div>
            </div>
          </div>
        </div>

        {/* ====== MAIN CONTENT ====== */}
        <div className="main-content">
          <div className="topbar">
            <h1 className="page-title">
              {activeMenu === "dashboard" && "Accueil"}
              {activeMenu === "users" && "Liste utilisateurs"}
              {activeMenu === "profile" && "Mon profil"}
            </h1>
            <div className="topbar-right">
              <div className="search-bar">
                <Search className="search-icon" size={20} />
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Rechercher utilisateurs, factures..."
                />
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
                      {adminData.avatar}
                    </div>
                    <div className="user-details-topbar">
                      <div className="user-name-topbar">{adminData.name}</div>
                      <div className="user-role-topbar">{adminData.role}</div>
                    </div>
                  </div>
                  <ChevronDown className={`dropdown-arrow ${userDropdownOpen ? 'open' : ''}`} size={18} />
                </button>
                
                <div className="user-dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-user-name">{adminData.name}</div>
                    <div className="dropdown-user-email">{adminData.email}</div>
                  </div>
                  <div className="dropdown-menu-items">
                    <div className="dropdown-item" onClick={() => setActiveMenu("profile")}>
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
            {/* ====== PAGE ACCUEIL - DASHBOARD AVEC 3 KPIS ====== */}
            {activeMenu === "dashboard" && (
              <>
                {/* Header with filters */}
                <div className="dashboard-header">
                  <div>
                    <h2 className="header-title">Supervision Plateforme</h2>
                    <p className="header-subtitle">
                      Vue d'ensemble des utilisateurs et factures
                    </p>
                  </div>
                  <div className="filters-container">
                    <div className="period-selector">
                      {periodOptions.map(period => (
                        <button
                          key={period.id}
                          className={`period-btn ${selectedPeriod === period.id ? 'active' : ''}`}
                          onClick={() => setSelectedPeriod(period.id)}
                        >
                          {period.id}
                        </button>
                      ))}
                    </div>
                    <button className="refresh-btn">
                      <RefreshCw size={16} />
                      Actualiser
                    </button>
                  </div>
                </div>

                {/* Tabs navigation */}
                <div className="tabs-navigation">
                  {tabOptions.map(tab => (
                    <button
                      key={tab.id}
                      className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <tab.icon size={18} />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* 3 KPIs Grid */}
                <div className="kpis-grid">
                  {kpiConfigs.map((kpi, index) => (
                    <div className="kpi-card" key={index}>
                      <div className="kpi-header">
                        <div>
                          <div className="kpi-value">{getKPIValue(kpi.key)}</div>
                          <div className="kpi-label">{kpi.label}</div>
                          <div className={`kpi-trend ${kpi.trend.startsWith('+') ? 'trend-up' : 'trend-down'}`}>
                            {kpi.trend.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            <span>{kpi.trend} ce mois</span>
                          </div>
                        </div>
                        <div className="kpi-icon-wrapper">
                          <kpi.icon size={24} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Graphiques */}
                <div className="charts-grid">
                  <div className="chart-container">
                    <div className="chart-header">
                      <h3 className="chart-title">
                        Évolution {selectedPeriod === "Mois" ? "Mensuelle" : "Annuelle"}
                      </h3>
                      <select 
                        className="chart-selector" 
                        value={selectedChartData}
                        onChange={(e) => setSelectedChartData(e.target.value)}
                      >
                        <option value="users">Utilisateurs</option>
                        <option value="factures">Factures</option>
                        <option value="invoices">Montants (kFCFA)</option>
                      </select>
                    </div>
                    <div className="chart-placeholder">
                      <div className="chart-bars">
                        {getChartData().map((item, index) => {
                          const maxValue = getMaxValue();
                          const heightPercentage = (item.value / maxValue) * 100;
                          return (
                            <div 
                              key={index} 
                              className="chart-bar" 
                              style={{ height: `${heightPercentage}%` }}
                            >
                              <div className="chart-bar-value">
                                {selectedChartData === "invoices" 
                                  ? `${item.value.toFixed(0)}K` 
                                  : item.value}
                              </div>
                              <div className="chart-bar-label">{item.label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="chart-container">
                    <div className="chart-header">
                      <h3 className="chart-title">Répartition</h3>
                    </div>
                    <div className="chart-placeholder" style={{ 
                      flexDirection: 'column', 
                      gap: '20px', 
                      padding: '20px',
                      justifyContent: 'flex-start'
                    }}>
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '15px', fontWeight: '700' }}>Utilisateurs</span>
                          <span style={{ fontSize: '15px', fontWeight: '800' }}>
                            {formatNumber(dashboardData.totalUsers)}
                          </span>
                        </div>
                        <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: '#000000', width: '100%', borderRadius: '6px' }} />
                        </div>
                      </div>
                      
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '15px', fontWeight: '700' }}>Factures</span>
                          <span style={{ fontSize: '15px', fontWeight: '800' }}>
                            {formatNumber(dashboardData.totalFactures)}
                          </span>
                        </div>
                        <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ 
                            height: '100%', 
                            background: '#333333', 
                            width: `${(dashboardData.totalFactures / 1000) * 100}%`, 
                            borderRadius: '6px' 
                          }} />
                        </div>
                      </div>
                      
                      <div style={{ width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '15px', fontWeight: '700' }}>Montant (kFCFA)</span>
                          <span style={{ fontSize: '15px', fontWeight: '800' }}>
                            {formatNumber(dashboardData.totalInvoices / 1000)}K
                          </span>
                        </div>
                        <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '6px', overflow: 'hidden' }}>
                          <div style={{ 
                            height: '100%', 
                            background: '#666666', 
                            width: `${(dashboardData.totalInvoices / 50000) * 100}%`, 
                            borderRadius: '6px' 
                          }} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Derniers utilisateurs actifs */}
                <div className="tables-grid">
                  <div className="table-container">
                    <div className="table-header">
                      <h3 className="table-title">
                        <Users size={18} />
                        Derniers Utilisateurs Actifs
                      </h3>
                      <div className="view-all">
                        <span>Voir tout</span>
                        <Eye size={14} />
                      </div>
                    </div>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '45%' }}>Utilisateur</th>
                          <th style={{ width: '25%' }}>Dernière activité</th>
                          <th style={{ width: '30%' }}>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentActiveUsers.map(user => (
                          <tr key={user.id}>
                            <td>
                              <div className="user-info">
                                <div className="user-avatar-small">
                                  {user.name.charAt(0)}
                                </div>
                                <div style={{ minWidth: 0 }}>
                                  <div className="user-name" title={user.name}>{user.name}</div>
                                  <div className="user-email" title={user.email}>{user.email}</div>
                                  <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', fontWeight: '500' }}>{user.role}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{ fontWeight: '500' }}>{user.lastActive}</td>
                            <td>
                              <span 
                                className="status-badge"
                                style={{
                                  background: statusColors[user.status].bg,
                                  color: statusColors[user.status].text,
                                  borderColor: statusColors[user.status].border
                                }}
                              >
                                {user.status === "online" ? <Check size={12} /> : <EyeOff size={12} />}
                                {user.status === "online" ? "En ligne" : "Hors ligne"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ====== PAGE UTILISATEURS - TABLEAU AVEC ACTIVER/DÉSACTIVER ====== */}
            {activeMenu === "users" && (
              <>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
                  Gestion des utilisateurs
                </h2>
                <div className="table-container">
                  <div className="table-header">
                    <h3 className="table-title">
                      <Users size={18} />
                      Liste des utilisateurs
                    </h3>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Rôle</th>
                        <th>Date d'inscription</th>
                        <th>Statut</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboardData.usersList.map(user => (
                        <tr key={user.id}>
                          <td><span className="user-name">{user.nom}</span></td>
                          <td>{user.prenom}</td>
                          <td><span className="user-email">{user.email}</span></td>
                          <td>{user.telephone}</td>
                          <td>{user.role}</td>
                          <td>{user.dateInscription}</td>
                          <td>
                            <span 
                              className="status-badge"
                              style={{
                                background: statusColors[user.status].bg,
                                color: statusColors[user.status].text,
                                borderColor: statusColors[user.status].border
                              }}
                            >
                              {user.status === "actif" ? <Check size={12} /> : <XIcon size={12} />}
                              {user.status === "actif" ? "Actif" : "Inactif"}
                            </span>
                          </td>
                          <td>
                            {user.status === "actif" ? (
                              <button className="action-button deactivate" onClick={() => handleToggleUserStatus(user.id)}>
                                <XIcon size={14} />
                                Désactiver
                              </button>
                            ) : (
                              <button 
                                className="action-button activate"
                                onClick={() => handleToggleUserStatus(user.id)}
                              >
                                <Check size={14} />
                                Activer
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ====== PAGE PROFIL ====== */}
            {activeMenu === "profile" && (
              <>
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
                  Mon profil
                </h2>
                <div className="profile-container">
                  <div className="profile-cover" />
                  <div className="profile-content">
                    <div className="profile-avatar-large">
                      {adminData.avatar}
                    </div>
                    <div className="profile-name">{adminData.name}</div>
                    <div className="profile-role">
                      <Shield size={16} />
                      {adminData.role}
                    </div>
                    
                    <div className="profile-grid">
                      <div className="profile-field">
                        <div className="profile-label">Email</div>
                        <div className="profile-value">{adminData.email}</div>
                      </div>
                      <div className="profile-field">
                        <div className="profile-label">Téléphone</div>
                        <div className="profile-value">{adminData.phone}</div>
                      </div>
                      <div className="profile-field">
                        <div className="profile-label">Date d'inscription</div>
                        <div className="profile-value">{adminData.createdAt}</div>
                      </div>
                      <div className="profile-field">
                        <div className="profile-label">Dernière connexion</div>
                        <div className="profile-value">{adminData.lastLogin}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}