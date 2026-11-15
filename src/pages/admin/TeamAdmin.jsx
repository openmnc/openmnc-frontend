import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthContext } from '../../context/AuthContext.jsx'
import apiClient from '../../api/client.js'

export default function TeamAdmin() {
  const { role, user } = useAuthContext()
  const [teamData, setTeamData] = useState({ members: [], invitations: [] })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [resendingEmail, setResendingEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Invite Form State
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteName, setInviteName] = useState('')
  const [inviteRole, setInviteRole] = useState('editor')
  const [generatedInvite, setGeneratedInvite] = useState(null)
  const [copied, setCopied] = useState(false)

  async function loadTeam() {
    setLoading(true)
    setError('')
    try {
      const res = await apiClient.get('/auth/team')
      setTeamData(res.data)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to load team data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeam()
  }, [])

  async function handleSendInvite(e) {
    e.preventDefault()
    if (!inviteEmail) return
    setSubmitting(true)
    setError('')
    setSuccess('')
    try {
      const res = await apiClient.post('/auth/team/invite', {
        email: inviteEmail.trim().toLowerCase(),
        name: inviteName.trim(),
        role: inviteRole,
      })
      const token = res.data.token
      const origin = window.location.origin
      const baseHost = (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) ? origin : 'https://www.openmnc.com'
      const fullInviteUrl = res.data.invite_url || `${baseHost}/admin/join?token=${token}`

      setGeneratedInvite({
        email: res.data.email,
        role: res.data.role,
        url: fullInviteUrl,
      })
      setSuccess(`✓ Official invitation dispatched to ${res.data.email}!`)
      setInviteEmail('')
      setInviteName('')
      loadTeam()
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to send invitation.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleResendInvite(email) {
    setResendingEmail(email)
    setError('')
    setSuccess('')
    try {
      const res = await apiClient.post('/auth/team/resend-invite', { email })
      setSuccess(res.data?.message || `✓ Invitation email resent to ${email}!`)
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to resend invitation email.')
    } finally {
      setResendingEmail('')
    }
  }

  async function handleRevoke(email) {
    if (!window.confirm(`Revoke and remove access for ${email}? They will no longer be able to sign in.`)) return
    try {
      await apiClient.delete(`/auth/team/${encodeURIComponent(email)}`)
      setSuccess(`Access for ${email} has been revoked.`)
      loadTeam()
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to revoke member.')
    }
  }

  function handleCopyInviteUrl(url) {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <div className="glass-card max-w-md mx-auto p-8 border border-red-500/20 rounded-2xl">
          <span className="text-3xl mb-2 block">🔒</span>
          <h2 className="text-lg font-bold text-white mb-2">Restricted Access</h2>
          <p className="text-gray-400 text-sm">
            Only Tier 1 Administrators can invite and manage team members.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              👥
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold text-white tracking-wide">
                Team & Role Management
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-0.5">
                Manage administrators, operations editors, and content authors with role-based access.
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={loadTeam}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
        >
          <span>↻</span> Refresh Team
        </button>
      </div>

      {/* Role Breakdown Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 border border-cyan-500/20 rounded-xl bg-cyan-500/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full border bg-cyan-500/10 text-cyan-300 border-cyan-500/30 font-bold">
              Tier 1: Admin
            </span>
            <span className="text-[11px] text-gray-400 font-mono">Full Access</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Full system control. Manages team members, system settings, blog publishing, candidate applications, leads, and services.
          </p>
        </div>

        <div className="glass-card p-4 border border-purple-500/20 rounded-xl bg-purple-500/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full border bg-purple-500/10 text-purple-300 border-purple-500/30 font-bold">
              Tier 2: Editor
            </span>
            <span className="text-[11px] text-gray-400 font-mono">Operations</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Operations Manager. Can manage blogs, services, job openings, applicant resumes, and customer leads. <strong>Cannot</strong> delete team members or edit root settings.
          </p>
        </div>

        <div className="glass-card p-4 border border-emerald-500/20 rounded-xl bg-emerald-500/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-300 border-emerald-500/30 font-bold">
              Tier 3: Author
            </span>
            <span className="text-[11px] text-gray-400 font-mono">Content Only</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Content Creator. Can draft, edit, and publish Blogs & News and view Services. <strong>Zero access</strong> to applicant resumes, leads, or team configurations.
          </p>
        </div>
      </div>

      {/* Notifications */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')} className="text-red-400 hover:text-white">✕</button>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between shadow-lg shadow-emerald-500/5"
          >
            <div className="flex items-center gap-2">
              <span>✓</span>
              <span>{success}</span>
            </div>
            <button onClick={() => setSuccess('')} className="text-emerald-300 hover:text-white">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Member Section */}
      <div className="glass-card p-5 sm:p-6 border border-white/10 rounded-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>✉️</span> Invite New Colleague or Member
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              An official invitation email will automatically be sent to their inbox with a secure 7-day activation link.
            </p>
          </div>
          <span className="self-start text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
            Enterprise Security Gateway
          </span>
        </div>

        <form onSubmit={handleSendInvite} className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-medium text-gray-300 mb-1">
              Member Email Address *
            </label>
            <input
              type="email"
              required
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-neon"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-medium text-gray-300 mb-1">
              Full Name (Optional)
            </label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-neon"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-medium text-gray-300 mb-1">
              Access Role *
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-neon"
            >
              <option value="editor">Tier 2: Editor (Operations)</option>
              <option value="author">Tier 3: Author (Content Only)</option>
              <option value="admin">Tier 1: Admin (Full Access)</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl font-display text-xs font-semibold text-navy-950 bg-gradient-to-r from-cyan-neon to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 transition-all shadow-cyan-glow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <span>✉️</span>
                  <span>Send Invite</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Generated Invite Modal / Card */}
        {generatedInvite && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <span>🎉</span>
                <span>Invitation Email Sent to {generatedInvite.email} ({generatedInvite.role.toUpperCase()})</span>
              </span>
              <button
                onClick={() => setGeneratedInvite(null)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>
            <p className="text-[11px] text-gray-300 mb-2">
              The recipient has received an email with this link. You can also manually copy and share it with them:
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedInvite.url}
                className="flex-1 px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs font-mono text-cyan-300 select-all"
              />
              <button
                onClick={() => handleCopyInviteUrl(generatedInvite.url)}
                className="px-4 py-2 rounded-lg bg-cyan-neon text-navy-950 text-xs font-bold hover:bg-cyan-300 transition-colors whitespace-nowrap shadow-cyan-glow-sm"
              >
                {copied ? '✓ Link Copied!' : 'Copy Activation Link'}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Active Team Members Table */}
      <div className="glass-card p-5 sm:p-6 border border-white/10 rounded-2xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Active Team Roster</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-white/10 text-gray-300">
                {teamData.members?.length || 0}
              </span>
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              Authorized team members with access to the OpenMNC Control Center.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500 text-xs animate-pulse">Loading team roster...</div>
        ) : teamData.members?.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-xs">No active team members registered yet.</div>
        ) : (
          <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Member</th>
                  <th className="pb-3 font-semibold">Assigned Role</th>
                  <th className="pb-3 font-semibold">Connection Status</th>
                  <th className="pb-3 font-semibold">Sign-in Method</th>
                  <th className="pb-3 font-semibold">Last Active</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {teamData.members.map((m) => {
                  const isOwner = m.is_owner || m.email === 'amit@openmnc.com' || m.email === 'openmnc.contract@gmail.com'
                  const roleBadgeClass = {
                    admin: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
                    editor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
                    author: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
                  }[m.role] || 'bg-gray-500/10 text-gray-300 border-gray-500/30'

                  const isConnected = m.status === 'active' || isOwner

                  return (
                    <tr key={m.email} className={`hover:bg-white/[0.02] transition-colors ${isOwner ? 'bg-amber-500/[0.03]' : ''}`}>
                      <td className="py-3.5 pr-4">
                        <div className="flex items-center gap-2">
                          {isOwner && (
                            <span className="text-amber-400 text-sm" title="Primary Owner & Founder">👑</span>
                          )}
                          <div>
                            <div className="font-semibold text-white flex items-center gap-1.5">
                              <span>{m.name || m.email.split('@')[0]}</span>
                              {isOwner && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wider">
                                  Owner
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-gray-400">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-mono uppercase font-bold ${roleBadgeClass}`}>
                          {m.role}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        {isConnected ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Connected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            Pending Setup
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 pr-4 text-gray-400 capitalize">
                        {m.auth_provider === 'google' ? 'Google OAuth' : m.auth_provider === 'otp_email' ? 'Email OTP' : 'Password'}
                      </td>
                      <td className="py-3.5 pr-4 text-gray-400 text-[11px]">
                        {m.last_login ? new Date(m.last_login).toLocaleString() : 'Never'}
                      </td>
                      <td className="py-3.5 text-right">
                        {isOwner ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-amber-400/80 font-mono px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                            <span>🔒</span> Protected Owner
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRevoke(m.email)}
                            className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-[11px] transition-colors"
                          >
                            Remove Access
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pending Invitations Section */}
      {teamData.invitations?.length > 0 && (
        <div className="glass-card p-5 sm:p-6 border border-white/10 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Pending Invitations</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {teamData.invitations.length}
                </span>
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">
                Colleagues who have received an email invite but have not yet accepted or created their password.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Invited Email</th>
                  <th className="pb-3 font-semibold">Assigned Role</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Expires</th>
                  <th className="pb-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {teamData.invitations.map((inv) => {
                  const origin = window.location.origin
                  const baseHost = (origin && !origin.includes('localhost') && !origin.includes('127.0.0.1')) ? origin : 'https://www.openmnc.com'
                  const inviteUrl = `${baseHost}/admin/join?token=${inv.token}`
                  const isResending = resendingEmail === inv.email

                  return (
                    <tr key={inv.token} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 pr-4">
                        <div className="font-mono text-cyan-300 font-medium">{inv.email}</div>
                        {inv.name && <div className="text-[11px] text-gray-400">{inv.name}</div>}
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="inline-block px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase bg-white/5 border-white/10 text-gray-300">
                          {inv.role}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          Pending Invite
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-gray-400 text-[11px]">
                        {inv.expires_at ? new Date(inv.expires_at).toLocaleDateString() : '7 days'}
                      </td>
                      <td className="py-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleResendInvite(inv.email)}
                          disabled={isResending}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 border border-cyan-500/20 text-[11px] transition-colors disabled:opacity-50"
                          title="Resend official invitation email"
                        >
                          {isResending ? 'Resending...' : '✉️ Resend Email'}
                        </button>
                        <button
                          onClick={() => handleCopyInviteUrl(inviteUrl)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 text-[11px] transition-colors"
                        >
                          🔗 Copy Link
                        </button>
                        <button
                          onClick={() => handleRevoke(inv.email)}
                          className="px-2.5 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 text-[11px] transition-colors"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
