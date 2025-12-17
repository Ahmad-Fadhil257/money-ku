import { axios } from '@/plugins/axios'

/**
 * Get all categories
 * @param {string} type - Optional: 'incomes' | 'expenses'
 * @returns {Promise}
 */
export async function getCategories(type = null) {
  try {
    const url = type ? `/api/categories?type=${type}` : '/api/categories'
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get category by ID
 * @param {string} id - Category ID
 * @returns {Promise}
 */
export async function getCategoryById(id) {
  try {
    const response = await axios.get(`/api/categories/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Create new category
 * @param {Object} data - { title, icon, type }
 * @returns {Promise}
 */
export async function createCategory(data) {
  try {
    const response = await axios.post('/api/categories', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Update category
 * @param {string} id - Category ID
 * @param {Object} data - { title?, icon? }
 * @returns {Promise}
 */
export async function updateCategory(id, data) {
  try {
    const response = await axios.put(`/api/categories/${id}`, data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Delete category
 * @param {string} id - Category ID
 * @returns {Promise}
 */
export async function deleteCategory(id) {
  try {
    const response = await axios.delete(`/api/categories/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

