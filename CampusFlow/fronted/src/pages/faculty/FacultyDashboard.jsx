import React from 'react'

export default function FacultyDashboard() {
  const stats = [
    { title: 'Total Students', value: '142', icon: '👥', color: '#3b82f6' },
    { title: 'Active Classes', value: '6', icon: '🏫', color: '#10b981' },
    { title: 'New Notices', value: '3', icon: '📢', color: '#f59e0b' },
    { title: 'Upcoming Events', value: '2', icon: '📅', color: '#8b5cf6' },
  ]

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {stats.map((s, i) => (
           <div key={i} className="stat-card" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `${s.color}20`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.title}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{s.value}</div>
              </div>
           </div>
        ))}
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: 12, border: '1px solid var(--border)' }}>
        <h3 style={{ marginBottom: '1rem', color: '#10b981' }}>Welcome to the Faculty Portal</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          From here you can manage all your students, create new notices for your classes, schedule events, and manage your weekly timetable. Use the sidebar to navigate to different sections.
        </p>
      </div>
    </div>
  )
}
