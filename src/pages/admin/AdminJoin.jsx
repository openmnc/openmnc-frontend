import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthContext } from '../../context/AuthContext.jsx'
import apiClient from '../../api/client.js'

export default function AdminJoin() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()
  const { setManualToken } = useAuthContext()

  const [checking, setChecking] = useState(true)
  const [inviteInfo, setInviteInfo] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

  useEffect(() => {
    if (!token) {
      setError('No invitation token found in the link.')
      setChecking(false)
      return
    }

    async function checkInvite() {
      try {
        const res = await apiClient.get(`/auth/team/verify-invite?token=${encodeURIComponent(token)}`)
        setInviteInfo(res.data)
        if (res.data.name) setName(res.data.name)
      } catch (err) {
        setError(err?.response?.data?.detail || 'This invitation is invalid or has already expired.')
      } finally {
        setChecking(false)
      }
    }

    checkInvite()
  }, [token])

  // Google Sign-In handler for invited user
  useEffect(() => {
    if (!googleClientId || !inviteInfo) return

    function initGoogle() {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            setLoading(true)
            setError('')
            try {
              const res = await apiClient.post('/auth/google-login', {
                credential: response.credential,
              })
              const { access_token, role, email } = res.data
              setManualToken(access_token, { email, role })
              navigate('/admin/dashboard')
            } catch (err) {
              setError(err?.response?.data?.detail || 'Google authentication failed.')
            } finally {
              setLoading(false)
            }
          },
        })

        const btnEl = document.getElementById('google-join-target')
        if (btnEl) {
          window.google.accounts.id.renderButton(btnEl, {
            theme: 'filled_black',
            size: 'large',
            width: '100%',
            text: 'signup_with',
            shape: 'rectangular',
          })
        }
      }
    }

    if (window.google?.accounts?.id) {
      initGoogle()
    } else {
      const timer = setTimeout(initGoogle, 1000)
      return () => clearTimeout(timer)
    }
  }, [googleClientId, inviteInfo, setManualToken, navigate])

  async function handleAccept(e) {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await apiClient.post('/auth/team/accept-invite', {
        token,
        password,
        name: name.trim(),
      })
      const { access_token, role, email } = res.data
      setManualToken(access_token, { email, role })
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to activate account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-navy-950 flex items-center justify-center px-4 py-8"
      style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #000000 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-6">
            <img
              src="/logo.png"
              alt="OpenMNC Logo"
              className="w-14 h-14 mx-auto mb-3 object-contain drop-shadow-[0_4px_12px_rgba(0,245,255,0.2)]"
            />
            <div className="inline-flex items-center gap-1 mb-1">
              <span className="font-display text-2xl font-bold text-white">Open</span>
              <span className="font-display text-2xl font-bold text-cyan-neon">MNC</span>
              <span className="ml-0.5 w-2 h-2 rounded-full bg-cyan-neon" aria-hidden="true" />
            </div>
            <p className="text-gray-400 text-sm">Team Member Invitation</p>
          </div>

          {checking ? (
            <div className="p-8 text-center text-gray-400 text-xs animate-pulse">
              Verifying invitation link...
            </div>
          ) : error && !inviteInfo ? (
            <div className="text-center py-6">
              <span className="text-3xl mb-3 block">⚠️</span>
              <h3 className="text-base font-bold text-white mb-2">Invalid or Expired Link</h3>
              <p className="text-xs text-red-400 mb-6">{error}</p>
              <button
                onClick={() => navigate('/admin/login')}
                className="px-4 py-2 rounded-lg bg-white/10 text-xs text-white hover:bg-white/20 transition-colors"
              >
                Go to Admin Login
              </button>
            </div>
          ) : (
            <div>
              {/* Role Welcome Banner */}
              <div className="mb-6 p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-center">
                <p className="text-xs text-gray-300">
                  You have been invited to join the OpenMNC team as:
                </p>
                <div className="mt-1 font-mono font-bold text-cyan-300 text-base uppercase tracking-wider">
                  Tier {inviteInfo.role === 'admin' ? '1: Admin' : inviteInfo.role === 'editor' ? '2: Editor' : '3: Author'}
                </div>
                <div className="mt-1 text-[11px] text-gray-400">
                  Authorized email: <strong className="text-white">{inviteInfo.email}</strong>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleAccept} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg font-display font-medium text-sm text-navy-950 bg-gradient-to-r from-cyan-neon to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 transition-all shadow-cyan-glow-sm disabled:opacity-50"
                >
                  {loading ? 'Activating Account...' : 'Accept Invitation & Enter Dashboard →'}
                </button>
              </form>

              {/* Google Sign-In Alternative */}
              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-[11px] text-gray-400 mb-3">Or sign up with your authorized Google account:</p>
                <div id="google-join-target" className="flex justify-center min-h-[40px]" />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
