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
    <div className="kbd-help-overlay" onClick={onClose}>
      <div className="kbd-help-dialog" onClick={e => e.stopPropagation()}>
        <div className="kbd-help-header">
          <h3 className="kbd-help-title">Skróty klawiszowe</h3>
          <button className="kbd-help-close" onClick={onClose}>&#10005;</button>
        </div>
        <div className="kbd-help-list">
          {shortcuts.map(({ keys, desc }) => (
            <div key={desc} className="kbd-help-row">
              <span className="kbd-help-desc">{desc}</span>
              <div className="kbd-help-keys">
                {keys.map((k, i) => (
                  <span key={i}>
                    <kbd className="kbd-help-key">{k}</kbd>
                    {i < keys.length - 1 && <span className="kbd-help-separator">+</span>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="kbd-help-footer">
          Skróty działają gdy kursor nie jest w polu tekstowym
        </p>
      </div>
    </div>
  );
}
