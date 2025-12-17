import { axios } from '@/plugins/axios'

/**
 * Get dashboard summary
 * @param {Object} params - Query parameters (fromDate, toDate, accountId)
 * @returns {Promise} Promise with summary data
 */
export async function getDashboardSummary(params = {}) {
  try {
    const response = await axios.get('/api/dashboard/summary', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching dashboard summary:', error)
    throw error.response?.data || error
  }
}

/**
 * Get expenses by category
 * @param {Object} params - Query parameters (fromDate, toDate, accountId)
 * @returns {Promise} Promise with expenses by category data
 */
export async function getExpensesByCategory(params = {}) {
  try {
    const response = await axios.get('/api/dashboard/expenses-by-category', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching expenses by category:', error)
    throw error.response?.data || error
  }
}

/**
 * Get income vs expenses
 * @param {Object} params - Query parameters (fromDate, toDate, accountId, periodType)
 * @returns {Promise} Promise with income vs expenses data
 */
export async function getIncomeVsExpenses(params = {}) {
  try {
    const response = await axios.get('/api/dashboard/income-vs-expenses', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching income vs expenses:', error)
    throw error.response?.data || error
  }
}

/**
 * Get recent transactions
 * @param {Object} params - Query parameters (fromDate, toDate, accountId, limit, page)
 * @returns {Promise} Promise with recent transactions data
 */
export async function getRecentTransactions(params = {}) {
  try {
    const response = await axios.get('/api/dashboard/recent-transactions', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching recent transactions:', error)
    throw error.response?.data || error
  }
}
