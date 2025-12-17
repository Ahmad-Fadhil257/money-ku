import { axios } from '@/plugins/axios'

/**
 * Get all accounts
 * @returns {Promise}
 */
export async function getAccounts() {
  try {
    const response = await axios.get('/api/accounts')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get account by ID
 * @param {string} id - Account ID
 * @returns {Promise}
 */
export async function getAccountById(id) {
  try {
    const response = await axios.get(`/api/accounts/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Create new account
 * @param {Object} data - { title, icon, description, balance }
 * @returns {Promise}
 */
export async function createAccount(data) {
  try {
    const response = await axios.post('/api/accounts', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Update account
 * @param {string} id - Account ID
 * @param {Object} data - { title?, icon?, description?, balance? }
 * @returns {Promise}
 */
export async function updateAccount(id, data) {
  try {
    const response = await axios.put(`/api/accounts/${id}`, data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Delete account
 * @param {string} id - Account ID
 * @returns {Promise}
 */
export async function deleteAccount(id) {
  try {
    const response = await axios.delete(`/api/accounts/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}
