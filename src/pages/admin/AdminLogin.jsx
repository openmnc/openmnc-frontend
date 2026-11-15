import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthContext } from '../../context/AuthContext.jsx'
import apiClient from '../../api/client.js'

export default function AdminLogin() {
  const { isAuthenticated, user, login, setManualToken, logout } = useAuthContext()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  // Auth Modes: 'login' | 'otp_login' | 'setup' | 'forgot_email' | 'verify_otp' | 'new_password'
  const [authMode, setAuthMode] = useState('login')

  // Password Login Form
  const { register, handleSubmit, formState: { errors } } = useForm()

  // OTP Login State (Strict Admin/Invited Only)
  const [otpLoginEmail, setOtpLoginEmail] = useState('')
  const [otpLoginStep, setOtpLoginStep] = useState(1) // 1: Enter email, 2: Enter OTP
  const [otpCode, setOtpCode] = useState('')
  const [otpMessage, setOtpMessage] = useState('')
  const [otpDebug, setOtpDebug] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  // Forgot Password Reset State
  const [forgotEmail, setForgotEmail] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // First-Time Setup State
  const [setupEmail, setSetupEmail] = useState('amit@openmnc.com')
  const [setupPassword, setSetupPassword] = useState('')
  const [setupConfirm, setSetupConfirm] = useState('')

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

  // 1. AUTO-REDIRECT IF ALREADY LOGGED IN: Don't ask for login again!
  useEffect(() => {
    if (isAuthenticated) {
      // Auto-navigate to dashboard after tiny delay for smooth UX
      const timer = setTimeout(() => {
        navigate('/admin/dashboard', { replace: true })
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, navigate])

  // Countdown timer for resending OTP
  useEffect(() => {
    if (resendCooldown <= 0) return
    const interval = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [resendCooldown])

  // Google OAuth Initialization
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

  // Handlers
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

  // OTP Login Step 1: Request OTP
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

  // OTP Login Step 2: Verify & Direct Login
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

  // Forgot Password Step 1: Send reset OTP
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

  // Forgot Password Step 2: Verify OTP
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

  // Forgot Password Step 3: Update Password
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

  // Initial Admin Setup
  async function handleInitialSetup(e) {
    e.preventDefault()
    if (setupPassword.length < 6) {
      setServerError('Password must be at least 6 characters.')
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
        setManualToken(res.data.access_token, { email: setupEmail, role: 'admin' })
        navigate('/admin/dashboard')
      } else {
        alert(res.data.message || 'Admin configured! Please log in.')
        setAuthMode('login')
      }
    } catch (err) {
      setServerError(err?.response?.data?.detail || 'Admin setup failed.')
    } finally {
      setLoading(false)
    }
  }

  // IF ALREADY AUTHENTICATED: Display sleek session confirmation card
  if (isAuthenticated) {
    return (
      <div
        className="min-h-screen bg-navy-950 flex items-center justify-center px-4"
        style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #000000 100%)' }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm glass-card p-8 border border-cyan-neon/30 rounded-2xl text-center shadow-2xl"
        >
          <div className="w-12 h-12 rounded-full bg-cyan-neon/15 text-cyan-neon border border-cyan-neon/40 flex items-center justify-center mx-auto mb-4 text-xl">
            ✓
          </div>
          <h2 className="font-display text-xl font-bold text-white mb-1">
            Active Session Detected
          </h2>
          <p className="text-gray-400 text-xs mb-4">
            You are currently signed in as <strong className="text-cyan-neon">{user?.email || 'Administrator'}</strong>
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="w-full py-2.5 rounded-lg bg-cyan-neon text-navy-950 font-bold text-sm shadow-cyan-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Open Admin Dashboard &rarr;
            </button>
            <button
              onClick={() => {
                logout()
                window.location.reload()
              }}
              className="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 text-xs hover:bg-white/10 hover:text-white transition-all"
            >
              Switch Account / Sign Out
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-navy-950 flex items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #000000 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1 mb-2">
              <span className="font-display text-2xl font-bold text-white">Open</span>
              <span className="font-display text-2xl font-bold text-cyan-neon">MNC</span>
              <span className="ml-0.5 w-2 h-2 rounded-full bg-cyan-neon animate-pulse" aria-hidden="true" />
            </div>
            <p className="text-gray-400 text-xs">
              Secure Control Center & Administration Portal
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          {(authMode === 'login' || authMode === 'otp_login') && (
            <div className="flex bg-navy-900/80 p-1 rounded-xl border border-white/5 mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login')
                  setServerError('')
                  setOtpMessage('')
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'login'
                    ? 'bg-cyan-neon text-navy-950 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                🔑 Password Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('otp_login')
                  setServerError('')
                  setOtpMessage('')
                  setOtpLoginStep(1)
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'otp_login'
                    ? 'bg-cyan-neon text-navy-950 shadow-md'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                ✉️ Login with OTP
              </button>
            </div>
          )}

          {/* Notification Banners */}
          {otpMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center">
              {otpMessage}
              {otpDebug && (
                <div className="mt-1.5 font-mono font-bold text-cyan-300 text-sm">
                  System OTP Code: {otpDebug}
                </div>
              )}
            </div>
          )}

          {serverError && (
            <div
              role="alert"
              className="mb-4 p-3.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs leading-relaxed text-center"
            >
              {(serverError.toLowerCase().includes('denied') || serverError.toLowerCase().includes('invited') || serverError.toLowerCase().includes('authorized')) && (
                <div className="font-semibold text-red-200 mb-1">Access Restricted</div>
              )}
              {serverError}
              {serverError.includes('invited') && (
                <div className="mt-2 text-[11px] text-gray-400">
                  Are you an invited team member? Please ensure you enter the exact email invited by the admin, or contact{' '}
                  <a href="mailto:amit@openmnc.com" className="text-cyan-neon underline">
                    amit@openmnc.com
                  </a>
                  .
                </div>
              )}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* 1. PASSWORD LOGIN TAB */}
            {authMode === 'login' && (
              <motion.form
                key="login-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSubmit(onLoginSubmit)}
                noValidate
              >
                <div className="space-y-4 mb-5">
                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">
                      Email Address
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
                    w-full py-2.5 px-4 rounded-lg font-semibold text-sm
                    bg-cyan-neon text-navy-950 hover:shadow-cyan-glow
                    transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2
                  "
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    'Sign In to Control Center'
                  )}
                </button>
              </motion.form>
            )}

            {/* 2. STRICT OTP LOGIN TAB (ADMIN & INVITED USERS ONLY) */}
            {authMode === 'otp_login' && (
              <motion.div
                key="otp-login-flow"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <div className="mb-4 p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-lg text-xs text-cyan-200">
                  🔒 <strong>Admin-Invite Only:</strong> Only primary admins and team members invited by the administrator can receive an OTP login code.
                </div>

                {otpLoginStep === 1 ? (
                  <form onSubmit={handleRequestLoginOtp} className="space-y-4">
                    <div>
                      <label htmlFor="otpEmail" className="block text-xs font-medium text-gray-300 mb-1">
                        Your Invited Email Address
                      </label>
                      <input
                        id="otpEmail"
                        type="email"
                        value={otpLoginEmail}
                        onChange={(e) => setOtpLoginEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/50"
                        placeholder="your-invited-email@domain.com"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 rounded-lg bg-cyan-neon text-navy-950 font-semibold text-sm hover:shadow-cyan-glow transition-all disabled:opacity-50"
                    >
                      {loading ? 'Validating Invite...' : 'Dispatch One-Time Passcode'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label htmlFor="loginOtp" className="block text-xs font-medium text-gray-300">
                          Enter 6-Digit Passcode
                        </label>
                        <span className="text-[11px] text-gray-400 font-mono">
                          {otpLoginEmail}
                        </span>
                      </div>
                      <input
                        id="loginOtp"
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                        autoFocus
                        required
                        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-cyan-neon/40 text-center text-2xl font-mono tracking-widest text-cyan-neon focus:outline-none focus:ring-2 focus:ring-cyan-neon/50"
                        placeholder="000000"
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <button
                        type="button"
                        onClick={() => setOtpLoginStep(1)}
                        className="hover:text-white underline"
                      >
                        Change Email
                      </button>
                      <button
                        type="button"
                        disabled={resendCooldown > 0 || loading}
                        onClick={handleRequestLoginOtp}
                        className="text-cyan-neon hover:underline disabled:opacity-50"
                      >
                        {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={loading || otpCode.length !== 6}
                      className="w-full py-2.5 rounded-lg bg-cyan-neon text-navy-950 font-semibold text-sm hover:shadow-cyan-glow transition-all disabled:opacity-50"
                    >
                      {loading ? 'Verifying Code...' : 'Verify Code & Enter Control Center'}
                    </button>
                  </form>
                )}
              </motion.div>
            )}

            {/* 3. FORGOT PASSWORD (STEP 1: EMAIL) */}
            {authMode === 'forgot_email' && (
              <motion.form
                key="forgot-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleSendForgotOtp}
              >
                <div className="mb-4">
                  <label htmlFor="forgotEmail" className="block text-xs font-medium text-gray-300 mb-1">
                    Enter Registered Admin Email
                  </label>
                  <input
                    id="forgotEmail"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-neon/50"
                    placeholder="amit@openmnc.com"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login')
                      setServerError('')
                    }}
                    className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 text-xs hover:bg-white/5"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 rounded-lg bg-cyan-neon text-navy-950 font-semibold text-xs hover:shadow-cyan-glow transition-all disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Reset Code'}
                  </button>
                </div>
              </motion.form>
            )}

            {/* 4. FORGOT PASSWORD (STEP 2: VERIFY OTP) */}
            {authMode === 'verify_otp' && (
              <motion.form
                key="verify-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleVerifyForgotOtp}
              >
                <div className="mb-4">
                  <label htmlFor="resetOtpCode" className="block text-xs font-medium text-gray-300 mb-1">
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    id="resetOtpCode"
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    autoFocus
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-cyan-neon/30 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-cyan-neon/50"
                    placeholder="123456"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-cyan-neon text-navy-950 font-semibold text-xs hover:shadow-cyan-glow transition-all disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                  <button
                    type="button"
                    onClick={handleRequestForgotOtp}
                    disabled={resendCooldown > 0 || loading}
                    className="text-cyan-neon hover:underline disabled:opacity-40 disabled:hover:no-underline"
                  >
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="text-gray-400 hover:text-white"
                  >
                    Back to Login
                  </button>
                </div>
              </motion.form>
            )}

            {/* 5. FORGOT PASSWORD (STEP 3: NEW PASSWORD) */}
            {authMode === 'new_password' && (
              <motion.form
                key="new-password-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleResetPassword}
              >
                <div className="space-y-3 mb-4">
                  <div>
                    <label htmlFor="newPass" className="block text-xs text-gray-300 mb-1">New Password</label>
                    <input
                      id="newPass"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                      placeholder="At least 6 characters"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPass" className="block text-xs text-gray-300 mb-1">Confirm New Password</label>
                    <input
                      id="confirmPass"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                      placeholder="Repeat password"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-cyan-neon text-navy-950 font-semibold text-xs hover:shadow-cyan-glow transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Set New Password & Log In'}
                </button>
              </motion.form>
            )}

            {/* 6. FIRST-TIME ADMIN SETUP FORM */}
            {authMode === 'setup' && (
              <motion.form
                key="setup-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleInitialSetup}
              >
                <div className="space-y-3 mb-4">
                  <div>
                    <label htmlFor="setupEmail" className="block text-xs text-gray-300 mb-1">Owner Admin Email</label>
                    <input
                      id="setupEmail"
                      type="email"
                      value={setupEmail}
                      onChange={(e) => setSetupEmail(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="setupPass" className="block text-xs text-gray-300 mb-1">Create Admin Password</label>
                    <input
                      id="setupPass"
                      type="password"
                      value={setupPassword}
                      onChange={(e) => setSetupPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                      placeholder="At least 6 characters"
                    />
                  </div>
                  <div>
                    <label htmlFor="setupConf" className="block text-xs text-gray-300 mb-1">Confirm Admin Password</label>
                    <input
                      id="setupConf"
                      type="password"
                      value={setupConfirm}
                      onChange={(e) => setSetupConfirm(e.target.value)}
                      required
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login')
                      setServerError('')
                    }}
                    className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 text-xs hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2 rounded-lg bg-cyan-neon text-navy-950 font-semibold text-xs hover:shadow-cyan-glow transition-all disabled:opacity-50"
                  >
                    {loading ? 'Configuring...' : 'Set Admin Password'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Google Sign-In for Admin / Invited Staff */}
          {googleClientId && (authMode === 'login' || authMode === 'otp_login') && (
            <div className="mt-6 pt-5 border-t border-white/10">
              <p className="text-center text-[11px] text-gray-400 mb-3">Or sign in with Google Workspace</p>
              <div id="google-signin-target" className="flex justify-center" />
            </div>
          )}

          {/* First-Time Setup Link */}
          {authMode === 'login' && (
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('setup')
                  setServerError('')
                }}
                className="text-[11px] text-gray-500 hover:text-cyan-neon transition-colors"
              >
                ★ First Time Here? Configure Initial Admin Password
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
