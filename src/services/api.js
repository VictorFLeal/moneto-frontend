import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('moneto_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('moneto_token')
      localStorage.removeItem('moneto_user')
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

export const login = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/register', data)

export const getTransactions = () => api.get('/transactions')
export const createTransaction = (data) => api.post('/transactions', data)
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data)
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`)
export const getSummary = () => api.get('/transactions/summary')
export const getPlans = () => api.get('/public/plans')

export const getGoals = () => api.get('/goals')
export const createGoal = (data) => api.post('/goals', data)
export const updateGoal = (id, data) => api.put(`/goals/${id}`, data)
export const deleteGoal = (id) => api.delete(`/goals/${id}`)

export const getDebts = () => api.get('/debts')
export const createDebt = (data) => api.post('/debts', data)
export const updateDebt = (id, data) => api.put(`/debts/${id}`, data)
export const deleteDebt = (id) => api.delete(`/debts/${id}`)

export const getDashboardSummary = () => api.get('/dashboard/summary')

export default api