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
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="liquid-glass rounded-3xl p-8 sm:p-10 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-6">
            <img src="/logo.png" alt="OpenMNC" className="w-12 h-12 mx-auto mb-3 object-contain" />
            <h1 className="font-display text-2xl font-semibold text-[#f5f5f7] tracking-tight">
              Join OpenMNC Team
            </h1>
            <p className="text-xs text-[#86868b] mt-1">Accept Invitation &amp; Set Password</p>
          </div>

          {checking ? (
            <div className="p-8 text-center text-xs text-[#86868b] animate-pulse">
              Verifying invitation credentials...
            </div>
          ) : error && !inviteInfo ? (
            <div className="text-center py-6">
              <span className="text-3xl mb-3 block">⚠️</span>
              <h3 className="text-base font-semibold text-[#f5f5f7] mb-2">Invalid or Expired Link</h3>
              <p className="text-xs text-red-400 mb-6">{error}</p>
              <button
                onClick={() => navigate('/admin/login')}
                className="px-5 py-2.5 rounded-full bg-white/10 text-xs text-white hover:bg-white/20 transition-colors"
              >
                Go to Admin Login
              </button>
            </div>
          ) : (
            <div>
              {/* Role Welcome Banner */}
              <div className="mb-6 p-4 rounded-2xl bg-white/[0.03] border border-white/8 text-center">
                <p className="text-xs text-[#86868b]">
                  You have been invited to join as:
                </p>
                <div className="mt-1 font-mono font-semibold text-[#2997ff] text-sm uppercase tracking-wider">
                  Tier {inviteInfo.role === 'admin' ? '1: Admin' : inviteInfo.role === 'editor' ? '2: Editor' : '3: Author'}
                </div>
                <div className="mt-1 text-[11px] text-[#a1a1a6]">
                  Authorized email: <strong className="text-white">{inviteInfo.email}</strong>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleAccept} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priyo Sen"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Create Password (6+ chars)</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full text-xs font-semibold bg-[#2997ff] text-white hover:bg-[#0071e3] transition-all disabled:opacity-50"
                >
                  {loading ? 'Activating Account...' : 'Activate Account & Access Console →'}
                </button>
              </form>

              {googleClientId && (
                <div className="mt-6 pt-5 border-t border-white/8 text-center">
                  <p className="text-xs text-[#86868b] mb-3">Or sign in with Google:</p>
                  <div id="google-join-target" className="flex justify-center" />
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
