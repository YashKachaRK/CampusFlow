import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const EVENT_COLORS = {
  Workshop: '#7c3aed',
  Exam: '#ef4444',
  Academic: '#3b82f6',
  Event: '#14b8a6',
  Personal: '#f59e0b',
}

const API_URL = 'http://localhost:5000/api/events';

export default function Schedule() {
  const [events, setEvents] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', date: '', time: '', location: '', type: 'Personal' })

  // 1. Fetch all events (Faculty + Personal) on component mount
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

  const handleDateClick = (arg) => {
    // Fill in date and open form when user clicks empty day
    setForm({ ...form, date: arg.dateStr.split('T')[0] })
    setShowForm(true)
  }

  // 2. Add a new Personal Event
  const addEvent = async () => {
    if (!form.title.trim() || !form.date) return
    const startObj = form.time ? `${form.date}T${form.time}` : form.date
    
    const newEvPayload = {
      title: form.title,
      start: startObj,
      allDay: !form.time,
      color: EVENT_COLORS[form.type] || EVENT_COLORS.Personal,
      extendedProps: { 
        type: form.type, 
        location: form.location, 
        isOfficial: false // Explicitly mark student events as unofficial
      }
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvPayload)
      });
      
      const savedEvent = await response.json();
      setEvents(prev => [...prev, savedEvent]);
      
      setForm({ title: '', date: '', time: '', location: '', type: 'Personal' })
      setShowForm(false)
    } catch (error) {
      console.error("Error saving event:", error);
    }
  }

  // 3. Delete an event (Only if it is a personal event)
  const handleEventClick = async (info) => {
    // We assume an event is official unless explicitly marked isOfficial: false
    const isOfficial = info.event.extendedProps?.isOfficial !== false;

    if (isOfficial) {
      alert("Cannot delete official academic schedules. Contact administration.");
      return;
    }

    if (window.confirm(`Event: ${info.event.title}\nDo you want to delete this event?`)) {
      try {
        await fetch(`${API_URL}/${info.event.id}`, { method: 'DELETE' });
        setEvents(prev => prev.filter(e => e.id !== info.event.id));
      } catch (error) {
        console.error("Error deleting event:", error);
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
        <div className="form-panel animate-fade-in" style={{ borderColor: 'var(--accent)', marginBottom: '1.5rem', padding: '1rem', border: '1px solid', borderRadius: '8px' }}>
          <div style={{ fontWeight: 700, marginBottom: '0.9rem', color: 'var(--accent)' }}>📔 New Personal Event</div>
          
          <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 2 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Event Title *</label>
              <input className="form-input" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }} placeholder="e.g. Study Group"
                value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Type</label>
              <select className="form-select" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option>Personal</option>
                <option>Workshop</option>
                <option>Academic</option>
                <option>Event</option>
              </select>
            </div>
          </div>
          
          <div className="form-row" style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Date *</label>
              <input type="date" className="form-input" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }} value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Time</label>
              <input type="time" className="form-input" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }} value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Location</label>
              <input className="form-input" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border)' }} placeholder="e.g. Library"
                value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
            </div>
          </div>
          
          <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%', padding: '0.75rem', borderRadius: '8px', background: 'var(--accent)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' }} onClick={addEvent}>
            ✔ Save Event
          </button>
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