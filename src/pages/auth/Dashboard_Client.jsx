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