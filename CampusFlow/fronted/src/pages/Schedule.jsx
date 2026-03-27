import { useState } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

// Convert our mock data into strict FullCalendar event objects
const EVENT_COLORS = {
  Workshop: '#7c3aed',
  Exam: '#ef4444',
  Academic: '#3b82f6',
  Event: '#14b8a6',
  Personal: '#f59e0b',
}

// FullCalendar uses ISO8601 strings
const SAMPLE_EVENTS = [
  { id: '1', title: 'Workshop: React Basics', start: '2026-03-28T10:00:00', end: '2026-03-28T12:00:00', color: EVENT_COLORS.Workshop, extendedProps: { type: 'Workshop', location: 'Lab 3B', isOfficial: true } },
  { id: '2', title: 'Mid-Semester Exam', start: '2026-03-30T09:00:00', end: '2026-03-30T12:00:00', color: EVENT_COLORS.Exam, extendedProps: { type: 'Exam', location: 'Hall A', isOfficial: true } },
  { id: '3', title: 'Project Submission', start: '2026-04-02T17:00:00', color: EVENT_COLORS.Academic, allDay: false, extendedProps: { type: 'Academic', location: 'Online', isOfficial: true } },
  { id: '4', title: 'Sports Day', start: '2026-04-05', allDay: true, color: EVENT_COLORS.Event, extendedProps: { type: 'Event', location: 'Ground', isOfficial: true } },
]

// To build a weekly schedule, we can add recurring events 
const WEEKLY_CLASSES = [
  { id: 'c1', title: 'Database Systems', daysOfWeek: [1, 4], startTime: '10:00:00', endTime: '11:00:00', color: '#8b5cf6', extendedProps: { isOfficial: true } },
  { id: 'c2', title: 'Operating Systems', daysOfWeek: [2], startTime: '11:00:00', endTime: '12:30:00', color: '#6366f1', extendedProps: { isOfficial: true } },
  { id: 'c3', title: 'Software Eng', daysOfWeek: [3], startTime: '14:00:00', endTime: '15:30:00', color: '#14b8a6', extendedProps: { isOfficial: true } },
  { id: 'c4', title: 'Project Mentoring', daysOfWeek: [5], startTime: '13:00:00', endTime: '14:00:00', color: '#f59e0b', extendedProps: { isOfficial: true } },
]

export default function Schedule() {
  const [events, setEvents] = useState([...SAMPLE_EVENTS, ...WEEKLY_CLASSES])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', time: '', location: '', type: 'Personal' })

  const handleDateClick = (arg) => {
    // Fill in date and open form when user clicks empty day
    setForm({ ...form, date: arg.dateStr.split('T')[0] })
    setShowForm(true)
  }

  const addEvent = () => {
    if (!form.title.trim() || !form.date) return
    const startObj = form.time ? `${form.date}T${form.time}` : form.date
    const newEv = {
      id: Date.now().toString(),
      title: form.title,
      start: startObj,
      allDay: !form.time,
      color: EVENT_COLORS[form.type] || EVENT_COLORS.Personal,
      extendedProps: { type: form.type, location: form.location, isOfficial: false }
    }
    setEvents(prev => [...prev, newEv])
    setForm({ title: '', date: '', time: '', location: '', type: 'Personal' })
    setShowForm(false)
  }

  const handleEventClick = (info) => {
    if (window.confirm(`Event: ${info.event.title}\nDo you want to delete this event?`)) {
      if (!info.event.extendedProps.isOfficial) {
        setEvents(prev => prev.filter(e => e.id !== info.event.id))
      } else {
        alert("Cannot delete official academic schedules. Contact administration.")
      }
    }
  }

  return (
    <div className="animate-fade-in pb-10">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Calendar & Schedule</h2>
        <button id="add-personal-event" className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '＋ Add Personal Event'}
        </button>
      </div>

      {showForm && (
        <div className="form-panel animate-fade-in" style={{ borderColor: 'var(--accent)', marginBottom: '1.5rem' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.9rem', color: 'var(--accent)' }}>📔 New Personal Event</div>
          <div className="form-row">
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label">Event Title *</label>
              <input className="form-input" placeholder="e.g. Study Group"
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
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
          <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={addEvent}>✔ Save Event</button>
        </div>
      )}

      {/* Calendar Wrapper */}
      <div style={{ background: 'var(--bg-card)', padding: '1rem', borderRadius: 16, border: '1px solid var(--border)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
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
          background: rgba(124, 58, 237, 0.1) !important;
          color: var(--accent) !important;
          border-color: rgba(124, 58, 237, 0.3) !important;
        }
        .fc-button-primary:disabled { 
          opacity: 0.5; 
        }
        .fc-button-active {
          background: var(--accent) !important;
          color: white !important;
          border-color: var(--accent) !important;
        }
      `}</style>
    </div>
  )
}
