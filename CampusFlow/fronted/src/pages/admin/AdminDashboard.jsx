import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const stats = [
    { label: 'Total Students', value: '1,240', icon: '👥', color: '#3b82f6', link: '/admin/users' },
    { label: 'Active Notices', value: '12',    icon: '📢', color: '#7c3aed', link: '/admin/notices' },
    { label: 'Upcoming Events', value: '8',     icon: '📅', color: '#10b981', link: '/admin/events' },
    { label: 'Pending Requests', value: '4',    icon: '⏳', color: '#f59e0b', link: '#' },
  ]

  return (
    <div>
      <div className="summary-grid">
        {stats.map((s, i) => (
          <div key={s.label} className="summary-card animate-fade-in" style={{ animationDelay: `${i * 0.1}s`, cursor: 'pointer' }} onClick={() => navigate(s.link)}>
            <div className="summary-icon" style={{ background: `${s.color}20`, color: s.color }}>{s.icon}</div>
            <div>
              <div className="summary-value" style={{ color: s.color }}>{s.value}</div>
              <div className="summary-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        <div className="card animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="section-header">
            <span className="section-title">🛡️ Recent Admin Actions</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { action: 'Posted Notice', target: 'Exam Timetable', time: '10 mins ago' },
              { action: 'Added Event', target: 'Spring Fest 2026', time: '1 hour ago' },
              { action: 'Added Student', target: 'Yash Kacha', time: '2 hours ago' },
              { action: 'Deleted Notice', target: 'Library Maintenance', time: 'Yesterday' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>{item.action}:</span>
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.target}</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <div className="section-header">
            <span className="section-title">📈 Semester Progress</span>
          </div>
          <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '1rem 0' }}>
            {[40, 65, 30, 85, 55, 90].map((h, i) => (
              <div key={i} style={{ width: '12%', height: `${h}%`, background: 'linear-gradient(to top, #ef4444, #f59e0b)', borderRadius: '4px 4px 0 0', opacity: 0.8 }} />
            ))}
          </div>
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Usage Activity (Last 6 Months)</div>
        </div>
      </div>
    </div>
  )
}
