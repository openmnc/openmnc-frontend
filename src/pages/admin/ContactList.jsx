import { useEffect, useState } from 'react'
import apiClient from '../../api/client.js'
import { formatDate } from '../../utils/helpers.js'

const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'In Discussion', 'Converted', 'Rejected']

export default function ContactList() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [error, setError] = useState('')
  const [leadTypeFilter, setLeadTypeFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  // Status editing
  const [currentStatus, setCurrentStatus] = useState('New')
  const [notes, setNotes] = useState('')
  const [savingStatus, setSavingStatus] = useState(false)

  useEffect(() => {
    fetchSubmissions()
  }, [])

  async function fetchSubmissions() {
    setLoading(true)
    setError('')
    try {
      const res = await apiClient.get('/contact')
      setSubmissions(res.data || [])
    } catch (err) {
      setError(err?.response?.data?.detail || 'Failed to load submissions. Please ensure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(sub) {
    setSelectedSubmission(sub)
    setCurrentStatus(sub.status || 'New')
    setNotes(sub.notes || '')
  }

  async function handleUpdateLead() {
    if (!selectedSubmission) return
    setSavingStatus(true)
    try {
      const res = await apiClient.put(`/contact/${selectedSubmission.id}/status`, {
        status: currentStatus,
        notes: notes,
      })
      setSubmissions((prev) =>
        prev.map((s) => (s.id === selectedSubmission.id ? res.data : s))
      )
      setSelectedSubmission(res.data)
      alert('Lead status updated successfully.')
    } catch {
      alert('Failed to update lead.')
    } finally {
      setSavingStatus(false)
    }
  }

  const filtered = submissions.filter((sub) => {
    const matchesType =
      leadTypeFilter === 'All' ? true : sub.lead_type === leadTypeFilter
    const matchesStatus =
      statusFilter === 'All' ? true : sub.status === statusFilter
    return matchesType && matchesStatus
  })

  return (
    <div className="p-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Smart Lead Tracking &amp; Inquiries
          </h1>
          <p className="text-gray-400 text-sm">
            Categorized leads for B2B Founders vs. Student Assistance with AI attribution.
          </p>
        </div>
        <button
          onClick={fetchSubmissions}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-all"
        >
          Refresh ↻
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2">
          {['All', 'b2b', 'student', 'general'].map((type) => (
            <button
              key={type}
              onClick={() => setLeadTypeFilter(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all uppercase tracking-wider ${
                leadTypeFilter === type
                  ? 'bg-cyan-neon text-navy-950 font-bold'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {type === 'b2b' ? '💼 B2B / Founders' : type === 'student' ? '🎓 Students' : type}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-navy-900 border border-white/10 text-white text-xs focus:outline-none"
          >
            <option value="All">All Statuses</option>
            {LEAD_STATUSES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 mb-6 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-cyan-neon/30 border-t-cyan-neon rounded-full animate-spin" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <span className="text-4xl block mb-3">📬</span>
          <h3 className="font-display text-lg font-bold text-white mb-1">No Leads Yet</h3>
          <p className="text-gray-400 text-sm">
            When visitors submit forms or ask AI tools about OpenMNC, their leads will appear here.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Table (7 cols) */}
          <div className="lg:col-span-7 glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Intent Tag</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filtered.map((sub) => {
                    const isSelected = selectedSubmission?.id === sub.id
                    return (
                      <tr
                        key={sub.id}
                        onClick={() => handleSelect(sub)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-cyan-neon/10' : 'hover:bg-white/5'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-white">{sub.name}</p>
                          <p className="text-xs text-gray-400">{sub.email}</p>
                          {sub.company_name && (
                            <p className="text-[11px] text-amber-glow font-medium">{sub.company_name}</p>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-neon/10 text-cyan-neon border border-cyan-neon/20">
                            {sub.intent_tag || sub.service_interest || 'General'}
                          </span>
                          {sub.ai_source && (
                            <span className="block text-[10px] text-gray-500 mt-0.5">
                              via {sub.ai_source}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-white/5 border border-white/10 text-white">
                            {sub.status || 'New'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right text-xs text-gray-400 whitespace-nowrap">
                          {formatDate(sub.submitted_at)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Details & CRM Actions (5 cols) */}
          <div className="lg:col-span-5 glass-card p-6 h-fit sticky top-6 border border-white/10">
            {selectedSubmission ? (
              <div className="space-y-4">
                <div className="border-b border-white/5 pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-cyan-neon font-mono uppercase tracking-wider">
                      Lead Type: {selectedSubmission.lead_type?.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(selectedSubmission.submitted_at)}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white">
                    {selectedSubmission.name}
                  </h3>
                  {selectedSubmission.company_name && (
                    <p className="text-xs text-amber-glow font-medium">🏢 {selectedSubmission.company_name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-gray-500 block">Email</label>
                    <a href={`mailto:${selectedSubmission.email}`} className="text-cyan-neon hover:underline truncate block">
                      {selectedSubmission.email}
                    </a>
                  </div>
                  <div>
                    <label className="text-gray-500 block">Phone</label>
                    {selectedSubmission.phone ? (
                      <a href={`tel:${selectedSubmission.phone}`} className="text-white hover:text-cyan-neon">
                        {selectedSubmission.phone}
                      </a>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </div>
                </div>

                {/* B2B / Student Extra Details */}
                {selectedSubmission.budget_range && (
                  <div className="text-xs">
                    <label className="text-gray-500 block">Budget &amp; Timeline</label>
                    <span className="text-white font-medium">
                      {selectedSubmission.budget_range} • {selectedSubmission.project_timeline || 'Standard'}
                    </span>
                  </div>
                )}

                {selectedSubmission.education_level && (
                  <div className="text-xs">
                    <label className="text-gray-500 block">Education Level &amp; Field</label>
                    <span className="text-white font-medium">
                      {selectedSubmission.education_level} ({selectedSubmission.preferred_field || 'General'})
                    </span>
                    {selectedSubmission.interested_in_college_subsidy && (
                      <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-glow/10 text-amber-glow border border-amber-glow/30 text-[10px] font-bold">
                        Applied for ₹3k–₹10k Subsidy
                      </span>
                    )}
                  </div>
                )}

                <div>
                  <label className="text-xs text-gray-500 block mb-1">Inquiry Message</label>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-200 whitespace-pre-wrap">
                    {selectedSubmission.message}
                  </div>
                </div>

                {/* Lead Status & Notes Action */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Sales / Admission Pipeline
                  </h4>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Lead Status</label>
                    <select
                      value={currentStatus}
                      onChange={(e) => setCurrentStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-white/10 text-white text-xs font-semibold focus:outline-none"
                    >
                      {LEAD_STATUSES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Internal Notes</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add conversation notes, call summary..."
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-xs resize-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleUpdateLead}
                      disabled={savingStatus}
                      className="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-cyan-neon text-navy-950 hover:bg-cyan-neon/90 disabled:opacity-50"
                    >
                      {savingStatus ? 'Updating...' : 'Save Lead Status'}
                    </button>
                    <a
                      href={`mailto:${selectedSubmission.email}?subject=Re: Inquiry with OpenMNC LLP`}
                      className="px-4 py-2 rounded-lg text-xs font-bold bg-white/10 text-white hover:bg-white/20 text-center"
                    >
                      Email ✉
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-500 text-xs">
                Select a lead to preview full details and manage pipeline status.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
