import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const EVENT_COLORS = {
  Exam:     '#ef4444',
  Workshop: '#7c3aed',
  Lecture:  '#3b82f6',
  Meeting:  '#f59e0b',
}

const API_URL = 'http://localhost:5000/api/events'; 

export default function FacultyEvents() {
  const [events, setEvents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null) // Tracks if we are creating or updating
  const [form, setForm] = useState({ title: '', date: '', time: '', type: 'Exam', location: '' })

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Triggered when clicking an empty date cell
  const handleDateClick = (arg) => {
    setEditingId(null)
    setForm({ title: '', date: arg.dateStr.split('T')[0], time: '', type: 'Exam', location: '' })
    setShowForm(true)
  }

  // Triggered when clicking an existing event
  const handleEventClick = (info) => {
    const ev = info.event;
    
    // Extract date and time strings properly
    const dateStr = ev.startStr.split('T')[0];
    let timeStr = '';
    if (!ev.allDay && ev.start) {
      const hours = ev.start.getHours().toString().padStart(2, '0');
      const mins = ev.start.getMinutes().toString().padStart(2, '0');
      timeStr = `${hours}:${mins}`;
    }

    setEditingId(ev.id);
    setForm({
      title: ev.title,
      date: dateStr,
      time: timeStr,
      type: ev.extendedProps?.type || 'Exam',
      location: ev.extendedProps?.location || ''
    });
    setShowForm(true);
  }

  // Handle Create AND Update
  const handleSave = async () => {
    if (!form.title || !form.date) return
    const startObj = form.time ? `${form.date}T${form.time}` : form.date
    
    const payload = {
      title: form.title,
      start: startObj,
      allDay: !form.time,
      color: EVENT_COLORS[form.type] || EVENT_COLORS.Lecture,
      extendedProps: { type: form.type, location: form.location }
    }

    try {
      if (editingId) {
        // UPDATE Existing
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const updatedEvent = await response.json();
        setEvents(events.map(e => e.id === editingId ? updatedEvent : e));
      } else {
        // CREATE New
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const savedEvent = await response.json();
        setEvents([...events, savedEvent]);
      }
      
      resetForm();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  }

  // Explicit Delete Function
  const handleDelete = async () => {
    if (!editingId) return;
    if (window.confirm(`Are you sure you want to delete "${form.title}"?`)) {
       try {
         await fetch(`${API_URL}/${editingId}`, { method: 'DELETE' });
         setEvents(events.filter(e => e.id !== editingId));
         resetForm();
       } catch (error) {
         console.error("Error deleting event:", error);
       }
    }
  }

  const resetForm = () => {
    setForm({ title: '', date: '', time: '', type: 'Exam', location: '' })
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <div className="animate-fade-in pb-10">
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, color: '#10b981' }}>Event Management</h2>
        <button className="btn" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => {
          if (showForm) {
            resetForm();
          } else {
            setEditingId(null);
            setForm({ title: '', date: '', time: '', type: 'Exam', location: '' });
            setShowForm(true);
          }
        }}>
          {showForm ? '✕ Cancel' : '＋ Schedule Event'}
        </button>
      </div>

      {/* Form Panel */}
      {showForm && (
        <div className="form-panel" style={{ borderColor: '#10b981', marginBottom: '1.5rem', padding: '1.5rem', border: '1px solid #10b981', borderRadius: '12px', background: 'var(--bg-card)' }}>
          <div style={{ fontWeight: 700, marginBottom: '1rem', color: '#10b981', fontSize: '1.1rem' }}>
            📅 {editingId ? 'Edit Event' : 'New Event / Schedule'}
          </div>
          
          <div className="form-row" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Title *</label>
              <input className="form-input" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)' }} placeholder="e.g. Final Exam" value={form.title} onChange={e => setForm({...form, title: e.target.value})} autoFocus />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Type</label>
              <select className="form-select" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)' }} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
                <option>Exam</option>
                <option>Workshop</option>
                <option>Lecture</option>
                <option>Meeting</option>
              </select>
            </div>
          </div>

          <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Date *</label>
              <input type="date" className="form-input" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)' }} value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Time</label>
              <input type="time" className="form-input" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)' }} value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Location</label>
              <input className="form-input" style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border)' }} placeholder="e.g. Ground" value={form.location} onChange={e => setForm({...form, location: e.target.value})} />
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn" style={{ flex: 2, background: '#10b981', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }} onClick={handleSave}>
              ✔ {editingId ? 'Save Changes' : 'Publish Schedule'}
            </button>
            {editingId && (
              <button className="btn" style={{ flex: 1, background: '#ef4444', color: '#fff', border: 'none', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }} onClick={handleDelete}>
                🗑 Delete
              </button>
            )}
          </div>
        </div>
      )}

      {/* Calendar Wrapper */}
      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 16, border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <FullCalendar
          plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek'
          }}
          events={events}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          height="700px"
          nowIndicator={true}
          slotMinTime="08:00:00"
          slotMaxTime="20:00:00"
          weekends={false}
        />
      </div>

      {/* Calendar Custom Styles */}
      <style>{`
        .fc-theme-standard .fc-scrollgrid,
        .fc-theme-standard td, .fc-theme-standard th { 
          border-color: var(--border) !important; 
        }
        .fc-col-header-cell-cushion, .fc-daygrid-day-number { 
          color: var(--text-primary) !important; 
          text-decoration: none !important; 
          padding: 8px !important;
        }
        .fc-event { 
          cursor: pointer; 
          border: none !important; 
          padding: 3px 6px; 
          border-radius: 6px; 
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .fc-event:hover {
          filter: brightness(1.1);
        }
        .fc-toolbar-title { 
          font-weight: 800; 
          color: var(--text-primary); 
          font-size: 1.5rem !important;
        }
        .fc-button-primary { 
          background: var(--bg-secondary) !important; 
          border: 1px solid var(--border) !important; 
          color: var(--text-primary) !important;
          text-transform: capitalize; 
          font-weight: 600 !important;
          border-radius: 8px !important;
          transition: all 0.2s;
        }
        .fc-button-primary:hover {
          background: rgba(16, 185, 129, 0.1) !important;
          color: #10b981 !important;
          border-color: rgba(16, 185, 129, 0.3) !important;
        }
        .fc-button-primary:disabled { 
          opacity: 0.5; 
        }
        .fc-button-active {
          background: #10b981 !important;
          color: white !important;
          border-color: #10b981 !important;
        }
      `}</style>
    </div>
  )
}