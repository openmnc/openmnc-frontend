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

  async function handleUpdateStatus() {
    if (!selectedApp) return
    setUpdatingStatus(true)
    try {
      const updated = await careersApi.updateApplicationStatus(selectedApp.id, {
        status: newStatus,
        hr_internal_notes: hrNotes,
        interview_date: interviewDate,
      })
      // Update local state
      setApplications((prev) =>
        prev.map((a) => (a.id === selectedApp.id ? updated.data : a))
      )
      setSelectedApp(updated.data)
      alert('Candidate status updated successfully.')
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
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            HR Candidate &amp; Applicant Management
          </h1>
          <p className="text-gray-400 text-sm">
            Zero-Storage resume review via Google Drive and real-time status management.
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all"
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
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              statusFilter === opt
                ? 'bg-cyan-neon text-navy-950 font-bold'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-cyan-neon/30 border-t-cyan-neon rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <span className="text-4xl block mb-3">👥</span>
          <h3 className="font-display text-lg font-bold text-white mb-2">No Applications Yet</h3>
          <p className="text-gray-400 text-sm">
            When candidates apply through the careers portal, their profiles and Google Drive resumes will appear here.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Applications Table (7 cols) */}
          <div className="lg:col-span-7 glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((app) => {
                    const isSelected = selectedApp?.id === app.id
                    return (
                      <tr
                        key={app.id}
                        onClick={() => handleSelectApp(app)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-cyan-neon/10' : 'hover:bg-white/5'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-white">{app.candidate_name}</p>
                          <p className="text-xs text-gray-400">{app.candidate_email}</p>
                          {app.candidate_phone && <p className="text-xs text-gray-500">{app.candidate_phone}</p>}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-xs font-medium text-white">{app.job_title}</p>
                          <p className="text-[10px] text-gray-500">{formatDate(app.applied_at)}</p>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/5 border border-white/10 text-cyan-neon">
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <a
                            href={app.resume_google_drive_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-xs text-cyan-neon hover:underline font-semibold"
                          >
                            Drive Link ↗
                          </a>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Candidate Detail & HR Management Pane (5 cols) */}
          <div className="lg:col-span-5 glass-card p-6 h-fit sticky top-6 border border-white/10">
            {selectedApp ? (
              <div className="space-y-4">
                <div className="border-b border-white/5 pb-3">
                  <span className="text-[10px] text-cyan-neon font-mono uppercase tracking-wider block mb-1">
                    Candidate Profile
                  </span>
                  <h3 className="font-display text-xl font-bold text-white">
                    {selectedApp.candidate_name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Applied for <strong>{selectedApp.job_title}</strong> on {formatDate(selectedApp.applied_at)}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-gray-500 block">Email</label>
                    <a href={`mailto:${selectedApp.candidate_email}`} className="text-cyan-neon hover:underline truncate block">
                      {selectedApp.candidate_email}
                    </a>
                  </div>
                  <div>
                    <label className="text-gray-500 block">Phone</label>
                    <span className="text-white">{selectedApp.candidate_phone || '—'}</span>
                  </div>
                </div>

                {/* Resume button */}
                <div className="p-3 rounded-lg bg-cyan-neon/10 border border-cyan-neon/30 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Candidate CV / Resume:</span>
                  <a
                    href={selectedApp.resume_google_drive_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 rounded bg-cyan-neon text-navy-950 font-bold text-xs hover:bg-cyan-neon/90"
                  >
                    Open Drive Resume ↗
                  </a>
                </div>

                {/* Portfolio / LinkedIn */}
                <div className="flex flex-wrap gap-3 text-xs">
                  {selectedApp.portfolio_or_github_url && (
                    <a
                      href={selectedApp.portfolio_or_github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-neon hover:underline"
                    >
                      🔗 Portfolio / GitHub ↗
                    </a>
                  )}
                  {selectedApp.linkedin_url && (
                    <a
                      href={selectedApp.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-neon hover:underline"
                    >
                      💼 LinkedIn Profile ↗
                    </a>
                  )}
                </div>

                {/* Cover note */}
                {selectedApp.cover_note && (
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Candidate Note</label>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                      {selectedApp.cover_note}
                    </div>
                  </div>
                )}

                {/* HR Action Controls */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    HR Hiring Actions
                  </h4>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Update Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-white/10 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Schedule Interview Date / Time</label>
                    <input
                      type="text"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      placeholder="e.g. Nov 20, 2026 at 3:00 PM IST via Google Meet"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Internal HR Notes</label>
                    <textarea
                      rows={2}
                      value={hrNotes}
                      onChange={(e) => setHrNotes(e.target.value)}
                      placeholder="Feedback from technical round, portfolio assessment..."
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs resize-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleUpdateStatus}
                    disabled={updatingStatus}
                    className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-cyan-neon text-navy-950 hover:bg-cyan-neon/90 shadow-cyan-glow-sm disabled:opacity-50"
                  >
                    {updatingStatus ? 'Updating...' : 'Save Candidate Status →'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 text-xs">
                Select an applicant from the table to view details and update their status.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
