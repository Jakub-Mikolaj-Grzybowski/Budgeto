import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';
import { CategoryChipSelector } from './CategoryChipSelector';

function toDateObj(str) {
  if (!str) return null;
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function toDateStr(date) {
  if (!date) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function QuickAddExpense({ visible, onClose, onSubmit, categories }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [type, setType] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const amountRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setAmount('');
      setCategory(null);
      setName('');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
      setType(1);
      setShowAdvanced(false);
      setSubmitting(false);
      setTimeout(() => amountRef.current?.focus(), 350);
    }
  }, [visible]);

  const filteredCategories = categories.filter(c =>
    type === 1 ? c.type === 1 : c.type === 0
  );

  async function handleSubmit() {
    if (!amount || parseFloat(amount) <= 0 || !category) return;
    setSubmitting(true);
    const selectedCat = categories.find(c => c.id === category);
    const data = {
      name: name || (selectedCat ? selectedCat.name : ''),
      amount: parseFloat(amount),
      date: date + 'T00:00:00',
      type: type,
      categoryId: category,
      notes: notes || null
    };
    try {
      await onSubmit(data);
      onClose();
    } catch (err) {
      toast.error(err?.message || 'Nie udało się dodać transakcji');
      setSubmitting(false);
    }
  }

  function handleAmountKeyDown(e) {
    if (e.key === 'Enter' && amount && parseFloat(amount) > 0 && category) {
      handleSubmit();
    }
  }

  return (
    <>
      {visible && <div className="quick-add-backdrop" onClick={onClose} />}
      <div className={`quick-add-panel ${visible ? 'open' : ''}`}>
        <div className="quick-add-handle" />

            <div className="quick-add-title">
              {type === 1 ? 'Nowy wydatek' : 'Nowy przychod'}
            </div>

            {/* Type toggle */}
            <div className="quick-add-type-toggle" style={{ marginBottom: 16 }}>
              <button
                type="button"
                className={`quick-add-type-btn ${type === 1 ? 'active-expense' : ''}`}
                onClick={() => { setType(1); setCategory(''); }}
              >
                Wydatek
              </button>
              <button
                type="button"
                className={`quick-add-type-btn ${type === 0 ? 'active-income' : ''}`}
                onClick={() => { setType(0); setCategory(''); }}
              >
                Przychod
              </button>
            </div>

            {/* Amount */}
            <input
              ref={amountRef}
              className="quick-add-amount-input"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              onKeyDown={handleAmountKeyDown}
            />
            <div className="quick-add-amount-suffix">PLN</div>

            {/* Category chips */}
            <div className="quick-add-category-title" style={{ marginTop: 16 }}>
              Kategoria
            </div>
            <CategoryChipSelector
              categories={filteredCategories}
              selectedCategory={category}
              onSelect={cat => setCategory(cat)}
            />

            {/* Advanced options toggle */}
            <button
              className="quick-add-advanced-toggle"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Ukryj opcje' : 'Wiecej opcji'}
            </button>

            {showAdvanced && (
              <div className="quick-add-advanced">
                <div className="form-group">
                  <label className="form-label">Nazwa (opcjonalnie)</label>
                  <input
                    className="form-input"
                    placeholder="Np. Zakupy spozywcze"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Data</label>
                  <DatePicker
                    className="form-input"
                    selected={toDateObj(date)}
                    onChange={d => setDate(toDateStr(d))}
                    dateFormat="dd.MM.yyyy"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Notatka</label>
                  <input
                    className="form-input"
                    placeholder="Dodatkowe informacje..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              className="quick-add-submit-btn"
              disabled={!amount || parseFloat(amount) <= 0 || !category || submitting}
              onClick={handleSubmit}
            >
              {submitting ? 'Zapisywanie...' : `Dodaj ${type === 1 ? 'wydatek' : 'przychod'}`}
            </button>
      </div>
    </>
  );
}
