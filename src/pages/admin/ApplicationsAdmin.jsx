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
  applied: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  'under review': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  shortlisted: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  'interview scheduled': 'bg-cyan-neon/15 text-cyan-neon border-cyan-neon/40',
  offer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
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
      alert(`Candidate status successfully updated to "${newStatus}".`)
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
          <h1 className="font-display text-2xl font-bold text-white">
            HR Candidate &amp; Applicant Management
          </h1>
          <p className="text-gray-400 text-xs mt-0.5">
            Zero-Storage resume review, WhatsApp direct reach, and hiring workflow.
          </p>
        </div>
        <button
          onClick={fetchApplications}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all self-start sm:self-auto"
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
        <div className="glass-card p-12 text-center border border-white/5 rounded-xl">
          <span className="text-4xl block mb-3">👥</span>
          <h3 className="font-display text-lg font-bold text-white mb-2">No Applications Yet</h3>
          <p className="text-gray-400 text-xs">
            When candidates submit their applications via the careers portal, their profiles and CVs will appear here.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Applications Table (7 cols) */}
          <div className="lg:col-span-7 glass-card overflow-hidden border border-white/5 rounded-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" aria-label="Applications list">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Applied Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((app) => {
                    const isSelected = selectedApp?.id === app.id
                    const statusKey = app.status?.toLowerCase() || 'applied'
                    const badgeClass = STATUS_COLORS[statusKey] || 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                    const resumeUrl = app.resume_file_url || app.resume_google_drive_url

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
                          {app.candidate_phone && (
                            <p className="text-[11px] text-gray-500 font-mono">{app.candidate_phone}</p>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="text-xs font-medium text-white">{app.job_title}</p>
                          <p className="text-[10px] text-gray-500">{formatDate(app.applied_at)}</p>
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
                              className="inline-flex items-center gap-1 text-xs text-cyan-neon hover:underline font-semibold"
                            >
                              View CV ↗
                            </a>
                          ) : (
                            <span className="text-gray-500 text-xs">No link</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Candidate Detail & HR Management Pane (5 cols) */}
          <div className="lg:col-span-5 glass-card p-6 h-fit sticky top-6 border border-white/10 rounded-xl">
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

                {/* Candidate Overview Badges */}
                <div className="grid grid-cols-2 gap-3 text-xs bg-white/2 p-3 rounded-lg border border-white/5">
                  <div>
                    <label className="text-gray-500 text-[10px] uppercase block">Education</label>
                    <span className="text-white font-medium">
                      {selectedApp.education_level || 'Undergraduate'}
                    </span>
                  </div>
                  <div>
                    <label className="text-gray-500 text-[10px] uppercase block">Experience</label>
                    <span className="text-white font-medium">
                      {selectedApp.experience_status || 'Fresher / Student'}
                    </span>
                  </div>
                </div>

                {/* Contact Information & WhatsApp Reach */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Email:</span>
                    <a href={`mailto:${selectedApp.candidate_email}`} className="text-cyan-neon hover:underline truncate max-w-[200px]">
                      {selectedApp.candidate_email}
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white font-mono">{selectedApp.candidate_phone || '—'}</span>
                  </div>
                </div>

                {/* 1-Click WhatsApp Candidate Link */}
                {selectedApp.candidate_phone && (
                  <a
                    href={`https://wa.me/${selectedApp.candidate_phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedApp.candidate_name)},%20this%20is%20OpenMNC%20LLP%20HR%20regarding%20your%20application%20for%20${encodeURIComponent(selectedApp.job_title)}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-emerald-600/30 transition-all"
                  >
                    💬 Message on WhatsApp
                  </a>
                )}

                {/* Resume Access Card */}
                <div className="p-3.5 rounded-lg bg-cyan-neon/10 border border-cyan-neon/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-white block">Candidate CV / Resume</span>
                    <span className="text-[11px] text-gray-400">
                      {selectedApp.resume_file_url ? 'Direct Upload (PDF/DOC)' : 'Google Drive Link'}
                    </span>
                  </div>
                  <a
                    href={selectedApp.resume_file_url || selectedApp.resume_google_drive_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-cyan-neon text-navy-950 font-bold text-xs hover:bg-cyan-neon/90 shadow-cyan-glow transition-all"
                  >
                    Open Resume ↗
                  </a>
                </div>

                {/* Portfolio / LinkedIn */}
                <div className="flex flex-wrap gap-2 text-xs">
                  {selectedApp.portfolio_or_github_url && (
                    <a
                      href={selectedApp.portfolio_or_github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-cyan-neon hover:underline"
                    >
                      🔗 Portfolio / GitHub ↗
                    </a>
                  )}
                  {selectedApp.linkedin_url && (
                    <a
                      href={selectedApp.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-cyan-neon hover:underline"
                    >
                      💼 LinkedIn ↗
                    </a>
                  )}
                </div>

                {/* Cover note */}
                {selectedApp.cover_note && (
                  <div>
                    <label className="text-[11px] text-gray-400 block mb-1">Candidate Note / Pitch:</label>
                    <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 leading-relaxed max-h-32 overflow-y-auto">
                      {selectedApp.cover_note}
                    </div>
                  </div>
                )}

                {/* HR Action Controls */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Update Pipeline Status
                  </h4>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Candidate Stage</label>
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
                    <label className="block text-[11px] text-gray-400 mb-1">Scheduled Interview Time (if applicable)</label>
                    <input
                      type="text"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      placeholder="e.g. Wednesday at 3:00 PM IST via Google Meet"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:ring-2 focus:ring-cyan-neon/40"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-400 mb-1">Internal HR Notes (Confidential)</label>
                    <textarea
                      rows={2}
                      value={hrNotes}
                      onChange={(e) => setHrNotes(e.target.value)}
                      placeholder="Technical evaluation, salary discussion, impressions..."
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs resize-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleUpdateStatus}
                    disabled={updatingStatus}
                    className="w-full py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-cyan-neon text-navy-950 hover:bg-cyan-neon/90 shadow-cyan-glow-sm disabled:opacity-50 transition-all"
                  >
                    {updatingStatus ? 'Updating Status...' : 'Save Pipeline Changes →'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 text-xs">
                Select any candidate from the table to view their resume and update hiring status.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
