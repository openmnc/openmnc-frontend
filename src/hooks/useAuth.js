import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/client.js'

const TOKEN_KEY = 'openmnc_admin_token'

export function useAuth() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const isAuthenticated = Boolean(token)

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)
      const response = await apiClient.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      const { access_token } = response.data
      localStorage.setItem(TOKEN_KEY, access_token)
      setToken(access_token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    navigate('/admin/login')
  }, [navigate])

  return { isAuthenticated, token, login, logout, loading, error }
}

export default useAuth
