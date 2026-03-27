import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useLocation } from 'react-router-dom'

const pageMeta = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Welcome back! Here\'s your overview' },
  '/tasks':     { title: 'My Tasks',  subtitle: 'Manage and track your assignments' },
  '/schedule':  { title: 'Schedule',  subtitle: 'View and plan upcoming events' },
  '/notices':   { title: 'Notices',   subtitle: 'Stay updated with campus announcements' },
}

export default function Layout() {
  const { pathname } = useLocation()
  const meta = pageMeta[pathname] || { title: 'CampusFlow', subtitle: '' }
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-content">
        {/* Top Bar */}
        <div className="topbar">
          <div>
            <div className="topbar-title">{meta.title}</div>
            <div className="topbar-subtitle">{meta.subtitle}</div>
          </div>
          <div className="topbar-right">
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📅 {dateStr}</span>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--green)',
              boxShadow: '0 0 6px #22c55e'
            }} />
          </div>
        </div>

        {/* Page Content */}
        <div className="page-body">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
