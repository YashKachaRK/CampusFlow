import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/tasks',     icon: '✅', label: 'Tasks' },
  { to: '/schedule',  icon: '📅', label: 'Schedule' },
  { to: '/notices',   icon: '📢', label: 'Notices' },
]

export default function Sidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Clear any auth state here if needed
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
        <div className="user-chip">
          <div className="user-avatar">YK</div>
          <div>
            <div className="user-info-name">Yash Kacha</div>
            <div className="user-info-role">Student · SE</div>
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

