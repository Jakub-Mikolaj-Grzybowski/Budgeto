export function KeyboardShortcutsHelp({ onClose }) {
  const shortcuts = [
    { keys: ['Alt', '1'], desc: 'Panel główny' },
    { keys: ['Alt', '2'], desc: 'Transakcje' },
    { keys: ['Alt', '3'], desc: 'Budżety' },
    { keys: ['Alt', '4'], desc: 'Majątek' },
    { keys: ['Alt', '5'], desc: 'Kategorie' },
    { keys: ['Alt', 'N'], desc: 'Nowa transakcja' },
    { keys: ['Alt', '/'], desc: 'Pokaż/ukryj tę pomoc' },
    { keys: ['Esc'], desc: 'Zamknij' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 9999
    }} onClick={onClose}>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-color)',
        borderRadius: 14, padding: '28px 32px', minWidth: 320,
        boxShadow: '0 8px 40px rgba(0,0,0,0.5)'
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>Skróty klawiszowe</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {shortcuts.map(({ keys, desc }) => (
            <div key={desc} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24 }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{desc}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {keys.map((k, i) => (
                  <span key={i}>
                    <kbd style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: 5,
                      background: 'var(--bg-input)', border: '1px solid var(--border-color)',
                      fontSize: '0.78rem', fontFamily: 'monospace', color: 'var(--text-primary)',
                      boxShadow: '0 2px 0 var(--border-color)'
                    }}>{k}</kbd>
                    {i < keys.length - 1 && <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', margin: '0 2px' }}>+</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p style={{ margin: '16px 0 0', fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          Skróty działają gdy kursor nie jest w polu tekstowym
        </p>
      </div>
    </div>
  );
}
