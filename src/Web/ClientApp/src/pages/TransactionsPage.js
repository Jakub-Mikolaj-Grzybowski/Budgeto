import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { api } from '../api';
import { formatCurrency, formatDateShort, groupByWeek, getDayName, getBudgetPeriodLabel, getPrevPeriod, getNextPeriod, getPeriodStartMonth, filterToPeriod, TransactionType } from '../utils';
import { QuickAddExpense } from '../components/QuickAddExpense';
import { CategoryChipSelector } from '../components/CategoryChipSelector';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SkeletonLoader } from '../components/SkeletonLoader';

function toDateObj(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toDateStr(date) {
  if (!date) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function TransactionsPage() {
  const now = new Date();
  const [periodMonth, setPeriodMonth] = useState(now.getMonth() + 1);
  const [periodYear, setPeriodYear] = useState(now.getFullYear());
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: '', amount: '', date: '', type: 1, categoryId: null, notes: '' });
  const [confirmId, setConfirmId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedWeeks, setCollapsedWeeks] = useState({});

  const loadData = useCallback(() => {
    setLoading(true);
    const { month: prevM, year: prevY } = getPeriodStartMonth(periodMonth, periodYear);
    Promise.all([
      api.transactions.getAll(prevM, prevY),
      api.transactions.getAll(periodMonth, periodYear),
      api.categories.getAll()
    ])
      .then(([txPrev, txCurr, cats]) => {
        const all = [...(txPrev || []), ...(txCurr || [])];
        setTransactions(filterToPeriod(all, periodMonth, periodYear));
        setCategories(cats || []);
      })
      .catch(err => toast.error(err?.message || 'Błąd podczas ładowania danych'))
      .finally(() => setLoading(false));
  }, [periodMonth, periodYear]);

  useEffect(() => { loadData(); }, [loadData]);

  useEffect(() => {
    function handleQuickAdd() { setShowQuickAdd(true); }
    window.addEventListener('budgeto:quickadd', handleQuickAdd);
    return () => window.removeEventListener('budgeto:quickadd', handleQuickAdd);
  }, []);

  function prevPeriod() {
    const p = getPrevPeriod(periodMonth, periodYear);
    setPeriodMonth(p.month); setPeriodYear(p.year);
  }

  function nextPeriod() {
    const p = getNextPeriod(periodMonth, periodYear);
    setPeriodMonth(p.month); setPeriodYear(p.year);
  }

  function openEdit(tx) {
    setForm({
      name: tx.name,
      amount: tx.amount.toString(),
      date: tx.date.split('T')[0],
      type: tx.type,
      categoryId: tx.categoryId,
      notes: tx.notes || ''
    });
    setEditingId(tx.id);
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name: form.name,
      amount: parseFloat(form.amount),
      date: form.date + 'T00:00:00',
      type: parseInt(form.type),
      categoryId: form.categoryId,
      notes: form.notes || null
    };
    try {
      await api.transactions.update(editingId, data);
      setShowModal(false);
      loadData();
      toast.success('Transakcja zaktualizowana');
    } catch (err) {
      toast.error(err?.message || 'Nie udało się zaktualizować transakcji');
    }
  }

  async function handleDelete() {
    try {
      await api.transactions.delete(confirmId);
      setConfirmId(null);
      loadData();
      toast.success('Transakcja usunięta');
    } catch (err) {
      setConfirmId(null);
      toast.error(err?.message || 'Nie udało się usunąć transakcji');
    }
  }

  const filteredCategories = categories.filter(c => c.type === parseInt(form.type));

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const q = searchQuery.toLowerCase().trim();
    return transactions.filter(t =>
      t.name.toLowerCase().includes(q) ||
      (t.categoryName && t.categoryName.toLowerCase().includes(q)) ||
      (t.notes && t.notes.toLowerCase().includes(q)) ||
      t.amount.toString().includes(q)
    );
  }, [transactions, searchQuery]);

  const weekGroups = groupByWeek(filteredTransactions);

  const totalIncome = filteredTransactions.filter(t => t.type === 0).reduce((s, t) => s + t.amount, 0);
  const totalExpense = filteredTransactions.filter(t => t.type === 1).reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h1>Transakcje</h1>
          <p>Zarzadzaj swoimi przychodami i wydatkami</p>
        </div>
        <div className="page-header-actions">
          <div className="month-selector">
            <button onClick={prevPeriod}>&lsaquo;</button>
            <span style={{ fontSize: '0.8rem' }}>{getBudgetPeriodLabel(periodMonth, periodYear)}</span>
            <button onClick={nextPeriod}>&rsaquo;</button>
          </div>
        </div>
      </div>

      {!loading && transactions.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <input
            className="form-input"
            placeholder="Szukaj transakcji..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ maxWidth: 400 }}
          />
        </div>
      )}

      {!loading && filteredTransactions.length > 0 && (
        <div className="tx-summary-row">
          <div className="summary-card income">
            <div className="summary-label">Przychody</div>
            <div className="summary-value">+{formatCurrency(totalIncome)}</div>
          </div>
          <div className="summary-card expense">
            <div className="summary-label">Wydatki</div>
            <div className="summary-value">-{formatCurrency(totalExpense)}</div>
          </div>
          <div className="summary-card balance">
            <div className="summary-label">Bilans</div>
            <div className="summary-value">{formatCurrency(totalIncome - totalExpense)}</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card"><SkeletonLoader rows={6} /></div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          <h3>Brak transakcji</h3>
          <p>Dodaj swoja pierwsza transakcje klikajac przycisk "+" na dole ekranu</p>
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="empty-state">
          <h3>Brak wynikow</h3>
          <p>Nie znaleziono transakcji pasujacych do &ldquo;{searchQuery}&rdquo;</p>
        </div>
      ) : (
        weekGroups.map(group => (
          <div className="week-group" key={group.weekLabel}>
            <div className="week-header" style={{ cursor: 'pointer', userSelect: 'none' }}
              onClick={() => setCollapsedWeeks(prev => ({ ...prev, [group.weekLabel]: !prev[group.weekLabel] }))}>
              <span className="week-header-label">
                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 16, fontSize: '0.7rem', color: 'var(--text-muted)', transition: 'transform 0.2s ease', transformOrigin: '50% 50%', transform: collapsedWeeks[group.weekLabel] ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
                {group.weekLabel}
              </span>
              <div className="week-header-totals">
                {group.income > 0 && (
                  <span className="week-header-income">+{formatCurrency(group.income)}</span>
                )}
                {group.expense > 0 && (
                  <span className="week-header-expense">-{formatCurrency(group.expense)}</span>
                )}
              </div>
            </div>
            {!collapsedWeeks[group.weekLabel] && (
            <div className="table-container" style={{ borderTop: 'none', borderRadius: '0 0 8px 8px', marginBottom: 0 }}>
              {group.transactions
                .slice()
                .sort((a, b) => new Date(b.date) - new Date(a.date) || b.id - a.id)
                .map(tx => (
                  <div className="week-tx-row" key={tx.id}>
                    <div className="week-tx-day">
                      <div>{getDayName(tx.date)}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 2 }}>
                        {formatDateShort(tx.date)}
                      </div>
                    </div>
                    <div className="week-tx-info">
                      <div className="week-tx-name">{tx.name}</div>
                      <div className="week-tx-category">
                        {tx.categoryName}
                        {tx.notes && <span style={{ marginLeft: 6, opacity: 0.7 }}>- {tx.notes}</span>}
                      </div>
                    </div>
                    <div
                      className="week-tx-amount"
                      style={{ color: tx.type === TransactionType.INCOME ? 'var(--accent-green)' : 'var(--accent-red)' }}
                    >
                      {tx.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(tx.amount)}
                    </div>
                    <div className="week-tx-actions">
                      <button className="week-tx-action-btn" onClick={() => openEdit(tx)}>&#9998;</button>
                      <button className="week-tx-action-btn delete" onClick={() => setConfirmId(tx.id)}>&#10005;</button>
                    </div>
                  </div>
                ))}
            </div>
            )}
          </div>
        ))
      )}

      <ConfirmDialog
        open={confirmId !== null}
        message="Czy na pewno chcesz usunąć tę transakcję?"
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
      />

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Edytuj transakcje</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nazwa</label>
                <input className="form-input" placeholder="Np. Zakupy spozywcze"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Kwota (PLN)</label>
                  <input className="form-input" type="number" step="0.01" min="0.01" placeholder="0.00"
                    value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Data</label>
                  <DatePicker
                    className="form-input"
                    selected={toDateObj(form.date)}
                    onChange={date => setForm({ ...form, date: toDateStr(date) })}
                    dateFormat="dd.MM.yyyy"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Typ</label>
                <div className="quick-add-type-toggle">
                  <button type="button"
                    className={`quick-add-type-btn ${form.type === 1 ? 'active-expense' : ''}`}
                    onClick={() => setForm({ ...form, type: 1, categoryId: null })}>
                    Wydatek
                  </button>
                  <button type="button"
                    className={`quick-add-type-btn ${form.type === 0 ? 'active-income' : ''}`}
                    onClick={() => setForm({ ...form, type: 0, categoryId: null })}>
                    Przychod
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Kategoria</label>
                <CategoryChipSelector
                  categories={filteredCategories}
                  selectedCategory={form.categoryId}
                  onSelect={cat => setForm({ ...form, categoryId: cat })}
                />
                {!form.categoryId && <div style={{ fontSize: '0.75rem', color: 'var(--accent-red)', marginTop: 6 }}>Wybierz kategorie</div>}
              </div>
              <div className="form-group">
                <label className="form-label">Notatka (opcjonalnie)</label>
                <input className="form-input" placeholder="Dodatkowe informacje..."
                  value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary-custom" onClick={() => setShowModal(false)}>Anuluj</button>
                <button type="submit" className="btn-primary-custom" disabled={!form.categoryId}>Zapisz</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <QuickAddExpense
        visible={showQuickAdd}
        onClose={() => setShowQuickAdd(false)}
        onSubmit={async (data) => {
          await api.transactions.create(data);
          loadData();
          toast.success('Transakcja dodana');
        }}
        categories={categories}
      />

      {!showQuickAdd && (
        <button className="fab-button" onClick={() => setShowQuickAdd(true)} title="Szybkie dodawanie">+</button>
      )}
    </div>
  );
}
