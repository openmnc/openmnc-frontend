import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthContext } from '../../context/AuthContext.jsx'
import apiClient from '../../api/client.js'

export default function TeamAdmin() {
  const { role } = useAuthContext()
  const [teamData, setTeamData] = useState({ members: [], invitations: [] })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [resendingEmail, setResendingEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
    if (!window.confirm(`Revoke and remove access for ${email}?`)) return
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
        <div className="rounded-2xl bg-[#161618] border border-red-500/20 max-w-md mx-auto p-8">
          <span className="text-3xl mb-2 block">🔒</span>
          <h2 className="text-base font-semibold text-white mb-2">Restricted Access</h2>
          <p className="text-[#86868b] text-xs">
            Only Tier 1 Administrators can invite and manage team members.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#f5f5f7] tracking-tight">
            Team &amp; Role Management
          </h1>
          <p className="text-[#86868b] text-xs mt-0.5">
            Role-based permissions for administrators, editors, and content authors.
          </p>
        </div>
        <button
          onClick={loadTeam}
          className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs text-[#d2d2d7] border border-white/10 transition-colors self-start sm:self-auto"
        >
          Refresh Team ↻
        </button>
      </div>

      {/* Role Breakdown Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[#161618] border border-white/8 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full border bg-[#2997ff]/10 text-[#2997ff] border-[#2997ff]/20 font-semibold">
              Tier 1: Admin
            </span>
            <span className="text-[11px] text-[#86868b]">Full Access</span>
          </div>
          <p className="text-xs text-[#a1a1a6] leading-relaxed">
            Full system control. Manages team members, system settings, blog publishing, candidate applications, leads, and services.
          </p>
        </div>

        <div className="rounded-2xl bg-[#161618] border border-white/8 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full border bg-purple-500/10 text-purple-300 border-purple-500/20 font-semibold">
              Tier 2: Editor
            </span>
            <span className="text-[11px] text-[#86868b]">Operations</span>
          </div>
          <p className="text-xs text-[#a1a1a6] leading-relaxed">
            Operations Manager. Can manage blogs, services, job openings, applicant resumes, and customer leads.
          </p>
        </div>

        <div className="rounded-2xl bg-[#161618] border border-white/8 p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono uppercase px-2.5 py-0.5 rounded-full border bg-emerald-500/10 text-emerald-300 border-emerald-500/20 font-semibold">
              Tier 3: Author
            </span>
            <span className="text-[11px] text-[#86868b]">Content Only</span>
          </div>
          <p className="text-xs text-[#a1a1a6] leading-relaxed">
            Content Creator. Can draft, edit, and publish Blogs & News and view Services. Zero access to candidate resumes or leads.
          </p>
        </div>
      </div>

      {/* Invite Member Surface */}
      <div className="rounded-2xl bg-[#161618] border border-white/8 p-6 sm:p-8">
        <h2 className="font-display text-base font-semibold text-white mb-1">
          Invite New Team Member
        </h2>
        <p className="text-[#86868b] text-xs mb-5">
          Generate an invitation token and grant role-based console access.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            {success}
          </div>
        )}

        <form onSubmit={handleSendInvite} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="email"
            required
            placeholder="colleague@openmnc.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
          />
          <input
            type="text"
            placeholder="Name (Optional)"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#2997ff]"
          />
          <div className="flex gap-2">
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-[#1c1c20] border border-white/10 text-white text-sm focus:outline-none flex-1"
            >
              <option value="editor">Editor (Tier 2)</option>
              <option value="author">Author (Tier 3)</option>
              <option value="admin">Admin (Tier 1)</option>
            </select>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-[#2997ff] text-white hover:bg-[#0071e3] transition-all disabled:opacity-50"
            >
              {submitting ? '...' : 'Send'}
            </button>
          </div>
        </form>

        {/* Generated Invite Copy Box */}
        {generatedInvite && (
          <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs truncate max-w-full">
              <span className="text-[#86868b] block">Direct Invitation URL:</span>
              <span className="text-[#2997ff] font-mono break-all">{generatedInvite.url}</span>
            </div>
            <button
              onClick={() => handleCopyInviteUrl(generatedInvite.url)}
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white text-black hover:bg-[#f5f5f7] transition-all flex-shrink-0"
            >
              {copied ? 'Copied ✓' : 'Copy Link'}
            </button>
          </div>
        )}
      </div>

      {/* Active Team Members Table */}
      <div className="rounded-2xl bg-[#161618] border border-white/8 overflow-hidden">
        <div className="p-5 border-b border-white/8">
          <h2 className="font-display text-base font-semibold text-white">
            Active Team Members ({teamData.members.length})
          </h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/[0.02] text-[#86868b] text-xs uppercase tracking-wider">
              <th className="py-3 px-4">Member</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/8">
            {teamData.members.map((m) => (
              <tr key={m.email} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4">
                  <p className="font-medium text-white">{m.name || m.email.split('@')[0]}</p>
                  <p className="text-xs text-[#86868b] font-mono">{m.email}</p>
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/5 text-[#d2d2d7] border border-white/10 uppercase font-mono">
                    {m.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  {!m.is_owner && (
                    <button
                      onClick={() => handleRevoke(m.email)}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                    >
                      Revoke Access
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
