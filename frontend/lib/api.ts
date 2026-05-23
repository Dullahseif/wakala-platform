import axios from 'axios'

const API = axios.create({
  baseURL: 'https://wakala-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Agents
export const getAgents = () => API.get('/agents/')
export const getAgent = (id: string) => API.get(`/agents/${id}`)
export const createAgent = (data: object) => API.post('/agents/', data)
export const updateAgent = (id: string, data: object) => API.put(`/agents/${id}`, data)
export const deleteAgent = (id: string) => API.delete(`/agents/${id}`)

// Transactions
export const getTransactions = () => API.get('/transactions/')
export const getAgentTransactions = (id: string) => API.get(`/transactions/agent/${id}`)
export const createTransaction = (data: object) => API.post('/transactions/', data)

// Credit Scores
export const getCreditScores = () => API.get('/credit-scores/')
export const getAgentCreditScore = (id: string) => API.get(`/credit-scores/${id}`)
export const calculateCreditScore = (id: string) => API.post(`/credit-scores/calculate/${id}`)
export const calculateAllScores = () => API.post('/credit-scores/calculate-all')

// Loans
export const getLoans = () => API.get('/loans/')
export const createLoan = (data: object) => API.post('/loans/', data)
export const approveLoan = (id: string) => API.put(`/loans/${id}/approve`)
export const rejectLoan = (id: string) => API.put(`/loans/${id}/reject`)
export const repayLoan = (id: string, data: object) => API.put(`/loans/${id}/repay`, data)

// Fraud
export const getFraudAlerts = () => API.get('/fraud/')
export const createFraudAlert = (data: object) => API.post('/fraud/', data)
export const investigateAlert = (id: string) => API.put(`/fraud/${id}/investigate`)
export const resolveAlert = (id: string) => API.put(`/fraud/${id}/resolve`)
export const scanAgent = (id: string) => API.post(`/fraud/scan/${id}`)

export default API

// Auth
export const registerUser = (data: object) => API.post('/auth/register', data)
export const loginUser = (data: object) => API.post('/auth/login', data)

// Analytics
export const getAnalyticsSummary = () => API.get('/analytics/summary')
export const getTransactionsByType = () => API.get('/analytics/transactions-by-type')
export const getTransactionsByProvider = () => API.get('/analytics/transactions-by-provider')
export const getCreditDistribution = () => API.get('/analytics/credit-distribution')
export const getAgentsByLocation = () => API.get('/analytics/agents-by-location')
export const getLoansByStatus = () => API.get('/analytics/loans-by-status')