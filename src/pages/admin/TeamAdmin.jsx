import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthContext } from '../../context/AuthContext.jsx'
import apiClient from '../../api/client.js'

export default function TeamAdmin() {
  const { role } = useAuthContext()
  const [teamData, setTeamData] = useState({ members: [], invitations: [] })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
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
      const baseUrl = window.location.origin
      const fullInviteUrl = `${baseUrl}/admin/join?token=${token}`

      setGeneratedInvite({
        email: res.data.email,
        role: res.data.role,
        url: fullInviteUrl,
      })
      setSuccess(`Invitation generated for ${res.data.email}! Share the link with them.`)
      setInviteEmail('')
      setInviteName('')
      loadTeam()
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to generate invitation.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleRevoke(email) {
    if (!window.confirm(`Revoke access for ${email}? They will no longer be able to sign in.`)) return
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
    setTimeout(() => setCopied(false), 2000)
  }

  if (role !== 'admin') {
    return (
      <div className="p-8 text-center">
        <div className="glass-card max-w-md mx-auto p-8 border border-red-500/20">
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
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <span>👥</span> Team & Role-Based Access Control
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Grant secure, role-restricted access to your colleagues, editors, and content authors.
          </p>
        </div>
        <button
          onClick={loadTeam}
          className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 hover:text-white hover:bg-white/10 transition-all"
        >
          ↻ Refresh Team
        </button>
      </div>

      {/* Role Breakdown Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 border border-cyan-500/20 rounded-xl bg-cyan-500/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-full border bg-cyan-500/10 text-cyan-300 border-cyan-500/30 font-bold">
              Tier 1: Admin
            </span>
            <span className="text-xs text-gray-400">Full Access</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Full system control. Manages team invitations, system settings, blog publishing, candidates, leads, and services.
          </p>
        </div>

        <div className="glass-card p-4 border border-purple-500/20 rounded-xl bg-purple-500/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-full border bg-purple-500/10 text-purple-300 border-purple-500/30 font-bold">
              Tier 2: Editor
            </span>
            <span className="text-xs text-gray-400">Operations</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Operations Manager. Can manage blogs, services, job openings, applicant resumes, and customer leads. <strong>Cannot</strong> invite users or change core settings.
          </p>
        </div>

        <div className="glass-card p-4 border border-emerald-500/20 rounded-xl bg-emerald-500/[0.02]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase px-2 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-300 border-emerald-500/30 font-bold">
              Tier 3: Author
            </span>
            <span className="text-xs text-gray-400">Content Only</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed">
            Content Creator. Can only draft, edit, and publish Blogs & News and view Services copy. <strong>Zero access</strong> to applicant resumes, leads, or settings.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
          {success}
        </div>
      )}

      {/* Invite Member Section */}
      <div className="glass-card p-5 border border-white/10 rounded-2xl">
        <h2 className="text-base font-bold text-white mb-1 flex items-center gap-2">
          <span>✉️</span> Invite New Team Member
        </h2>
        <p className="text-gray-400 text-xs mb-4">
          Send an invitation link with pre-authorized access. The member can join via Password or Google Sign-In with that email.
        </p>

        <form onSubmit={handleSendInvite} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
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
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-neon"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-medium text-gray-300 mb-1">
              Member Name (Optional)
            </label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-neon"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-medium text-gray-300 mb-1">
              Assigned Role *
            </label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-white/10 text-white text-xs focus:outline-none focus:ring-1 focus:ring-cyan-neon"
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
              className="w-full py-2 px-3 rounded-lg font-display text-xs font-medium text-navy-950 bg-gradient-to-r from-cyan-neon to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 transition-all shadow-cyan-glow-sm disabled:opacity-50"
            >
              {submitting ? 'Creating...' : '+ Generate Invite'}
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
              <span className="text-xs font-bold text-cyan-300">
                🎉 Invitation Ready for {generatedInvite.email} ({generatedInvite.role})
              </span>
              <button
                onClick={() => setGeneratedInvite(null)}
                className="text-gray-400 hover:text-white text-xs"
              >
                ✕ Close
              </button>
            </div>
            <p className="text-[11px] text-gray-300 mb-2">
              Share this secure invitation link with the member to let them activate their account:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedInvite.url}
                className="flex-1 px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono text-cyan-300 select-all"
              />
              <button
                onClick={() => handleCopyInviteUrl(generatedInvite.url)}
                className="px-3 py-1.5 rounded-lg bg-cyan-neon text-navy-950 text-xs font-bold hover:bg-cyan-300 transition-colors whitespace-nowrap"
              >
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* Active Team Members Table */}
      <div className="glass-card p-5 border border-white/10 rounded-2xl">
        <h2 className="text-base font-bold text-white mb-3 flex items-center justify-between">
          <span>Active Team Roster ({teamData.members?.length || 0})</span>
        </h2>

        {loading ? (
          <div className="p-8 text-center text-gray-500 text-xs animate-pulse">Loading team roster...</div>
        ) : teamData.members?.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-xs">No active team members registered yet.</div>
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 font-medium">Member</th>
                  <th className="pb-3 font-medium">Assigned Role</th>
                  <th className="pb-3 font-medium">Sign-in Method</th>
                  <th className="pb-3 font-medium">Last Login</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {teamData.members.map((m) => {
                  const roleBadgeClass = {
                    admin: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
                    editor: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
                    author: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
                  }[m.role] || 'bg-gray-500/10 text-gray-300 border-gray-500/30'

                  return (
                    <tr key={m.email} className="hover:bg-white/[0.02]">
                      <td className="py-3 pr-4">
                        <div className="font-medium text-white">{m.name || m.email.split('@')[0]}</div>
                        <div className="text-[11px] font-mono text-gray-400">{m.email}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-mono uppercase font-bold ${roleBadgeClass}`}>
                          {m.role}
                        </span>
                        {m.is_owner && (
                          <span className="ml-1.5 text-[10px] text-amber-400 font-medium">Owner</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 text-gray-400 capitalize">
                        {m.auth_provider === 'google' ? 'Google Sign-In' : 'Password Auth'}
                      </td>
                      <td className="py-3 pr-4 text-gray-400 text-[11px]">
                        {m.last_login ? new Date(m.last_login).toLocaleString() : 'Never'}
                      </td>
                      <td className="py-3 text-right">
                        {!m.is_owner ? (
                          <button
                            onClick={() => handleRevoke(m.email)}
                            className="px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[11px] transition-colors"
                          >
                            Revoke Access
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-500 italic">Protected Owner</span>
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
        <div className="glass-card p-5 border border-white/10 rounded-2xl">
          <h2 className="text-base font-bold text-white mb-3">
            Pending Invitations ({teamData.invitations.length})
          </h2>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="pb-3 font-medium">Invited Email</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Expires</th>
                  <th className="pb-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {teamData.invitations.map((inv) => {
                  const inviteUrl = `${window.location.origin}/admin/join?token=${inv.token}`
                  return (
                    <tr key={inv.token} className="hover:bg-white/[0.02]">
                      <td className="py-3 font-mono text-cyan-300">{inv.email}</td>
                      <td className="py-3 font-mono uppercase text-gray-300">{inv.role}</td>
                      <td className="py-3 text-gray-400 text-[11px]">
                        {inv.expires_at ? new Date(inv.expires_at).toLocaleDateString() : '7 days'}
                      </td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          onClick={() => handleCopyInviteUrl(inviteUrl)}
                          className="px-2 py-1 rounded bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 text-[11px]"
                        >
                          Copy Link
                        </button>
                        <button
                          onClick={() => handleRevoke(inv.email)}
                          className="px-2 py-1 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 text-[11px]"
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
