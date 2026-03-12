import { useState, useEffect } from 'react';
import { formatCurrency } from '../utils';

export function BudgetCategoryRow({ categoryName, budget, weeklySpent, onSave, onDelete }) {
  const [localAmount, setLocalAmount] = useState('');
  const [localWeekly, setLocalWeekly] = useState('');

  useEffect(() => {
    setLocalAmount(budget ? budget.amount.toString() : '');
    setLocalWeekly(budget && budget.weeklyLimit ? budget.weeklyLimit.toString() : '');
  }, [budget]);

  function handleSave() {
    const parsed = parseFloat(localAmount);
    const parsedWeekly = localWeekly ? parseFloat(localWeekly) : null;
    if (!localAmount || isNaN(parsed) || parsed <= 0) {
      if (budget) {
        onDelete();
        setLocalAmount('');
        setLocalWeekly('');
      }
      return;
    }
    const weeklyVal = parsedWeekly && !isNaN(parsedWeekly) && parsedWeekly > 0 ? parsedWeekly : null;
    const amountChanged = !budget || parsed !== budget.amount;
    const weeklyChanged = !budget || weeklyVal !== budget.weeklyLimit;
    if (amountChanged || weeklyChanged) {
      onSave(parsed, weeklyVal);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') e.target.blur();
  }

  const pct = budget && budget.amount > 0 ? (budget.spent / budget.amount) * 100 : 0;
  const progressClass = pct > 100 ? 'progress-danger' : pct >= 100 ? 'progress-warning' : 'progress-ok';

  const wPct = budget && budget.weeklyLimit > 0 ? ((weeklySpent || 0) / budget.weeklyLimit) * 100 : 0;
  const wProgressClass = wPct > 100 ? 'progress-danger' : wPct >= 100 ? 'progress-warning' : 'progress-ok';

  return (
    <div className="budget-row">
      <div className="budget-row-label">{categoryName}</div>
      <div className="budget-row-inputs">
        <div className="budget-row-input-group">
          <input
            className="budget-amount-input"
            type="number"
            step="0.01"
            min="0"
            placeholder="Mies."
            value={localAmount}
            onChange={e => setLocalAmount(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
          />
          <span className="budget-row-currency">PLN</span>
        </div>
        <div className="budget-row-input-group budget-row-input-weekly">
          <input
            className="budget-amount-input"
            type="number"
            step="0.01"
            min="0"
            placeholder="Tyg."
            value={localWeekly}
            onChange={e => setLocalWeekly(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
          />
          <span className="budget-row-currency">PLN</span>
        </div>
      </div>
      {budget && budget.amount > 0 ? (
        <div className="budget-row-progress">
          <div className="budget-row-stats">
            <span>{formatCurrency(budget.spent)} z {formatCurrency(budget.amount)}</span>
            <span style={{ color: pct > 100 ? 'var(--accent-red)' : pct >= 100 ? 'var(--accent-amber)' : undefined, fontWeight: 600 }}>
              {Math.round(pct)}%
            </span>
          </div>
          <div className="progress-bar-container" style={{ marginTop: 0 }}>
            <div className={`progress-bar-fill ${progressClass}`} style={{ width: `${Math.min(pct, 100)}%` }} />
          </div>
          {budget.weeklyLimit > 0 && (
            <div style={{ marginTop: 6 }}>
              <div className="budget-row-stats" style={{ fontSize: '0.7rem' }}>
                <span>Tydzien: {formatCurrency(weeklySpent || 0)} z {formatCurrency(budget.weeklyLimit)}</span>
                <span style={{ color: wPct > 100 ? 'var(--accent-red)' : wPct >= 100 ? 'var(--accent-amber)' : undefined, fontWeight: 600 }}>
                  {Math.round(wPct)}%
                </span>
              </div>
              <div className="progress-bar-container" style={{ marginTop: 0, height: 4 }}>
                <div className={`progress-bar-fill ${wProgressClass}`} style={{ width: `${Math.min(wPct, 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="budget-no-limit">Brak limitu</div>
      )}
    </div>
  );
}
