import { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '60vh', gap: 16, textAlign: 'center', padding: 32
        }}>
          <div style={{ fontSize: '2.5rem' }}>⚠️</div>
          <h2 style={{ color: 'var(--text-primary)', margin: 0 }}>Coś poszło nie tak</h2>
          <p style={{ color: 'var(--text-muted)', margin: 0, maxWidth: 400 }}>
            {this.state.error?.message || 'Wystąpił nieoczekiwany błąd.'}
          </p>
          <button
            className="btn-primary-custom"
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
          >
            Odśwież stronę
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
