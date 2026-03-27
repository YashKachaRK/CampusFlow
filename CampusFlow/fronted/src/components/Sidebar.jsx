import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/tasks',     icon: '✅', label: 'Tasks' },
  { to: '/schedule',  icon: '📅', label: 'Events Schedule' },
  { to: '/timetable', icon: '🕰️', label: 'Timetable' },
  { to: '/notices',   icon: '📢', label: 'Notices' },
  { to: '/profile',   icon: '👤', label: 'Profile' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('campusflow_user')) || { name: 'Yash Kacha', role: 'Student' }

  const handleLogout = () => {
    localStorage.removeItem('campusflow_user')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🎓</div>
        <span className="sidebar-logo-text">CampusFlow</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '0 0.5rem', marginBottom: '0.4rem' }}>
          Main Menu
        </div>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            id={`nav-${item.label.toLowerCase()}`}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div 
          className="user-chip" 
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer', transition: 'background 0.2s', padding: '0.5rem', borderRadius: 8 }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <div className="user-avatar">{user.name ? user.name.split(' ').map(n=>n[0]).join('') : 'U'}</div>
          <div>
            <div className="user-info-name">{user.name}</div>
            <div className="user-info-role">{user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''} · CampusFlow</div>
          </div>
        </div>

        {/* Logout */}
        <button
          id="logout-btn"
          onClick={handleLogout}
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

