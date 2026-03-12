const BASE = '/api';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function handleResponse(response) {
  if (!response.ok) {
    const text = await response.text();
    let message = text || response.statusText;
    try { message = JSON.parse(text)?.title || JSON.parse(text)?.message || message; } catch {}
    throw new ApiError(message, response.status);
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function handleNetworkError(err) {
  if (err instanceof ApiError) throw err;
  throw new ApiError('Brak połączenia z serwerem', 0);
}

function headers() {
  return { 'Content-Type': 'application/json' };
}

function get(url) {
  return fetch(url, { headers: headers() }).then(handleResponse).catch(handleNetworkError);
}
function post(url, data) {
  return fetch(url, { method: 'POST', headers: headers(), body: JSON.stringify(data) }).then(handleResponse).catch(handleNetworkError);
}
function put(url, data) {
  return fetch(url, { method: 'PUT', headers: headers(), body: JSON.stringify(data) }).then(handleResponse).catch(handleNetworkError);
}
function del(url) {
  return fetch(url, { method: 'DELETE', headers: headers() }).then(handleResponse).catch(handleNetworkError);
}

export const api = {
  dashboard: {
    getSummary: (month, year) => get(`${BASE}/Dashboard?month=${month}&year=${year}`),
  },
  transactions: {
    getAll: (month, year) => {
      let url = `${BASE}/Transactions`;
      if (month && year) url += `?month=${month}&year=${year}`;
      return get(url);
    },
    get: (id) => get(`${BASE}/Transactions/${id}`),
    create: (data) => post(`${BASE}/Transactions`, data),
    update: (id, data) => put(`${BASE}/Transactions/${id}`, { id, ...data }),
    delete: (id) => del(`${BASE}/Transactions/${id}`),
  },
  budgets: {
    getAll: (month, year) => get(`${BASE}/Budgets?month=${month}&year=${year}`),
    create: (data) => post(`${BASE}/Budgets`, data),
    update: (id, data) => put(`${BASE}/Budgets/${id}`, { id, ...data }),
    delete: (id) => del(`${BASE}/Budgets/${id}`),
  },
  categories: {
    getAll: () => get(`${BASE}/Categories`),
    create: (data) => post(`${BASE}/Categories`, data),
    delete: (id) => del(`${BASE}/Categories/${id}`),
  },
  savingsGoals: {
    getAll: () => get(`${BASE}/SavingsGoals`),
    create: (data) => post(`${BASE}/SavingsGoals`, data),
    update: (id, data) => put(`${BASE}/SavingsGoals/${id}`, { id, ...data }),
    delete: (id) => del(`${BASE}/SavingsGoals/${id}`),
  },
  recurringTransactions: {
    getAll: () => get(`${BASE}/RecurringTransactions`),
    create: (data) => post(`${BASE}/RecurringTransactions`, data),
    update: (id, data) => put(`${BASE}/RecurringTransactions/${id}`, { id, ...data }),
    delete: (id) => del(`${BASE}/RecurringTransactions/${id}`),
    process: () => post(`${BASE}/RecurringTransactions/process`, {}),
  },
  netWorth: {
    getSummary: () => get(`${BASE}/NetWorth`),
    create: (data) => post(`${BASE}/NetWorth`, data),
    update: (id, data) => put(`${BASE}/NetWorth/${id}`, { id, ...data }),
    delete: (id) => del(`${BASE}/NetWorth/${id}`),
  },
};
