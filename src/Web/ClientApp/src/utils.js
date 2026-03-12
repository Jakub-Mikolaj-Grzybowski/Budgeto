
// Enum dla typów transakcji
export const TransactionType = {
  INCOME: 0,
  EXPENSE: 1,
};
// Zamiast magicznych liczb używaj TransactionType:
// tx.type === TransactionType.INCOME
// tx.type === TransactionType.EXPENSE

const MONTH_NAMES = [
  'Styczen', 'Luty', 'Marzec', 'Kwiecien', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpien', 'Wrzesien', 'Pazdziernik', 'Listopad', 'Grudzien'
];

export function getMonthName(month) {
  return MONTH_NAMES[month - 1] || '';
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' });
}

// Get Monday-based ISO week number
export function getWeekNumber(dateStr) {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
}

// Get Monday of the week for a given date
export function getMonday(dateStr) {
  const d = new Date(dateStr);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

// Group transactions by week, returns array of { weekStart, weekEnd, weekLabel, transactions, income, expense }
export function groupByWeek(transactions) {
  if (!transactions || transactions.length === 0) return [];

  const groups = {};
  transactions.forEach(tx => {
    const mon = getMonday(tx.date);
    const key = mon.toISOString().split('T')[0];
    if (!groups[key]) {
      const sun = new Date(mon);
      sun.setDate(sun.getDate() + 6);
      groups[key] = {
        weekStart: mon,
        weekEnd: sun,
        weekLabel: `${formatDateShort(mon.toISOString())} - ${formatDateShort(sun.toISOString())}`,
        transactions: [],
        income: 0,
        expense: 0
      };
    }
    groups[key].transactions.push(tx);

    if (tx.type === TransactionType.INCOME) groups[key].income += tx.amount;
    else groups[key].expense += tx.amount;
  });

  return Object.values(groups).sort((a, b) => b.weekStart - a.weekStart);
}

const DAY_NAMES = ['Niedz', 'Pon', 'Wt', 'Sr', 'Czw', 'Pt', 'Sob'];

export function getDayName(dateStr) {
  return DAY_NAMES[new Date(dateStr).getDay()];
}

// ------- Budget cycle helpers (cycle starts 24th of each month) -------

const MONTH_SHORT = ['Sty','Lut','Mar','Kwi','Maj','Cze','Lip','Sie','Wrz','Paz','Lis','Gru'];

// periodMonth/periodYear = "end" month (e.g. March 2026 = cycle 24 Feb – 23 Mar 2026)
export function getBudgetPeriodLabel(periodMonth, periodYear) {
  let startMonth = periodMonth - 1;
  if (startMonth === 0) { startMonth = 12; }
  return `24 ${MONTH_SHORT[startMonth - 1]} - 23 ${MONTH_SHORT[periodMonth - 1]} ${periodYear}`;
}

// Previous period
export function getPrevPeriod(periodMonth, periodYear) {
  if (periodMonth === 1) return { month: 12, year: periodYear - 1 };
  return { month: periodMonth - 1, year: periodYear };
}

// Next period
export function getNextPeriod(periodMonth, periodYear) {
  if (periodMonth === 12) return { month: 1, year: periodYear + 1 };
  return { month: periodMonth + 1, year: periodYear };
}

// Get the "start" month for a period (previous calendar month)
export function getPeriodStartMonth(periodMonth, periodYear) {
  if (periodMonth === 1) return { month: 12, year: periodYear - 1 };
  return { month: periodMonth - 1, year: periodYear };
}

// Filter transactions to the current period (24th prev – 23rd curr)
export function filterToPeriod(transactions, periodMonth, periodYear) {
  const { month: sm, year: sy } = getPeriodStartMonth(periodMonth, periodYear);
  const start = new Date(sy, sm - 1, 24, 0, 0, 0);
  const end   = new Date(periodYear, periodMonth - 1, 23, 23, 59, 59);
  return (transactions || []).filter(tx => {
    const d = new Date(tx.date);
    return d >= start && d <= end;
  });
}
