import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Tasks from './pages/Tasks'
import Schedule from './pages/Schedule'
import Notices from './pages/Notices'

export default function App() {
  return (
    <Routes>
      {/* Public pages — no sidebar */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* App pages — with sidebar layout */}
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/notices" element={<Notices />} />
      </Route>
    </Routes>
  )
}