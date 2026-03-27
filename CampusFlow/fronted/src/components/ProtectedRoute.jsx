import { Navigate } from 'react-router-dom'

/**
 * ProtectedRoute component
 * Checks if a user is logged in via localStorage.
 * If not, redirects to the login page.
 */
export default function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem('campusflow_user'))

  if (!user) {
    // Not logged in -> Redirect to login
    return <Navigate to="/login" replace />
  }

  if (allowedRole && user.role !== allowedRole) {
    // Logged in but wrong role -> Redirect to their respective dashboard
    const fallback = user.role === 'admin' ? '/admin/dashboard' : '/dashboard'
    return <Navigate to={fallback} replace />
  }

  return children
}
