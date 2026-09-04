import { Navigate, Outlet } from 'react-router-dom'

/**
 * Wraps routes that require authentication.
 * Reads auth token from localStorage. If missing, redirects to /login. 
 */
function ProtectedRoute() {
  const token = localStorage.getItem('token') 

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
