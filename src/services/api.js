import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_URL,
})

// ========================
// INTERCEPTOR REQUEST
// ========================
api.interceptors.request.use(config => {
  const token = localStorage.getItem('moneto_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// ========================
// INTERCEPTOR RESPONSE
// ========================
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('moneto_token')
      localStorage.removeItem('moneto_user')
      localStorage.removeItem('moneto_refresh')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

// ========================
// AUTH
// ========================
export const login = data => api.post('/auth/login', data)
export const register = data => api.post('/auth/register', data)
export const verifyPhone = data => api.post('/auth/verify-phone', data)
export const resendCode = telefone =>
  api.post('/auth/resend-code', { telefone })

// ========================
// PLANOS
// ========================
export const getPlans = () => api.get('/plans')

// ========================
// SETTINGS
// ========================
export const getSettings = () => api.get('/settings')
export const updateSettings = data => api.put('/settings', data)

// ========================
// TRANSAÇÕES
// ========================
export const getTransactions = () => api.get('/transactions')
export const createTransaction = data => api.post('/transactions', data)
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data)
export const deleteTransaction = id => api.delete(`/transactions/${id}`)
export const getSummary = () => api.get('/transactions/summary')

// ========================
// METAS
// ========================
export const getGoals = () => api.get('/goals')
export const createGoal = data => api.post('/goals', data)
export const updateGoal = (id, data) => api.put(`/goals/${id}`, data)
export const deleteGoal = id => api.delete(`/goals/${id}`)
export const addGoalValue = (id, valor) =>
  api.post(`/goals/${id}/add-value`, { valor })

// ========================
// BUSINESS
// ========================
export const getBusinessEntries = () => api.get('/business/entries')
export const createBusinessEntry = data => api.post('/business/entries', data)
export const updateBusinessEntry = (id, data) => api.put(`/business/entries/${id}`, data)
export const deleteBusinessEntry = id => api.delete(`/business/entries/${id}`)
export const getBusinessSummary = () => api.get('/business/summary')

// ========================
// DÍVIDAS
// ========================
export const getDebts = () => api.get('/debts')
export const createDebt = data => api.post('/debts', data)
export const updateDebt = (id, data) => api.put(`/debts/${id}`, data)
export const deleteDebt = id => api.delete(`/debts/${id}`)

// ========================
// DASHBOARD
// ========================
export const getDashboardSummary = () => api.get('/dashboard/summary')

// ========================
// RESERVAS (COFRINHO)
// ========================
export const getReserves = () => api.get('/reserves')
export const createReserve = data => api.post('/reserves', data)
export const updateReserve = (id, data) => api.put(`/reserves/${id}`, data)
export const deleteReserve = id => api.delete(`/reserves/${id}`)
export const depositReserve = (id, valor) => api.post(`/reserves/${id}/deposit?valor=${valor}`)
export const withdrawReserve = (id, valor) => api.post(`/reserves/${id}/withdraw?valor=${valor}`)

// ========================
// ORÇAMENTOS
// ========================
export const getBudgets = () => api.get('/budgets')
export const createBudget = data => api.post('/budgets', data)
export const updateBudget = (id, data) => api.put(`/budgets/${id}`, data)
export const deleteBudget = id => api.delete(`/budgets/${id}`)

export default api