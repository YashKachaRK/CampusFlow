import { useState } from 'react'
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

const INITIAL_EVENTS = [
  { id: '1', title: 'Data Structures Mid-Term', start: '2026-04-10T10:00:00', end: '2026-04-10T12:00:00', color: EVENT_COLORS.Exam, extendedProps: { type: 'Exam', location: 'Hall B' } },
  { id: '2', title: 'React Workshop', start: '2026-04-15T14:00:00', end: '2026-04-15T16:00:00', color: EVENT_COLORS.Workshop, extendedProps: { type: 'Workshop', location: 'Lab 1' } },
]

export default function FacultyEvents() {
  const [events, setEvents] = useState(INITIAL_EVENTS)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', time: '', type: 'Exam', location: '' })

  const handleDateClick = (arg) => {
    setForm({ ...form, date: arg.dateStr.split('T')[0] })
    setShowForm(true)
  }

  const handleAdd = () => {
    if (!form.title || !form.date) return
    const startObj = form.time ? `${form.date}T${form.time}` : form.date
    const newEv = {
      id: Date.now().toString(),
      title: form.title,
      start: startObj,
      allDay: !form.time,
      color: EVENT_COLORS[form.type] || EVENT_COLORS.Lecture,
      extendedProps: { type: form.type, location: form.location }
    }
    setEvents([...events, newEv])
    setForm({ title: '', date: '', time: '', type: 'Exam', location: '' })
    setShowForm(false)
  }

  const handleEventClick = (info) => {
    if (window.confirm(`Event: ${info.event.title}\nDo you want to remove this event?`)) {
       setEvents(events.filter(e => e.id !== info.event.id))
    }
  }

  return (
    <div className="animate-fade-in pb-10">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, color: '#10b981' }}>Event Management</h2>
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
              <input className="form-input" placeholder="e.g. Final Exam" value={form.title} onChange={e => setForm({...form, title: e.target.value})} autoFocus />
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

      {/* Calendar Wrapper */}
      <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 16, border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
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
