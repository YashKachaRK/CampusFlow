import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AdminLayout from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Schedule from './pages/Schedule'
import Notices from './pages/Notices'
import Profile from './pages/Profile'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminNotices from './pages/admin/AdminNotices'
import AdminEvents from './pages/admin/AdminEvents'
import AdminUsers from './pages/admin/AdminUsers'

export default function App() {
  return (
    <Routes>
      {/* Public pages — no sidebar */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Student pages — with standard layout */}
      <Route element={<ProtectedRoute allowedRole="student"><Layout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* Admin pages — with admin layout */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="notices" element={<AdminNotices />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  )
}