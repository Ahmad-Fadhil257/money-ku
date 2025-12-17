import { axios } from '@/plugins/axios'

/**
 * Get all tickets
 * @returns {Promise}
 */
export async function getTickets() {
  try {
    const response = await axios.get('/api/tickets')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Get ticket by ID
 * @param {string} id - Ticket ID
 * @returns {Promise}
 */
export async function getTicketById(id) {
  try {
    const response = await axios.get(`/api/tickets/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Create new ticket
 * @param {Object} data - { subject, message, file? }
 * @returns {Promise}
 */
export async function createTicket(data) {
  try {
    const response = await axios.post('/api/tickets', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Update ticket
 * @param {string} id - Ticket ID
 * @param {Object} data - { subject?, message?, file?, status? }
 * @returns {Promise}
 */
export async function updateTicket(id, data) {
  try {
    const response = await axios.put(`/api/tickets/${id}`, data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

/**
 * Delete ticket
 * @param {string} id - Ticket ID
 * @returns {Promise}
 */
export async function deleteTicket(id) {
  try {
    const response = await axios.delete(`/api/tickets/${id}`)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}
