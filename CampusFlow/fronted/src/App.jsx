import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Schedule from './pages/Schedule'
import Notices from './pages/Notices'
import Profile from './pages/Profile'



// Faculty Pages
import FacultyLayout from './components/FacultyLayout'
import FacultyDashboard from './pages/faculty/FacultyDashboard'
import FacultyStudents from './pages/faculty/FacultyStudents'
import FacultyNotices from './pages/faculty/FacultyNotices'
import FacultyEvents from './pages/faculty/FacultyEvents'
import FacultyTimetable from './pages/faculty/FacultyTimetable'

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

      {/* Faculty pages — with faculty layout */}
      <Route path="/faculty" element={<ProtectedRoute allowedRole="faculty"><FacultyLayout /></ProtectedRoute>}>
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="students" element={<FacultyStudents />} />
        <Route path="notices" element={<FacultyNotices />} />
        <Route path="events" element={<FacultyEvents />} />
        <Route path="timetable" element={<FacultyTimetable />} />
      </Route>
    </Routes>
  )
}