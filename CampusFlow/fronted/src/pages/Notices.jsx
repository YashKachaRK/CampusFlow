  import { useState } from 'react'

const SAMPLE = [
  {
    id: 1,
    title: '📌 Exam Timetable Released',
    description: 'The mid-semester examination timetable has been published on the college portal. Students are advised to check their subject-wise schedule and exam hall allocation.',
    date: '2026-03-26',
    category: 'Academic',
    important: true,
  },
  {
    id: 2,
    title: '🎉 AI Hackathon Registration Open',
    description: 'AI Hackathon 2026 registrations are now OPEN! Team size: 2-4 members. Last date to register: March 31, 2026. Winners get cash prizes + internship offers.',
    date: '2026-03-25',
    category: 'Event',
    important: false,
  },
  {
    id: 3,
    title: '🛑 Library Closed for Maintenance',
    description: 'The central library will remain closed from March 28 to March 30 for annual book cataloguing and system upgrades. Online resources remain accessible.',
    date: '2026-03-24',
    category: 'General',
    important: false,
  },
  {
    id: 4,
    title: '🏆 Scholarship Application Deadline',
    description: 'Last date to apply for the Merit-cum-Means scholarship is April 5. Submit applications to the office with all required documents. No extensions will be granted.',
    date: '2026-03-22',
    category: 'Financial',
    important: true,
  },
]

const CAT_COLOR = {
  Academic:  '#7c3aed',
  Event:     '#14b8a6',
  General:   '#6b7280',
  Financial: '#f59e0b',
}

export default function Notices() {
  const [notices, setNotices]   = useState(SAMPLE)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter]     = useState('All')
  const [form, setForm]         = useState({ title: '', description: '', category: 'General', important: false })

  const addNotice = () => {
    if (!form.title.trim()) return
    setNotices(prev => [{ id: Date.now(), ...form, date: '2026-03-27' }, ...prev])
    setForm({ title: '', description: '', category: 'General', important: false })
    setShowForm(false)
  }

  const del = id => setNotices(prev => prev.filter(n => n.id !== id))

  const categories = ['All', ...new Set(SAMPLE.map(n => n.category))]
  const filtered   = filter === 'All' ? notices : notices.filter(n => n.category === filter)

  return (
    <div>
      {/* Filter + Add Row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {categories.map(c => (
          <button
            key={c}
            id={`notice-filter-${c}`}
            className="btn btn-secondary btn-sm"
            onClick={() => setFilter(c)}
            style={filter === c ? { borderColor: '#a78bfa', color: '#a78bfa', background: 'rgba(167,139,250,0.1)' } : {}}
          >
            {c}
          </button>
        ))}
        <button id="add-notice-btn" className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '＋ Post Notice'}
        </button>
      </div>

      {/* Add Notice Form */}
      {showForm && (
        <div className="form-panel animate-fade-in">
          <div style={{ fontWeight: 700, marginBottom: '0.9rem' }}>📢 Post New Notice</div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Title *</label>
              <input id="notice-title-input" className="form-input" placeholder="Notice title..."
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="form-group" style={{ flex: 0, minWidth: 140 }}>
              <label className="form-label">Category</label>
              <select id="notice-cat-select" className="form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option>Academic</option>
                <option>Event</option>
                <option>General</option>
                <option>Financial</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="form-label">Description</label>
            <textarea id="notice-desc-input" className="form-textarea" placeholder="Enter notice details..."
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
            <input type="checkbox" id="notice-important" checked={form.important}
              onChange={e => setForm(f => ({ ...f, important: e.target.checked }))}
              style={{ accentColor: '#ef4444', width: 14, height: 14 }} />
            <label htmlFor="notice-important" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              Mark as Important
            </label>
            <button id="submit-notice-btn" className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={addNotice}>✔ Post</button>
          </div>
        </div>
      )}

      {/* Notice Cards */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">No notices in this category.</div>
        </div>
      ) : filtered.map((n, i) => (
        <div key={n.id} className="notice-card animate-fade-in" style={{ animationDelay: `${i * 0.05}s`, borderLeftColor: CAT_COLOR[n.category] || '#7c3aed' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                <span className="notice-title">{n.title}</span>
                {n.important && <span className="badge badge-high" style={{ fontSize: '0.67rem' }}>⚠ Important</span>}
                <span className="badge" style={{ background: `${CAT_COLOR[n.category]}20`, color: CAT_COLOR[n.category], border: `1px solid ${CAT_COLOR[n.category]}40`, fontSize: '0.67rem' }}>
                  {n.category}
                </span>
              </div>
              <div className="notice-desc">{n.description}</div>
              <div className="notice-meta">
                <span>📅 {n.date}</span>
              </div>
            </div>
            <button id={`del-notice-${n.id}`} className="btn btn-danger btn-sm" onClick={() => del(n.id)}>🗑</button>
          </div>
        </div>
      ))}
    </div>
  )
}
