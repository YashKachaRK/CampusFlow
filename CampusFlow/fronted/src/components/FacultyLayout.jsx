import { Outlet, useLocation } from 'react-router-dom'
import FacultySidebar from './FacultySidebar'

const pageMeta = {
  '/faculty/dashboard': { title: 'Faculty Overview', subtitle: 'Manage your classes and students' },
  '/faculty/students':  { title: 'Student Management', subtitle: 'Add, edit, or remove students' },
  '/faculty/notices':   { title: 'Manage Notices', subtitle: 'Post class announcements' },
  '/faculty/events':    { title: 'Manage Events', subtitle: 'Schedule exams and workshops' },
  '/faculty/timetable': { title: 'Time Table Management', subtitle: 'Organize your weekly schedule' },
}

export default function FacultyLayout() {
  const { pathname } = useLocation()
  const meta = pageMeta[pathname] || { title: 'Faculty Portal', subtitle: '' }
  const now = new Date()
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="app-layout">
      <FacultySidebar />

      <div className="main-content">
        {/* Top Bar */}
        <div className="topbar" style={{ borderBottom: '1px solid #10b98120' }}>
          <div>
            <div className="topbar-title" style={{ color: '#10b981' }}>{meta.title}</div>
            <div className="topbar-subtitle">{meta.subtitle}</div>
          </div>
          <div className="topbar-right">
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>👨‍🏫 FACULTY MODE</span>
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
