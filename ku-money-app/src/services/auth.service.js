import { axios } from '@/plugins/axios'

export async function register(data) {
  try {
    const response = await axios.post('/api/auth/register', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export async function login(data) {
  try {
    const response = await axios.post('/api/auth/login', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export async function verifyEmail(token) {
  try {
    const response = await axios.post('/api/auth/verify', { token })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export async function resendVerification(email) {
  try {
    const response = await axios.post('/api/auth/resend-verification', { email })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export async function refreshToken(refreshToken) {
  try {
    const response = await axios.post('/api/auth/refresh', { refreshToken })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export async function logout(refreshToken) {
  try {
    const response = await axios.post('/api/auth/logout', { refreshToken })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export async function updatePassword(data) {
  try {
    const response = await axios.put('/api/auth/password', data)
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export async function getMe() {
  try {
    const response = await axios.get('/api/auth/me')
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}

export async function googleAuth(idToken) {
  try {
    const response = await axios.post('/api/auth/google', { idToken })
    return response.data
  } catch (error) {
    throw error.response?.data || error
  }
}
