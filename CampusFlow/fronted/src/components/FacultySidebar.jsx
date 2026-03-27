import { NavLink, useNavigate } from 'react-router-dom'

const facultyNavItems = [
  { to: '/faculty/dashboard', icon: '📊', label: 'Faculty Dashboard' },
  { to: '/faculty/students',  icon: '👥', label: 'Manage Students' },
  { to: '/faculty/notices',   icon: '📢', label: 'Manage Notices' },
  { to: '/faculty/events',    icon: '📅', label: 'Manage Events' },
  { to: '/faculty/timetable', icon: '🕒', label: 'Time Table' },
]

export default function FacultySidebar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('campusflow_user')) || { name: 'Faculty User', role: 'faculty' }

  const handleLogout = () => {
    localStorage.removeItem('campusflow_user')
    navigate('/login')
  }

  return (
    <aside className="sidebar" style={{ borderRight: '1px solid #10b98140' }}>
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon" style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}>👨‍🏫</div>
        <span className="sidebar-logo-text" style={{ background: 'linear-gradient(90deg, #34d399, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Faculty Portal
        </span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 0.5rem', marginBottom: '0.4rem' }}>
          Menu
        </div>
        {facultyNavItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            style={({ isActive }) => isActive ? { color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)' } : {}}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="user-chip" style={{ border: '1px solid rgba(16,185,129,0.2)' }}>
          <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #10b981, #3b82f6)' }}>
            {user.name.split(' ').map(n=>n[0]).join('').substring(0, 2)}
          </div>
          <div>
            <div className="user-info-name">{user.name}</div>
            <div className="user-info-role">CampusFlow Faculty</div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="btn-logout-sidebar"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.65rem',
            width: '100%', marginTop: '0.5rem',
            padding: '0.6rem 0.75rem', borderRadius: 10,
            background: 'transparent', border: '1px solid transparent',
            color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
            e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'
            e.currentTarget.style.color = '#ef4444'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.borderColor = 'transparent'
            e.currentTarget.style.color = 'var(--text-muted)'
          }}
        >
          <span style={{ fontSize: '1.1rem', width: 20, textAlign: 'center' }}>🚪</span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  )
}
