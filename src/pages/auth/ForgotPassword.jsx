import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Mail, Shield, ArrowLeft, CheckCircle2 } from "lucide-react";
import "../../assets/css/Login.css";
import { forgotPasswordAdmin, validateForgotPasswordForm, handleApiError } from "../../service/auth/authService";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    document.title = "SIGN APP | Mot de passe oublié";
  }, []);

  const handleChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForgotPasswordForm(email);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsLoading(true);
    try {
      const message = await forgotPasswordAdmin(email);
      // Le message générique renvoyé par le backend est affiché tel quel —
      // il ne révèle jamais si le compte existe (anti-énumération).
      setSent(true);
      toast.success(message || "Si ce compte existe, un lien a été envoyé.", { autoClose: 5000 });
    } catch (error) {
      toast.error(handleApiError(error), { autoClose: 4000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <ToastContainer position="top-right" newestOnTop pauseOnHover closeOnClick draggable />

      <div className="login-card">
        <div className="admin-badge">
          <Shield size={12} className="badge-icon" />
          <span>PANEL ADMINISTRATEUR</span>
        </div>
        <hr className="login-divider" />

        {sent ? (
          <div style={{ textAlign: "center", padding: "8px 0 4px" }}>
            <CheckCircle2 size={40} color="#18181b" style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6, marginBottom: 22 }}>
              Si cette adresse email est associée à un compte administrateur valide,
              un lien de réinitialisation vient de vous être envoyé. Consultez votre
              boîte de réception (et vos spams).
            </p>
            <Link to="/sign/login" className="forgot-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <ArrowLeft size={14} /> Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <p style={{ fontSize: 13, color: "#71717a", marginBottom: 20, lineHeight: 1.5 }}>
              Saisissez votre adresse email administrateur. Si elle correspond à un
              compte valide, un lien de réinitialisation vous sera envoyé.
            </p>

            <div className="form-group">
              <label>Email</label>
              <div className={`input-wrapper ${errors.email ? "error" : ""}`}>
                <Mail className="input-icon" size={16} />
                <input
                  type="email"
                  name="email"
                  placeholder="Entrez votre adresse email"
                  value={email}
                  onChange={handleChange}
                  autoComplete="off"
                />
              </div>
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Envoi..." : "ENVOYER LE LIEN"}
            </button>

            <div className="login-footer">
              <Link to="/sign/login" className="forgot-link" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <ArrowLeft size={14} /> Retour à la connexion
              </Link>
            </div>
          </form>
        )}
      </div>

      <p className="login-copyright">© 2025 SIGN APP — Tous droits réservés</p>
    </div>
  );
}
