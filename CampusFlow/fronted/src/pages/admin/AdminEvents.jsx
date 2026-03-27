import { useState } from 'react'

const TYPE_COLOR = {
  Workshop: '#7c3aed',
  Exam:     '#ef4444',
  Academic: '#3b82f6',
  Event:    '#14b8a6',
}

const SAMPLE = [
  { id: 1, title: 'Exam on Monday', date: '2026-03-30', time: '09:00 AM', location: 'Hall A', type: 'Exam' },
  { id: 2, title: 'Holiday Notice', date: '2026-04-01', time: 'Full Day', location: 'Campus-wide', type: 'Event' },
  { id: 3, title: 'Guest Seminar: AI', date: '2026-04-05', time: '02:00 PM', location: 'Lab 4', type: 'Workshop' },
]

export default function AdminEvents() {
  const [events, setEvents] = useState(SAMPLE)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', time: '', location: '', type: 'Academic' })

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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '➕ Add Official Event'}
        </button>
      </div>

      {showForm && (
        <div className="form-panel animate-fade-in" style={{ borderColor: '#ef4444' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.9rem', color: '#f87171' }}>📅 Add Official Event</div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Event Title *</label>
              <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. Mid-Semester Exam" />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                {Object.keys(TYPE_COLOR).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="form-row" style={{ marginTop: '0.75rem' }}>
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input type="date" className="form-input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Time</label>
              <input className="form-input" value={form.time} onChange={e => setForm({...form, time: e.target.value})} placeholder="e.g. 10:00 AM" />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '0.75rem' }}>
            <label className="form-label">Location</label>
            <input className="form-input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Hall A or Online" />
          </div>
          <button className="btn btn-primary" style={{ marginTop: '1.25rem', width: '100%' }} onClick={addEvent}>Publish Event</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {sorted.map(e => (
          <div key={e.id} className="card animate-fade-in" style={{ borderLeft: `4px solid ${TYPE_COLOR[e.type]}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span className="badge" style={{ background: `${TYPE_COLOR[e.type]}20`, color: TYPE_COLOR[e.type], marginBottom: '0.5rem' }}>{e.type}</span>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{e.title}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', gap: '1rem' }}>
                  <span>📅 {e.date}</span>
                  <span>🕐 {e.time}</span>
                </div>
                {e.location && <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>📍 {e.location}</div>}
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => del(e.id)}>🗑 Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
