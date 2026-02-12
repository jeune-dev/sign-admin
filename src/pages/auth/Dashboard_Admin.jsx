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
  const [selectedPeriod, setSelectedPeriod] = useState("7j");
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

  // ============ DONNÉES PRINCIPALES ============
  const [dashboardData, setDashboardData] = useState({
    // KPIs pour les nouvelles cards
    totalUsers: 12547,
    totalContracts: 124586,
    totalInvoices: 45321,
    
    // Liste des utilisateurs pour la nouvelle table
    usersList: [
      { id: 1, nom: "Gueye", prenom: "Alassane", email: "alassane@entreprise.sn", telephone: "+221 77 123 45 67", role: "Administrateur", status: "actif", dateInscription: "15/01/2024" },
      { id: 2, nom: "Thiam", prenom: "Ibnou", email: "ibnou@tech.sn", telephone: "+221 78 234 56 78", role: "Utilisateur Premium", status: "actif", dateInscription: "20/01/2024" },
      { id: 3, nom: "Beye", prenom: "Balla", email: "balla@legal.sn", telephone: "+221 76 345 67 89", role: "Utilisateur Standard", status: "inactif", dateInscription: "05/02/2024" },
      { id: 4, nom: "Diao", prenom: "Aboubekrine", email: "aboubekrine@startup.sn", telephone: "+221 77 456 78 90", role: "Administrateur", status: "actif", dateInscription: "12/02/2024" },
      { id: 5, nom: "Ndoye", prenom: "Adama", email: "adama@consulting.sn", telephone: "+221 78 567 89 01", role: "Utilisateur Premium", status: "actif", dateInscription: "28/02/2024" }
    ],

    // ============ ANCIENNES DONNÉES ============
    user: {
      name: "Admin Système",
      email: "admin@signapp.com",
      role: "Super Administrateur",
      avatar: "SA"
    },
    
    // KPIs Principaux (anciens)
    kpis: {
      totalUsers: 12547,
      activeUsers: 8923,
      totalDocuments: 124586,
      signedDocuments: 98452,
      pendingDocuments: 2134,
      totalPayments: 4523789,
      activeSubscriptions: 7452,
      securityAlerts: 23
    },

    // Statistiques par jour (7 derniers jours)
    dailyStats: [
      { date: "Lun", users: 245, documents: 1876, signatures: 1523, payments: 12500 },
      { date: "Mar", users: 312, documents: 2145, signatures: 1789, payments: 18700 },
      { date: "Mer", users: 289, documents: 1987, signatures: 1654, payments: 15400 },
      { date: "Jeu", users: 356, documents: 2456, signatures: 2012, payments: 23100 },
      { date: "Ven", users: 412, documents: 2876, signatures: 2345, payments: 29800 },
      { date: "Sam", users: 187, documents: 1456, signatures: 1198, payments: 8900 },
      { date: "Dim", users: 156, documents: 1234, signatures: 987, payments: 6700 }
    ],

    // Derniers utilisateurs actifs - Noms sénégalais
    recentActiveUsers: [
      { id: 1, name: "Alassane Gueye", email: "alassane@entreprise.sn", lastActive: "Il y a 5 min", status: "online", role: "Administrateur" },
      { id: 2, name: "Ibnou Thiam", email: "ibnou@tech.sn", lastActive: "Il y a 12 min", status: "online", role: "Utilisateur Premium" },
      { id: 3, name: "Balla Beye", email: "balla@legal.sn", lastActive: "Il y a 25 min", status: "offline", role: "Utilisateur Standard" },
      { id: 4, name: "Aboubekrine Diao", email: "aboubekrine@startup.sn", lastActive: "Il y a 1h", status: "online", role: "Administrateur" },
      { id: 5, name: "Adama Ndoye", email: "adama@consulting.sn", lastActive: "Il y a 2h", status: "offline", role: "Utilisateur Premium" }
    ],

    // Derniers abonnements
    recentSubscriptions: [
      { id: 1, user: "Entreprise A", plan: "Premium Annuel", amount: 299900, date: "15/03/2024", status: "active" },
      { id: 2, user: "Startup B", plan: "Business Mensuel", amount: 49900, date: "14/03/2024", status: "active" },
      { id: 3, user: "Société C", plan: "Enterprise", amount: 899900, date: "13/03/2024", status: "pending" },
      { id: 4, user: "Freelance D", plan: "Standard", amount: 19900, date: "12/03/2024", status: "active" },
      { id: 5, user: "Agence E", plan: "Premium Mensuel", amount: 89900, date: "11/03/2024", status: "cancelled" }
    ],

    // Documents les plus utilisés
    popularDocuments: [
      { id: 1, name: "Contrat de Service", count: 4521, category: "Services", color: "#000000" },
      { id: 2, name: "NDA Standard", count: 3876, category: "Confidentialité", color: "#333333" },
      { id: 3, name: "Contrat de Travail", count: 2987, category: "RH", color: "#666666" },
      { id: 4, name: "Devis Commercial", count: 2456, category: "Commercial", color: "#999999" },
      { id: 5, name: "Convention de Partenariat", count: 1876, category: "Partnership", color: "#cccccc" }
    ],

    // Paiements récents - Modes de paiement Sénégal
    recentPayments: [
      { id: 1, user: "Compagnie X", amount: 299900, method: "Wave", date: "15/03/2024", status: "completed", methodIcon: SmartphoneIcon },
      { id: 2, user: "Entreprise Y", amount: 89900, method: "Orange Money", date: "15/03/2024", status: "completed", methodIcon: SmartphoneIcon },
      { id: 3, user: "Société Z", amount: 49900, method: "Carte Bancaire", date: "14/03/2024", status: "pending", methodIcon: CreditCard },
      { id: 4, user: "Startup W", amount: 19900, method: "Free Money", date: "14/03/2024", status: "completed", methodIcon: SmartphoneIcon },
      { id: 5, user: "Freelance V", amount: 899900, method: "Virement", date: "13/03/2024", status: "completed", methodIcon: Wallet }
    ],

    // Alertes de sécurité
    securityAlerts: [
      { id: 1, type: "Tentative de connexion", user: "user@unknown.sn", time: "10:23", severity: "high" },
      { id: 2, type: "Modification de rôle", user: "admin@company.sn", time: "09:45", severity: "medium" },
      { id: 3, type: "Accès document sensible", user: "employee@company.sn", time: "08:12", severity: "low" },
      { id: 4, type: "Signature invalide", user: "client@external.sn", time: "Hier 15:30", severity: "high" }
    ]
  });

  // ============ MENU SIMPLIFIÉ (4 ITEMS SEULEMENT) ============
  const menuItems = [
    { id: "dashboard", label: "Accueil", icon: Home, color: "#ffffff" },
    { id: "users", label: "Les utilisateurs", icon: Users, color: "#ffffff" },
    { id: "profile", label: "Profils", icon: User, color: "#ffffff" },
    { id: "logout", label: "Déconnexion", icon: LogOut, color: "#ffffff" }
  ];

  // ============ ANCIENS MENU ITEMS (GARDÉS POUR RÉFÉRENCE) ============
  const oldMenuItems = [
    { id: "dashboard", label: "Tableau de bord", icon: Home, color: "#ffffff" },
    { id: "users", label: "Gestion Utilisateurs", icon: Users, color: "#ffffff" },
    { id: "documents", label: "Supervision Documents", icon: FileText, color: "#ffffff" },
    { id: "signatures", label: "Signatures & Horodatage", icon: FileSignature, color: "#ffffff" },
    { id: "ai", label: "Génération IA", icon: Zap, color: "#ffffff" },
    { id: "payments", label: "Paiements & Abonnements", icon: CreditCard, color: "#ffffff" },
    { id: "analytics", label: "Statistiques", icon: BarChart3, color: "#ffffff" },
    { id: "security", label: "Sécurité & Conformité", icon: Shield, color: "#ffffff" },
    { id: "support", label: "Support & Réclamations", icon: Headphones, color: "#ffffff" },
    { id: "settings", label: "Configuration", icon: Settings, color: "#ffffff" },
  ];

  const periodOptions = [
    { id: "7j", label: "7 derniers jours" },
    { id: "30j", label: "30 derniers jours" },
    { id: "90j", label: "90 derniers jours" },
    { id: "1a", label: "Cette année" }
  ];

  const tabOptions = [
    { id: "users", label: "Utilisateurs", icon: UsersIcon, color: "#000000" },
    { id: "documents", label: "Documents", icon: FileText, color: "#000000" },
    { id: "payments", label: "Paiements", icon: CreditCard, color: "#000000" },
    { id: "security", label: "Sécurité", icon: Shield, color: "#000000" }
  ];

  // ============ COULEURS STATUT ============
  const statusColors = {
    "actif": { bg: "#f0fdf4", text: "#166534", border: "#dcfce7" },
    "inactif": { bg: "#fef2f2", text: "#991b1b", border: "#fee2e2" },
    "online": { bg: "#f3f4f6", text: "#000000", border: "#e5e7eb", icon: "#000000" },
    "offline": { bg: "#f9fafb", text: "#666666", border: "#f3f4f6", icon: "#666666" },
    "active": { bg: "#f3f4f6", text: "#000000", border: "#e5e7eb", icon: "#000000" },
    "pending": { bg: "#fefce8", text: "#92400e", border: "#fef9c3", icon: "#92400e" },
    "cancelled": { bg: "#fef2f2", text: "#991b1b", border: "#fee2e2", icon: "#991b1b" },
    "completed": { bg: "#f0fdf4", text: "#166534", border: "#dcfce7", icon: "#166534" },
    "high": { bg: "#fef2f2", text: "#991b1b", border: "#fee2e2", icon: "#991b1b" },
    "medium": { bg: "#fefce8", text: "#92400e", border: "#fef9c3", icon: "#92400e" },
    "low": { bg: "#eff6ff", text: "#1e40af", border: "#dbeafe", icon: "#1e40af" }
  };

  const kpiConfigs = [
    { key: "totalUsers", label: "Utilisateurs Totaux", icon: Users, color: "#000000", trend: "+12%" },
    { key: "activeUsers", label: "Utilisateurs Actifs", icon: UserCheck, color: "#000000", trend: "+8%" },
    { key: "totalDocuments", label: "Documents Traités", icon: FileText, color: "#000000", trend: "+15%" },
    { key: "signedDocuments", label: "Signatures Validées", icon: FileCheck, color: "#000000", trend: "+18%" },
    { key: "totalPayments", label: "Chiffre d'Affaires", icon: CreditCard, color: "#000000", trend: "+22%" },
    { key: "activeSubscriptions", label: "Abonnements Actifs", icon: Activity, color: "#000000", trend: "+5%" },
    { key: "pendingDocuments", label: "Documents En Attente", icon: Clock, color: "#000000", trend: "-3%" },
    { key: "securityAlerts", label: "Alertes Sécurité", icon: Shield, color: "#000000", trend: "-8%" }
  ];

  // ============ FONCTIONNALITÉ 1: MESSAGE DE CONNEXION ============
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

  // ============ FONCTIONNALITÉ 5: DÉCONNEXION ============
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

  // ============ FONCTIONNALITÉ 4: ACTIVER/DÉSACTIVER UTILISATEUR ============
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

  // ============ GESTIONNAIRE DE MENU ============
  const handleMenuClick = (menuId) => {
    if (menuId === 'logout') {
      handleLogout();
    } else {
      setActiveMenu(menuId);
    }
  };

  // ============ FORMATAGE ============
  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(amount);
  };

  const getKPIValue = (key) => {
    if (key === "totalPayments") return `${formatNumber(dashboardData.kpis[key] / 1000)}K FCFA`;
    return formatNumber(dashboardData.kpis[key]);
  };

  const getSeverityIcon = (severity) => {
    return <AlertTriangle size={14} />;
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
          background: #ffffff;
          color: var(--text-primary);
          font-size: 15px;
        }

        .dashboard-container {
          display: flex;
          width: 100vw;
          height: 100vh;
          background: #ffffff;
          overflow: hidden;
        }

        /* ====== SIDEBAR ====== */
        .sidebar {
          width: ${sidebarOpen ? '280px' : '80px'};
          background: var(--sidebar-bg);
          border-right: 1px solid #333333;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 40;
          position: relative;
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
          border: 2px solid rgba(255, 255, 255, 0.1);
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
          transition: all 0.3s ease;
        }

        .menu-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
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
          transform: translateX(4px);
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
          border: 2px solid rgba(255, 255, 255, 0.2);
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
          min-width: 0;
          background: #ffffff;
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
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          flex-shrink: 0;
        }

        .page-title {
          font-size: 22px;
          font-weight: 800;
          color: var(--text-primary);
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
          transform: scale(1.05);
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
          transition: all 0.3s ease;
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
          animation: dropdownFade 0.2s ease;
        }

        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
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
          margin-bottom: 4px;
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
          background: #ffffff;
        }

        /* ====== SECTION DIVIDER ====== */
        .section-divider {
          margin: 40px 0 20px;
          border-top: 2px solid var(--card-border);
          position: relative;
        }

        .section-divider-title {
          position: absolute;
          top: -14px;
          left: 20px;
          background: #ffffff;
          padding: 0 20px;
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }

        /* ====== NOUVELLES CARDS (3 PAR LIGNE) ====== */
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

        /* ====== NOUVELLE TABLE UTILISATEURS ====== */
        .table-container {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid var(--card-border);
          overflow: hidden;
          margin-bottom: 32px;
        }

        .table-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--card-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--hover-bg);
        }

        .table-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
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

        .data-table tr:hover td {
          background: var(--hover-bg);
        }

        .user-avatar-small {
          width: 40px;
          height: 40px;
          background: #000000;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          font-weight: 700;
          font-size: 16px;
        }

        .user-name {
          font-weight: 700;
          color: var(--text-primary);
        }

        .user-email {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 13px;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          gap: 6px;
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

        /* ====== PROFIL ADMIN ====== */
        .profile-container {
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid var(--card-border);
          overflow: hidden;
          margin-bottom: 32px;
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

        /* ====== ANCIENS STYLES ====== */
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
          font-weight: 500;
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
          color: var(--text-primary);
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
          background: var(--hover-bg);
        }

        .tab-btn.active {
          color: var(--text-primary);
          border-bottom-color: #000000;
        }

        .kpis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 28px;
        }

        .kpi-card {
          background: #ffffff;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid var(--card-border);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
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

        .kpi-card:hover .kpi-icon-wrapper {
          background: #000000;
          color: #ffffff;
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
          font-weight: 600;
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

        .trend-up { color: #000000; }
        .trend-down { color: #666666; }

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

        .tables-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
          gap: 24px;
          margin-bottom: 28px;
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

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .document-count {
          font-weight: 800;
          color: var(--text-primary);
          font-size: 15px;
        }

        .payment-amount {
          font-weight: 800;
          color: var(--text-primary);
          font-size: 15px;
        }

        .payment-method {
          font-size: 13px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .quick-actions {
          background: #ffffff;
          border-radius: 12px;
          padding: 28px;
          border: 1px solid var(--card-border);
          margin-top: 28px;
        }

        .actions-title {
          font-size: 22px;
          font-weight: 900;
          color: var(--text-primary);
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #f9fafb;
          border: 1px solid var(--card-border);
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: #000000;
          border-color: #000000;
          transform: translateY(-4px);
        }

        .action-btn:hover .action-text {
          color: #ffffff;
        }

        .action-icon {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: #000000;
          flex-shrink: 0;
        }

        .action-btn:hover .action-icon {
          background: #ffffff;
          color: #000000;
        }

        .action-text {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          transition: color 0.3s ease;
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
          cursor: pointer;
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

        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 45;
          backdrop-filter: blur(4px);
        }

        @media (max-width: 1200px) {
          .sidebar {
            position: fixed;
            left: ${sidebarOpen ? '0' : '-280px'};
            height: 100vh;
            z-index: 50;
          }
          .sidebar-overlay {
            display: ${sidebarOpen ? 'block' : 'none'};
          }
          .charts-grid {
            grid-template-columns: 1fr;
          }
          .tables-grid {
            grid-template-columns: 1fr;
          }
          .cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
          .profile-grid {
            grid-template-columns: 1fr;
          }
          .user-details-topbar {
            display: none;
          }
          .kpis-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .kpis-grid {
            grid-template-columns: 1fr;
          }
        }

        .kpi-card, .chart-container, .table-container, .quick-actions {
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
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
              {activeMenu === "users" && "Les utilisateurs"}
              {activeMenu === "profile" && "Mon profil"}
            </h1>
            <div className="topbar-right">
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
            {/* ====== PAGE ACCUEIL ====== */}
            {activeMenu === "dashboard" && (
              <>
                {/* ====== NOUVELLES FONCTIONNALITÉS ====== */}
                <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>
                  Vue d'ensemble
                </h2>
                <div className="cards-grid">
                  <div className="stat-card">
                    <div className="stat-header">
                      <div className="stat-icon">
                        <Users size={28} />
                      </div>
                    </div>
                    <div className="stat-value">{formatNumber(dashboardData.totalUsers)}</div>
                    <div className="stat-label">Nombre d'utilisateurs</div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-header">
                      <div className="stat-icon">
                        <FileText size={28} />
                      </div>
                    </div>
                    <div className="stat-value">{formatNumber(dashboardData.totalContracts)}</div>
                    <div className="stat-label">Nombre de contrats</div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-header">
                      <div className="stat-icon">
                        <DollarSign size={28} />
                      </div>
                    </div>
                    <div className="stat-value">{formatNumber(dashboardData.totalInvoices)}</div>
                    <div className="stat-label">Nombre de factures</div>
                  </div>
                </div>

                {/* ====== ANCIEN CONTENU ====== */}
                <div className="section-divider">
                  <span className="section-divider-title">Supervision Plateforme</span>
                </div>

                {/* Header with filters */}
                <div className="dashboard-header">
                  <div>
                    <h2 className="header-title">Supervision Plateforme</h2>
                    <p className="header-subtitle">
                      Vue d'ensemble complète de l'activité de la plateforme
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

                {/* KPIs Grid */}
                <div className="kpis-grid">
                  {kpiConfigs.map((kpi, index) => (
                    <div className="kpi-card" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
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

                {/* Charts Grid */}
                <div className="charts-grid">
                  <div className="chart-container" style={{ animationDelay: '0.8s' }}>
                    <div className="chart-header">
                      <h3 className="chart-title">Activité Journalière</h3>
                      <select className="chart-selector" defaultValue="signatures">
                        <option value="users">Utilisateurs</option>
                        <option value="documents">Documents</option>
                        <option value="signatures">Signatures</option>
                        <option value="payments">Paiements</option>
                      </select>
                    </div>
                    <div className="chart-placeholder">
                      <div className="chart-bars">
                        {dashboardData.dailyStats.map((stat, index) => (
                          <div 
                            key={index} 
                            className="chart-bar" 
                            style={{ height: `${(stat.signatures / 2500) * 100}%` }}
                          >
                            <div className="chart-bar-value">{stat.signatures}</div>
                            <div className="chart-bar-label">{stat.date}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="chart-container" style={{ animationDelay: '0.9s' }}>
                    <div className="chart-header">
                      <h3 className="chart-title">Documents Populaires</h3>
                    </div>
                    <div className="chart-placeholder" style={{ flexDirection: 'column', gap: '16px', padding: '20px' }}>
                      {dashboardData.popularDocuments.map(doc => (
                        <div key={doc.id} style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)' }}>
                              {doc.name}
                            </span>
                            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>
                              {doc.count.toLocaleString()}
                            </span>
                          </div>
                          <div style={{ height: '10px', background: '#f3f4f6', borderRadius: '6px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: doc.color, width: `${(doc.count / 5000) * 100}%`, borderRadius: '6px' }} />
                          </div>
                          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px', fontWeight: '500' }}>
                            {doc.category}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tables Grid */}
                <div className="tables-grid">
                  {/* Derniers utilisateurs actifs */}
                  <div className="table-container" style={{ animationDelay: '1s' }}>
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

                  {/* Derniers abonnements */}
                  <div className="table-container" style={{ animationDelay: '1.1s' }}>
                    <div className="table-header">
                      <h3 className="table-title">
                        <CreditCard size={18} />
                        Derniers Abonnements
                      </h3>
                      <div className="view-all">
                        <span>Voir tout</span>
                        <Eye size={14} />
                      </div>
                    </div>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '40%' }}>Client</th>
                          <th style={{ width: '30%' }}>Montant</th>
                          <th style={{ width: '30%' }}>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentSubscriptions.map(sub => (
                          <tr key={sub.id}>
                            <td>
                              <div className="user-name" title={sub.user}>{sub.user}</div>
                              <div className="user-email" title={sub.plan} style={{ fontWeight: '500' }}>{sub.plan}</div>
                              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', fontWeight: '500' }}>{sub.date}</div>
                            </td>
                            <td>
                              <div className="payment-amount">{formatCurrency(sub.amount)}</div>
                            </td>
                            <td>
                              <span 
                                className="status-badge"
                                style={{
                                  background: statusColors[sub.status].bg,
                                  color: statusColors[sub.status].text,
                                  borderColor: statusColors[sub.status].border
                                }}
                              >
                                {sub.status === "active" ? <Check size={12} /> : 
                                 sub.status === "pending" ? <Clock size={12} /> : 
                                 <XIcon size={12} />}
                                {sub.status === "active" ? "Actif" : 
                                 sub.status === "pending" ? "En attente" : 
                                 "Annulé"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Paiements récents et Alertes de sécurité */}
                <div className="tables-grid">
                  {/* Paiements récents */}
                  <div className="table-container" style={{ animationDelay: '1.2s' }}>
                    <div className="table-header">
                      <h3 className="table-title">
                        <DollarSign size={18} />
                        Paiements Récents
                      </h3>
                      <div className="view-all">
                        <span>Voir tout</span>
                        <Eye size={14} />
                      </div>
                    </div>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '40%' }}>Client</th>
                          <th style={{ width: '30%' }}>Montant</th>
                          <th style={{ width: '30%' }}>Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentPayments.map(payment => {
                          const MethodIcon = payment.methodIcon || CreditCard;
                          return (
                            <tr key={payment.id}>
                              <td>
                                <div className="user-name" title={payment.user}>{payment.user}</div>
                                <div className="payment-method" title={payment.method} style={{ fontWeight: '500' }}>
                                  <MethodIcon size={12} />
                                  {payment.method}
                                </div>
                                <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', fontWeight: '500' }}>{payment.date}</div>
                              </td>
                              <td>
                                <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                              </td>
                              <td>
                                <span 
                                  className="status-badge"
                                  style={{
                                    background: statusColors[payment.status].bg,
                                    color: statusColors[payment.status].text,
                                    borderColor: statusColors[payment.status].border
                                  }}
                                >
                                  {payment.status === "completed" ? <Check size={12} /> : <Clock size={12} />}
                                  {payment.status === "completed" ? "Complété" : "En attente"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Alertes de sécurité */}
                  <div className="table-container" style={{ animationDelay: '1.3s' }}>
                    <div className="table-header">
                      <h3 className="table-title">
                        <Shield size={18} />
                        Alertes de Sécurité
                      </h3>
                      <div className="view-all">
                        <span>Voir tout</span>
                        <Eye size={14} />
                      </div>
                    </div>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '40%' }}>Type</th>
                          <th style={{ width: '40%' }}>Utilisateur</th>
                          <th style={{ width: '20%' }}>Sévérité</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.securityAlerts.map(alert => (
                          <tr key={alert.id}>
                            <td>
                              <div className="user-name" title={alert.type}>{alert.type}</div>
                              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px', fontWeight: '500' }}>{alert.time}</div>
                            </td>
                            <td>
                              <div className="user-email" title={alert.user} style={{ fontWeight: '500' }}>{alert.user}</div>
                            </td>
                            <td>
                              <span 
                                className="status-badge"
                                style={{
                                  background: statusColors[alert.severity].bg,
                                  color: statusColors[alert.severity].text,
                                  borderColor: statusColors[alert.severity].border
                                }}
                              >
                                {getSeverityIcon(alert.severity)}
                                {alert.severity === "high" ? "Haute" : 
                                 alert.severity === "medium" ? "Moyenne" : 
                                 "Basse"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions" style={{ animationDelay: '1.4s' }}>
                  <h3 className="actions-title">
                    <Zap size={22} />
                    Actions Administratives Rapides
                  </h3>
                  <div className="actions-grid">
                    <div className="action-btn">
                      <div className="action-icon">
                        <Users size={22} />
                      </div>
                      <div className="action-text">Gérer utilisateurs</div>
                    </div>
                    <div className="action-btn">
                      <div className="action-icon">
                        <FileCheck size={22} />
                      </div>
                      <div className="action-text">Valider documents</div>
                    </div>
                    <div className="action-btn">
                      <div className="action-icon">
                        <CreditCard size={22} />
                      </div>
                      <div className="action-text">Gérer abonnements</div>
                    </div>
                    <div className="action-btn">
                      <div className="action-icon">
                        <Shield size={22} />
                      </div>
                      <div className="action-text">Audit sécurité</div>
                    </div>
                    <div className="action-btn">
                      <div className="action-icon">
                        <FileX size={22} />
                      </div>
                      <div className="action-text">Invalider documents</div>
                    </div>
                    <div className="action-btn">
                      <div className="action-icon">
                        <BarChart3 size={22} />
                      </div>
                      <div className="action-text">Rapports détaillés</div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ====== PAGE UTILISATEURS ====== */}
            {activeMenu === "users" && (
              <>
                {/* ====== NOUVELLE TABLE UTILISATEURS ====== */}
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
                              <button 
                                className="action-button deactivate"
                                onClick={() => handleToggleUserStatus(user.id)}
                              >
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

                {/* ====== ANCIEN CONTENU UTILISATEURS ====== */}
                <div className="section-divider">
                  <span className="section-divider-title">Ancienne vue</span>
                </div>
                
                <div className="table-container">
                  <div className="table-header">
                    <h3 className="table-title">
                      <Users size={18} />
                      Derniers Utilisateurs Actifs
                    </h3>
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Utilisateur</th>
                        <th>Dernière activité</th>
                        <th>Statut</th>
                        <th>Rôle</th>
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
                              <div>
                                <div className="user-name">{user.name}</div>
                                <div className="user-email">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{user.lastActive}</td>
                          <td>
                            <span 
                              className="status-badge"
                              style={{
                                background: statusColors[user.status].bg,
                                color: statusColors[user.status].text,
                                borderColor: statusColors[user.status].border
                              }}
                            >
                              {user.status === "online" ? "En ligne" : "Hors ligne"}
                            </span>
                          </td>
                          <td>{user.role}</td>
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
                {/* ====== NOUVEAU PROFIL ====== */}
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

                {/* ====== ANCIEN PROFIL ====== */}
                <div className="section-divider">
                  <span className="section-divider-title">Ancien profil</span>
                </div>
                
                <div className="profile-container">
                  <div className="table-header">
                    <h3 className="table-title">
                      <User size={18} />
                      Informations administrateur
                    </h3>
                  </div>
                  <div style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                      <div className="user-avatar-small" style={{ width: 60, height: 60, fontSize: 24 }}>
                        {dashboardData.user.avatar}
                      </div>
                      <div>
                        <div style={{ fontSize: 20, fontWeight: 800 }}>{dashboardData.user.name}</div>
                        <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{dashboardData.user.role}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Email</div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{dashboardData.user.email}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Dernière connexion</div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{new Date().toLocaleString('fr-FR')}</div>
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