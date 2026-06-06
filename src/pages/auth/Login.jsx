import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";
import "../../assets/css/Login.css";
import { login, validateLoginForm, handleApiError } from "../../service/auth/authService";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifiant: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "SIGN APP | Connexion";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateLoginForm(formData.identifiant, formData.password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach((err) => toast.error(err, { autoClose: 4000 }));
      return;
    }
    setIsLoading(true);
    try {
      const utilisateur = await login(formData.identifiant, formData.password);
      if (utilisateur.role === "Admin") {
        toast.success("Connexion réussie !", { autoClose: 2000 });
        sessionStorage.setItem('adminJustLoggedIn', 'true');
        navigate("/sign/admin-dashboard");
      } else {
        toast.error("Accès non autorisé. Zone réservée aux administrateurs.", { autoClose: 4000 });
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage, { autoClose: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" newestOnTop pauseOnHover closeOnClick draggable />

      <div className="login-card">

        {/* Badge Panel Administrateur */}
        <div className="admin-badge">
          <Shield size={12} className="badge-icon" />
          <span>PANEL ADMINISTRATEUR</span>
        </div>
        <hr className="login-divider" />

        <form onSubmit={handleSubmit} noValidate autoComplete="off">
          <div className="form-group">
            <label>Identifiant</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={16} />
              <input
                type="text"
                name="identifiant"
                placeholder="Entrez votre identifiant"
                value={formData.identifiant}
                onChange={handleChange}
                className={errors.identifiant ? "error" : ""}
                autoComplete="off"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readonly')}
              />
            </div>
            {errors.identifiant && <span className="error-text">{errors.identifiant}</span>}
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={16} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Entrez votre mot de passe"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
                autoComplete="new-password"
                readOnly
                onFocus={(e) => e.target.removeAttribute('readonly')}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Connexion..." : "SE CONNECTER"}
          </button>

          <div className="login-footer">
            <a href="#" className="forgot-link">Mot de passe oublié ?</a>
          </div>
        </form>
      </div>

      <p className="login-copyright">© 2025 SIGN APP — Tous droits réservés</p>
    </div>
  );
}
