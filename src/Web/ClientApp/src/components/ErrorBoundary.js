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
        <div className="error-boundary">
          <div className="error-boundary-icon">⚠️</div>
          <h2>Coś poszło nie tak</h2>
          <p>
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
