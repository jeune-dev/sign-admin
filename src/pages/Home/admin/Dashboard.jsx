import {
  Users,
  FileText,
  DollarSign,
  Briefcase,
  UserCheck,
  User,
  FileSignature,
  RefreshCw,
  Banknote
} from "lucide-react";

export default function Dashboard({ dashboardData }) {

  const kpiConfigs = [
    { key: "totalUsers", label: "Utilisateurs Totaux", icon: Users },
    { key: "totalFactures", label: "Factures Générées", icon: FileText },
    { key: "totalInvoices", label: "Montant Total (FCFA)", icon: Banknote },

    { key: "totalProfessionnels", label: "Professionnels", icon: Briefcase },
    { key: "totalClients", label: "Clients", icon: UserCheck },
    { key: "totalParticuliers", label: "Particuliers", icon: User },
    { key: "totalContrats", label: "Contrats", icon: FileSignature },
  ];

  const formatNumber = (num) => {
    if (!num) return 0;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getKPIValue = (key) => {
    if (key === "totalInvoices") {
      return `${formatNumber(dashboardData[key] / 1000)}K FCFA`;
    }
    return formatNumber(dashboardData[key]);
  };

  return (
    <>
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2 className="header-title">Supervision Plateforme</h2>
          <p className="header-subtitle">
            Vue d'ensemble des utilisateurs et factures
          </p>
        </div>

        <div className="filters-container">
          <button className="refresh-btn">
            <RefreshCw size={16} />
            Actualiser
          </button>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="kpis-grid">
        {kpiConfigs.map((kpi, index) => (
          <div className="kpi-card" key={index}>
            <div className="kpi-header">
              <div>
                <div className="kpi-value">
                  {getKPIValue(kpi.key)}
                </div>
                <div className="kpi-label">{kpi.label}</div>
              </div>

              <div className="kpi-icon-wrapper">
                <kpi.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}