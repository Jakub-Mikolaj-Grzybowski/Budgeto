import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SkeletonLoader } from '../components/SkeletonLoader';

const TYPE_CONFIG = [
  { type: 0, label: 'Przychody', color: 'var(--accent-green)', emptyMsg: 'Brak kategorii przychodow' },
  { type: 1, label: 'Wydatki', color: 'var(--accent-red)', emptyMsg: 'Brak kategorii wydatkow' },
  { type: 2, label: 'Aktywa', color: 'var(--accent-blue)', emptyMsg: 'Brak kategorii aktywow' },
  { type: 3, label: 'Zobowiazania', color: 'var(--accent-amber)', emptyMsg: 'Brak kategorii zobowiazan' },
];

export function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', icon: '', type: 1 });
  const [confirmId, setConfirmId] = useState(null);

  const loadData = useCallback(() => {
    setLoading(true);
    api.categories.getAll()
      .then(data => setCategories(data || []))
      .catch(err => toast.error(err?.message || 'Błąd podczas ładowania danych'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  function openAdd() {
    setForm({ name: '', icon: '', type: 1 });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.categories.create({
        name: form.name,
        icon: form.icon || null,
        type: parseInt(form.type)
      });
      setShowModal(false);
      loadData();
      toast.success('Kategoria dodana');
    } catch (err) {
      toast.error(err?.message || 'Nie udało się dodać kategorii');
    }
  }

  async function handleDelete() {
    try {
      await api.categories.delete(confirmId);
      setConfirmId(null);
      loadData();
      toast.success('Kategoria usunięta');
    } catch (err) {
      setConfirmId(null);
      toast.error(err?.message || 'Nie udało się usunąć kategorii');
    }
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Kategorie</h1>
          <p>Zarzadzaj kategoriami przychodow, wydatkow i wartosci netto</p>
        </div>
        <button className="btn-primary-custom" onClick={openAdd}>+ Nowa kategoria</button>
      </div>

      {loading ? (
        <div className="card"><SkeletonLoader rows={8} /></div>
      ) : (
        <>
          {TYPE_CONFIG.map(({ type, label, color, emptyMsg }) => {
            const items = categories.filter(c => c.type === type);
            return (
              <div key={type} className="card" style={{ marginBottom: 20 }}>
                <h3 className="card-title" style={{ marginBottom: 16, color }}>{label}</h3>
                {items.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{emptyMsg}</div>
                ) : (
                  <div className="category-grid">
                    {items.map(c => (
                      <div key={c.id} className="category-card">
                        <div className="category-info">
                          <span className="category-name">{c.name}</span>
                        </div>
                        <button className="btn-danger-custom" onClick={() => setConfirmId(c.id)}>Usun</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </>
      )}

      <ConfirmDialog
        open={confirmId !== null}
        message="Czy na pewno chcesz usunąć tę kategorię?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Nowa kategoria</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nazwa</label>
                <input className="form-input" placeholder="Np. Subskrypcje"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Typ</label>
                <select className="form-select" value={form.type}
                  onChange={e => setForm({ ...form, type: parseInt(e.target.value) })}>
                  <option value={1}>Wydatek</option>
                  <option value={0}>Przychod</option>
                  <option value={2}>Aktywo</option>
                  <option value={3}>Zobowiazanie</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary-custom" onClick={() => setShowModal(false)}>Anuluj</button>
                <button type="submit" className="btn-primary-custom">Dodaj kategorie</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
