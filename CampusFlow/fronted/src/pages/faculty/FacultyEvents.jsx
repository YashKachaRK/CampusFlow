import { useState } from 'react'

const INITIAL_EVENTS = [
  { id: 1, title: 'Data Structures Mid-Term', date: '2026-04-10', time: '10:00 AM', type: 'Exam', location: 'Hall B' },
  { id: 2, title: 'React Workshop', date: '2026-04-15', time: '02:00 PM', type: 'Workshop', location: 'Lab 1' },
]

export default function FacultyEvents() {
  const [events, setEvents] = useState(INITIAL_EVENTS)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', time: '', type: 'Exam', location: '' })

  const handleAdd = () => {
    if (!form.title || !form.date) return
    setEvents([...events, { id: Date.now(), ...form }])
    setForm({ title: '', date: '', time: '', type: 'Exam', location: '' })
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setEvents(events.filter(e => e.id !== id))
  }

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
        <button className="btn" style={{ background: '#10b981', color: '#fff', border: 'none' }} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '＋ Schedule Event'}
        </button>
      </div>

      {showForm && (
        <div className="form-panel" style={{ borderColor: '#10b981', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.9rem', color: '#10b981' }}>📅 New Event / Schedule</div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Title *</label>
              <input className="form-input" placeholder="e.g. Final Exam" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-select" value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option>Exam</option>
                <option>Workshop</option>
                <option>Lecture</option>
                <option>Meeting</option>
              </select>
            </div>
          </div>
          <div className="form-row" style={{ marginTop: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Date *</label>
              <input type="date" className="form-input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Time</label>
              <input type="time" className="form-input" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Location</label>
              <input className="form-input" placeholder="e.g. Ground" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
            </div>
          </div>
          <button className="btn" style={{ background: '#10b981', color: '#fff', border: 'none', marginTop: '1rem', width: '100%' }} onClick={handleAdd}>✔ Publish Schedule</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {events.map((e, i) => (
          <div key={e.id} className="event-item" style={{ border: '1px solid var(--border)', background: 'var(--bg-card)' }}>
             <div className="event-date-badge" style={{ background: '#10b98120', borderColor: '#10b98150' }}>
               <div className="event-day" style={{ color: '#10b981' }}>{new Date(e.date).getDate()}</div>
               <div className="event-month">{new Date(e.date).toLocaleString('en', { month: 'short' })}</div>
             </div>
             <div style={{ flex: 1 }}>
               <div className="event-title">{e.title}</div>
               <div className="event-time" style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>
                 {e.time && <span>🕐 {e.time}</span>}
                 {e.location && <span style={{ marginLeft: '0.75rem' }}>📍 {e.location}</span>}
               </div>
               <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span className="badge" style={{ background: '#10b98120', color: '#10b981', border: '1px solid #10b98140' }}>{e.type}</span>
                 <button className="btn btn-sm btn-danger" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }} onClick={() => handleDelete(e.id)}>Remove</button>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  )
}
