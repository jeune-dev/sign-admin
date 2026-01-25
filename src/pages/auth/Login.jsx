import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";

// Importer les images
import backgroundImg from "../../assets/images/v4_10.png";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
    // Clear error when user starts typing
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
      newErrors.email = "L'email est requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Veuillez entrer un email valide";
    }
    
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    // Simulation d'appel API
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("Connexion réussie:", formData);
      // Ici, tu ajouterais ta logique de connexion réelle
      alert("Connexion réussie !");
    } catch (error) {
      setErrors({ general: "Échec de la connexion. Veuillez réessayer." });
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
        }

        /* ====== Background sans filtre ====== */
        .login-page {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100vw;
          height: 100vh;
          background-image: url(${backgroundImg});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          padding: 20px;
        }

        /* ====== Card Login professionnelle ====== */
        .login-card {
          background: white;
          border-radius: 16px;
          padding: 40px 45px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          width: 100%;
          max-width: 420px;
          text-align: left;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.3);
          overflow: hidden;
        }

        /* ====== Header professionnel ====== */
        .login-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .login-header h1 {
          font-size: 32px;
          margin-bottom: 8px;
          color: #073257;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .login-subtitle {
          color: #666;
          font-size: 15px;
          font-weight: 500;
        }

        /* ====== Form Groups optimisés ====== */
        .form-group {
          margin-bottom: 22px;
        }

        .input-label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 600;
          font-size: 14px;
          letter-spacing: -0.1px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          color: #666;
          width: 18px;
          height: 18px;
          z-index: 2;
        }

        /* ====== Inputs professionnels ====== */
        .login-card input {
          width: 100%;
          padding: 15px 16px 15px 46px;
          border: 2px solid #ddd;
          border-radius: 10px;
          font-size: 15px;
          font-family: inherit;
          transition: all 0.2s;
          background: #f8f9fa;
          color: #222;
          font-weight: 500;
        }

        .login-card input:hover {
          border-color: #bbb;
          background: white;
        }

        .login-card input:focus {
          outline: none;
          border-color: #073257;
          box-shadow: 0 0 0 3px rgba(7, 50, 87, 0.15);
          background: white;
        }

        .login-card input.error {
          border-color: #e53e3e;
          background: #fff5f5;
        }

        .login-card input::placeholder {
          color: #777;
          font-weight: 400;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          color: #666;
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          transition: all 0.2s;
        }

        .password-toggle:hover {
          color: #073257;
          background: #f0f0f0;
        }

        /* ====== Error Messages ====== */
        .error-message {
          display: flex;
          align-items: center;
          gap: 6px;
          color: #c53030;
          font-size: 13px;
          margin-top: 6px;
          font-weight: 500;
          padding-left: 3px;
        }

        .error-icon {
          width: 14px;
          height: 14px;
          flex-shrink: 0;
        }

        /* ====== Remember Me ====== */
        .remember-forgot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
          margin-top: 8px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          user-select: none;
          padding: 4px 6px;
          border-radius: 6px;
          transition: background 0.2s;
        }

        .remember-me:hover {
          background: #f7f7f7;
        }

        .remember-checkbox {
          width: 18px;
          height: 18px;
          border-radius: 5px;
          border: 2px solid #ccc;
          background: white;
          position: relative;
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .remember-checkbox.checked {
          background: #073257;
          border-color: #073257;
        }

        .remember-checkbox.checked::after {
          content: '';
          position: absolute;
          left: 5px;
          top: 2px;
          width: 5px;
          height: 9px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }

        .remember-text {
          color: #555;
          font-size: 14px;
          font-weight: 500;
          white-space: nowrap;
        }

        /* ====== Button professionnel ====== */
        .login-button {
          width: 100%;
          padding: 16px;
          background: #073257;
          color: white;
          font-size: 16px;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 15px rgba(7, 50, 87, 0.2);
        }

        .login-button:hover:not(:disabled) {
          background: #0a3a83;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(7, 50, 87, 0.3);
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
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 0.8s linear infinite;
          margin-right: 10px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* ====== Links ====== */
        .forgot-password {
          color: #073257;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          padding: 5px 8px;
          border-radius: 5px;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .forgot-password:hover {
          color: #0a3a83;
          background: #f0f0f0;
          text-decoration: none;
        }

        /* ====== Separator élégant ====== */
        .separator {
          display: flex;
          align-items: center;
          text-align: center;
          margin: 25px 0;
          color: #666;
          font-size: 14px;
          font-weight: 600;
          position: relative;
        }

        .separator::before,
        .separator::after {
          content: '';
          flex: 1;
          border-bottom: 2px solid #eee;
        }

        .separator span {
          padding: 0 15px;
          background: white;
        }

        /* ====== Create Account ====== */
        .create-account {
          display: block;
          text-align: center;
          padding: 15px;
          background: #f8f9fa;
          border: 2px solid #ddd;
          border-radius: 10px;
          color: #073257;
          font-weight: 700;
          text-decoration: none;
          font-size: 15px;
          transition: all 0.3s;
          cursor: pointer;
        }

        .create-account:hover {
          background: white;
          border-color: #073257;
          color: #0a3a83;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* ====== Responsive ====== */
        @media (max-width: 480px) {
          .login-page {
            padding: 15px;
          }

          .login-card {
            padding: 35px 25px;
            max-width: 100%;
          }

          .login-header h1 {
            font-size: 28px;
          }

          .login-subtitle {
            font-size: 14px;
          }

          .remember-forgot {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .forgot-password {
            align-self: flex-start;
            padding-left: 0;
          }
        }

        @media (max-height: 700px) {
          .login-card {
            padding: 30px 35px;
          }
          
          .form-group {
            margin-bottom: 18px;
          }
          
          .remember-forgot {
            margin-bottom: 20px;
          }
          
          .separator {
            margin: 20px 0;
          }
          
          .login-header {
            margin-bottom: 25px;
          }
        }

        /* ====== Styles de curseur ====== */
        button, 
        .remember-me,
        .forgot-password,
        .create-account {
          cursor: pointer;
        }

        /* ====== Styles pour les textes non-cliquables ====== */
        .login-header,
        .login-subtitle,
        .input-label,
        .separator span {
          cursor: default;
          user-select: none;
        }

        /* ====== Focus visible pour l'accessibilité ====== */
        button:focus-visible,
        a:focus-visible,
        input:focus-visible,
        .remember-me:focus-visible {
          outline: 2px solid rgba(7, 50, 87, 0.5);
          outline-offset: 2px;
        }
        `}
      </style>

      <div className="login-page">
        <div className="login-card">
          <div className="login-header">
            <h1>Se connecter</h1>
            <p className="login-subtitle">Accédez à votre espace personnel</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="input-label">Adresse email</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
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
                  <AlertCircle className="error-icon" size={14} />
                  {errors.email}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="input-label">Mot de passe</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Votre mot de passe"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? "error" : ""}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Cacher le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <div className="error-message">
                  <AlertCircle className="error-icon" size={14} />
                  {errors.password}
                </div>
              )}
            </div>

            <div className="remember-forgot">
              <div 
                className="remember-me" 
                onClick={() => setRememberMe(!rememberMe)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setRememberMe(!rememberMe)}
              >
                <div className={`remember-checkbox ${rememberMe ? 'checked' : ''}`} />
                <span className="remember-text">Se souvenir de moi</span>
              </div>
              <a 
                href="/forgot-password" 
                className="forgot-password"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/forgot-password');
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
                "Connexion"
              )}
            </button>

            <div className="separator">
              <span>OU</span>
            </div>

            <a 
              href="/Inscription" 
              className="create-account"
              onClick={(e) => {
                e.preventDefault();
                navigate('/Inscription');
              }}
              aria-label="Créer un nouveau compte"
            >
              Créer un nouveau compte
            </a>
          </form>
        </div>
      </div>
    </>
  );
}