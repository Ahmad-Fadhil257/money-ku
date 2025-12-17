import { axios } from '@/plugins/axios'

/**
 * Get user subscription
 * @returns {Promise} Promise with subscription data
 */
export async function getSubscription() {
  try {
    const response = await axios.get('/api/subscriptions')
    return response.data
  } catch (error) {
    console.error('Error fetching subscription:', error)
    throw error.response?.data || error
  }
}

/**
 * Get user expired status
 * @returns {Promise} Promise with expired status data (expiredAt, isExpired, remainingDays)
 */
export async function getExpiredStatus() {
  try {
    const response = await axios.get('/api/subscriptions/expired')
    return response.data
  } catch (error) {
    console.error('Error fetching expired status:', error)
    throw error.response?.data || error
  }
}
