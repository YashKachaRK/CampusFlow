import { useState, useEffect } from 'react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM']

const API_URL = 'http://localhost:5000/api/timetable';

// Helper: Converts "01:00 PM" to "13:00:00" for the database
const convertTo24Hour = (time12h) => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') hours = '00';
  if (modifier === 'PM') hours = (parseInt(hours, 10) + 12).toString();
  return `${hours.padStart(2, '0')}:${minutes}:00`;
}

// Helper: Converts "13:00:00" to "01:00 PM" for the frontend
const convertTo12Hour = (time24h) => {
  let [hours, minutes] = time24h.split(':');
  hours = parseInt(hours, 10);
  const modifier = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, '0')}:${minutes} ${modifier}`;
}

export default function FacultyTimetable() {
  const [timetable, setTimetable] = useState({})
  const [editing, setEditing] = useState(null) // "Day-Time" format
  const [form, setForm] = useState({ subject: '', room: '' })

  // 1. Fetch data from DB on load
  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      // Map array of DB records into a dictionary object for the grid
      const formattedTimetable = {};
      data.forEach(slot => {
        const time12h = convertTo12Hour(slot.start_time);
        formattedTimetable[`${slot.day}-${time12h}`] = slot;
      });
      
      setTimetable(formattedTimetable);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  }

  const handleCellClick = (day, time) => {
    const key = `${day}-${time}`
    setEditing(key)
    if (timetable[key]) {
      setForm({ subject: timetable[key].subject, room: timetable[key].room || '' })
    } else {
      setForm({ subject: '', room: '' })
    }
  }

  // 2. Explicit Delete Function
  const handleDelete = async () => {
    if (!editing) return;
    const existingSlot = timetable[editing];

    if (existingSlot?.id) {
      if (!window.confirm(`Are you sure you want to delete ${existingSlot.subject}?`)) return;

      try {
        await fetch(`${API_URL}/${existingSlot.id}`, { method: 'DELETE' });
        const updated = { ...timetable };
        delete updated[editing];
        setTimetable(updated);
      } catch (error) {
        console.error("Error deleting slot:", error);
      }
    }

    setEditing(null);
    setForm({ subject: '', room: '' });
  };

  // 3. Save or Update slots
  const handleSave = async () => {
    if (!editing) return
    const [day, timeStr] = editing.split('-');
    const existingSlot = timetable[editing];
    
    // Calculate start and end times in 24h format
    const start_time = convertTo24Hour(timeStr);
    const startHour = parseInt(start_time.split(':')[0], 10);
    const end_time = `${(startHour + 1).toString().padStart(2, '0')}:00:00`; 

    try {
      if (!form.subject) {
        // Fallback: If user clears the subject field and hits save, treat it as a delete
        handleDelete();
        return;
      } 
      
      const payload = { day, start_time, end_time, subject: form.subject, room: form.room };

      if (existingSlot?.id) {
        // UPDATE existing slot
        const res = await fetch(`${API_URL}/${existingSlot.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const updatedSlot = await res.json();
        setTimetable({ ...timetable, [editing]: updatedSlot });
      } else {
        // CREATE new slot
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const newSlot = await res.json();
        setTimetable({ ...timetable, [editing]: newSlot });
      }
      
    } catch (error) {
      console.error("Error saving slot:", error);
    }
    
    setEditing(null);
    setForm({ subject: '', room: '' });
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
            <h3 style={{ marginTop: 0, color: '#10b981' }}>{timetable[editing] ? 'Update Slot' : 'Add New Slot'}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{editing.split('-').join(' at ')}</p>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Subject *</label>
              <input className="form-input" placeholder="e.g. Machine Learning" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} autoFocus />
            </div>

            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label">Room / Lab</label>
              <input className="form-input" placeholder="e.g. Lab 4" value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button className="btn" style={{ flex: 1, background: '#10b981', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleSave}>
                Save
              </button>
              
              {/* Only show Delete button if the slot already exists in the database */}
              {timetable[editing] && (
                <button className="btn" style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }} onClick={handleDelete}>
                  Delete
                </button>
              )}
              
              <button className="btn" style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer' }} onClick={() => setEditing(null)}>
                Cancel
              </button>
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
                        if (!cell) e.currentTarget.style.background = '#10b98105'
                      }}
                      onMouseLeave={(e) => {
                        if (!cell) e.currentTarget.style.background = 'transparent'
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