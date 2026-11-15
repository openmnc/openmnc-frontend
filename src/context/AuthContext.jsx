import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import apiClient from '../api/client.js'

const AuthContext = createContext(null)

const TOKEN_KEY = 'openmnc_admin_token'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(Boolean(token))

  const isAuthenticated = Boolean(token)

  const fetchCurrentUser = useCallback(async () => {
    if (!localStorage.getItem(TOKEN_KEY)) {
      setUser(null)
      setLoadingUser(false)
      return null
    }
    try {
      setLoadingUser(true)
      const res = await apiClient.get('/auth/me')
      setUser(res.data)
      return res.data
    } catch {
      // If token expired or invalid
      setUser(null)
      return null
    } finally {
      setLoadingUser(false)
    }
  }, [])

  useEffect(() => {
    if (token) {
      fetchCurrentUser()
    } else {
      setUser(null)
      setLoadingUser(false)
    }
  }, [token, fetchCurrentUser])

  const login = useCallback(async (email, password) => {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)
    const response = await apiClient.post('/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    const { access_token, role } = response.data
    localStorage.setItem(TOKEN_KEY, access_token)
    setToken(access_token)
    setUser({ email, role: role || 'admin' })
    fetchCurrentUser()
    return access_token
  }, [fetchCurrentUser])

  const setManualToken = useCallback((newToken, userInfo = null) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
    if (userInfo) setUser(userInfo)
    fetchCurrentUser()
  }, [fetchCurrentUser])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const role = user?.role || 'admin'

  const hasRole = useCallback((allowedRoles) => {
    if (!allowedRoles || allowedRoles.length === 0) return true
    if (role === 'admin') return true
    return allowedRoles.includes(role)
  }, [role])

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        role,
        loadingUser,
        hasRole,
        login,
        setManualToken,
        logout,
        fetchCurrentUser,
      }}
    >
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
