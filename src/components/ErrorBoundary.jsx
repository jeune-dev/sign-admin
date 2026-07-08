import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * Filet de sécurité global : sans ça, une erreur de render n'importe où dans
 * l'arbre (ex: accès à une propriété d'un objet undefined) fait planter
 * toute l'app en écran blanc, sans aucun message pour l'utilisateur.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Erreur non gérée capturée par ErrorBoundary :', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            minHeight: '100vh',
            padding: '24px',
            textAlign: 'center',
            color: '#6b7280',
          }}
        >
          <AlertTriangle size={48} color="#ef4444" />
          <h2 style={{ margin: 0, color: '#111827' }}>Une erreur est survenue</h2>
          <p style={{ margin: 0, maxWidth: 420 }}>
            L'application a rencontré un problème inattendu. Essayez de recharger la page ;
            si le problème persiste, contactez le support technique.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              background: '#111827',
              color: '#fff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
