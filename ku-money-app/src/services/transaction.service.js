import { axios } from '@/plugins/axios'

/**
 * Get all transactions (grouped by date)
 * @param {Object} params - { page?, limit?, grouped?, categoryType?, accountId?, startDate?, endDate? }
 * @returns {Promise}
 */
export async function getTransactions(params = {}) {
  try {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append('page', params.page)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.grouped !== undefined) queryParams.append('grouped', params.grouped)
    if (params.categoryType) queryParams.append('categoryType', params.categoryType)
    if (params.accountId) queryParams.append('accountId', params.accountId)
    if (params.startDate) queryParams.append('startDate', params.startDate)
    if (params.endDate) queryParams.append('endDate', params.endDate)

    const queryString = queryParams.toString()
    const url = `/api/transactions${queryString ? `?${queryString}` : ''}`

    const response = await axios.get(url)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get transaction by ID
 * @param {string} id - Transaction ID
 * @returns {Promise}
 */
export async function getTransactionById(id) {
  try {
    const response = await axios.get(`/api/transactions/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Create new transaction
 * @param {Object} data - { accountId, categoryId, amount, note, paymentDate }
 * @returns {Promise}
 */
export async function createTransaction(data) {
  try {
    const response = await axios.post('/api/transactions', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Update transaction
 * @param {string} id - Transaction ID
 * @param {Object} data - { amount?, note?, paymentDate?, accountId?, categoryId? }
 * @returns {Promise}
 */
export async function updateTransaction(id, data) {
  try {
    const response = await axios.put(`/api/transactions/${id}`, data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Delete transaction
 * @param {string} id - Transaction ID
 * @returns {Promise}
 */
export async function deleteTransaction(id) {
  try {
    const response = await axios.delete(`/api/transactions/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}
