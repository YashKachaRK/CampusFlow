import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { useLocation } from 'react-router-dom'

const pageMeta = {
  '/admin/dashboard': { title: 'Admin Overview', subtitle: 'Global campus management' },
  '/admin/notices':   { title: 'Manage Notices', subtitle: 'Post and remove official announcements' },
  '/admin/events':    { title: 'Manage Events',  subtitle: 'Organize exams, holidays, and workshops' },
  '/admin/users':     { title: 'Manage Students', subtitle: 'Add and monitor student accounts' },
}

export default function AdminLayout() {
  const { pathname } = useLocation()
  const meta = pageMeta[pathname] || { title: 'Admin Panel', subtitle: '' }
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="app-layout">
      <AdminSidebar />

      <div className="main-content">
        {/* Top Bar */}
        <div className="topbar" style={{ borderBottom: '1px solid #ef444420' }}>
          <div>
            <div className="topbar-title" style={{ color: '#f87171' }}>{meta.title}</div>
            <div className="topbar-subtitle">{meta.subtitle}</div>
          </div>
          <div className="topbar-right">
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>🛡️ ADMIN MODE</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{dateStr}</span>
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
