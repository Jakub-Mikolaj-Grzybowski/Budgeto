import { useState, useCallback } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

export function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  function isActive(path) {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }

  const handleNewTransaction = useCallback(() => {
    navigate('/transactions');
    // Małe opóźnienie by strona się załadowała zanim wyślemy event
    setTimeout(() => window.dispatchEvent(new CustomEvent('budgeto:quickadd')), 100);
  }, [navigate]);

  const handleToggleHelp = useCallback((val) => {
    setShowHelp(prev => val !== undefined ? !!val : !prev);
  }, []);

  useKeyboardShortcuts({ onNewTransaction: handleNewTransaction, onToggleHelp: handleToggleHelp });

  return (
    <div>
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        &#9776;
      </button>

      <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          Budge<span>to</span>
        </div>
        <ul className="sidebar-nav">
          <li>
            <NavLink to="/" className={isActive('/') ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              Panel glowny
            </NavLink>
          </li>
          <li>
            <NavLink to="/transactions" className={isActive('/transactions') ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
              Transakcje
            </NavLink>
          </li>
          <li>
            <NavLink to="/budgets" className={isActive('/budgets') ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
              </svg>
              Budzety
            </NavLink>
          </li>
          <li>
            <NavLink to="/net-worth" className={isActive('/net-worth') ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
              </svg>
              Wartosc netto
            </NavLink>
          </li>
          <li>
            <NavLink to="/categories" className={isActive('/categories') ? 'active' : ''} onClick={() => setSidebarOpen(false)}>
              <svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 9h16"/><path d="M4 15h16"/><path d="M10 3L8 21"/><path d="M16 3l-2 18"/>
              </svg>
              Kategorie
            </NavLink>
          </li>
        </ul>
        <button
          onClick={() => setShowHelp(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: '0.78rem', padding: '8px 16px',
            marginTop: 8, borderRadius: 8, transition: 'color 0.15s'
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <kbd style={{
            display: 'inline-block', padding: '1px 6px', borderRadius: 4,
            background: 'var(--bg-input)', border: '1px solid var(--border-color)',
            fontSize: '0.72rem', fontFamily: 'monospace'
          }}>Alt + /</kbd>
          Skróty klawiszowe
        </button>
      </nav>

      <main className="main-content">
        {children}
      </main>

      {showHelp && <KeyboardShortcutsHelp onClose={() => setShowHelp(false)} />}

      {sidebarOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', zIndex: 99
        }} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
