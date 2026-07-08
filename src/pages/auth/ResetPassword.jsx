import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Shield, CheckCircle2, XCircle } from "lucide-react";
import "../../assets/css/Login.css";
import { resetPasswordAdmin, validateResetPasswordForm, handleApiError } from "../../service/auth/authService";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.title = "SIGN APP | Réinitialisation du mot de passe";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    const validationErrors = validateResetPasswordForm(formData.newPassword, formData.confirmPassword);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      await resetPasswordAdmin(token, formData.newPassword, formData.confirmPassword);
      setDone(true);
      toast.success("Mot de passe réinitialisé avec succès !", { autoClose: 3000 });
      setTimeout(() => navigate("/sign/login"), 2500);
    } catch (error) {
      toast.error(handleApiError(error), { autoClose: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-card" style={{ textAlign: "center" }}>
          <div className="admin-badge">
            <Shield size={12} className="badge-icon" />
            <span>PANEL ADMINISTRATEUR</span>
          </div>
          <hr className="login-divider" />
          <XCircle size={40} color="#ef4444" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: 14, color: "#374151", marginBottom: 22 }}>
            Ce lien de réinitialisation est invalide. Veuillez refaire une demande.
          </p>
          <Link to="/sign/forgot-password" className="login-button" style={{ display: "block", textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>
            NOUVELLE DEMANDE
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <ToastContainer position="top-right" newestOnTop pauseOnHover closeOnClick draggable />

      <div className="login-card">
        <div className="admin-badge">
          <Shield size={12} className="badge-icon" />
          <span>PANEL ADMINISTRATEUR</span>
        </div>
        <hr className="login-divider" />

        {done ? (
          <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
            <CheckCircle2 size={40} color="#18181b" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>
              Votre mot de passe a été réinitialisé. Redirection vers la connexion...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <p style={{ fontSize: 13, color: "#71717a", marginBottom: 20, lineHeight: 1.5 }}>
              Choisissez un nouveau mot de passe (8 caractères min., majuscule,
              minuscule, chiffre et caractère spécial).
            </p>

            <div className="form-group">
              <label>Nouveau mot de passe</label>
              <div className={`input-wrapper ${errors.newPassword ? "error" : ""}`}>
                <Lock className="input-icon" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Entrez le nouveau mot de passe"
                  value={formData.newPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.newPassword && <span className="error-text">{errors.newPassword}</span>}
            </div>

            <div className="form-group">
              <label>Confirmer le mot de passe</label>
              <div className={`input-wrapper ${errors.confirmPassword ? "error" : ""}`}>
                <Lock className="input-icon" size={16} />
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirmez le mot de passe"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button type="button" className="password-toggle" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Réinitialisation..." : "RÉINITIALISER"}
            </button>
          </form>
        )}
      </div>

      <p className="login-copyright">© 2025 SIGN APP — Tous droits réservés</p>
    </div>
  );
}
