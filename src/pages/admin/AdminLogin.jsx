import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthContext } from '../../context/AuthContext.jsx'
import apiClient from '../../api/client.js'

export default function AdminLogin() {
  const { isAuthenticated, login, setManualToken } = useAuthContext()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  // Auth Modes: 'login' | 'otp_login' | 'forgot_email' | 'verify_otp' | 'new_password'
  const [authMode, setAuthMode] = useState('login')

  const { register, handleSubmit, formState: { errors } } = useForm()

  // OTP Login State
  const [otpLoginEmail, setOtpLoginEmail] = useState('')
  const [otpLoginStep, setOtpLoginStep] = useState(1)
  const [otpCode, setOtpCode] = useState('')
  const [otpMessage, setOtpMessage] = useState('')
  const [otpDebug, setOtpDebug] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        navigate('/admin/dashboard', { replace: true })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (resendCooldown <= 0) return
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [resendCooldown])

  useEffect(() => {
    if (!googleClientId) return

    function initGoogle() {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            setLoading(true)
            setServerError('')
            try {
              const res = await apiClient.post('/auth/google-login', {
                credential: response.credential,
              })
              const { access_token, email, role } = res.data
              setManualToken(access_token, { email, role })
              navigate('/admin/dashboard')
            } catch (err) {
              setServerError(err?.response?.data?.detail || 'Google sign-in failed. Please verify authorization.')
            } finally {
              setLoading(false)
            }
          },
        })

        const btnEl = document.getElementById('google-signin-target')
        if (btnEl) {
          window.google.accounts.id.renderButton(btnEl, {
            theme: 'filled_black',
            size: 'large',
            width: '100%',
            text: 'signin_with',
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
  }, [googleClientId, authMode, setManualToken, navigate])

  async function onLoginSubmit(data) {
    setLoading(true)
    setServerError('')
    try {
      await login(data.email, data.password)
      navigate('/admin/dashboard')
    } catch (err) {
      setServerError(err?.response?.data?.detail || 'Invalid credentials. Please verify your email and password.')
    } finally {
      setLoading(false)
    }
  }

  async function handleRequestLoginOtp(e) {
    e.preventDefault()
    if (!otpLoginEmail) {
      setServerError('Please enter your administrator or invited team email.')
      return
    }
    setLoading(true)
    setServerError('')
    setOtpMessage('')
    try {
      const res = await apiClient.post('/auth/request-otp', { email: otpLoginEmail })
      setOtpMessage(res.data.message || 'Verification code dispatched to your email.')
      if (res.data.otp_debug) {
        setOtpDebug(res.data.otp_debug)
      }
      setOtpLoginStep(2)
      setResendCooldown(60)
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Failed to dispatch verification code.'
      setServerError(msg)
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyLoginOtp(e) {
    e.preventDefault()
    if (!otpCode || otpCode.trim().length !== 6) {
      setServerError('Please enter the 6-digit verification code.')
      return
    }
    setLoading(true)
    setServerError('')
    try {
      const res = await apiClient.post('/auth/otp-login', {
        email: otpLoginEmail,
        otp: otpCode.trim(),
      })
      const { access_token, email, role } = res.data
      setManualToken(access_token, { email, role })
      navigate('/admin/dashboard')
    } catch (err) {
      setServerError(err?.response?.data?.detail || 'Invalid or expired OTP code.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSendForgotOtp(e) {
    e.preventDefault()
    if (!forgotEmail) {
      setServerError('Please enter your administrator email.')
      return
    }
    setLoading(true)
    setServerError('')
    setOtpMessage('')
    try {
      const res = await apiClient.post('/auth/forgot-password', { email: forgotEmail })
      setOtpMessage(res.data.message || 'Password reset OTP dispatched.')
      if (res.data.otp_debug) {
        setOtpDebug(res.data.otp_debug)
      }
      setResendCooldown(60)
      setAuthMode('verify_otp')
    } catch (err) {
      setServerError(err?.response?.data?.detail || 'Failed to dispatch reset code.')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyForgotOtp(e) {
    e.preventDefault()
    if (!otpCode || otpCode.trim().length !== 6) {
      setServerError('Please enter the 6-digit OTP.')
      return
    }
    setLoading(true)
    setServerError('')
    try {
      const res = await apiClient.post('/auth/verify-otp', { email: forgotEmail, otp: otpCode.trim() })
      setResetToken(res.data.reset_token)
      setAuthMode('new_password')
      setOtpMessage('Code verified! Enter your new password below.')
    } catch (err) {
      setServerError(err?.response?.data?.detail || 'Invalid or expired code.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e) {
    e.preventDefault()
    if (newPassword.length < 6) {
      setServerError('Password must be at least 6 characters long.')
      return
    }
    if (newPassword !== confirmPassword) {
      setServerError('Passwords do not match.')
      return
    }
    setLoading(true)
    setServerError('')
    try {
      const res = await apiClient.post('/auth/reset-password', {
        reset_token: resetToken,
        new_password: newPassword,
      })
      alert(res.data.message || 'Password updated! Please log in.')
      setAuthMode('login')
      setServerError('')
    } catch (err) {
      setServerError(err?.response?.data?.detail || 'Password reset failed.')
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
          {/* Header */}
          <div className="text-center mb-6">
            <img src="/logo.png" alt="OpenMNC" className="w-12 h-12 mx-auto mb-3 object-contain" />
            <h1 className="font-display text-2xl font-semibold text-[#f5f5f7] tracking-tight">
              OpenMNC Console
            </h1>
            <p className="text-xs text-[#86868b] mt-1">
              Engineering CMS &amp; Operational Management
            </p>
          </div>

          {/* Segmented Mode Selector */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex p-1 rounded-full bg-white/5 border border-white/8 text-xs font-medium">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setServerError('') }}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  authMode === 'login' ? 'bg-white/15 text-white shadow-sm' : 'text-[#86868b] hover:text-white'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('otp_login'); setServerError('') }}
                className={`px-4 py-1.5 rounded-full transition-all ${
                  authMode === 'otp_login' ? 'bg-white/15 text-white shadow-sm' : 'text-[#86868b] hover:text-white'
                }`}
              >
                Instant OTP
              </button>
            </div>
          </div>

          {serverError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {serverError}
            </div>
          )}

          {otpMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center">
              {otpMessage}
            </div>
          )}

          {/* Mode 1: Standard Password Login */}
          {authMode === 'login' && (
            <form onSubmit={handleSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Email Address</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  placeholder="admin@openmnc.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff] transition-colors"
                />
                {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-[#d2d2d7]">Password</label>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot_email'); setServerError('') }}
                    className="text-[11px] text-[#2997ff] hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required' })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff] transition-colors"
                />
                {errors.password && <p className="text-red-400 text-[11px] mt-1">{errors.password.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-xs font-semibold tracking-wide bg-[#2997ff] hover:bg-[#0071e3] text-white transition-all disabled:opacity-50 mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign In to Console →'}
              </button>
            </form>
          )}

          {/* Mode 2: OTP Login */}
          {authMode === 'otp_login' && (
            <div className="space-y-4">
              {otpLoginStep === 1 ? (
                <form onSubmit={handleRequestLoginOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Registered Team Email</label>
                    <input
                      type="email"
                      value={otpLoginEmail}
                      onChange={(e) => setOtpLoginEmail(e.target.value)}
                      placeholder="you@openmnc.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full text-xs font-semibold bg-[#2997ff] text-white hover:bg-[#0071e3] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Sending Code...' : 'Send 6-Digit Code →'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-center text-lg font-mono tracking-widest focus:outline-none focus:border-[#2997ff]"
                    />
                    {otpDebug && (
                      <p className="text-[10px] text-amber-400 font-mono mt-1 text-center">
                        Dev OTP: {otpDebug}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-full text-xs font-semibold bg-[#2997ff] text-white hover:bg-[#0071e3] transition-all disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify & Enter Console →'}
                  </button>
                  <div className="flex justify-between items-center text-xs text-[#86868b] pt-1">
                    <button
                      type="button"
                      onClick={() => setOtpLoginStep(1)}
                      className="hover:text-white"
                    >
                      ← Change Email
                    </button>
                    {resendCooldown > 0 ? (
                      <span className="tabular-nums">Resend in {resendCooldown}s</span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleRequestLoginOtp}
                        className="text-[#2997ff] hover:underline"
                      >
                        Resend OTP
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Mode 3: Forgot Password */}
          {authMode === 'forgot_email' && (
            <form onSubmit={handleSendForgotOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Administrator Email</label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="admin@openmnc.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-xs font-semibold bg-[#2997ff] text-white hover:bg-[#0071e3] transition-all disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Password Reset OTP →'}
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="w-full text-center text-xs text-[#86868b] hover:text-white pt-2"
              >
                ← Back to Login
              </button>
            </form>
          )}

          {/* Mode 4: Verify OTP for Password Reset */}
          {authMode === 'verify_otp' && (
            <form onSubmit={handleVerifyForgotOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Enter Verification Code</label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-center text-lg font-mono tracking-widest focus:outline-none focus:border-[#2997ff]"
                />
                {otpDebug && (
                  <p className="text-[10px] text-amber-400 font-mono mt-1 text-center">
                    Dev OTP: {otpDebug}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-xs font-semibold bg-[#2997ff] text-white hover:bg-[#0071e3] transition-all disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Code →'}
              </button>
            </form>
          )}

          {/* Mode 5: Set New Password */}
          {authMode === 'new_password' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#d2d2d7] mb-1">New Password (6+ chars)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#d2d2d7] mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-xs font-semibold bg-[#2997ff] text-white hover:bg-[#0071e3] transition-all disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Set New Password & Log In →'}
              </button>
            </form>
          )}

          {/* Google OAuth container if available */}
          {googleClientId && (
            <div className="mt-6 pt-5 border-t border-white/8">
              <div id="google-signin-target" className="flex justify-center" />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
