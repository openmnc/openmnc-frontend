import { createContext, useContext, useState, useCallback } from 'react'
import apiClient from '../api/client.js'

const AuthContext = createContext(null)

const TOKEN_KEY = 'openmnc_admin_token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))

  const isAuthenticated = Boolean(token)

  const login = useCallback(async (email, password) => {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)
    const response = await apiClient.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    const { access_token } = response.data
    localStorage.setItem(TOKEN_KEY, access_token)
    setToken(access_token)
    return access_token
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}

export default AuthContext
