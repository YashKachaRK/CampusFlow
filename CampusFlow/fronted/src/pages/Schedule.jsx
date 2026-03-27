import { useState } from 'react'

const SAMPLE = [
  { id: 1, title: 'Workshop: React Basics',  date: '2026-03-28', time: '10:00 AM', location: 'Lab 3B',      type: 'Workshop' },
  { id: 2, title: 'Mid-Semester Exam',        date: '2026-03-30', time: '09:00 AM', location: 'Hall A',      type: 'Exam'     },
  { id: 3, title: 'Project Submission',       date: '2026-04-02', time: '05:00 PM', location: 'Online',      type: 'Academic' },
  { id: 4, title: 'Sports Day',               date: '2026-04-05', time: '08:00 AM', location: 'Ground',      type: 'Event'    },
]

const TYPE_COLOR = {
  Workshop: '#7c3aed',
  Exam:     '#ef4444',
  Academic: '#3b82f6',
  Event:    '#14b8a6',
}

export default function Schedule() {
  const [events, setEvents]     = useState(SAMPLE)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm]         = useState({ title: '', date: '', time: '', location: '', type: 'Academic' })

  const addEvent = () => {
    if (!form.title.trim() || !form.date) return
    setEvents(prev => [...prev, { id: Date.now(), ...form }])
    setForm({ title: '', date: '', time: '', location: '', type: 'Academic' })
    setShowForm(false)
  }

  const del = id => setEvents(prev => prev.filter(e => e.id !== id))

  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <div>
      {/* Header Action */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button id="add-event-btn" className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '＋ Add Event'}
        </button>
      </div>

      {/* Add Event Form */}
      {showForm && (
        <div className="form-panel animate-fade-in">
          <div style={{ fontWeight: 700, marginBottom: '0.9rem' }}>📅 New Event</div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Event Title *</label>
              <input id="event-title-input" className="form-input" placeholder="e.g. Guest Lecture on AI"
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select id="event-type-select" className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option>Academic</option>
                <option>Workshop</option>
                <option>Exam</option>
                <option>Event</option>
              </select>
            </div>
          </div>
          <div className="form-row" style={{ marginTop: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input id="event-date-input" type="date" className="form-input" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input id="event-time-input" type="time" className="form-input" value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input id="event-location-input" className="form-input" placeholder="e.g. Room 301"
                value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
          </div>
          <button id="submit-event-btn" className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={addEvent}>✔ Add Event</button>
        </div>
      )}

      {/* Event List */}
      {sorted.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <div className="empty-text">No events scheduled. Add one above!</div>
        </div>
      ) : sorted.map((e, i) => {
        const d = new Date(e.date)
        const isToday = e.date === '2026-03-27'
        const isPast  = new Date(e.date) < new Date('2026-03-27')
        return (
          <div key={e.id} className="event-item animate-fade-in" style={{ animationDelay: `${i * 0.05}s`, opacity: isPast ? 0.5 : 1 }}>
            <div className="event-date-badge" style={{ background: `linear-gradient(135deg, ${TYPE_COLOR[e.type]}30, ${TYPE_COLOR[e.type]}10)`, borderColor: `${TYPE_COLOR[e.type]}50` }}>
              <div className="event-day" style={{ color: TYPE_COLOR[e.type] }}>{d.getDate()}</div>
              <div className="event-month">{d.toLocaleString('en', { month: 'short' })}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div className="event-title">{e.title}</div>
                {isToday && <span className="badge badge-high" style={{ fontSize: '0.67rem' }}>TODAY</span>}
              </div>
              <div className="event-time">
                {e.time && <span>🕐 {e.time}</span>}
                {e.location && <span style={{ marginLeft: '0.75rem' }}>📍 {e.location}</span>}
              </div>
            </div>
            <span className="badge" style={{ background: `${TYPE_COLOR[e.type]}20`, color: TYPE_COLOR[e.type], border: `1px solid ${TYPE_COLOR[e.type]}40`, marginRight: '0.5rem' }}>
              {e.type}
            </span>
            <button id={`del-event-${e.id}`} className="btn btn-danger btn-sm" onClick={() => del(e.id)}>🗑</button>
          </div>
        )
      })}
    </div>
  )
}
