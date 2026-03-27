import { useState, useEffect } from 'react'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM']

const API_URL = 'http://localhost:5000/api/timetable';

// Helper: Converts "13:00:00" from database to "01:00 PM" for the frontend grid
const convertTo12Hour = (time24h) => {
  let [hours, minutes] = time24h.split(':');
  hours = parseInt(hours, 10);
  const modifier = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, '0')}:${minutes} ${modifier}`;
}

export default function Timetable() {
  const [timetable, setTimetable] = useState({})

  // Fetch the latest timetable from the database when the component loads
  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      
      // Map the array of DB records into a dictionary object for the grid
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

  return (
    <div className="animate-fade-in pb-10">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>My Timetable</h2>
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 16, border: '1px solid var(--border)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>📚</span> Weekly Hourly Timetable
        </h3>
        
        {/* Weekly Timetable Grid (Student View - Read Only) */}
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
                          background: cell ? '#10b98108' : 'transparent',
                          transition: 'background 0.2s',
                          height: 70,
                          verticalAlign: 'top'
                        }}
                      >
                        {cell && (
                          <div style={{ padding: '0.5rem', border: '1px solid #10b98130', borderRadius: 6, background: 'var(--bg-card)', height: '100%', boxSizing: 'border-box', borderLeft: '3px solid #10b981' }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981', lineHeight: 1.2 }}>{cell.subject}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              📍 {cell.room}
                            </div>
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
    </div>
  )
}