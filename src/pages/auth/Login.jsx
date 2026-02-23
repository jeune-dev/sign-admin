import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react";

import "../../assets/css/Login.css";
import backgroundImg from "../../assets/images/image_de_fond.png";
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
    document.title = "SIGN APP | Se Connecter";
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation côté client
    const validationErrors = validateLoginForm(formData.identifiant, formData.password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      Object.values(validationErrors).forEach((err) =>
        toast.error(err, { autoClose: 4000 })
      );
      return;
    }

    setIsLoading(true);

    try {
      const utilisateur = await login(formData.identifiant, formData.password);

      // Vérifier rôle admin
      if (utilisateur.role === "Admin") {
        toast.success("Connexion réussie !", { autoClose: 2000 });
        navigate("/sign/admin-dashboard");
      } else {
        toast.error("Identifiant ou mot de passe incorrect.", { autoClose: 4000 });
      }
    } catch (error) {
      const errorMessage = handleApiError(error);
      console.error("Erreur serveur : ", errorMessage);
      toast.error(errorMessage, { autoClose: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${backgroundImg})` }}>
      {/* ToastContainer doit être présent */}
      <ToastContainer 
        position="top-right" 
        newestOnTop 
        pauseOnHover 
        closeOnClick 
        draggable
      />
      
      <div className="login-card">
        <div className="login-header">
          <div className="admin-badge">
            <Shield size={16} />
            <span>PANEL ADMINISTRATEUR</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="input-label">Identifiant</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                type="text"
                name="identifiant"
                placeholder="admin@organisation.com"
                value={formData.identifiant}
                onChange={handleChange}
                className={errors.identifiant ? "error" : ""}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="input-label">Mot de passe</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "error" : ""}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Connexion..." : "SE CONNECTER"}
          </button>
        </form>
      </div>
    </div>
  );
}