import { axios } from '@/plugins/axios'

/**
 * Get user orders with pagination
 * @param {Object} params - { status?, limit?, page? }
 * @returns {Promise}
 */
export async function getUserOrders(params = {}) {
  try {
    const queryParams = new URLSearchParams()

    if (params.status) queryParams.append('status', params.status)
    if (params.limit) queryParams.append('limit', params.limit)
    if (params.page) queryParams.append('page', params.page)

    const queryString = queryParams.toString()
    const url = `/api/orders/my-orders${queryString ? `?${queryString}` : ''}`

    const response = await axios.get(url)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get order status by transaction ID
 * @param {string} transactionId - Transaction ID
 * @returns {Promise}
 */
export async function getOrderStatus(transactionId) {
  try {
    const response = await axios.get(`/api/orders/status/${transactionId}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get last order created by user
 * @returns {Promise}
 */
export async function getLastOrder() {
  try {
    const response = await axios.get('/api/orders/last')
    return response.data
  } catch (error) {
    // If no order found, return null instead of throwing
    if (error.response?.status === 404) {
      return null
    }
    throw error.response?.data || error
  }
}

/**
 * Create order for subscription upgrade
 * @param {Object} data - { orderType, packageId, period: { type, value } }
 * @returns {Promise}
 */
export async function createOrder(data) {
  try {
    const response = await axios.post('/api/orders/create', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}
