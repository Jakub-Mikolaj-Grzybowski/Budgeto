import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Globalne skróty klawiszowe (Alt + klawisz):
 *  Alt + 1  → Dashboard
 *  Alt + 2  → Transakcje
 *  Alt + 3  → Budżety
 *  Alt + 4  → Majątek (Net Worth)
 *  Alt + 5  → Kategorie
 *  Alt + N  → Nowa transakcja (QuickAdd)
 *  Alt + /  → Pokaż/ukryj pomoc skrótów
 *  Escape   → Zamknij overlay pomocy
 */
export function useKeyboardShortcuts({ onNewTransaction, onToggleHelp } = {}) {
  const navigate = useNavigate();

  useEffect(() => {
    function handler(e) {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) {
        if (e.key === 'Escape') { e.target.blur(); return; }
        return;
      }

      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        switch (e.key) {
          case '1': e.preventDefault(); navigate('/'); break;
          case '2': e.preventDefault(); navigate('/transactions'); break;
          case '3': e.preventDefault(); navigate('/budgets'); break;
          case '4': e.preventDefault(); navigate('/net-worth'); break;
          case '5': e.preventDefault(); navigate('/categories'); break;
          case 'n': case 'N': e.preventDefault(); onNewTransaction?.(); break;
          case '/': e.preventDefault(); onToggleHelp?.(); break;
          default: break;
        }
        return;
      }

      if (e.key === 'Escape') { onToggleHelp?.(false); return; }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, onNewTransaction, onToggleHelp]);
}
