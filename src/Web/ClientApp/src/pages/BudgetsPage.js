import { useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { api } from '../api';
import { formatCurrency, formatDate, getBudgetPeriodLabel, getPrevPeriod, getNextPeriod, getPeriodStartMonth, filterToPeriod, getMonday } from '../utils';
import { BudgetCategoryRow } from '../components/BudgetCategoryRow';
import { CategoryChipSelector } from '../components/CategoryChipSelector';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { ConfirmDialog } from '../components/ConfirmDialog';

function toDateObj(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}
function toDateStr(date) {
  if (!date) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function BudgetsPage() {
  const now = new Date();
  const [periodMonth, setPeriodMonth] = useState(now.getMonth() + 1);
  const [periodYear, setPeriodYear] = useState(now.getFullYear());
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Savings goals
  const [goals, setGoals] = useState([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [goalForm, setGoalForm] = useState({ name: '', targetAmount: '', currentAmount: '0', deadline: '' });
  const [depositGoalId, setDepositGoalId] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [deleteGoalId, setDeleteGoalId] = useState(null);

  // Balance deposit to goal + net worth sync
  const [balanceDepositGoalId, setBalanceDepositGoalId] = useState(null);

  // Recurring transactions
  const [recurrings, setRecurrings] = useState([]);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState(null);
  const [recurringForm, setRecurringForm] = useState({ name: '', amount: '', categoryId: null, frequency: 0, nextDueDate: '' });
  const [deleteRecurringId, setDeleteRecurringId] = useState(null);

  const loadAll = useCallback(() => {
    setLoading(true);
    const { month: prevM, year: prevY } = getPeriodStartMonth(periodMonth, periodYear);
    // Auto-process overdue recurring payments first, then load data
    api.recurringTransactions.process().catch(() => {}).then(() =>
      Promise.all([
        api.budgets.getAll(periodMonth, periodYear),
        api.categories.getAll(),
        api.transactions.getAll(prevM, prevY),
        api.transactions.getAll(periodMonth, periodYear),
        api.savingsGoals.getAll(),
        api.recurringTransactions.getAll()
      ])
        .then(([b, cats, txPrev, txCurr, g, r]) => {
          setBudgets(b || []);
          setCategories(cats || []);
          setAllTransactions([...(txPrev || []), ...(txCurr || [])]);
          setGoals(g || []);
          setRecurrings(r || []);
        })
        .catch(err => toast.error(err?.message || 'Nie udało się pobrać danych'))
        .finally(() => setLoading(false))
    );
  }, [periodMonth, periodYear]);

  useEffect(() => { loadAll(); }, [loadAll]);

  function prevPeriod() {
    const p = getPrevPeriod(periodMonth, periodYear);
    setPeriodMonth(p.month); setPeriodYear(p.year);
  }
  function nextPeriod() {
    const p = getNextPeriod(periodMonth, periodYear);
    setPeriodMonth(p.month); setPeriodYear(p.year);
  }

  const expenseCategories = useMemo(() => categories.filter(c => c.type === 1), [categories]);
  const periodTransactions = useMemo(() => filterToPeriod(allTransactions, periodMonth, periodYear), [allTransactions, periodMonth, periodYear]);

  const spentByCategory = useMemo(() => {
    const map = {};
    periodTransactions.filter(t => t.type === 1).forEach(t => {
      map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
    });
    return map;
  }, [periodTransactions]);

  // Weekly spent: transactions in current Mon-Sun week
  const weeklySpentByCategory = useMemo(() => {
    const mon = getMonday(new Date().toISOString());
    mon.setHours(0, 0, 0, 0);
    const sun = new Date(mon);
    sun.setDate(sun.getDate() + 6);
    sun.setHours(23, 59, 59, 999);
    const map = {};
    periodTransactions.filter(t => t.type === 1).forEach(t => {
      const d = new Date(t.date);
      if (d >= mon && d <= sun) {
        map[t.categoryId] = (map[t.categoryId] || 0) + t.amount;
      }
    });
    return map;
  }, [periodTransactions]);

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = Object.values(spentByCategory).reduce((s, v) => s + v, 0);
  const totalRemaining = totalBudgeted - totalSpent;

  const periodIncome = useMemo(() =>
    periodTransactions.filter(t => t.type === 0).reduce((s, t) => s + t.amount, 0),
    [periodTransactions]);
  const periodBalance = periodIncome - totalSpent;

  const overallPct = totalBudgeted > 0 ? (totalSpent / totalBudgeted) * 100 : 0;
  const overallProgressClass = overallPct >= 100 ? 'progress-danger' : overallPct >= 75 ? 'progress-warning' : 'progress-ok';

  function getBudgetForCategory(categoryId) {
    return budgets.find(b => b.categoryId === categoryId) || null;
  }

  function loadBudgets() {
    const { month: prevM, year: prevY } = getPeriodStartMonth(periodMonth, periodYear);
    Promise.all([
      api.budgets.getAll(periodMonth, periodYear),
      api.transactions.getAll(prevM, prevY),
      api.transactions.getAll(periodMonth, periodYear)
    ]).then(([b, txPrev, txCurr]) => {
      setBudgets(b || []);
      setAllTransactions([...(txPrev || []), ...(txCurr || [])]);
    }).catch(err => toast.error(err?.message || 'Błąd podczas ładowania danych'));
  }

  async function handleSave(categoryId, categoryName, amount, weeklyLimit) {
    const existing = getBudgetForCategory(categoryId);
    try {
      if (existing) {
        await api.budgets.update(existing.id, {
          name: existing.name, amount, weeklyLimit, categoryId,
          month: periodMonth, year: periodYear
        });
      } else {
        await api.budgets.create({
          name: categoryName, amount, weeklyLimit, categoryId,
          month: periodMonth, year: periodYear
        });
      }
      loadBudgets();
      toast.success('Budżet zapisany');
    } catch (err) { toast.error(err?.message || 'Nie udało się zapisać budżetu'); }
  }

  async function handleDelete(categoryId) {
    const existing = getBudgetForCategory(categoryId);
    if (!existing) return;
    try {
      await api.budgets.delete(existing.id);
      loadBudgets();
      toast.success('Budżet usunięty');
    } catch (err) { toast.error(err?.message || 'Nie udało się usunąć budżetu'); }
  }

  // -------- Savings Goals handlers --------
  function openGoalCreate() {
    setEditingGoal(null);
    setGoalForm({ name: '', targetAmount: '', currentAmount: '0', deadline: '' });
    setShowGoalModal(true);
  }
  function openGoalEdit(g) {
    setEditingGoal(g);
    setGoalForm({
      name: g.name,
      targetAmount: g.targetAmount.toString(),
      currentAmount: g.currentAmount.toString(),
      deadline: g.deadline || ''
    });
    setShowGoalModal(true);
  }
  async function handleGoalSubmit(e) {
    e.preventDefault();
    const data = {
      name: goalForm.name,
      targetAmount: parseFloat(goalForm.targetAmount),
      currentAmount: parseFloat(goalForm.currentAmount) || 0,
      deadline: goalForm.deadline || null
    };
    try {
      if (editingGoal) {
        await api.savingsGoals.update(editingGoal.id, data);
        toast.success('Cel zaktualizowany');
      } else {
        await api.savingsGoals.create(data);
        toast.success('Cel utworzony');
      }
      setShowGoalModal(false);
      const g = await api.savingsGoals.getAll();
      setGoals(g || []);
    } catch (err) { toast.error(err?.message || 'Nie udało się zapisać celu'); }
  }
  async function handleDeposit() {
    const goal = goals.find(g => g.id === depositGoalId);
    if (!goal) return;
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) { toast.error('Podaj poprawną kwotę'); return; }
    const savingsCat = categories.find(c => c.name.toLowerCase() === 'oszczędności' || c.name.toLowerCase() === 'oszczednosci');
    if (!savingsCat) { toast.error('Utwórz kategorię "Oszczędności"'); return; }
    try {
      await api.savingsGoals.update(goal.id, {
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: goal.currentAmount + amt,
        deadline: goal.deadline
      });
      await api.transactions.create({
        name: `Oszczędności: ${goal.name}`,
        amount: amt,
        date: toDateStr(now) + 'T00:00:00',
        type: 1,
        categoryId: savingsCat.id,
        notes: `Wpłata na cel: ${goal.name}`
      });
      setDepositGoalId(null); setDepositAmount('');
      toast.success(`Wpłacono ${formatCurrency(amt)}`);
      loadAll();
    } catch (err) { toast.error(err?.message || 'Nie udało się wpłacić'); }
  }
  async function handleBalanceDeposit() {
    const goal = goals.find(g => g.id === balanceDepositGoalId);
    if (!goal) return;
    if (periodBalance <= 0) {
      toast.error('Brak dodatniego bilansu do wpłaty');
      setBalanceDepositGoalId(null);
      return;
    }
    const savingsCat = categories.find(c => c.name.toLowerCase() === 'oszczędności' || c.name.toLowerCase() === 'oszczednosci');
    if (!savingsCat) { toast.error('Utwórz kategorię "Oszczędności"'); setBalanceDepositGoalId(null); return; }
    try {
      const newAmount = goal.currentAmount + periodBalance;
      // 1. Update savings goal
      await api.savingsGoals.update(goal.id, {
        name: goal.name,
        targetAmount: goal.targetAmount,
        currentAmount: newAmount,
        deadline: goal.deadline
      });
      // 2. Create expense transaction
      await api.transactions.create({
        name: `Oszczędności: ${goal.name}`,
        amount: periodBalance,
        date: toDateStr(now) + 'T00:00:00',
        type: 1,
        categoryId: savingsCat.id,
        notes: `Wpłata bilansu na cel: ${goal.name}`
      });
      // 3. Sync to net worth
      try {
        const nwData = await api.netWorth.getSummary();
        const nwAccounts = nwData?.accounts || [];
        const existingNw = nwAccounts.find(a => a.name === goal.name);
        const assetCat = categories.find(c => c.type === 2);
        if (existingNw) {
          await api.netWorth.update(existingNw.id, {
            name: existingNw.name,
            categoryId: existingNw.categoryId,
            balance: newAmount,
            repaymentDate: null
          });
        } else if (assetCat) {
          await api.netWorth.create({
            name: goal.name,
            categoryId: assetCat.id,
            balance: newAmount,
            repaymentDate: null
          });
        }
      } catch { /* net worth sync is best-effort */ }
      setBalanceDepositGoalId(null);
      toast.success(`Wpłacono bilans ${formatCurrency(periodBalance)} na cel "${goal.name}"`);
      loadAll();
    } catch (err) {
      toast.error(err?.message || 'Nie udało się wpłacić bilansu');
      setBalanceDepositGoalId(null);
    }
  }
  async function handleGoalDelete() {
    try {
      await api.savingsGoals.delete(deleteGoalId);
      setDeleteGoalId(null);
      toast.success('Cel usunięty');
      const g = await api.savingsGoals.getAll();
      setGoals(g || []);
    } catch (err) { toast.error(err?.message || 'Nie udało się usunąć celu'); }
  }

  // -------- Recurring handlers --------
  function openRecurringCreate() {
    setEditingRecurring(null);
    setRecurringForm({ name: '', amount: '', categoryId: null, frequency: 0, nextDueDate: toDateStr(now) });
    setShowRecurringModal(true);
  }
  function openRecurringEdit(rec) {
    setEditingRecurring(rec);
    setRecurringForm({
      name: rec.name,
      amount: rec.amount.toString(),
      categoryId: rec.categoryId,
      frequency: rec.frequency,
      nextDueDate: rec.nextDueDate
    });
    setShowRecurringModal(true);
  }
  async function handleRecurringSubmit(e) {
    e.preventDefault();
    const data = {
      name: recurringForm.name,
      amount: parseFloat(recurringForm.amount),
      categoryId: recurringForm.categoryId,
      frequency: parseInt(recurringForm.frequency),
      nextDueDate: recurringForm.nextDueDate,
      isActive: true
    };
    try {
      if (editingRecurring) {
        await api.recurringTransactions.update(editingRecurring.id, data);
        toast.success('Płatność zaktualizowana');
      } else {
        await api.recurringTransactions.create(data);
        toast.success('Płatność cykliczna dodana');
      }
      setShowRecurringModal(false);
      const r = await api.recurringTransactions.getAll();
      setRecurrings(r || []);
    } catch (err) { toast.error(err?.message || 'Nie udało się zapisać płatności'); }
  }
  async function handleRecurringDelete() {
    try {
      await api.recurringTransactions.delete(deleteRecurringId);
      setDeleteRecurringId(null);
      toast.success('Płatność usunięta');
      const r = await api.recurringTransactions.getAll();
      setRecurrings(r || []);
    } catch (err) { toast.error(err?.message || 'Nie udało się usunąć'); }
  }

  const periodLabel = getBudgetPeriodLabel(periodMonth, periodYear);

  return (
    <div>
      <div className="page-header page-header-flex">
        <div>
          <h1>Budzety</h1>
          <p>Planuj i kontroluj swoje wydatki</p>
        </div>
        <div className="month-selector">
          <button onClick={prevPeriod}>&lsaquo;</button>
          <span style={{ fontSize: '0.8rem' }}>{periodLabel}</span>
          <button onClick={nextPeriod}>&rsaquo;</button>
        </div>
      </div>

      {loading ? (
        <div className="card"><SkeletonLoader rows={6} /></div>
      ) : (
        <>
          {/* Category limits */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header-custom">
              <h3 className="card-title">Limity kategorii</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Mies. / Tyg.</span>
            </div>
            {expenseCategories.length === 0 ? (
              <div className="empty-state">
                <h3>Brak kategorii wydatkow</h3>
                <p>Dodaj kategorie wydatkow w zakladce Kategorie</p>
              </div>
            ) : (
              expenseCategories.map(cat => {
                const budget = getBudgetForCategory(cat.id);
                const spent = spentByCategory[cat.id] || 0;
                const wSpent = weeklySpentByCategory[cat.id] || 0;
                return (
                  <BudgetCategoryRow
                    key={cat.id}
                    categoryName={cat.name}
                    budget={budget ? { ...budget, spent } : null}
                    weeklySpent={wSpent}
                    onSave={(amount, weeklyLimit) => handleSave(cat.id, cat.name, amount, weeklyLimit)}
                    onDelete={() => handleDelete(cat.id)}
                  />
                );
              })
            )}
          </div>

          {/* Savings Goals */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header-custom">
              <h3 className="card-title">Cele oszczedzania</h3>
              <button className="btn-primary-custom btn-sm" onClick={openGoalCreate}>+ Nowy cel</button>
            </div>
            {goals.length === 0 ? (
              <div className="empty-state" style={{ padding: '20px 0' }}>
                <p>Brak celow oszczedzania</p>
              </div>
            ) : (
              <div className="goals-grid">
                {goals.map(g => {
                  const pct = g.targetAmount > 0 ? (g.currentAmount / g.targetAmount) * 100 : 0;
                  const cls = pct >= 100 ? 'progress-ok' : 'progress-ok';
                  return (
                    <div key={g.id} className="goal-card">
                      <div className="goal-card-header">
                        <div className="goal-card-name">{g.name}</div>
                        <div className="goal-card-actions">
                          <button className="week-tx-action-btn" onClick={() => setDepositGoalId(g.id)} title="Wplac">+</button>
                          <button className="week-tx-action-btn" onClick={() => openGoalEdit(g)} title="Edytuj">&#9998;</button>
                          <button className="week-tx-action-btn delete" onClick={() => setDeleteGoalId(g.id)} title="Usun">&#10005;</button>
                        </div>
                      </div>
                      <div className="goal-card-amounts">
                        <span style={{ color: 'var(--accent-green)', fontWeight: 600 }}>{formatCurrency(g.currentAmount)}</span>
                        <span style={{ color: 'var(--text-muted)' }}> z {formatCurrency(g.targetAmount)}</span>
                      </div>
                      <div className="progress-bar-container" style={{ marginTop: 0 }}>
                        <div className={`progress-bar-fill ${cls}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 0 }}>
                        <span>{Math.round(pct)}%</span>
                        {g.deadline && <span>Do: {formatDate(g.deadline)}</span>}
                      </div>
                      {periodBalance > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-color)', marginTop: 2 }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Bilans: <strong style={{ color: 'var(--accent-green)' }}>{formatCurrency(periodBalance)}</strong>
                          </span>
                          <button className="btn-primary-custom btn-sm"
                            style={{ fontSize: '0.7rem', padding: '4px 10px' }}
                            onClick={() => setBalanceDepositGoalId(g.id)}>
                            Wplac bilans
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recurring Transactions */}
          <div className="card">
            <div className="card-header-custom">
              <h3 className="card-title">Powtarzalne platnosci</h3>
              <button className="btn-primary-custom btn-sm" onClick={openRecurringCreate}>+ Nowa</button>
            </div>
            {recurrings.length === 0 ? (
              <div className="empty-state" style={{ padding: '20px 0' }}>
                <p>Brak powtarzalnych platnosci</p>
              </div>
            ) : (
              recurrings.map(rec => (
                  <div key={rec.id} className="recurring-row">
                    <div className="recurring-info">
                      <div className="recurring-name">{rec.name}</div>
                      <div className="recurring-meta">
                        {rec.categoryName} &middot; {rec.frequency === 0 ? 'Miesiecznie' : 'Tygodniowo'}
                      </div>
                    </div>
                    <div className="recurring-amount">{formatCurrency(rec.amount)}</div>
                    <div className="recurring-date" style={{ color: 'var(--text-muted)' }}>
                      Nastepna: {formatDate(rec.nextDueDate)}
                    </div>
                    <div className="recurring-actions">
                      <button className="week-tx-action-btn" onClick={() => openRecurringEdit(rec)} title="Edytuj">&#9998;</button>
                      <button className="week-tx-action-btn delete" onClick={() => setDeleteRecurringId(rec.id)} title="Usun">&#10005;</button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </>
      )}

      {/* Goal create/edit modal */}
      {showGoalModal && (
        <div className="modal-overlay" onClick={() => setShowGoalModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>{editingGoal ? 'Edytuj cel' : 'Nowy cel oszczedzania'}</h2>
              <button className="modal-close" onClick={() => setShowGoalModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleGoalSubmit}>
              <div className="form-group">
                <label className="form-label">Nazwa</label>
                <input className="form-input" value={goalForm.name}
                  onChange={e => setGoalForm({ ...goalForm, name: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Cel (PLN)</label>
                  <input className="form-input" type="number" step="0.01" min="0.01"
                    value={goalForm.targetAmount}
                    onChange={e => setGoalForm({ ...goalForm, targetAmount: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Zebrano (PLN)</label>
                  <input className="form-input" type="number" step="0.01" min="0"
                    value={goalForm.currentAmount}
                    onChange={e => setGoalForm({ ...goalForm, currentAmount: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Termin (opcjonalnie)</label>
                <DatePicker className="form-input"
                  selected={toDateObj(goalForm.deadline)}
                  onChange={d => setGoalForm({ ...goalForm, deadline: toDateStr(d) })}
                  dateFormat="dd.MM.yyyy"
                  isClearable
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary-custom" onClick={() => setShowGoalModal(false)}>Anuluj</button>
                <button type="submit" className="btn-primary-custom">Zapisz</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Deposit modal */}
      {depositGoalId !== null && (
        <div className="modal-overlay" onClick={() => { setDepositGoalId(null); setDepositAmount(''); }}>
          <div className="modal-content modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Wplac na cel</h2>
              <button className="modal-close" onClick={() => { setDepositGoalId(null); setDepositAmount(''); }}>&times;</button>
            </div>
            <div className="form-group">
              <label className="form-label">Kwota (PLN)</label>
              <input className="form-input" type="number" step="0.01" min="0.01"
                value={depositAmount} onChange={e => setDepositAmount(e.target.value)} autoFocus />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary-custom" onClick={() => { setDepositGoalId(null); setDepositAmount(''); }}>Anuluj</button>
              <button className="btn-primary-custom" onClick={handleDeposit}>Wplac</button>
            </div>
          </div>
        </div>
      )}

      {/* Balance deposit confirmation modal */}
      {balanceDepositGoalId !== null && (
        <div className="modal-overlay" onClick={() => setBalanceDepositGoalId(null)}>
          <div className="modal-content modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Wplac bilans na cel</h2>
              <button className="modal-close" onClick={() => setBalanceDepositGoalId(null)}>&times;</button>
            </div>
            <p style={{ color: 'var(--text-primary)', marginBottom: 12 }}>
              Bilans okresu: <strong style={{ color: 'var(--accent-green)' }}>{formatCurrency(periodBalance)}</strong>
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 20 }}>
              Kwota zostanie wplacona na cel &ldquo;{goals.find(g => g.id === balanceDepositGoalId)?.name}&rdquo; i zaktualizowana w wartosci netto.
            </p>
            <div className="modal-actions">
              <button className="btn-secondary-custom" onClick={() => setBalanceDepositGoalId(null)}>Anuluj</button>
              <button className="btn-primary-custom" onClick={handleBalanceDeposit}>Wplac bilans</button>
            </div>
          </div>
        </div>
      )}

      {/* Recurring create/edit modal */}
      {showRecurringModal && (
        <div className="modal-overlay" onClick={() => setShowRecurringModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>{editingRecurring ? 'Edytuj platnosc cykliczna' : 'Nowa platnosc cykliczna'}</h2>
              <button className="modal-close" onClick={() => setShowRecurringModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleRecurringSubmit}>
              <div className="form-group">
                <label className="form-label">Nazwa</label>
                <input className="form-input" value={recurringForm.name}
                  onChange={e => setRecurringForm({ ...recurringForm, name: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Kwota (PLN)</label>
                  <input className="form-input" type="number" step="0.01" min="0.01"
                    value={recurringForm.amount}
                    onChange={e => setRecurringForm({ ...recurringForm, amount: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Czestotliwosc</label>
                  <select className="form-input" value={recurringForm.frequency}
                    onChange={e => setRecurringForm({ ...recurringForm, frequency: parseInt(e.target.value) })}>
                    <option value={0}>Miesiecznie</option>
                    <option value={1}>Tygodniowo</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Kategoria</label>
                <CategoryChipSelector
                  categories={expenseCategories}
                  selectedCategory={recurringForm.categoryId}
                  onSelect={cat => setRecurringForm({ ...recurringForm, categoryId: cat })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nastepna data platnosci</label>
                <DatePicker className="form-input"
                  selected={toDateObj(recurringForm.nextDueDate)}
                  onChange={d => setRecurringForm({ ...recurringForm, nextDueDate: toDateStr(d) })}
                  dateFormat="dd.MM.yyyy"
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary-custom" onClick={() => setShowRecurringModal(false)}>Anuluj</button>
                <button type="submit" className="btn-primary-custom" disabled={!recurringForm.categoryId}>
                  {editingRecurring ? 'Zapisz' : 'Dodaj'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog open={deleteGoalId !== null} message="Czy na pewno chcesz usunąć ten cel?" onConfirm={handleGoalDelete} onCancel={() => setDeleteGoalId(null)} />
      <ConfirmDialog open={deleteRecurringId !== null} message="Czy na pewno chcesz usunąć tę płatność cykliczną?" onConfirm={handleRecurringDelete} onCancel={() => setDeleteRecurringId(null)} />
    </div>
  );
}
