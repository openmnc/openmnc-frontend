import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthContext } from '../../context/AuthContext.jsx'
import apiClient from '../../api/client.js'

export default function AdminLogin() {
  const { login } = useAuthContext()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  // Auth states: 'login' | 'setup' | 'forgot_email' | 'verify_otp' | 'new_password'
  const [authMode, setAuthMode] = useState('login')
  const [forgotEmail, setForgotEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [otpMessage, setOtpMessage] = useState('')
  const [otpDebug, setOtpDebug] = useState('')

  // First-Time Setup State
  const [setupEmail, setSetupEmail] = useState('amit@openmnc.com')
  const [setupPassword, setSetupPassword] = useState('')
  const [setupConfirm, setSetupConfirm] = useState('')

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

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
              const { access_token } = res.data
              localStorage.setItem('openmnc_admin_token', access_token)
              window.location.href = '/admin/dashboard'
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
  }, [googleClientId, authMode])

  async function handleInitialSetup(e) {
    e.preventDefault()
    if (setupPassword.length < 6) {
      setServerError('Password must be at least 6 characters long.')
      return
    }
    if (setupPassword !== setupConfirm) {
      setServerError('Passwords do not match.')
      return
    }
    setLoading(true)
    setServerError('')
    try {
      const res = await apiClient.post('/auth/setup-admin', {
        email: setupEmail,
        password: setupPassword,
      })
      if (res.data.access_token) {
        localStorage.setItem('openmnc_admin_token', res.data.access_token)
        window.location.href = '/admin/dashboard'
      } else {
        alert(res.data.message || 'Credentials set! Please sign in.')
        setAuthMode('login')
      }
    } catch (err) {
      setServerError(err?.response?.data?.detail || 'First-time setup failed. Check MongoDB connection.')
    } finally {
      setLoading(false)
    }
  }

  const { register, handleSubmit, formState: { errors } } = useForm()

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

  // Step 1: Send OTP
  async function handleSendOtp(e) {
    e.preventDefault()
    if (!forgotEmail) {
      setServerError('Please enter your administrator email address.')
      return
    }
    setLoading(true)
    setServerError('')
    setOtpMessage('')
    try {
      const res = await apiClient.post('/auth/forgot-password', { email: forgotEmail })
      setOtpMessage(res.data.message || 'OTP sent successfully to your administrator email.')
      if (res.data.otp_debug) {
        setOtpDebug(res.data.otp_debug)
      }
      setAuthMode('verify_otp')
    } catch (err) {
      setServerError(err?.response?.data?.detail || 'Failed to dispatch OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify OTP
  async function handleVerifyOtp(e) {
    e.preventDefault()
    if (!otpCode || otpCode.trim().length !== 6) {
      setServerError('Please enter the valid 6-digit OTP code.')
      return
    }
    setLoading(true)
    setServerError('')
    try {
      const res = await apiClient.post('/auth/verify-otp', { email: forgotEmail, otp: otpCode.trim() })
      setResetToken(res.data.reset_token)
      setOtpMessage('OTP verified successfully! Now choose your new secure password.')
      setAuthMode('new_password')
    } catch (err) {
      setServerError(err?.response?.data?.detail || 'Invalid or expired OTP. Please re-check the code.')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Reset Password
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
      alert(res.data.message || 'Password updated successfully! You can now log in.')
      setAuthMode('login')
      setServerError('')
      setOtpMessage('Password changed successfully. Please log in with your new password.')
    } catch (err) {
      setServerError(err?.response?.data?.detail || 'Password reset failed. Please restart the OTP process.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen bg-navy-950 flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #000000 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="glass-card p-8 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1 mb-2">
              <span className="font-display text-2xl font-bold text-white">Open</span>
              <span className="font-display text-2xl font-bold text-cyan-neon">MNC</span>
              <span className="ml-0.5 w-2 h-2 rounded-full bg-cyan-neon" aria-hidden="true" />
            </div>
            <p className="text-gray-400 text-sm">
              {authMode === 'login'
                ? 'Administrator & Staff Login'
                : authMode === 'setup'
                ? 'First-Time Admin Setup'
                : 'Password Recovery (OTP)'}
            </p>
          </div>

          {/* Feedback messages */}
          {otpMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center">
              {otpMessage}
              {otpDebug && (
                <div className="mt-1.5 font-mono font-bold text-cyan-300 text-sm">
                  OTP Code: {otpDebug}
                </div>
              )}
            </div>
          )}

          {serverError && (
            <div role="alert" className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-center">
              {serverError}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* 1. Normal Login Form */}
            {authMode === 'login' && (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSubmit(onLoginSubmit)}
                noValidate
              >
                <div className="space-y-4 mb-4">
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">
                      Admin Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email' },
                      })}
                      className={`
                        w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white placeholder-gray-500 text-sm
                        focus:outline-none focus:ring-2 focus:ring-cyan-neon/50 transition-all
                        ${errors.email ? 'border-red-500/50' : 'border-white/10'}
                      `}
                      placeholder="amit@openmnc.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label htmlFor="password" className="block text-xs font-medium text-gray-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot_email')
                          setServerError('')
                          setOtpMessage('')
                        }}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      {...register('password', { required: 'Password is required' })}
                      className={`
                        w-full px-4 py-2.5 rounded-lg bg-white/5 border text-white placeholder-gray-500 text-sm
                        focus:outline-none focus:ring-2 focus:ring-cyan-neon/50 transition-all
                        ${errors.password ? 'border-red-500/50' : 'border-white/10'}
                      `}
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full py-2.5 px-4 rounded-lg font-display font-medium text-sm text-navy-950
                    bg-gradient-to-r from-cyan-neon to-cyan-400 hover:from-cyan-400 hover:to-cyan-300
                    transition-all duration-200 shadow-cyan-glow-sm disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2 mt-4
                  "
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </button>

                {/* Google Sign-in Target */}
                <div className="mt-4 pt-4 border-t border-white/10 text-center">
                  <div id="google-signin-target" className="flex justify-center mb-3 min-h-[40px]" />
                  
                  <div className="flex flex-col gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('setup')
                        setServerError('')
                        setOtpMessage('')
                      }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      ★ First Time Here? Set Admin Password
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('forgot_email')
                        setServerError('')
                        setOtpMessage('')
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    >
                      Forgot password? Reset via OTP
                    </button>
                  </div>
                </div>
              </motion.form>
            )}

            {/* 0. First-Time Setup Form */}
            {authMode === 'setup' && (
              <motion.form
                key="setup-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleInitialSetup}
              >
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Set the primary administrator password for <strong className="text-cyan-300">amit@openmnc.com</strong>.
                </p>
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={setupEmail}
                      onChange={(e) => setSetupEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      New Admin Password
                    </label>
                    <input
                      type="password"
                      value={setupPassword}
                      onChange={(e) => setSetupPassword(e.target.value)}
                      required
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={setupConfirm}
                      onChange={(e) => setSetupConfirm(e.target.value)}
                      required
                      placeholder="Repeat password"
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/50"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg font-display font-medium text-sm text-navy-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all duration-200 shadow-cyan-glow-sm flex items-center justify-center gap-2"
                >
                  {loading ? 'Initializing Password...' : 'Save & Enter Dashboard →'}
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setServerError(''); }}
                  className="w-full mt-3 text-xs text-gray-400 hover:text-white transition-colors text-center"
                >
                  ← Back to Login
                </button>
              </motion.form>
            )}

            {/* 2. Step 1: Enter email for OTP */}
            {authMode === 'forgot_email' && (
              <motion.form
                key="forgot-email"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleSendOtp}
              >
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Enter your admin email to receive a secure 6-digit OTP verification code.
                </p>
                <div className="mb-4">
                  <label htmlFor="forgot-email-input" className="block text-xs font-medium text-gray-300 mb-1">
                    Registered Admin Email
                  </label>
                  <input
                    id="forgot-email-input"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    placeholder="amit@openmnc.com"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg font-display font-medium text-sm text-navy-950 bg-gradient-to-r from-cyan-neon to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 transition-all duration-200 shadow-cyan-glow-sm flex items-center justify-center gap-2"
                >
                  {loading ? 'Generating OTP...' : 'Send 6-Digit OTP →'}
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setServerError(''); }}
                  className="w-full mt-3 text-xs text-gray-400 hover:text-white transition-colors text-center"
                >
                  ← Back to Login
                </button>
              </motion.form>
            )}

            {/* 3. Step 2: Verify 6-digit OTP */}
            {authMode === 'verify_otp' && (
              <motion.form
                key="verify-otp"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleVerifyOtp}
              >
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Enter the 6-digit verification code sent for <strong className="text-cyan-300">{forgotEmail}</strong>.
                </p>
                <div className="mb-4">
                  <label htmlFor="otp-input" className="block text-xs font-medium text-gray-300 mb-1">
                    6-Digit OTP Code
                  </label>
                  <input
                    id="otp-input"
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    required
                    placeholder="123456"
                    className="w-full px-4 py-2.5 text-center tracking-[0.5em] font-mono text-lg rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-neon/50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg font-display font-medium text-sm text-navy-950 bg-gradient-to-r from-cyan-neon to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 transition-all duration-200 shadow-cyan-glow-sm flex items-center justify-center gap-2"
                >
                  {loading ? 'Verifying OTP...' : 'Verify OTP Code →'}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot_email')}
                  className="w-full mt-3 text-xs text-gray-400 hover:text-white transition-colors text-center"
                >
                  ← Resend Code / Change Email
                </button>
              </motion.form>
            )}

            {/* 4. Step 3: Enter New Password */}
            {authMode === 'new_password' && (
              <motion.form
                key="new-password"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleResetPassword}
              >
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Enter your new administrator password.
                </p>
                <div className="space-y-3 mb-4">
                  <div>
                    <label htmlFor="new-pw" className="block text-xs font-medium text-gray-300 mb-1">
                      New Password
                    </label>
                    <input
                      id="new-pw"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="At least 6 characters"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-pw" className="block text-xs font-medium text-gray-300 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirm-pw"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      placeholder="Repeat new password"
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/50"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-lg font-display font-medium text-sm text-navy-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all duration-200 shadow-cyan-glow-sm flex items-center justify-center gap-2"
                >
                  {loading ? 'Saving Password...' : 'Save & Update Password'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
