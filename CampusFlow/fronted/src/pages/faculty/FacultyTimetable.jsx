import { useState } from 'react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM']

// Pre-fill some data
const INITIAL_TIMETABLE = {
  'Monday-10:00 AM': { subject: 'Database Systems', room: 'Lab 2' },
  'Tuesday-11:00 AM': { subject: 'Operating Systems', room: 'Room 401' },
  'Wednesday-02:00 PM': { subject: 'Software Eng', room: 'Room 304' },
  'Thursday-09:00 AM': { subject: 'Database Systems', room: 'Lab 2' },
  'Friday-01:00 PM': { subject: 'Project Mentoring', room: 'Staff Room' },
}

export default function FacultyTimetable() {
  const [timetable, setTimetable] = useState(INITIAL_TIMETABLE)
  const [editing, setEditing] = useState(null) // "Day-Time"
  const [form, setForm] = useState({ subject: '', room: '' })

  const handleCellClick = (day, time) => {
    const key = `${day}-${time}`
    setEditing(key)
    if (timetable[key]) {
      setForm({ subject: timetable[key].subject, room: timetable[key].room })
    } else {
      setForm({ subject: '', room: '' })
    }
  }

  const handleSave = () => {
    if (!editing) return
    if (!form.subject) {
      // Clear cell if saving empty
      const updated = { ...timetable }
      delete updated[editing]
      setTimetable(updated)
    } else {
      setTimetable({
        ...timetable,
        [editing]: { ...form }
      })
    }
    setEditing(null)
  }

  return (
    <div className="animate-fade-in">
      <div style={{ background: '#10b98115', border: '1px solid #10b98130', borderRadius: 8, padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.25rem' }}>ℹ️</span>
        Click on any empty slot to assign a class, or click an existing class to edit/remove it.
      </div>

      {/* Editor Modal */}
      {editing && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 12, width: '100%', maxWidth: 400, border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginTop: 0, color: '#10b981' }}>Edit Slot</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{editing.split('-').join(' at ')}</p>
            
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Subject</label>
              <input className="form-input" placeholder="e.g. Machine Learning" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} autoFocus />
            </div>
            
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Room / Lab</label>
              <input className="form-input" placeholder="e.g. Lab 4" value={form.room} onChange={e => setForm({...form, room: e.target.value})} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
               <button className="btn" style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none' }} onClick={handleSave}>Save</button>
               <button className="btn" style={{ flex: 1 }} onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Timetable Grid */}
      <div style={{ overflowX: 'auto', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12 }}>
        <table style={{ width: '100%', minWidth: 800, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem', borderRight: '1px solid var(--border)', width: 100 }}>Time</th>
              {DAYS.map(day => (
                <th key={day} style={{ padding: '1rem', textAlign: 'center', color: '#10b981', fontWeight: 600, borderRight: '1px solid var(--border)' }}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TIME_SLOTS.map(time => (
              <tr key={time} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', borderRight: '1px solid var(--border)', fontWeight: 600 }}>
                  {time}
                </td>
                {DAYS.map(day => {
                  const key = `${day}-${time}`
                  const cell = timetable[key]
                  return (
                    <td 
                      key={day} 
                      style={{ 
                        padding: '0.5rem', 
                        borderRight: '1px solid var(--border)', 
                        background: cell ? '#10b98110' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        height: 70,
                        verticalAlign: 'top'
                      }}
                      onClick={() => handleCellClick(day, time)}
                      onMouseEnter={(e) => {
                         if(!cell) e.currentTarget.style.background = '#10b98105'
                      }}
                      onMouseLeave={(e) => {
                         if(!cell) e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      {cell && (
                        <div style={{ padding: '0.5rem', border: '1px solid #10b98130', borderRadius: 6, background: 'var(--bg-card)', height: '100%', boxSizing: 'border-box' }}>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981', lineHeight: 1.2 }}>{cell.subject}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{cell.room}</div>
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
