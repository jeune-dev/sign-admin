import React, { useEffect, useState } from 'react';
import { Smartphone, Apple, Save, Loader2, AlertTriangle } from 'lucide-react';
import SwalCustom from '../../../utils/swal.config';
import {
  listerAppVersions,
  creerAppVersion,
  modifierAppVersion,
} from '../../../service/admin/appVersionService';
import '../../../assets/css/AppVersionPage.css';

const EMPTY_FORM = {
  id: null,
  latest_version: '',
  minimum_version: '',
  force_update: false,
  title: 'Nouvelle version disponible',
  subtitle: '',
  message: '',
  update_button: 'Mettre à jour',
  later_button: 'Plus tard',
  store_url: '',
  is_active: true,
};

/* Une carte par plateforme — chaque plateforme a sa propre configuration
 * indépendante (Android peut être en force_update pendant qu'iOS ne l'est
 * pas, par ex.). "Enregistrer" crée la config si elle n'existe pas encore
 * pour cette plateforme, sinon la met à jour (PUT). */
function PlatformCard({ platform, icon, initialConfig, onSaved }) {
  const Icon = icon;
  const [form, setForm] = useState(initialConfig || { ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(initialConfig || { ...EMPTY_FORM });
  }, [initialConfig]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.latest_version || !form.minimum_version || !form.store_url) {
      SwalCustom.fire({
        icon: 'warning',
        title: 'Champs requis',
        text: 'Version la plus récente, version minimale et URL du Store sont obligatoires.',
      });
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form, platform };
      delete payload.id;

      let saved;
      if (form.id) {
        saved = await modifierAppVersion(form.id, payload);
      } else {
        saved = await creerAppVersion(payload);
      }

      SwalCustom.fire({
        icon: 'success',
        title: 'Enregistré',
        timer: 1800,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      onSaved(saved);
    } catch (err) {
      SwalCustom.fire({
        icon: 'error',
        title: 'Erreur',
        text: err?.response?.data?.message || 'Impossible d\'enregistrer la configuration',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="appversion-card">
      <div className="appversion-card-header">
        <div className="appversion-card-title">
          <Icon size={20} />
          <span>{platform === 'android' ? 'Android' : 'iOS'}</span>
        </div>
        {form.force_update && (
          <span className="appversion-badge-force">
            <AlertTriangle size={13} /> Mise à jour obligatoire active
          </span>
        )}
      </div>

      <div className="appversion-grid">
        <div className="appversion-field">
          <label>Version la plus récente *</label>
          <input
            type="text"
            placeholder="Ex: 1.2.0"
            value={form.latest_version}
            onChange={handleChange('latest_version')}
          />
        </div>
        <div className="appversion-field">
          <label>Version minimale requise *</label>
          <input
            type="text"
            placeholder="Ex: 1.1.0"
            value={form.minimum_version}
            onChange={handleChange('minimum_version')}
          />
        </div>

        <div className="appversion-field appversion-field-full">
          <label>URL de la fiche Store *</label>
          <input
            type="text"
            placeholder="https://play.google.com/store/apps/details?id=..."
            value={form.store_url}
            onChange={handleChange('store_url')}
          />
        </div>

        <div className="appversion-field appversion-field-full">
          <label>Titre du popup</label>
          <input
            type="text"
            value={form.title}
            onChange={handleChange('title')}
          />
        </div>

        <div className="appversion-field">
          <label>Sous-titre</label>
          <input
            type="text"
            placeholder="Ex: Version 1.2.0"
            value={form.subtitle || ''}
            onChange={handleChange('subtitle')}
          />
        </div>
        <div className="appversion-field">
          <label>&nbsp;</label>
          <div className="appversion-toggle-row">
            <label className="appversion-switch">
              <input
                type="checkbox"
                checked={!!form.force_update}
                onChange={handleChange('force_update')}
              />
              <span className="appversion-switch-slider" />
            </label>
            <span>Forcer la mise à jour (bloquant)</span>
          </div>
        </div>

        <div className="appversion-field appversion-field-full">
          <label>Message</label>
          <textarea
            rows={3}
            placeholder="Cette version améliore les performances, corrige plusieurs bugs..."
            value={form.message || ''}
            onChange={handleChange('message')}
          />
        </div>

        <div className="appversion-field">
          <label>Texte bouton "Mettre à jour"</label>
          <input
            type="text"
            value={form.update_button}
            onChange={handleChange('update_button')}
          />
        </div>
        <div className="appversion-field">
          <label>Texte bouton "Plus tard"</label>
          <input
            type="text"
            value={form.later_button}
            onChange={handleChange('later_button')}
          />
        </div>

        <div className="appversion-field">
          <label>&nbsp;</label>
          <div className="appversion-toggle-row">
            <label className="appversion-switch">
              <input
                type="checkbox"
                checked={!!form.is_active}
                onChange={handleChange('is_active')}
              />
              <span className="appversion-switch-slider" />
            </label>
            <span>Configuration active</span>
          </div>
        </div>
      </div>

      <div className="appversion-card-footer">
        <button className="appversion-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 size={16} className="appversion-spin" /> : <Save size={16} />}
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}

export default function AppVersionPage() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await listerAppVersions();
      setConfigs(Array.isArray(data) ? data : []);
    } catch {
      SwalCustom.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les configurations de version',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const androidConfig = configs.find((c) => c.platform === 'android') || null;
  const iosConfig = configs.find((c) => c.platform === 'ios') || null;

  const handleSaved = (saved) => {
    setConfigs((prev) => {
      const others = prev.filter((c) => c.platform !== saved.platform);
      return [...others, saved];
    });
  };

  return (
    <div className="appversion-page">
      <div className="appversion-page-header">
        <h1>Mises à jour de l'application</h1>
        <p>
          Gère la version minimale requise et les messages affichés aux utilisateurs — pris en
          compte immédiatement, sans republier l'application.
        </p>
      </div>

      {loading ? (
        <div className="appversion-loading">
          <Loader2 size={28} className="appversion-spin" />
        </div>
      ) : (
        <div className="appversion-cards">
          <PlatformCard
            platform="android"
            icon={Smartphone}
            initialConfig={androidConfig}
            onSaved={handleSaved}
          />
          <PlatformCard
            platform="ios"
            icon={Apple}
            initialConfig={iosConfig}
            onSaved={handleSaved}
          />
        </div>
      )}
    </div>
  );
}
