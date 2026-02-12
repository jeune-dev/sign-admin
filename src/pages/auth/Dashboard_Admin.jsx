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

// Import du logo
import logoImage from "../../assets/images/logo.jpeg";

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("7j");
  const [activeTab, setActiveTab] = useState("users");
  const [notifications, setNotifications] = useState(3);

  // Données simulées pour le dashboard admin
  const [dashboardData, setDashboardData] = useState({
    user: {
      name: "Admin Système",
      email: "admin@signapp.com",
      role: "Super Administrateur",
      avatar: "SA"
    },
    
    // KPIs Principaux
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

  // Menu items spécifiques admin
  const menuItems = [
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

  const statusColors = {
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

  const getSeverityIcon = (severity) => {
    switch(severity) {
      case "high": return <AlertTriangle size={14} />;
      case "medium": return <AlertTriangle size={14} />;
      case "low": return <AlertTriangle size={14} />;
      default: return <AlertTriangle size={14} />;
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
    if (key === "totalPayments") return `${formatNumber(dashboardData.kpis[key] / 1000)}K FCFA`;
    return formatNumber(dashboardData.kpis[key]);
  };

  // Effet pour vérifier l'affichage
  useEffect(() => {
    console.log("Dashboard chargé - Sidebar ouvert:", sidebarOpen);
  }, [sidebarOpen]);

  return (
    <>
      <style>
        {`
        /* ====== Variables CSS ====== */
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
          background: #ffffff;
          color: var(--text-primary);
          font-size: 15px; /* TAILLE AUGMENTÉE */
        }

        /* ====== Layout principal ====== */
        .dashboard-container {
          display: flex;
          width: 100vw;
          height: 100vh;
          background: #ffffff;
          overflow: hidden;
        }

        /* ====== Sidebar avec fond noir et animation améliorée ====== */
        .sidebar {
          width: ${sidebarOpen ? '280px' : '80px'}; /* Largeur augmentée */
          background: var(--sidebar-bg);
          border-right: 1px solid #333333;
          display: flex;
          flex-direction: column;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Animation améliorée */
          z-index: 40;
          position: relative;
          box-shadow: ${sidebarOpen ? '2px 0 12px rgba(0, 0, 0, 0.1)' : 'none'};
        }

        /* Logo et toggle */
        .sidebar-header {
          padding: 24px; /* Augmenté */
          border-bottom: 1px solid #333333;
          display: flex;
          align-items: center;
          justify-content: ${sidebarOpen ? 'space-between' : 'center'};
          position: relative;
          z-index: 2;
          min-height: 80px; /* Hauteur augmentée */
        }

        .logo-container {
          display: flex;
          align-items: center;
          gap: 12px; /* Espacement augmenté */
          opacity: ${sidebarOpen ? '1' : '0'};
          width: ${sidebarOpen ? 'auto' : '0'};
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
        }

        .logo-image {
          width: 44px; /* Augmenté */
          height: 44px; /* Augmenté */
          border-radius: 10px; /* Augmenté */
          overflow: hidden;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }

        .logo-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 8px;
        }

        .logo-text {
          font-size: 22px; /* Augmenté */
          font-weight: 800; /* Plus gras */
          color: #ffffff;
          letter-spacing: -0.3px;
        }

        .menu-toggle {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid #333333;
          color: #ffffff;
          cursor: pointer;
          padding: 8px; /* Augmenté */
          border-radius: 8px; /* Augmenté */
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 40px; /* Augmenté */
          height: 40px; /* Augmenté */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .menu-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
          transform: scale(1.05);
        }

        .menu-toggle:active {
          transform: scale(0.95);
        }

        /* Menu principal */
        .sidebar-menu {
          flex: 1;
          padding: 20px 0; /* Augmenté */
          overflow-y: auto;
          position: relative;
          z-index: 2;
        }

        .menu-item {
          display: flex;
          align-items: center;
          gap: 14px; /* Espacement augmenté */
          padding: 16px 20px; /* Augmenté */
          color: #cccccc;
          text-decoration: none;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          margin: 0 12px 6px 12px; /* Espacement augmenté */
          border-radius: 8px; /* Augmenté */
          font-size: 15px; /* TAILLE AUGMENTÉE */
          font-weight: 500;
          position: relative;
          overflow: hidden;
        }

        .menu-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          transition: left 0.6s;
        }

        .menu-item:hover::before {
          left: 100%;
        }

        .menu-item:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #ffffff;
          transform: translateX(4px);
        }

        .menu-item.active {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          border-left: 4px solid #ffffff; /* Épaisseur augmentée */
          font-weight: 700; /* Plus gras */
          transform: translateX(0);
        }

        .menu-icon {
          width: 20px; /* Augmenté */
          height: 20px; /* Augmenté */
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }

        .menu-item:hover .menu-icon {
          transform: scale(1.1);
        }

        .menu-label {
          font-size: 15px; /* TAILLE AUGMENTÉE */
          font-weight: 500;
          white-space: nowrap;
          opacity: ${sidebarOpen ? '1' : '0'};
          width: ${sidebarOpen ? 'auto' : '0'};
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Section utilisateur */
        .user-section {
          padding: 20px; /* Augmenté */
          border-top: 1px solid #333333;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px; /* Espacement augmenté */
          margin: 12px;
          border-radius: 10px; /* Augmenté */
          background: rgba(255, 255, 255, 0.05);
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .user-section:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }

        .user-info-sidebar {
          display: flex;
          align-items: center;
          gap: 12px; /* Espacement augmenté */
          width: 100%;
        }

        .user-avatar {
          width: 44px; /* Augmenté */
          height: 44px; /* Augmenté */
          background: #ffffff;
          border-radius: 10px; /* Augmenté */
          display: flex;
          align-items: center;
          justify-content: center;
          color: #000000;
          font-weight: 700; /* Plus gras */
          font-size: 16px; /* Augmenté */
          flex-shrink: 0;
          border: 2px solid rgba(255, 255, 255, 0.2); /* Épaisseur augmentée */
          transition: all 0.3s ease;
        }

        .user-section:hover .user-avatar {
          transform: scale(1.05);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .user-details-sidebar {
          opacity: ${sidebarOpen ? '1' : '0'};
          width: ${sidebarOpen ? 'auto' : '0'};
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .user-name-sidebar {
          font-size: 15px; /* TAILLE AUGMENTÉE */
          font-weight: 700; /* Plus gras */
          color: #ffffff;
          white-space: nowrap;
          margin-bottom: 2px;
        }

        .user-role-sidebar {
          font-size: 13px; /* TAILLE AUGMENTÉE */
          color: rgba(255, 255, 255, 0.7);
          white-space: nowrap;
        }

        /* ====== Main content ====== */
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          min-width: 0;
          background: #ffffff;
        }

        /* Topbar */
        .topbar {
          background: #ffffff;
          border-bottom: 1px solid var(--card-border);
          padding: 0 28px; /* Augmenté */
          height: 72px; /* Hauteur augmentée */
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 30;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          flex-shrink: 0;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 20px; /* Espacement augmenté */
        }

        .page-title {
          font-size: 22px; /* Augmenté */
          font-weight: 800; /* Plus gras */
          color: var(--text-primary);
          white-space: nowrap;
          letter-spacing: -0.5px;
        }

        .search-bar {
          position: relative;
          width: 350px; /* Largeur augmentée */
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 44px; /* Augmenté */
          border: 1px solid var(--card-border);
          border-radius: 8px; /* Augmenté */
          font-size: 15px; /* TAILLE AUGMENTÉE */
          color: var(--text-primary);
          background: #ffffff;
          transition: all 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 16px; /* Décalage augmenté */
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-secondary);
          width: 18px; /* Augmenté */
          height: 18px; /* Augmenté */
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 20px; /* Espacement augmenté */
          position: relative;
        }

        .notification-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px; /* Augmenté */
          border-radius: 8px; /* Augmenté */
          position: relative;
          transition: all 0.3s ease;
          width: 44px; /* Augmenté */
          height: 44px; /* Augmenté */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-btn:hover {
          background: var(--hover-bg);
          color: var(--text-primary);
          transform: scale(1.05);
        }

        .notification-badge {
          position: absolute;
          top: 6px; /* Décalage augmenté */
          right: 6px; /* Décalage augmenté */
          width: 10px; /* Augmenté */
          height: 10px; /* Augmenté */
          background: #000000;
          border-radius: 50%;
          border: 2px solid #ffffff;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.4);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(0, 0, 0, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
          }
        }

        /* User dropdown */
        .user-dropdown-container {
          position: relative;
        }

        .user-dropdown-trigger {
          display: flex;
          align-items: center;
          gap: 10px; /* Espacement augmenté */
          padding: 8px 12px; /* Augmenté */
          border-radius: 8px; /* Augmenté */
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .user-dropdown-trigger:hover {
          background: var(--hover-bg);
          transform: scale(1.02);
        }

        .user-dropdown-trigger.active {
          background: var(--hover-bg);
          border-color: var(--card-border);
          transform: scale(1.02);
        }

        .user-info-topbar {
          display: flex;
          align-items: center;
          gap: 12px; /* Espacement augmenté */
        }

        .user-details-topbar {
          text-align: right;
        }

        .user-name-topbar {
          font-size: 15px; /* TAILLE AUGMENTÉE */
          font-weight: 700; /* Plus gras */
          color: var(--text-primary);
          white-space: nowrap;
        }

        .user-role-topbar {
          font-size: 13px; /* TAILLE AUGMENTÉE */
          color: var(--text-secondary);
          white-space: nowrap;
        }

        .dropdown-arrow {
          color: var(--text-secondary);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          width: 18px; /* Augmenté */
          height: 18px; /* Augmenté */
        }

        .dropdown-arrow.open {
          transform: rotate(180deg);
        }

        .user-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 260px; /* Largeur augmentée */
          background: #ffffff;
          border-radius: 12px; /* Augmenté */
          border: 1px solid var(--card-border);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          z-index: 1000;
          overflow: hidden;
          display: ${userDropdownOpen ? 'block' : 'none'};
          animation: dropdownFade 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          transform-origin: top right;
        }

        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .dropdown-header {
          padding: 20px; /* Augmenté */
          border-bottom: 1px solid var(--card-border);
          background: var(--hover-bg);
        }

        .dropdown-user-name {
          font-size: 16px; /* Augmenté */
          font-weight: 800; /* Plus gras */
          color: var(--text-primary);
          margin-bottom: 4px;
        }

        .dropdown-user-email {
          font-size: 14px; /* TAILLE AUGMENTÉE */
          color: var(--text-secondary);
        }

        .dropdown-menu-items {
          padding: 8px 0; /* Augmenté */
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px; /* Espacement augmenté */
          padding: 12px 20px; /* Augmenté */
          color: var(--text-secondary);
          font-size: 14px; /* TAILLE AUGMENTÉE */
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .dropdown-item:hover {
          background: var(--hover-bg);
          color: var(--text-primary);
          padding-left: 24px;
        }

        .dropdown-divider {
          height: 1px;
          background: var(--card-border);
          margin: 8px 20px; /* Espacement augmenté */
        }

        .dropdown-icon {
          width: 18px; /* Augmenté */
          height: 18px; /* Augmenté */
          color: inherit;
          transition: transform 0.2s ease;
        }

        .dropdown-item:hover .dropdown-icon {
          transform: scale(1.1);
        }

        .mobile-menu-toggle {
          display: none;
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 8px; /* Augmenté */
          border-radius: 8px; /* Augmenté */
          transition: all 0.3s ease;
          width: 44px; /* Augmenté */
          height: 44px; /* Augmenté */
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mobile-menu-toggle:hover {
          background: var(--hover-bg);
          color: var(--text-primary);
          transform: scale(1.05);
        }

        /* Content area */
        .content-area {
          flex: 1;
          overflow-y: auto;
          padding: 28px; /* Augmenté */
          background: #ffffff;
          min-height: calc(100vh - 72px);
        }

        /* Header with filters */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 28px; /* Augmenté */
        }

        .header-title {
          font-size: 28px; /* Augmenté */
          font-weight: 900; /* Plus gras */
          color: var(--text-primary);
          margin-bottom: 6px;
          letter-spacing: -0.5px;
        }

        .header-subtitle {
          font-size: 16px; /* TAILLE AUGMENTÉE */
          color: var(--text-secondary);
          font-weight: 500;
          line-height: 1.5;
        }

        .filters-container {
          display: flex;
          gap: 12px; /* Espacement augmenté */
          align-items: center;
        }

        .period-selector {
          display: flex;
          gap: 4px;
          background: #ffffff;
          border: 1px solid var(--card-border);
          border-radius: 8px; /* Augmenté */
          padding: 4px;
        }

        .period-btn {
          padding: 8px 16px; /* Augmenté */
          border: none;
          background: none;
          border-radius: 6px; /* Augmenté */
          font-size: 14px; /* TAILLE AUGMENTÉE */
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .period-btn:hover {
          background: var(--hover-bg);
          color: var(--text-primary);
        }

        .period-btn.active {
          background: #000000;
          color: #ffffff;
          font-weight: 700; /* Plus gras */
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .refresh-btn {
          padding: 10px 16px; /* Augmenté */
          border: 1px solid var(--card-border);
          background: #ffffff;
          border-radius: 8px; /* Augmenté */
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px; /* Espacement augmenté */
          font-size: 14px; /* TAILLE AUGMENTÉE */
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover {
          background: var(--hover-bg);
          border-color: #d1d5db;
          transform: translateY(-1px);
        }

        .refresh-btn:active {
          transform: translateY(0);
        }

        /* Tabs navigation */
        .tabs-navigation {
          display: flex;
          gap: 6px;
          margin-bottom: 28px; /* Augmenté */
          border-bottom: 2px solid var(--card-border); /* Épaisseur augmentée */
          padding-bottom: 0;
        }

        .tab-btn {
          padding: 14px 24px; /* Augmenté */
          border: none;
          background: none;
          font-size: 15px; /* TAILLE AUGMENTÉE */
          font-weight: 700; /* Plus gras */
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px; /* Espacement augmenté */
          border-bottom: 3px solid transparent; /* Épaisseur augmentée */
          margin-bottom: -2px;
          transition: all 0.3s ease;
        }

        .tab-btn:hover {
          color: var(--text-primary);
          background: var(--hover-bg);
        }

        .tab-btn.active {
          color: var(--text-primary);
          border-bottom-color: #000000;
        }

        /* KPIs Grid */
        .kpis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Largeur minimum augmentée */
          gap: 20px; /* Espacement augmenté */
          margin-bottom: 28px; /* Augmenté */
        }

        .kpi-card {
          background: #ffffff;
          border-radius: 12px; /* Augmenté */
          padding: 24px; /* Augmenté */
          border: 1px solid var(--card-border);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px; /* Épaisseur augmentée */
          background: #000000;
          transition: transform 0.3s ease;
        }

        .kpi-card:hover::before {
          transform: scaleX(1.05);
        }

        .kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          border-color: #d1d5db;
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px; /* Augmenté */
        }

        .kpi-icon-wrapper {
          width: 48px; /* Augmenté */
          height: 48px; /* Augmenté */
          border-radius: 10px; /* Augmenté */
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--hover-bg);
          color: var(--text-primary);
          border: 1px solid var(--card-border);
          transition: all 0.3s ease;
        }

        .kpi-card:hover .kpi-icon-wrapper {
          background: #000000;
          color: #ffffff;
          transform: scale(1.05);
        }

        .kpi-value {
          font-size: 32px; /* Augmenté */
          font-weight: 900; /* Plus gras */
          color: var(--text-primary);
          margin-bottom: 6px;
          line-height: 1;
          letter-spacing: -0.5px;
        }

        .kpi-label {
          font-size: 14px; /* TAILLE AUGMENTÉE */
          color: var(--text-secondary);
          margin-bottom: 12px; /* Espacement augmenté */
          font-weight: 600;
        }

        .kpi-trend {
          display: flex;
          align-items: center;
          gap: 6px; /* Espacement augmenté */
          font-size: 13px; /* TAILLE AUGMENTÉE */
          font-weight: 700;
          padding: 6px 12px; /* Augmenté */
          border-radius: 16px; /* Augmenté */
          background: var(--hover-bg);
          width: fit-content;
        }

        .trend-up {
          color: #000000;
        }

        .trend-down {
          color: #666666;
        }

        /* Charts Grid */
        .charts-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px; /* Espacement augmenté */
          margin-bottom: 28px; /* Augmenté */
        }

        .chart-container {
          background: #ffffff;
          border-radius: 12px; /* Augmenté */
          padding: 24px; /* Augmenté */
          border: 1px solid var(--card-border);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px; /* Augmenté */
        }

        .chart-title {
          font-size: 18px; /* Augmenté */
          font-weight: 800; /* Plus gras */
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }

        .chart-selector {
          padding: 8px 16px; /* Augmenté */
          border: 1px solid var(--card-border);
          border-radius: 6px; /* Augmenté */
          background: #ffffff;
          color: var(--text-secondary);
          font-size: 14px; /* TAILLE AUGMENTÉE */
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .chart-selector:focus {
          border-color: #000000;
          outline: none;
          box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.1);
        }

        .chart-placeholder {
          height: 280px; /* Hauteur augmentée */
          background: #f9fafb;
          border-radius: 8px; /* Augmenté */
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          font-size: 15px; /* TAILLE AUGMENTÉE */
          position: relative;
          overflow: hidden;
        }

        /* Tables Grid - Optimisé pour éviter le débordement */
        .tables-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); /* Largeur minimum augmentée */
          gap: 24px; /* Espacement augmenté */
          margin-bottom: 28px; /* Augmenté */
        }

        .table-container {
          background: #ffffff;
          border-radius: 12px; /* Augmenté */
          border: 1px solid var(--card-border);
          overflow: hidden;
          max-height: 460px; /* Hauteur augmentée */
          display: flex;
          flex-direction: column;
        }

        .table-header {
          padding: 20px 24px; /* Augmenté */
          border-bottom: 1px solid var(--card-border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--hover-bg);
          flex-shrink: 0;
        }

        .table-title {
          font-size: 18px; /* Augmenté */
          font-weight: 800; /* Plus gras */
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px; /* Espacement augmenté */
          letter-spacing: -0.3px;
        }

        .view-all {
          color: var(--primary-color);
          font-size: 14px; /* TAILLE AUGMENTÉE */
          font-weight: 700;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 6px; /* Espacement augmenté */
          cursor: pointer;
          padding: 6px 12px; /* Augmenté */
          border-radius: 6px; /* Augmenté */
          transition: all 0.2s ease;
        }

        .view-all:hover {
          background: var(--hover-bg);
          transform: translateX(2px);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px; /* TAILLE AUGMENTÉE */
          flex: 1;
          overflow-y: auto;
        }

        .data-table th {
          padding: 16px 20px; /* Augmenté */
          text-align: left;
          font-size: 13px; /* TAILLE AUGMENTÉE */
          font-weight: 700; /* Plus gras */
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.4px;
          background: #f9fafb;
          border-bottom: 1px solid var(--card-border);
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .data-table td {
          padding: 16px 20px; /* Augmenté */
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px; /* TAILLE AUGMENTÉE */
          transition: background 0.2s ease;
          vertical-align: top;
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
          gap: 12px; /* Espacement augmenté */
          min-width: 0;
        }

        .user-avatar-small {
          width: 40px; /* Augmenté */
          height: 40px; /* Augmenté */
          background: #000000;
          border-radius: 8px; /* Augmenté */
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700; /* Plus gras */
          color: #ffffff;
          font-size: 16px; /* Augmenté */
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }

        .data-table tr:hover .user-avatar-small {
          transform: scale(1.05);
        }

        .user-name {
          font-weight: 700; /* Plus gras */
          color: var(--text-primary);
          font-size: 14px; /* TAILLE AUGMENTÉE */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }

        .user-email {
          font-size: 13px; /* TAILLE AUGMENTÉE */
          color: var(--text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }

        .status-badge {
          padding: 6px 12px; /* Augmenté */
          border-radius: 16px; /* Augmenté */
          font-size: 13px; /* TAILLE AUGMENTÉE */
          font-weight: 700; /* Plus gras */
          display: inline-flex;
          align-items: center;
          gap: 6px; /* Espacement augmenté */
          border: 1px solid transparent;
          min-width: 80px; /* Largeur minimum augmentée */
          justify-content: center;
          white-space: nowrap;
          transition: all 0.2s ease;
        }

        .data-table tr:hover .status-badge {
          transform: scale(1.05);
        }

        .document-count {
          font-weight: 800; /* Plus gras */
          color: var(--text-primary);
          font-size: 15px; /* TAILLE AUGMENTÉE */
        }

        .document-category {
          font-size: 13px; /* TAILLE AUGMENTÉE */
          color: var(--text-secondary);
        }

        .payment-amount {
          font-weight: 800; /* Plus gras */
          color: var(--text-primary);
          font-size: 15px; /* TAILLE AUGMENTÉE */
        }

        .payment-method {
          font-size: 13px; /* TAILLE AUGMENTÉE */
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 6px; /* Espacement augmenté */
        }

        /* Quick Actions */
        .quick-actions {
          background: #ffffff;
          border-radius: 12px; /* Augmenté */
          padding: 28px; /* Augmenté */
          border: 1px solid var(--card-border);
        }

        .actions-title {
          font-size: 22px; /* Augmenté */
          font-weight: 900; /* Plus gras */
          color: var(--text-primary);
          margin-bottom: 24px; /* Augmenté */
          display: flex;
          align-items: center;
          gap: 10px; /* Espacement augmenté */
          letter-spacing: -0.5px;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Largeur minimum augmentée */
          gap: 16px; /* Espacement augmenté */
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 16px; /* Espacement augmenté */
          padding: 20px; /* Augmenté */
          background: #f9fafb;
          border: 1px solid var(--card-border);
          border-radius: 12px; /* Augmenté */
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .action-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.05), transparent);
          transition: left 0.6s;
        }

        .action-btn:hover::before {
          left: 100%;
        }

        .action-btn:hover {
          background: #000000;
          border-color: #000000;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .action-btn:hover .action-text {
          color: #ffffff;
        }

        .action-icon {
          width: 44px; /* Augmenté */
          height: 44px; /* Augmenté */
          border-radius: 10px; /* Augmenté */
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          background: #000000;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }

        .action-btn:hover .action-icon {
          background: #ffffff;
          color: #000000;
          transform: scale(1.1) rotate(5deg);
        }

        .action-text {
          font-size: 15px; /* TAILLE AUGMENTÉE */
          font-weight: 700; /* Plus gras */
          color: var(--text-primary);
          flex: 1;
          transition: color 0.3s ease;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .sidebar {
            position: fixed;
            left: ${sidebarOpen ? '0' : '-280px'};
            height: 100vh;
            z-index: 50;
            box-shadow: ${sidebarOpen ? '4px 0 24px rgba(0, 0, 0, 0.15)' : 'none'};
          }

          .mobile-menu-toggle {
            display: flex;
          }

          .search-bar {
            width: 280px;
          }
          
          .charts-grid {
            grid-template-columns: 1fr;
          }

          .tables-grid {
            grid-template-columns: 1fr;
          }
          
          .user-dropdown-menu {
            position: fixed;
            top: 72px;
            right: 20px;
            left: auto;
            width: calc(100vw - 40px);
            max-width: 300px;
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

          .kpis-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .tables-grid {
            grid-template-columns: 1fr;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }

          .actions-grid {
            grid-template-columns: 1fr;
          }

          .filters-container {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .user-details-topbar {
            display: none;
          }
          
          .header-title {
            font-size: 24px;
          }
          
          .kpi-value {
            font-size: 26px;
          }
          
          .tables-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          .kpis-grid {
            grid-template-columns: 1fr;
          }
          
          .tables-grid {
            grid-template-columns: 1fr;
          }
          
          .header-title {
            font-size: 22px;
          }
          
          .kpi-value {
            font-size: 24px;
          }
        }

        /* ====== Overlay pour mobile ====== */
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
          animation: overlayFade 0.3s ease;
        }

        @keyframes overlayFade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @media (max-width: 1200px) {
          .sidebar-overlay {
            display: ${sidebarOpen ? 'block' : 'none'};
          }
        }

        /* ====== Chart bars simulation ====== */
        .chart-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 240px; /* Hauteur augmentée */
          padding: 20px 0;
          gap: 12px;
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
          font-size: 13px; /* TAILLE AUGMENTÉE */
          font-weight: 600;
          color: var(--text-secondary);
        }

        .chart-bar-value {
          position: absolute;
          top: -32px;
          left: 0;
          right: 0;
          text-align: center;
          font-size: 13px; /* TAILLE AUGMENTÉE */
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

        /* ====== Focus visible pour l'accessibilité ====== */
        button:focus-visible,
        input:focus-visible,
        select:focus-visible {
          outline: 3px solid #000000;
          outline-offset: 2px;
          border-radius: 3px;
        }

        /* ====== Scrollbar styling amélioré ====== */
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
          transition: background 0.3s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* Animation pour les éléments qui apparaissent */
        .kpi-card, .chart-container, .table-container, .quick-actions {
          animation: fadeInUp 0.5s ease forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Animation pour le sidebar */
        .sidebar {
          animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }

        /* Hover effects améliorés */
        .menu-item, .action-btn, .kpi-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Effet de profondeur */
        .kpi-card:hover, .action-btn:hover, .chart-container:hover, .table-container:hover {
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        }

        /* Typographie améliorée */
        h1, h2, h3, h4, h5, h6 {
          font-weight: 800;
          letter-spacing: -0.3px;
        }

        /* Espacements améliorés */
        .dashboard-header, .tabs-navigation, .kpis-grid, .charts-grid, .tables-grid, .quick-actions {
          margin-bottom: 32px;
        }

        /* Bordures et rayons améliorés */
        .chart-container, .table-container, .quick-actions, .kpi-card {
          border-radius: 16px;
        }

        .search-input, .chart-selector, .period-btn, .refresh-btn {
          border-radius: 10px;
        }

        /* Icônes plus grandes */
        .menu-icon, .dropdown-icon, .search-icon, .notification-btn svg {
          width: 20px;
          height: 20px;
        }

        .table-title svg, .actions-title svg {
          width: 22px;
          height: 22px;
        }

        .kpi-icon-wrapper svg {
          width: 24px;
          height: 24px;
        }

        .action-icon svg {
          width: 22px;
          height: 22px;
        }
        `}
      </style>

      <div className="dashboard-container">
        {/* Overlay pour mobile avec animation */}
        {sidebarOpen && (
          <div 
            className="sidebar-overlay" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar avec fond noir et animation améliorée */}
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
              aria-label={sidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          <div className="sidebar-menu">
            {menuItems.map(item => (
              <div
                key={item.id}
                className={`menu-item ${activeMenu === item.id ? 'active' : ''}`}
                onClick={() => setActiveMenu(item.id)}
              >
                <item.icon 
                  className="menu-icon" 
                  size={20} 
                  style={{ color: activeMenu === item.id ? '#ffffff' : '#cccccc' }}
                />
                <span className="menu-label">{item.label}</span>
              </div>
            ))}
          </div>

          {/* Section utilisateur dans la sidebar */}
          <div className="user-section">
            <div className="user-info-sidebar">
              <div className="user-avatar">
                {dashboardData.user.avatar}
              </div>
              <div className="user-details-sidebar">
                <div className="user-name-sidebar">{dashboardData.user.name}</div>
                <div className="user-role-sidebar">{dashboardData.user.role}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="main-content">
          {/* Topbar */}
          <div className="topbar">
            <div className="topbar-left">
              <h1 className="page-title">Admin Dashboard</h1>
              <div className="search-bar">
                <Search className="search-icon" size={20} />
                <input 
                  type="text" 
                  className="search-input" 
                  placeholder="Rechercher utilisateurs, documents..."
                />
              </div>
            </div>
            <div className="topbar-right">
              <button className="notification-btn">
                <Bell size={20} />
                {notifications > 0 && (
                  <span className="notification-badge"></span>
                )}
              </button>
              
              {/* Menu déroulant utilisateur */}
              <div className="user-dropdown-container">
                <button 
                  className={`user-dropdown-trigger ${userDropdownOpen ? 'active' : ''}`}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="Menu utilisateur"
                >
                  <div className="user-info-topbar">
                    <div className="user-avatar">
                      {dashboardData.user.avatar}
                    </div>
                    <div className="user-details-topbar">
                      <div className="user-name-topbar">{dashboardData.user.name}</div>
                      <div className="user-role-topbar">{dashboardData.user.role}</div>
                    </div>
                  </div>
                  <ChevronDown 
                    className={`dropdown-arrow ${userDropdownOpen ? 'open' : ''}`} 
                    size={18} 
                  />
                </button>
                
                <div className="user-dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-user-name">{dashboardData.user.name}</div>
                    <div className="dropdown-user-email">{dashboardData.user.email}</div>
                  </div>
                  
                  <div className="dropdown-menu-items">
                    <div className="dropdown-item">
                      <User className="dropdown-icon" size={18} />
                      <span>Mon profil</span>
                    </div>
                    <div className="dropdown-item">
                      <SettingsIcon className="dropdown-icon" size={18} />
                      <span>Paramètres</span>
                    </div>
                    <div className="dropdown-item">
                      <Shield className="dropdown-icon" size={18} />
                      <span>Sécurité</span>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-item">
                      <DownloadCloud className="dropdown-icon" size={18} />
                      <span>Exporter les données</span>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-item" style={{ color: '#000000', fontWeight: '700' }}>
                      <LogOut className="dropdown-icon" size={18} />
                      <span>Déconnexion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content area */}
          <div className="content-area">
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
                        style={{ 
                          height: `${(stat.signatures / 2500) * 100}%`
                        }}
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
                      <div style={{ 
                        height: '10px', 
                        background: '#f3f4f6', 
                        borderRadius: '6px', 
                        overflow: 'hidden'
                      }}>
                        <div 
                          style={{ 
                            height: '100%', 
                            background: doc.color,
                            width: `${(doc.count / 5000) * 100}%`,
                            borderRadius: '6px'
                          }}
                        />
                      </div>
                      <div style={{ 
                        fontSize: '13px', 
                        color: 'var(--text-secondary)', 
                        marginTop: '6px',
                        fontWeight: '500'
                      }}>
                        {doc.category}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tables Grid - Optimisé pour éviter le débordement */}
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
          </div>
        </div>
      </div>
    </>
  );
}