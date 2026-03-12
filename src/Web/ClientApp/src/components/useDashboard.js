import { useState, useEffect, useMemo, useCallback } from 'react';
import toast from 'react-hot-toast';
import { api } from '../api';
import { getMonthName } from '../utils';

const EMPTY_SUMMARY = {
  totalIncome: 0, totalExpenses: 0, balance: 0,
  transactionCount: 0, topExpenseCategories: [], monthlyTrend: []
};

export function useDashboard(month, year) {
  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [netWorth, setNetWorth] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.dashboard.getSummary(month, year),
      api.transactions.getAll(month, year),
      api.netWorth.getSummary().catch(err => {
        // Net worth może nie mieć danych — logujemy, ale nie blokujemy dashboardu
        console.warn('Net worth niedostępny:', err?.message);
        return null;
      }),
    ])
      .then(([summary, tx, nw]) => {
        setData(summary);
        setTransactions(tx || []);
        setNetWorth(nw);
      })
      .catch(err => toast.error(err?.message || 'Błąd podczas ładowania danych'))
      .finally(() => setLoading(false));
  }, [month, year]);

  useEffect(() => { loadData(); }, [loadData]);

  const summary = data || EMPTY_SUMMARY;

  const chartData = useMemo(() =>
    (summary.monthlyTrend || []).map(m => ({
      name: getMonthName(m.month).substring(0, 3),
      Przychody: m.income,
      Wydatki: m.expenses,
    })),
    [summary.monthlyTrend]
  );

  const recentTransactions = useMemo(() =>
    [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6),
    [transactions]
  );

  const nwChartData = useMemo(() =>
    (netWorth?.history || []).map(h => ({
      name: `${getMonthName(h.month).substring(0, 3)} ${h.year}`,
      'Wartość netto': h.netWorth,
    })),
    [netWorth]
  );

  const netWorthValue = netWorth?.netWorth ?? null;
  const isBalancePositive = summary.balance >= 0;
  const isNwPositive = netWorthValue === null || netWorthValue >= 0;

  return {
    loading, summary, chartData, recentTransactions,
    netWorth, netWorthValue, nwChartData,
    isBalancePositive, isNwPositive,
  };
}
