import { useEffect, useState } from "react";
import { nombreFacture, nombreUtilisateur, nombreProfessionnelle, nombreIndependant,nombreParticulier, nombreAdmin } from "../../../service/admin/adminService";
import {
  Users, FileText, DollarSign, Briefcase,
  UserCheck, User, FileSignature, RefreshCw, Banknote
} from "lucide-react";

export default function Dashboard({ dashboardData }) {
  const [nbFactures, setNbFactures] = useState(0);
  const [nbUtilisateurs, setNbUtilisateurs] = useState(0);
  const [nbParticuliers, setNbParticuliers] = useState(0);
  const [nbProfessionnelle, setNbProfessionnelle] = useState(0);
  const [nbIndependants, setNbIndependants] = useState(0);
  const [nbAdmins, setNbAdmins] = useState(0);

  // === Fonction pour tout récupérer en même temps ===
  const fetchAllData = async () => {
    try {
      const [
        facturesData,
        utilisateursData,
        particuliersData,
        professionnelsData,
        independantsData,
        adminsData
      ] = await Promise.all([
        nombreFacture(),
        nombreUtilisateur(),
        nombreParticulier(),
        nombreProfessionnelle(),
        nombreIndependant(),
        nombreAdmin()
      ]);

      setNbFactures(facturesData.totalFactures || 0);
      setNbUtilisateurs(utilisateursData.totalUtilisateurs || 0);
      setNbParticuliers(particuliersData.totalParticuliers || 0);
      setNbProfessionnelle(professionnelsData.totalProfessionnels || 0);
      setNbIndependants(independantsData.totalIndependants || 0);
      setNbAdmins(adminsData.totalAdmins || 0);

    } catch (error) {
      console.error("Erreur lors de la récupération des données du dashboard :", error);
    }
  };

  // === useEffect pour charger au montage ===
  useEffect(() => {
    fetchAllData();
  }, []);

  const kpiConfigs = [
    { key: "totalUsers", label: "Utilisateurs Totaux", icon: Users, value: nbUtilisateurs },
    { key: "totalFactures", label: "Factures Générées", icon: FileText, value: nbFactures },
    { key: "totalParticuliers", label: "Particuliers", icon: User, value: nbParticuliers},
    { key: "totalProfessionnels", label: "Professionnels", icon: Briefcase, value: nbProfessionnelle },
    { key: "totalIndependants", label: "Independants", icon: UserCheck, value: nbIndependants },
    { key: "totalAdmins", label: "Admins", icon: UserCheck, value: nbAdmins },
    { key: "totalContrats", label: "Contrats", icon: FileSignature }, 
  ];

  const formatNumber = (num) => {
    if (!num) return 0;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getKPIValue = (kpi) => {
    if (kpi.value !== undefined) return formatNumber(kpi.value);
    if (kpi.key === "totalInvoices") {
      return `${formatNumber(dashboardData[kpi.key] / 1000)}K FCFA`;
    }
    return formatNumber(dashboardData[kpi.key]);
  };

  return (
    <>
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2 className="header-title">Supervision Plateforme</h2>
          <p className="header-subtitle">Vue d'ensemble des utilisateurs et factures</p>
        </div>
        <div className="filters-container">
          <button className="refresh-btn" onClick={fetchAllData}>
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
                <div className="kpi-value">{getKPIValue(kpi)}</div>
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