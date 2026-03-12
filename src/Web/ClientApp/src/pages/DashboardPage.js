// src/Web/ClientApp/src/pages/DashboardPage.js

// Enum dla typów transakcji
export const TransactionType = {
  INCOME: 0,
  EXPENSE: 1,
};
// ...existing code...
// Zamiast magicznych liczb używaj TransactionType:
// tx.type === TransactionType.INCOME
// tx.type === TransactionType.EXPENSE
// ...existing code...
// src/Web/ClientApp/src/pages/DashboardPage.js

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency, getDayName, formatDateShort, getMonthName } from '../utils';
import { SkeletonLoader } from '../components/SkeletonLoader';
import { useDashboard } from '../components/useDashboard';

const CATEGORY_COLORS = [
  'var(--accent-red)', 'var(--accent-amber)', 'var(--accent-blue)',
  'var(--accent-purple)', 'var(--accent-green)'
];

const TOOLTIP_STYLE = {
  background: 'var(--bg-card)', border: '1px solid var(--border-color)',
  borderRadius: 8, fontSize: '0.85rem'
};

export function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const {
    loading, summary, chartData, recentTransactions,
    netWorth, netWorthValue, nwChartData,
    isBalancePositive, isNwPositive,
  } = useDashboard(month, year);

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const balanceColor = isBalancePositive ? 'var(--accent-green)' : 'var(--accent-red)';
  const nwColor = isNwPositive ? 'var(--accent-blue)' : 'var(--accent-red)';
  const balanceBorder = isBalancePositive ? 'rgba(74,222,128,0.45)' : 'rgba(248,113,113,0.45)';
  const balanceShadow = isBalancePositive ? '0 0 0 1px rgba(74,222,128,0.15) inset' : '0 0 0 1px rgba(248,113,113,0.15) inset';
  const nwBorder = isNwPositive ? 'rgba(96,165,250,0.45)' : 'rgba(248,113,113,0.45)';
  const nwShadow = isNwPositive ? '0 0 0 1px rgba(96,165,250,0.15) inset' : '0 0 0 1px rgba(248,113,113,0.15) inset';

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1>Panel główny</h1>
          <p>Podsumowanie Twoich finansów</p>
        </div>
        <div className="summary-grid" style={{ marginBottom: 24 }}>
          {[...Array(2)].map((_, i) => (
            <div key={i} className="summary-card" style={{ minHeight: 72 }}>
              <SkeletonLoader rows={2} />
            </div>
          ))}
        </div>
        <div className="card"><SkeletonLoader rows={5} /></div>
      </div>
    );
  }

  return (
    <div>
      {/* Nagłówek */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Panel główny</h1>
          <p>Podsumowanie Twoich finansów</p>
        </div>
        <div className="month-selector">
          <button onClick={prevMonth} disabled={loading}>&lsaquo;</button>
          <span>{getMonthName(month)} {year}</span>
          <button onClick={nextMonth} disabled={loading}>&rsaquo;</button>
        </div>
      </div>

      {/* ── Karty + Wykresy ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Lewa kolumna: kafelki + trend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            {/* Bilans miesiąca */}
            <div className="summary-card" style={{ borderColor: balanceBorder, boxShadow: balanceShadow }}>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: balanceColor, borderRadius: '12px 12px 0 0' }} />
              <div className="summary-label">Bilans miesiąca</div>
              <div className="summary-value" style={{ color: balanceColor, fontSize: '2rem' }}>
                {formatCurrency(summary.balance)}
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: '0.78rem' }}>
                <span style={{ color: 'var(--accent-green)' }}>↑ {formatCurrency(summary.totalIncome)}</span>
                <span style={{ color: 'var(--accent-red)' }}>↓ {formatCurrency(summary.totalExpenses)}</span>
                <span style={{ color: 'var(--text-muted)', marginLeft: 'auto' }}>{summary.transactionCount} transakcji</span>
              </div>
            </div>

            {/* Wartość netto */}
            <NavLink to="/net-worth" style={{ textDecoration: 'none' }}>
              <div className="summary-card" style={{ cursor: 'pointer', transition: 'border-color 0.15s, box-shadow 0.15s', borderColor: nwBorder, boxShadow: nwShadow }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = nwColor; e.currentTarget.style.boxShadow = isNwPositive ? '0 0 0 1px rgba(96,165,250,0.3) inset' : '0 0 0 1px rgba(248,113,113,0.3) inset'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = nwBorder; e.currentTarget.style.boxShadow = nwShadow; }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: nwColor, borderRadius: '12px 12px 0 0' }} />
                <div className="summary-label">Wartość netto</div>
                {netWorthValue !== null ? (
                  <>
                    <div className="summary-value" style={{ color: nwColor, fontSize: '2rem' }}>{formatCurrency(netWorthValue)}</div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 10, fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--accent-green)' }}>↑ {formatCurrency(netWorth.totalAssets)}</span>
                      <span style={{ color: 'var(--accent-red)' }}>↓ {formatCurrency(netWorth.totalLiabilities)}</span>
                    </div>
                  </>
                ) : (
                  <div className="summary-value" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 8 }}>Skonfiguruj →</div>
                )}
              </div>
            </NavLink>
          </div>

          {/* Trend */}
          <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="card-header-custom">
              <h3 className="card-title">Trend (6 miesięcy)</h3>
            </div>
            {chartData.length > 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={chartData} barGap={2} barCategoryGap="35%">
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                    <Bar dataKey="Przychody" fill="var(--accent-green)" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="Wydatki" fill="var(--accent-red)" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
                  {[['var(--accent-green)', 'Przychody'], ['var(--accent-red)', 'Wydatki']].map(([color, label]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} /> {label}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state"><p>Brak danych</p></div>
            )}
          </div>
        </div>

        {/* Prawa kolumna: wykres kołowy */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header-custom">
            <h3 className="card-title">Top wydatki wg kategorii</h3>
          </div>
          {summary.topExpenseCategories && summary.topExpenseCategories.length > 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: 0 }}>
              <div style={{ flex: '1 1 60%' }}>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie data={summary.topExpenseCategories} dataKey="amount" nameKey="category" cx="50%" cy="50%" innerRadius={100} outerRadius={160} paddingAngle={2}>
                      {summary.topExpenseCategories.map((_, i) => (
                        <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={{ ...TOOLTIP_STYLE, fontSize: '0.8rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingRight: 16 }}>
                {summary.topExpenseCategories.map((cat, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{cat.category}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="empty-state"><p>Brak wydatków w tym miesiącu</p></div>
          )}
        </div>
      </div>

      {/* Historia NW — pokazuj tylko gdy jest więcej niż 1 punkt (pojedynczy punkt to nie "historia") */}
      {nwChartData.length > 1 && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-header-custom">
            <h3 className="card-title">Historia wartości netto</h3>
            <NavLink to="/net-worth" style={{ fontSize: '0.8rem', fontWeight: 500 }}>Szczegóły →</NavLink>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height={90}>
              <LineChart data={nwChartData}>
                <Line type="monotone" dataKey="Wartość netto" stroke={nwColor} strokeWidth={2} dot={false} />
                <Tooltip formatter={(v) => formatCurrency(v)} contentStyle={TOOLTIP_STYLE} />
                <XAxis dataKey="name" hide />
              </LineChart>
            </ResponsiveContainer>
            <div style={{ textAlign: 'right', minWidth: 140 }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 4 }}>Aktywa</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-green)' }}>{formatCurrency(netWorth.totalAssets)}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 8, marginBottom: 4 }}>Zobowiązania</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--accent-red)' }}>{formatCurrency(netWorth.totalLiabilities)}</div>
            </div>
          </div>
        </div>
      )}

      {/* Ostatnie transakcje */}
      <div className="card">
        <div className="card-header-custom">
          <h3 className="card-title">Ostatnie transakcje</h3>
          <NavLink to="/transactions" style={{ fontSize: '0.8rem', fontWeight: 500 }}>Wszystkie →</NavLink>
        </div>
        {recentTransactions.length === 0 ? (
          <div className="empty-state" style={{ padding: '20px 0' }}>
            <p>Brak transakcji w tym miesiącu</p>
          </div>
        ) : (
          <div className="recent-tx-list">
            {recentTransactions.map(tx => (
              <div className="recent-tx-item" key={tx.id}>
                <div className="recent-tx-left">
                  <div className={`recent-tx-icon ${tx.type === TransactionType.INCOME ? 'income' : 'expense'}`}>
                    {tx.type === TransactionType.INCOME ? '+' : '-'}
                  </div>
                  <div className="recent-tx-info">
                    <div className="recent-tx-name">{tx.name}</div>
                    <div className="recent-tx-cat">
                      {tx.categoryName} · {getDayName(tx.date)} {formatDateShort(tx.date)}
                    </div>
                  </div>
                </div>
                <div className="recent-tx-amount" style={{ color: tx.type === TransactionType.INCOME ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                  {tx.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}