import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, IdCard, AlertCircle, ArrowLeft, ArrowRight, Building } from "lucide-react";

// Importer les images
import backgroundImg from "../../assets/images/v4_10.png";

export default function Signup() {
  const navigate = useNavigate();
  // État pour gérer l'étape actuelle
  const [currentStep, setCurrentStep] = useState(1);
  
  // État pour les données du formulaire
  const [formData, setFormData] = useState({
    // Étape 1: Informations personnelles
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    
    // Étape 2: Informations de sécurité
    password: "",
    confirmPassword: "",
    address: "",
    city: "", // Changé de streetNumber à city
    cni: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Fonctions de validation
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[0-9]{9}$/; // 9 chiffres
    return re.test(phone.replace(/\s/g, ''));
  };

  const validateCNI = (cni) => {
    const re = /^[A-Z0-9]{6,12}$/;
    return re.test(cni.toUpperCase());
  };

  const validatePassword = (password) => {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false; // Au moins une majuscule
    if (!/\d/.test(password)) return false; // Au moins un chiffre
    return true;
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Le prénom est requis";
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = "Le prénom doit contenir au moins 2 caractères";
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Le nom est requis";
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = "Le nom doit contenir au moins 2 caractères";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Numéro de téléphone invalide (9 chiffres requis)";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Veuillez entrer un email valide";
    }
    
    return newErrors;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "8 caractères min, 1 majuscule, 1 chiffre";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "La confirmation du mot de passe est requise";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "L'adresse est requise";
    }
    
    if (!formData.city.trim()) { // Changé de streetNumber à city
      newErrors.city = "La ville est requise";
    }
    
    if (!formData.cni.trim()) {
      newErrors.cni = "Le numéro CNI est requis";
    } else if (!validateCNI(formData.cni)) {
      newErrors.cni = "Format CNI invalide (6-12 caractères alphanumériques)";
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleNextStep = () => {
    const step1Errors = validateStep1();
    
    if (Object.keys(step1Errors).length > 0) {
      setErrors(step1Errors);
      return;
    }
    
    setCurrentStep(2);
    setErrors({});
  };

  const handlePrevStep = () => {
    setCurrentStep(1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const step2Errors = validateStep2();
    
    if (Object.keys(step2Errors).length > 0) {
      setErrors(step2Errors);
      return;
    }
    
    setIsLoading(true);
    
    // Simulation d'appel API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Inscription réussie:", formData);
      // Ici, tu ajouterais ta logique d'inscription réelle
      alert("Inscription réussie !");
    } catch (error) {
      setErrors({ general: "Échec de l'inscription. Veuillez réessayer." });
    } finally {
      setIsLoading(false);
    }
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

        /* ====== Background ====== */
        .signup-page {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          height: 100vh;
          background-image: url(${backgroundImg});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 15px;
        }

        /* ====== Card Signup ====== */
        .signup-card {
          background: white;
          border-radius: 16px;
          padding: 30px 35px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          width: 100%;
          max-width: 450px;
          min-height: 600px;
          max-height: 90vh;
          text-align: left;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.3);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        /* ====== Header professionnel ====== */
        .signup-header {
          margin-bottom: 25px;
          text-align: center;
          flex-shrink: 0;
        }

        .signup-header h1 {
          font-size: 28px;
          margin-bottom: 8px;
          color: #073257;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .signup-subtitle {
          color: #666;
          font-size: 14px;
          font-weight: 500;
        }

        /* ====== Indicateur d'étape compact ====== */
        .step-indicator {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 25px;
          gap: 8px;
          flex-shrink: 0;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }

        .step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 13px;
          transition: all 0.3s;
        }

        .step-circle.active {
          background: #073257;
          color: white;
          box-shadow: 0 3px 10px rgba(7, 50, 87, 0.3);
        }

        .step-circle.inactive {
          background: #f0f0f0;
          color: #888;
        }

        .step-circle.completed {
          background: #10b981;
          color: white;
        }

        .step-label {
          font-size: 11px;
          color: #666;
          font-weight: 500;
          text-align: center;
          line-height: 1.2;
        }

        .step-line {
          width: 30px;
          height: 2px;
          background: #e0e0e0;
          margin: 0 3px;
        }

        /* ====== Form container ====== */
        .signup-form {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: hidden;
        }

        /* Contenu des étapes avec display conditionnel */
        .step-content {
          display: ${currentStep === 1 ? 'flex' : 'none'};
          flex-direction: column;
          flex: 1;
          overflow: hidden;
          animation: fadeIn 0.4s ease-out;
        }

        .step-content.step2 {
          display: ${currentStep === 2 ? 'flex' : 'none'};
          flex-direction: column;
          flex: 1;
          overflow: hidden;
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Contenu scrollable des étapes */
        .step-scrollable {
          flex: 1;
          overflow-y: auto;
          padding-right: 5px;
          margin-bottom: 10px;
        }

        /* Style de la scrollbar discrète */
        .step-scrollable::-webkit-scrollbar {
          width: 4px;
        }

        .step-scrollable::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .step-scrollable::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        .step-scrollable::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }

        /* ====== Form Groups optimisés ====== */
        .form-group {
          margin-bottom: 20px;
          position: relative;
        }

        .form-row {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
        }

        .form-row .form-group {
          flex: 1;
          margin-bottom: 0;
        }

        .input-label {
          display: block;
          margin-bottom: 6px;
          color: #333;
          font-weight: 600;
          font-size: 13px;
          letter-spacing: -0.1px;
        }

        .input-label span {
          color: #e53e3e;
          margin-left: 3px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: #666;
          width: 16px;
          height: 16px;
          z-index: 2;
        }

        /* ====== Inputs compacts ====== */
        .signup-card input {
          width: 100%;
          padding: 13px 14px 13px 42px;
          border: 2px solid #ddd;
          border-radius: 9px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s;
          background: #f8f9fa;
          color: #222;
          font-weight: 500;
        }

        .signup-card input:hover {
          border-color: #bbb;
          background: white;
        }

        .signup-card input:focus {
          outline: none;
          border-color: #073257;
          box-shadow: 0 0 0 3px rgba(7, 50, 87, 0.15);
          background: white;
        }

        .signup-card input.error {
          border-color: #e53e3e;
          background: #fff5f5;
        }

        .signup-card input.success {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .signup-card input::placeholder {
          color: #888;
          font-weight: 400;
        }

        .password-toggle {
          position: absolute;
          right: 14px;
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 5px;
          transition: all 0.2s;
        }

        .password-toggle:hover {
          color: #073257;
          background: #f0f0f0;
        }

        /* ====== Error Messages fixes ====== */
        .error-message {
          position: absolute;
          bottom: -18px;
          left: 0;
          display: flex;
          align-items: center;
          gap: 5px;
          color: #c53030;
          font-size: 11px;
          font-weight: 500;
          padding-left: 2px;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .error-icon {
          width: 11px;
          height: 11px;
          flex-shrink: 0;
        }

        /* ====== Buttons de navigation fixes en bas ====== */
        .nav-buttons {
          display: flex;
          gap: 12px;
          margin-top: 10px;
          flex-shrink: 0;
          padding-top: 10px;
          border-top: 1px solid #eee;
        }

        .nav-button {
          flex: 1;
          padding: 13px;
          font-size: 14px;
          font-weight: 600;
          border: none;
          border-radius: 9px;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 44px;
        }

        .nav-button.prev {
          background: #f8f9fa;
          color: #333;
          border: 2px solid #ddd;
        }

        .nav-button.prev:hover:not(:disabled) {
          background: #e9ecef;
          border-color: #bbb;
        }

        .nav-button.next {
          background: #073257;
          color: white;
        }

        .nav-button.next:hover:not(:disabled) {
          background: #0a3a83;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(7, 50, 87, 0.3);
        }

        .nav-button.submit {
          background: #10b981;
          color: white;
        }

        .nav-button.submit:hover:not(:disabled) {
          background: #059669;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .nav-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .button-loader {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ====== Responsive ====== */
        @media (max-width: 480px) {
          .signup-page {
            padding: 12px;
          }

          .signup-card {
            padding: 25px 20px;
            max-width: 100%;
            min-height: 580px;
            max-height: 85vh;
          }

          .signup-header h1 {
            font-size: 26px;
          }

          .signup-subtitle {
            font-size: 13px;
          }

          .signup-header {
            margin-bottom: 20px;
          }

          .step-indicator {
            margin-bottom: 20px;
          }

          .form-row {
            flex-direction: column;
            gap: 15px;
          }

          .form-group {
            margin-bottom: 18px;
          }

          .form-row .form-group {
            margin-bottom: 0;
          }

          .step-indicator {
            gap: 5px;
          }

          .step-line {
            width: 20px;
          }

          .step-label {
            font-size: 10px;
          }

          .step-circle {
            width: 28px;
            height: 28px;
            font-size: 12px;
          }

          .nav-button {
            padding: 12px;
            font-size: 13px;
            min-height: 42px;
          }

          .signup-card input {
            padding: 12px 12px 12px 40px;
            font-size: 13px;
          }

          .error-message {
            bottom: -16px;
            font-size: 10px;
          }
        }

        @media (max-width: 360px) {
          .signup-card {
            padding: 20px 15px;
            min-height: 560px;
          }

          .signup-header h1 {
            font-size: 24px;
          }

          .signup-header {
            margin-bottom: 18px;
          }

          .form-group {
            margin-bottom: 16px;
          }

          .nav-buttons {
            margin-top: 8px;
            padding-top: 8px;
          }

          .step-indicator {
            margin-bottom: 18px;
          }
        }

        @media (max-height: 700px) {
          .signup-card {
            min-height: 550px;
            max-height: 85vh;
          }
          
          .signup-header {
            margin-bottom: 20px;
          }
          
          .step-indicator {
            margin-bottom: 20px;
          }
          
          .form-group {
            margin-bottom: 16px;
          }
          
          .nav-buttons {
            margin-top: 8px;
            padding-top: 8px;
          }
        }

        /* ====== Styles de curseur ====== */
        button, 
        .password-toggle,
        .nav-button {
          cursor: pointer;
        }

        /* ====== Styles pour les textes NON-cliquables ====== */
        .signup-header,
        .signup-subtitle,
        .input-label,
        .step-label,
        .step-circle,
        .step-line,
        .error-message,
        .signup-card h1,
        .signup-card p {
          cursor: default !important;
          user-select: none;
        }

        /* Désactiver le curseur sur tous les textes non-interactifs */
        .signup-card :not(button):not(input):not(.password-toggle):not(.nav-button):not(a) {
          cursor: default !important;
        }

        /* ====== Focus visible pour l'accessibilité ====== */
        button:focus-visible,
        input:focus-visible {
          outline: 2px solid rgba(7, 50, 87, 0.5);
          outline-offset: 2px;
        }

        /* ====== Limitation de largeur totale ====== */
        body {
          max-width: 100vw;
          overflow-x: hidden;
        }
        `}
      </style>

      <div className="signup-page">
        <div className="signup-card">
          <div className="signup-header">
            <h1>Créer un compte</h1>
            <p className="signup-subtitle">Rejoignez notre plateforme en quelques étapes</p>
          </div>

          {/* Indicateur d'étape */}
          <div className="step-indicator">
            <div className="step">
              <div className={`step-circle ${currentStep === 1 ? 'active' : 'completed'}`}>
                1
              </div>
              <div className="step-label">Informations<br />personnelles</div>
            </div>
            <div className="step-line"></div>
            <div className="step">
              <div className={`step-circle ${currentStep === 2 ? 'active' : 'inactive'}`}>
                2
              </div>
              <div className="step-label">Sécurité<br />& adresse</div>
            </div>
          </div>

          <form className="signup-form" onSubmit={handleSubmit} noValidate>
            {/* Étape 1: Informations personnelles */}
            <div className="step-content">
              <div className="step-scrollable">
                <div className="form-row">
                  <div className="form-group">
                    <label className="input-label">
                      Prénom<span>*</span>
                    </label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={16} />
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Votre prénom"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={errors.firstName ? "error" : ""}
                        autoComplete="given-name"
                      />
                    </div>
                    {errors.firstName && (
                      <div className="error-message">
                        <AlertCircle className="error-icon" size={11} />
                        {errors.firstName}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="input-label">
                      Nom<span>*</span>
                    </label>
                    <div className="input-wrapper">
                      <User className="input-icon" size={16} />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Votre nom"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={errors.lastName ? "error" : ""}
                        autoComplete="family-name"
                      />
                    </div>
                    {errors.lastName && (
                      <div className="error-message">
                        <AlertCircle className="error-icon" size={11} />
                        {errors.lastName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="input-label">
                    Numéro de téléphone<span>*</span>
                  </label>
                  <div className="input-wrapper">
                    <Phone className="input-icon" size={16} />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="012345678 (9 chiffres)"
                      value={formData.phone}
                      onChange={handleChange}
                      className={errors.phone ? "error" : ""}
                      autoComplete="tel"
                      maxLength="9"
                    />
                  </div>
                  {errors.phone && (
                    <div className="error-message">
                      <AlertCircle className="error-icon" size={11} />
                      {errors.phone}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="input-label">
                    Adresse email<span>*</span>
                  </label>
                  <div className="input-wrapper">
                    <Mail className="input-icon" size={16} />
                    <input
                      type="email"
                      name="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? "error" : ""}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <div className="error-message">
                      <AlertCircle className="error-icon" size={11} />
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Boutons de navigation pour la première étape */}
              <div className="nav-buttons">
                <div 
                  className="nav-button prev"
                  onClick={() => navigate('/login')}
                >
                  <ArrowLeft size={16} />
                  Précédent
                </div>
                <button
                  type="button"
                  className="nav-button next"
                  onClick={handleNextStep}
                  disabled={isLoading}
                >
                  Suivant
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Étape 2: Informations de sécurité */}
            <div className="step-content step2">
              <div className="step-scrollable">
                <div className="form-row">
                  <div className="form-group">
                    <label className="input-label">
                      Mot de passe<span>*</span>
                    </label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" size={16} />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder=""
                        value={formData.password}
                        onChange={handleChange}
                        className={errors.password ? "error" : ""}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                      >
                        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {errors.password && (
                      <div className="error-message">
                        <AlertCircle className="error-icon" size={11} />
                        {errors.password}
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="input-label">
                      Confirmer le mot de passe<span>*</span>
                    </label>
                    <div className="input-wrapper">
                      <Lock className="input-icon" size={16} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder=""
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={errors.confirmPassword ? "error" : ""}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Cacher la confirmation" : "Afficher la confirmation"}
                      >
                        {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <div className="error-message">
                        <AlertCircle className="error-icon" size={11} />
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="input-label">
                      Adresse<span>*</span>
                    </label>
                    <div className="input-wrapper">
                      <MapPin className="input-icon" size={16} />
                      <input
                        type="text"
                        name="address"
                        placeholder="Nom de la rue"
                        value={formData.address}
                        onChange={handleChange}
                        className={errors.address ? "error" : ""}
                        autoComplete="street-address"
                      />
                    </div>
                    {errors.address && (
                      <div className="error-message">
                        <AlertCircle className="error-icon" size={11} />
                        {errors.address}
                      </div>
                    )}
                  </div>

                  
                <div className="form-group">
                    <label className="input-label">
                      Ville<span>*</span>
                    </label>
                    <div className="input-wrapper">
                      <Building className="input-icon" size={16} />
                      <input
                        type="text"
                        name="city"
                        placeholder="Ex: Dakar"
                        value={formData.city}
                        onChange={handleChange}
                        className={errors.city ? "error" : ""}
                        autoComplete="address-level2"
                      />
                    </div>
                    {errors.city && (
                      <div className="error-message">
                        <AlertCircle className="error-icon" size={11} />
                        {errors.city}
                      </div>
                    )}
                    </div>
                </div>

                <div className="form-group">
                  <label className="input-label">
                    Numéro CNI<span>*</span>
                  </label>
                  <div className="input-wrapper">
                    <IdCard className="input-icon" size={16} />
                    <input
                      type="text"
                      name="cni"
                      placeholder="Ex: AB123456"
                      value={formData.cni}
                      onChange={handleChange}
                      className={errors.cni ? "error" : ""}
                      autoComplete="off"
                      maxLength="12"
                    />
                  </div>
                  {errors.cni && (
                    <div className="error-message">
                      <AlertCircle className="error-icon" size={11} />
                      {errors.cni}
                    </div>
                  )}
                </div>
              </div>

              {/* Boutons de navigation pour la deuxième étape */}
              <div className="nav-buttons">
                <button
                  type="button"
                  className="nav-button prev"
                  onClick={handlePrevStep}
                  disabled={isLoading}
                >
                  <ArrowLeft size={16} />
                  Précédent
                </button>

                <button
                  type="submit"
                  className="nav-button submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="button-loader"></span>
                      Inscription...
                    </>
                  ) : (
                    "S'inscrire"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}