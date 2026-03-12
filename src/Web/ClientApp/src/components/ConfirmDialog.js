
export function ConfirmDialog({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" style={{ maxWidth: 340 }} onClick={e => e.stopPropagation()}>
        <p style={{ marginBottom: 20, color: 'var(--text-primary)' }}>{message}</p>
        <div className="modal-actions">
          <button className="btn-secondary-custom" onClick={onCancel}>Anuluj</button>
          <button className="btn-danger-custom" onClick={onConfirm}>Usuń</button>
        </div>
      </div>
    </div>
  );
}
