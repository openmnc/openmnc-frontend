import { useEffect, useState } from 'react'
import { careersApi } from '../../api/careers.js'
import { formatDate } from '../../utils/helpers.js'

const STATUS_OPTIONS = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Offer',
  'Rejected',
]

const STATUS_COLORS = {
  applied: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'under review': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  shortlisted: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  'interview scheduled': 'bg-[#2997ff]/15 text-[#2997ff] border-[#2997ff]/30',
  offer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function ApplicationsAdmin() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedApp, setSelectedApp] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [hrNotes, setHrNotes] = useState('')
  const [interviewDate, setInterviewDate] = useState('')

  useEffect(() => {
    fetchApplications()
  }, [])

  async function fetchApplications() {
    setLoading(true)
    try {
      const res = await careersApi.getApplications()
      setApplications(res.data || [])
    } catch {
      setApplications([])
    } finally {
      setLoading(false)
    }
  }

  function handleSelectApp(app) {
    setSelectedApp(app)
    setNewStatus(app.status || 'Applied')
    setHrNotes(app.hr_internal_notes || '')
    setInterviewDate(app.interview_date || '')
  }

  async function handleDeleteApp() {
    if (!selectedApp) return
    if (!window.confirm(`Delete application from "${selectedApp.candidate_name}"? This cannot be undone.`)) return
    try {
      await careersApi.deleteApplication(selectedApp.id)
      setApplications((prev) => prev.filter((a) => a.id !== selectedApp.id))
      setSelectedApp(null)
    } catch {
      alert('Failed to delete application.')
    }
  }

  async function handleUpdateStatus() {
    if (!selectedApp) return
    setUpdatingStatus(true)
    try {
      const updated = await careersApi.updateApplicationStatus(selectedApp.id, {
        status: newStatus,
        hr_internal_notes: hrNotes,
        interview_date: interviewDate,
      })
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? updated.data : a))
      )
      setSelectedApp(updated.data)
      alert(`Candidate status updated to "${newStatus}".`)
    } catch {
      alert('Failed to update status.')
    } finally {
      setUpdatingStatus(false)
    }
  }

  const filtered = statusFilter === 'All'
    ? applications
    : applications.filter((a) => a.status === statusFilter)

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#f5f5f7] tracking-tight">
            Applicant &amp; Resume Review
          </h1>
          <p className="text-[#86868b] text-xs mt-0.5">
            Real-time candidate submissions, resume inspection, and interview pipeline.
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className="px-4 py-2 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-[#d2d2d7] border border-white/10 transition-colors self-start sm:self-auto"
        >
          Refresh ↻
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...STATUS_OPTIONS].map((opt) => (
          <button
            key={opt}
            onClick={() => setStatusFilter(opt)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              statusFilter === opt
                ? 'bg-white/15 text-white shadow-sm border border-white/10'
                : 'bg-white/5 text-[#86868b] hover:text-white border border-transparent'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#2997ff]/30 border-t-[#2997ff] rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="rounded-2xl bg-[#161618] border border-white/8 p-12 text-center">
          <span className="text-4xl block mb-3">👥</span>
          <h3 className="font-display text-lg font-semibold text-[#f5f5f7] mb-2">No Applications Yet</h3>
          <p className="text-[#86868b] text-xs">
            When candidates submit applications through the careers portal, they will appear here.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Applications Table (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#161618] border border-white/8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" aria-label="Applications list">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02] text-[#86868b] text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {filtered.map((app) => {
                    const isSelected = selectedApp?.id === app.id
                    const statusKey = app.status?.toLowerCase() || 'applied'
                    const badgeClass = STATUS_COLORS[statusKey] || 'bg-white/5 text-[#a1a1a6] border-white/10'
                    const resumeUrl = app.resume_file_url || app.resume_google_drive_url

                    return (
                      <tr
                        key={app.id}
                        onClick={() => handleSelectApp(app)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-white/[0.06]' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-white">{app.candidate_name}</p>
                          <p className="text-xs text-[#86868b]">{app.candidate_email}</p>
                          {app.candidate_phone && (
                            <p className="text-[11px] text-[#86868b] font-mono tabular-nums">{app.candidate_phone}</p>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-xs text-[#d2d2d7]">{app.job_title}</p>
                          <p className="text-[10px] text-[#86868b] font-mono">{formatDate(app.applied_at)}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClass}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {resumeUrl ? (
                            <a
                              href={resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs text-[#2997ff] hover:underline font-medium"
                            >
                              Open CV ↗
                            </a>
                          ) : (
                            <span className="text-xs text-[#86868b]">—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Candidate Detail Drawer (5 cols) */}
          <div className="lg:col-span-5">
            {selectedApp ? (
              <div className="rounded-2xl bg-[#161618] border border-white/8 p-6 space-y-5">
                <div className="flex items-start justify-between border-b border-white/8 pb-4">
                  <div>
                    <span className="text-[10px] text-[#2997ff] font-semibold uppercase tracking-wider block">
                      Candidate Profile
                    </span>
                    <h2 className="font-display text-lg font-semibold text-[#f5f5f7] mt-0.5">
                      {selectedApp.candidate_name}
                    </h2>
                    <p className="text-xs text-[#86868b]">{selectedApp.job_title}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                    STATUS_COLORS[selectedApp.status?.toLowerCase()] || 'bg-white/5 text-[#a1a1a6] border-white/10'
                  }`}>
                    {selectedApp.status}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-[#86868b] block">Contact Details:</span>
                    <p className="text-[#d2d2d7] mt-0.5">{selectedApp.candidate_email}</p>
                    {selectedApp.candidate_phone && (
                      <p className="text-[#2997ff] font-mono mt-0.5">{selectedApp.candidate_phone}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                    <div>
                      <span className="text-[#86868b] block">Education:</span>
                      <p className="text-[#d2d2d7] mt-0.5">{selectedApp.education_level || '—'}</p>
                    </div>
                    <div>
                      <span className="text-[#86868b] block">Experience:</span>
                      <p className="text-[#d2d2d7] mt-0.5">{selectedApp.experience_status || '—'}</p>
                    </div>
                  </div>

                  {selectedApp.portfolio_or_github_url && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[#86868b] block">Portfolio / GitHub:</span>
                      <a
                        href={selectedApp.portfolio_or_github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2997ff] hover:underline break-all"
                      >
                        {selectedApp.portfolio_or_github_url}
                      </a>
                    </div>
                  )}

                  {selectedApp.linkedin_url && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[#86868b] block">LinkedIn:</span>
                      <a
                        href={selectedApp.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#2997ff] hover:underline break-all"
                      >
                        {selectedApp.linkedin_url}
                      </a>
                    </div>
                  )}

                  {selectedApp.cover_note && (
                    <div className="pt-2 border-t border-white/5">
                      <span className="text-[#86868b] block mb-1">Cover Note:</span>
                      <p className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[#d2d2d7] leading-relaxed italic">
                        "{selectedApp.cover_note}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Status Update Form */}
                <div className="pt-4 border-t border-white/8 space-y-3">
                  <h3 className="text-xs font-semibold text-[#f5f5f7]">Update Hiring Progression</h3>

                  <div>
                    <label className="block text-[11px] text-[#86868b] mb-1">Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1c20] border border-white/10 text-white text-xs focus:outline-none"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#86868b] mb-1">Interview Date (Optional)</label>
                    <input
                      type="text"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      placeholder="e.g. 24 Nov 2026, 4:00 PM IST"
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2997ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#86868b] mb-1">Internal HR Notes</label>
                    <textarea
                      rows={2}
                      value={hrNotes}
                      onChange={(e) => setHrNotes(e.target.value)}
                      placeholder="Internal evaluation notes..."
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2997ff] resize-none"
                    />
                  </div>

                  <button
                    onClick={handleUpdateStatus}
                    disabled={updatingStatus}
                    className="w-full py-2.5 rounded-full text-xs font-semibold bg-[#2997ff] text-white hover:bg-[#0071e3] transition-all disabled:opacity-50"
                  >
                    {updatingStatus ? 'Updating...' : 'Save Progression →'}
                  </button>
                  <button
                    onClick={handleDeleteApp}
                    className="w-full py-2.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all mt-2"
                  >
                    🗑 Delete Application Permanently
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#161618] border border-white/8 p-8 text-center text-[#86868b] text-xs">
                Select an applicant from the table to view details and manage status.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
