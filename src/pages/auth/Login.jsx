import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Shield, AlertCircle } from "lucide-react";

// Importer les images
import backgroundImg from "../../assets/images/image_de_fond.png";
import { showLoginSuccess } from "../../utils/alerts";


export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "SIGN APP | Admin Login";
    // Désactiver le scroll sur la page entière
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email administrateur requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Format email invalide";
    }
    
    if (!formData.password) {
      newErrors.password = "Mot de passe requis";
    } else if (formData.password.length < 8) {
      newErrors.password = "8 caractères minimum";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const matchedUser = TEST_USERS.find(u => u.email === formData.email && u.password === formData.password);
      if (matchedUser && (matchedUser.role === 'admin' || matchedUser.role === 'super_admin')) {
        await showLoginSuccess();
        navigate('/Dashboard_Admin');
      } else {
        throw new Error("Accès non autorisé");
      }
    } catch (error) {
      setErrors({ general: "Accès refusé. Vérifiez vos identifiants." });
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
          width: 100vw;
          height: 100vh;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background: #f5f5f5;
          overflow: hidden; /* Désactive tout scroll */
          position: fixed; /* Fixe la page */
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        /* ====== Background avec image de fond ====== */
        .login-page {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          height: 100vh;
          min-height: 600px;
          background-image: url(${backgroundImg});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          padding: 20px;
          overflow: hidden; /* Désactive le scroll */
          position: fixed; /* Fixe le conteneur */
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }

        /* ====== Card Login avec largeur augmentée ====== */
        .login-card {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 24px;
          padding: 40px 45px; /* Padding augmenté */
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.25),
            0 8px 20px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 420px; /* Largeur augmentée de 360px à 420px */
          text-align: left;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.4);
          overflow: hidden; /* Désactive tout scroll dans la carte */
          backdrop-filter: blur(10px);
          animation: cardEntrance 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          /* Désactive la sélection de texte et le drag */
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          -webkit-user-drag: none;
        }

        /* Barre supérieure élégante */
        .login-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, 
            #2a2a2a 0%, 
            #444444 50%, 
            #2a2a2a 100%);
          z-index: 2;
          border-radius: 24px 24px 0 0;
        }

        /* ====== Header ====== */
        .login-header {
          margin-bottom: 32px;
          text-align: center;
          /* Empêche le drag des éléments du header */
          user-select: none;
          -webkit-user-select: none;
        }

        .login-header h1 {
          font-size: 28px; /* Légèrement augmenté */
          margin-bottom: 8px; /* Augmenté */
          color: #2a2a2a;
          font-weight: 700;
          letter-spacing: -0.3px;
          /* Empêche la sélection */
          user-select: none;
          -webkit-user-select: none;
        }

        .login-subtitle {
          color: #666;
          font-size: 14px; /* Augmenté */
          font-weight: 500;
          line-height: 1.5;
          margin-top: 15px;
          user-select: none;
          -webkit-user-select: none;
        }

        /* ====== Badge Admin ====== */
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px; /* Augmenté */
          background: rgba(42, 42, 42, 0.08);
          padding: 12px 20px; /* Augmenté */
          border-radius: 20px; /* Augmenté */
          margin-bottom: 24px; /* Augmenté */
          font-size: 14px; /* Augmenté */
          font-weight: 600;
          color: #2a2a2a;
          letter-spacing: 0.2px;
          border: 1px solid rgba(42, 42, 42, 0.12);
          user-select: none;
          -webkit-user-select: none;
        }

        /* ====== Form Groups ====== */
        .form-group {
          margin-bottom: 25px; /* Augmenté */
          position: relative;
        }

        .input-label {
          display: block;
          margin-bottom: 8px; /* Augmenté */
          color: #444;
          font-weight: 600;
          font-size: 14px; /* Augmenté */
          letter-spacing: 0.1px;
          user-select: none;
          -webkit-user-select: none;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 18px; /* Augmenté */
          color: #777;
          width: 18px; /* Augmenté */
          height: 18px; /* Augmenté */
          z-index: 2;
          user-select: none;
          -webkit-user-select: none;
        }

        /* ====== Inputs ====== */
        .login-card input {
          width: 100%;
          padding: 16px 18px 16px 52px; /* Augmenté */
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          font-size: 15px; /* Augmenté */
          font-family: inherit;
          transition: all 0.2s;
          background: rgba(255, 255, 255, 0.9);
          color: #222;
          font-weight: 500;
          height: 50px; /* Augmenté */
          /* Permet la sélection du texte dans l'input seulement */
          user-select: auto;
          -webkit-user-select: auto;
        }

        .login-card input:hover {
          border-color: #b0b0b0;
          background: white;
        }

        .login-card input:focus {
          outline: none;
          border-color: #2a2a2a;
          box-shadow: 0 0 0 4px rgba(42, 42, 42, 0.1);
          background: white;
        }

        .login-card input.error {
          border-color: #dc2626;
          background: #fef2f2;
        }

        .login-card input::placeholder {
          color: #999;
          font-weight: 400;
          font-size: 14px; /* Augmenté */
        }

        .password-toggle {
          position: absolute;
          right: 18px; /* Augmenté */
          background: none;
          border: none;
          color: #777;
          cursor: pointer;
          padding: 8px; /* Augmenté */
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s;
          user-select: none;
          -webkit-user-select: none;
          -webkit-user-drag: none;
        }

        .password-toggle:hover {
          color: #2a2a2a;
          background: rgba(42, 42, 42, 0.08);
        }

        /* ====== Error Messages ====== */
        .error-message {
          display: flex;
          align-items: center;
          gap: 6px; /* Augmenté */
          color: #dc2626;
          font-size: 13px; /* Augmenté */
          margin-top: 6px; /* Augmenté */
          font-weight: 500;
          padding-left: 4px; /* Augmenté */
          user-select: none;
          -webkit-user-select: none;
        }

        .error-icon {
          width: 14px; /* Augmenté */
          height: 14px; /* Augmenté */
          flex-shrink: 0;
          user-select: none;
          -webkit-user-select: none;
        }

        /* ====== Forgot Password ====== */
        .forgot-password-container {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          margin-bottom: 25px; /* Augmenté */
          margin-top: 8px; /* Augmenté */
          user-select: none;
          -webkit-user-select: none;
        }

        .forgot-password {
          color: #555;
          font-size: 13px; /* Augmenté */
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          padding: 6px 10px; /* Augmenté */
          border-radius: 6px;
          transition: all 0.2s;
          white-space: nowrap;
          user-select: none;
          -webkit-user-select: none;
          -webkit-user-drag: none;
        }

        .forgot-password:hover {
          color: #2a2a2a;
          background: rgba(42, 42, 42, 0.05);
        }

        /* ====== Button ====== */
        .login-button {
          width: 100%;
          padding: 16px; /* Augmenté */
          background: #2a2a2a;
          color: white;
          font-size: 15px; /* Augmenté */
          font-weight: 600;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.2px;
          box-shadow: 0 4px 12px rgba(42, 42, 42, 0.2);
          height: 50px; /* Augmenté */
          display: flex;
          align-items: center;
          justify-content: center;
          user-select: none;
          -webkit-user-select: none;
          -webkit-user-drag: none;
        }

        .login-button:hover:not(:disabled) {
          background: #333333;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(42, 42, 42, 0.25);
        }

        .login-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .login-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }

        .button-loader {
          display: inline-block;
          width: 18px; /* Augmenté */
          height: 18px; /* Augmenté */
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
          margin-right: 10px; /* Augmenté */
          user-select: none;
          -webkit-user-select: none;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ====== Security Footer ====== */
        .security-footer {
          margin-top: 30px; /* Augmenté */
          padding-top: 20px; /* Augmenté */
          border-top: 1px solid rgba(0, 0, 0, 0.08);
          text-align: center;
          font-size: 12px; /* Augmenté */
          color: #777;
          font-weight: 500;
          letter-spacing: 0.2px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px; /* Augmenté */
          user-select: none;
          -webkit-user-select: none;
        }

        /* ====== General Error ====== */
        .general-error {
          background: #fee;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 14px; /* Augmenté */
          border-radius: 10px;
          margin-bottom: 25px; /* Augmenté */
          font-size: 14px; /* Augmenté */
          font-weight: 500;
          text-align: center;
          line-height: 1.5;
          user-select: none;
          -webkit-user-select: none;
        }

        /* ====== Responsive ====== */
        @media (max-width: 480px) {
          .login-page {
            padding: 20px 15px;
          }

          .login-card {
            padding: 35px 30px;
            max-width: 100%;
            border-radius: 20px;
          }

          .login-header h1 {
            font-size: 26px;
          }

          .login-subtitle {
            font-size: 13px;
          }

          .forgot-password-container {
            justify-content: flex-start;
          }

          .forgot-password {
            align-self: flex-start;
          }
        }

        @media (max-height: 700px) {
          .login-card {
            padding: 30px 35px;
          }
          
          .form-group {
            margin-bottom: 20px;
          }
          
          .forgot-password-container {
            margin-bottom: 20px;
          }
          
          .login-header {
            margin-bottom: 28px;
          }
        }

        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ====== Focus visible ====== */
        button:focus-visible,
        a:focus-visible,
        input:focus-visible {
          outline: 2px solid rgba(42, 42, 42, 0.5);
          outline-offset: 2px;
        }

        /* ====== Prévention du zoom sur mobile ====== */
        @media (max-width: 768px) {
          input, textarea, select {
            font-size: 16px !important; /* Empêche le zoom sur iOS */
          }
        }
        `}
      </style>

      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <div className="admin-badge">
              <Shield size={16} /> {/* Augmenté */}
              <span>PANEL ADMINISTRATEUR</span>
            </div>
            <h1>Connexion Sécurisée</h1>
          </div>

          {errors.general && (
            <div className="general-error">
              <AlertCircle size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="input-label">
                Identifiant Administrateur
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} /> {/* Augmenté */}
                <input
                  type="email"
                  name="email"
                  placeholder="admin@organisation.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "error" : ""}
                  autoComplete="username"
                  required
                />
              </div>
              {errors.email && (
                <div className="error-message">
                  <AlertCircle className="error-icon" size={14} /> {/* Augmenté */}
                  {errors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="input-label">
                Mot de Passe Administrateur
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} /> {/* Augmenté */}
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />} {/* Augmenté */}
                </button>
              </div>
              {errors.password && (
                <div className="error-message">
                  <AlertCircle className="error-icon" size={14} /> {/* Augmenté */}
                  {errors.password}
                </div>
              )}
            </div>

            <div className="forgot-password-container">
              <a 
                href="/admin/forgot-password"
                className="forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/admin/forgot-password');
                }}
                aria-label="Mot de passe oublié"
              >
                Mot de passe oublié ?
              </a>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="button-loader"></span>
                  Connexion...
                </>
              ) : (
                "SE CONNECTER"
              )}
            </button>

            {/* Séparateur supprimé */}

            <div className="security-footer">
              <Shield size={14} /> {/* Augmenté */}
              <span>Protection avancée • Accès surveillé</span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}