import { useState } from 'react'

const SAMPLE = [
  { id: 1, title: 'Workshop: React Basics',  date: '2026-03-28', time: '10:00 AM', location: 'Lab 3B',      type: 'Workshop', isOfficial: true },
  { id: 2, title: 'Mid-Semester Exam',        date: '2026-03-30', time: '09:00 AM', location: 'Hall A',      type: 'Exam',     isOfficial: true },
  { id: 3, title: 'Project Submission',       date: '2026-04-02', time: '05:00 PM', location: 'Online',      type: 'Academic', isOfficial: true },
  { id: 4, title: 'Sports Day',               date: '2026-04-05', time: '08:00 AM', location: 'Ground',      type: 'Event',    isOfficial: true },
]

const TYPE_COLOR = {
  Workshop: '#7c3aed',
  Exam:     '#ef4444',
  Academic: '#3b82f6',
  Event:    '#14b8a6',
  Personal: '#f59e0b',
}

export default function Schedule() {
  const [events, setEvents]     = useState(SAMPLE)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ title: '', date: '', time: '', location: '', type: 'Personal' })

  const addEvent = () => {
    if (!form.title.trim() || !form.date) return
    setEvents(prev => [...prev, { id: Date.now(), ...form, isOfficial: false }])
    setForm({ title: '', date: '', time: '', location: '', type: 'Personal' })
    setShowForm(false)
  }

  const del = id => setEvents(prev => prev.filter(e => e.id !== id))

  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div>
      {/* Header Action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button id="add-personal-event" className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '＋ Add Personal Event'}
        </button>
      </div>

      {/* Personal Event Form */}
      {showForm && (
        <div className="form-panel animate-fade-in" style={{ borderColor: 'var(--accent)' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.9rem', color: 'var(--accent)' }}>📔 New Personal Event</div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Event Title *</label>
              <input className="form-input" placeholder="e.g. Study Group"
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option>Personal</option>
                <option>Workshop</option>
                <option>Academic</option>
                <option>Event</option>
              </select>
            </div>
          </div>
          <div className="form-row" style={{ marginTop: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input type="date" className="form-input" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input type="time" className="form-input" value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input className="form-input" placeholder="e.g. Library"
                value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={addEvent}>✔ Save to My Schedule</button>
        </div>
      )}

      {/* Event List */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {sorted.map((e, i) => {
          const d = new Date(e.date)
          const isToday = e.date === '2026-03-27'
          const isPast  = new Date(e.date) < new Date('2026-03-27')
          return (
            <div key={e.id} className="event-item animate-fade-in" style={{ 
              animationDelay: `${i * 0.05}s`, 
              opacity: isPast ? 0.6 : 1,
              border: e.isOfficial ? 'none' : '1px dashed var(--border)',
              background: e.isOfficial ? 'var(--bg-card)' : 'rgba(245, 158, 11, 0.05)'
            }}>
              <div className="event-date-badge" style={{ background: `linear-gradient(135deg, ${TYPE_COLOR[e.type]}30, ${TYPE_COLOR[e.type]}10)`, borderColor: `${TYPE_COLOR[e.type]}50` }}>
                <div className="event-day" style={{ color: TYPE_COLOR[e.type] }}>{d.getDate()}</div>
                <div className="event-month">{d.toLocaleString('en', { month: 'short' })}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <div className="event-title">{e.title}</div>
                  {isToday && <span className="badge badge-high" style={{ fontSize: '0.67rem' }}>TODAY</span>}
                </div>
                <div className="event-time" style={{ fontSize: '0.8rem' }}>
                  {e.time && <span>🕐 {e.time}</span>}
                  {e.location && <span style={{ marginLeft: '0.75rem' }}>📍 {e.location}</span>}
                </div>
                <div style={{ marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge" style={{ background: `${TYPE_COLOR[e.type]}20`, color: TYPE_COLOR[e.type], border: `1px solid ${TYPE_COLOR[e.type]}40`, fontSize: '0.65rem' }}>
                    {e.isOfficial ? '🛡️ Official' : '👤 Personal'} {e.type}
                  </span>
                  {!e.isOfficial && (
                    <button className="btn btn-danger btn-sm" style={{ padding: '0.2rem 0.4rem', fontSize: '0.65rem' }} onClick={() => del(e.id)}>🗑 Remove</button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
