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
      setError(err?.response?.data?.detail || 'Failed to load inquiries.')
    } finally {
      setLoading(false)
    }
  }

  function handleSelect(sub) {
    setSelectedSubmission(sub)
    setCurrentStatus(sub.status || 'New')
    setNotes(sub.notes || '')
  }

  async function handleDeleteLead() {
    if (!selectedSubmission) return
    if (!window.confirm(`Delete lead from "${selectedSubmission.name}"? This cannot be undone.`)) return
    try {
      await apiClient.delete(`/contact/${selectedSubmission.id}`)
      setSubmissions((prev) => prev.filter((s) => s.id !== selectedSubmission.id))
      setSelectedSubmission(null)
    } catch {
      alert('Failed to delete lead.')
    }
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
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[#f5f5f7] tracking-tight">
            Founder Inquiries &amp; Leads
          </h1>
          <p className="text-[#86868b] text-xs mt-0.5">
            Segregated leads for B2B engineering vs. free student counseling.
          </p>
        </div>
        <button
          onClick={fetchSubmissions}
          className="px-4 py-2 rounded-full text-xs font-medium bg-white/5 hover:bg-white/10 text-[#d2d2d7] border border-white/10 transition-colors self-start sm:self-auto"
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                leadTypeFilter === type
                  ? 'bg-white/15 text-white shadow-sm border border-white/10'
                  : 'bg-white/5 text-[#86868b] hover:text-white border border-transparent'
              }`}
            >
              {type === 'b2b' ? '💼 B2B Founders' : type === 'student' ? '🎓 Students' : type === 'All' ? 'All Leads' : 'General'}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs text-[#86868b]">
          <span>Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-[#1c1c20] border border-white/10 text-white text-xs focus:outline-none"
          >
            <option value="All">All Statuses</option>
            {LEAD_STATUSES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-3 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#2997ff]/30 border-t-[#2997ff] rounded-full animate-spin" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="rounded-2xl bg-[#161618] border border-white/8 p-12 text-center">
          <span className="text-4xl block mb-3">📬</span>
          <h3 className="font-display text-lg font-semibold text-[#f5f5f7] mb-1">No Leads Yet</h3>
          <p className="text-[#86868b] text-xs">
            When visitors submit contact forms or booking requests, their inquiries will appear here.
          </p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Table (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl bg-[#161618] border border-white/8 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.02] text-[#86868b] text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Intent</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/8">
                  {filtered.map((sub) => {
                    const isSelected = selectedSubmission?.id === sub.id
                    return (
                      <tr
                        key={sub.id}
                        onClick={() => handleSelect(sub)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-white/[0.06]' : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <p className="font-medium text-white">{sub.name}</p>
                          <p className="text-xs text-[#86868b]">{sub.email}</p>
                          {sub.company_name && (
                            <p className="text-[11px] text-[#2997ff]">{sub.company_name}</p>
                          )}
                          {sub.wants_nda && (
                            <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                              🔒 NDA Requested
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/5 text-[#d2d2d7] border border-white/10">
                            {sub.intent_tag || sub.service_interest || 'General'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-xs text-[#a1a1a6] font-medium">{sub.status || 'New'}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-xs text-[#86868b] tabular-nums">
                          {formatDate(sub.created_at)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lead Detail Panel (5 cols) */}
          <div className="lg:col-span-5">
            {selectedSubmission ? (
              <div className="rounded-2xl bg-[#161618] border border-white/8 p-6 space-y-5">
                <div className="flex items-start justify-between border-b border-white/8 pb-4">
                  <div>
                    <span className="text-[10px] text-[#2997ff] font-semibold uppercase tracking-wider block">
                      Lead Details
                    </span>
                    <h2 className="font-display text-lg font-semibold text-[#f5f5f7] mt-0.5">
                      {selectedSubmission.name}
                    </h2>
                    <p className="text-xs text-[#86868b]">{selectedSubmission.email}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/5 text-white border border-white/10">
                    {selectedSubmission.status || 'New'}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  {selectedSubmission.phone && (
                    <div>
                      <span className="text-[#86868b] block">Phone / WhatsApp:</span>
                      <p className="text-[#2997ff] font-mono mt-0.5">{selectedSubmission.phone}</p>
                    </div>
                  )}

                  {selectedSubmission.wants_nda && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs">
                      🔒 Requested Mutual NDA before technical discussion.
                    </div>
                  )}

                  <div>
                    <span className="text-[#86868b] block mb-1">Message / Requirements:</span>
                    <p className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[#d2d2d7] leading-relaxed">
                      {selectedSubmission.message}
                    </p>
                  </div>
                </div>

                {/* Status Update */}
                <div className="pt-4 border-t border-white/8 space-y-3">
                  <h3 className="text-xs font-semibold text-[#f5f5f7]">Update Lead Pipeline</h3>

                  <div>
                    <label className="block text-[11px] text-[#86868b] mb-1">Lead Status</label>
                    <select
                      value={currentStatus}
                      onChange={(e) => setCurrentStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#1c1c20] border border-white/10 text-white text-xs focus:outline-none"
                    >
                      {LEAD_STATUSES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-[#86868b] mb-1">Internal Notes</label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Follow-up notes..."
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-[#2997ff] resize-none"
                    />
                  </div>

                  <button
                    onClick={handleUpdateLead}
                    disabled={savingStatus}
                    className="w-full py-2.5 rounded-full text-xs font-semibold bg-[#2997ff] text-white hover:bg-[#0071e3] transition-all disabled:opacity-50"
                  >
                    {savingStatus ? 'Saving...' : 'Update Lead Status →'}
                  </button>
                  <button
                    onClick={handleDeleteLead}
                    className="w-full py-2.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 transition-all mt-2"
                  >
                    🗑 Delete Lead Permanently
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-[#161618] border border-white/8 p-8 text-center text-[#86868b] text-xs">
                Select an inquiry from the table to view message details and update status.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
