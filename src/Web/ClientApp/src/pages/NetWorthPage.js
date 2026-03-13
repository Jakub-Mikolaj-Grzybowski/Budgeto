import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api';
import { formatCurrency, formatDate, getMonthName } from '../utils';
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

export function NetWorthPage() {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [form, setForm] = useState({ name: '', categoryId: '', balance: '', repaymentDate: '' });
  const [deleteId, setDeleteId] = useState(null);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([api.netWorth.getSummary(), api.categories.getAll()])
      .then(([d, cats]) => {
        setData(d);
        setCategories((cats || []).filter(c => c.type === 2 || c.type === 3));
      })
      .catch(err => toast.error(err?.message || 'Nie udalo sie pobrac danych'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const assetCategories = categories.filter(c => c.type === 2);
  const liabilityCategories = categories.filter(c => c.type === 3);

  function openCreate(isAsset) {
    setEditingAccount(null);
    const defaultCat = isAsset ? assetCategories[0] : liabilityCategories[0];
    setForm({ name: '', categoryId: defaultCat ? defaultCat.id.toString() : '', balance: '', repaymentDate: '' });
    setShowModal(true);
  }

  function openEdit(acc) {
    setEditingAccount(acc);
    setForm({ name: acc.name, categoryId: acc.categoryId.toString(), balance: acc.balance.toString(), repaymentDate: acc.repaymentDate || '' });
    setShowModal(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingAccount) {
        await api.netWorth.update(editingAccount.id, {
          name: form.name,
          categoryId: parseInt(form.categoryId),
          balance: parseFloat(form.balance),
          repaymentDate: form.repaymentDate || null
        });
        toast.success('Konto zaktualizowane');
      } else {
        await api.netWorth.create({
          name: form.name,
          categoryId: parseInt(form.categoryId),
          balance: parseFloat(form.balance),
          repaymentDate: form.repaymentDate || null
        });
        toast.success('Konto dodane');
      }
      setShowModal(false);
      loadData();
    } catch (err) { toast.error(err?.message || 'Nie udalo sie zapisac'); }
  }

  async function handleDelete() {
    try {
      await api.netWorth.delete(deleteId);
      setDeleteId(null);
      toast.success('Konto usuniete');
      loadData();
    } catch (err) { toast.error(err?.message || 'Nie udalo sie usunac'); }
  }

  const summary = data || { accounts: [], snapshots: [], totalAssets: 0, totalLiabilities: 0, netWorth: 0 };
  const assets = summary.accounts.filter(a => a.categoryType === 2);
  const liabilities = summary.accounts.filter(a => a.categoryType === 3);

  const chartData = summary.snapshots.map(s => ({
    name: getMonthName(s.month).substring(0, 3) + ' ' + s.year,
    value: s.netWorth
  }));

  const netWorthColor = summary.netWorth >= 0 ? 'var(--accent-green)' : 'var(--accent-red)';

  const selectedCat = categories.find(c => c.id === parseInt(form.categoryId));
  const isLiability = selectedCat && selectedCat.type === 3;

  return (
    <div>
      <div className="page-header">
        <h1>Wartosc netto</h1>
        <p>Twoja calkowita sytuacja finansowa</p>
      </div>

      {loading ? (
        <div className="card"><SkeletonLoader rows={6} /></div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="nw-summary-grid">
            <div className="summary-card income">
              <div className="summary-label">Aktywa</div>
              <div className="summary-value">{formatCurrency(summary.totalAssets)}</div>
            </div>
            <div className="summary-card expense">
              <div className="summary-label">Zobowiazania</div>
              <div className="summary-value">{formatCurrency(summary.totalLiabilities)}</div>
            </div>
            <div className="summary-card balance">
              <div className="summary-label">Netto</div>
              <div className="summary-value">{formatCurrency(summary.netWorth)}</div>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 1 && (
            <div className="card" style={{ marginBottom: 24 }}>
              <div className="card-header-custom">
                <h3 className="card-title">Trend</h3>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="nwGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: 'var(--text-secondary)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 8,
                      fontSize: '0.85rem',
                    }}
                    cursor={{ stroke: 'var(--accent-blue)', strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--accent-blue)"
                    strokeWidth={2}
                    fill="url(#nwGradient)"
                    name="Wartosc netto"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Assets */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header-custom">
              <h3 className="card-title">Aktywa</h3>
              <button className="btn-primary-custom btn-sm" onClick={() => openCreate(true)}>+ Dodaj</button>
            </div>
            {assets.length === 0 ? (
              <div className="empty-state" style={{ padding: '20px 0' }}>
                <p>Brak aktywow</p>
              </div>
            ) : (
              assets.map(acc => (
                <div key={acc.id} className="nw-account-row">
                  <div className="nw-account-info">
                    <span className="nw-account-name">{acc.name}</span>
                    <span className="nw-type-badge nw-badge-asset">{acc.categoryName}</span>
                  </div>
                  <div className="nw-account-balance" style={{ color: 'var(--accent-green)' }}>
                    {formatCurrency(acc.balance)}
                  </div>
                  <div className="nw-account-actions">
                    <button className="week-tx-action-btn" onClick={() => openEdit(acc)} title="Edytuj">&#9998;</button>
                    <button className="week-tx-action-btn delete" onClick={() => setDeleteId(acc.id)} title="Usun">&#10005;</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Liabilities */}
          <div className="card">
            <div className="card-header-custom">
              <h3 className="card-title">Zobowiazania</h3>
              <button className="btn-primary-custom btn-sm" onClick={() => openCreate(false)}>+ Dodaj</button>
            </div>
            {liabilities.length === 0 ? (
              <div className="empty-state" style={{ padding: '20px 0' }}>
                <p>Brak zobowiazan</p>
              </div>
            ) : (
              liabilities.map(acc => (
                <div key={acc.id} className="nw-account-row">
                  <div className="nw-account-info">
                    <span className="nw-account-name">{acc.name}</span>
                    <span className="nw-type-badge nw-badge-liability">{acc.categoryName}</span>
                    {acc.repaymentDate && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 8 }}>
                        Splata: {formatDate(acc.repaymentDate)}
                      </span>
                    )}
                  </div>
                  <div className="nw-account-balance" style={{ color: 'var(--accent-red)' }}>
                    {formatCurrency(acc.balance)}
                  </div>
                  <div className="nw-account-actions">
                    <button className="week-tx-action-btn" onClick={() => openEdit(acc)} title="Edytuj">&#9998;</button>
                    <button className="week-tx-action-btn delete" onClick={() => setDeleteId(acc.id)} title="Usun">&#10005;</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Create/Edit modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>{editingAccount ? 'Edytuj konto' : 'Nowe konto'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nazwa</label>
                <input className="form-input" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Kategoria</label>
                <select className="form-input" value={form.categoryId}
                  onChange={e => setForm({ ...form, categoryId: e.target.value })} required>
                  <optgroup label="Aktywa">
                    {assetCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Zobowiazania">
                    {liabilityCategories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </optgroup>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Kwota (PLN)</label>
                <input className="form-input" type="number" step="0.01" min="0"
                  value={form.balance}
                  onChange={e => setForm({ ...form, balance: e.target.value })} required />
              </div>
              {isLiability && (
                <div className="form-group">
                  <label className="form-label">Data splaty (opcjonalnie)</label>
                  <DatePicker className="form-input"
                    selected={toDateObj(form.repaymentDate)}
                    onChange={d => setForm({ ...form, repaymentDate: toDateStr(d) })}
                    dateFormat="dd.MM.yyyy"
                    isClearable
                  />
                </div>
              )}
              <div className="modal-actions">
                <button type="button" className="btn-secondary-custom" onClick={() => setShowModal(false)}>Anuluj</button>
                <button type="submit" className="btn-primary-custom">{editingAccount ? 'Zapisz' : 'Dodaj'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog open={deleteId !== null} message="Czy na pewno chcesz usunac to konto?" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
