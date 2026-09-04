import { Navigate, Outlet } from 'react-router-dom'

/**
 * Wraps routes that should only be accessible when NOT logged in (e.g. login, register).
 * If a token exists, redirects to /dashboard.
 */
function PublicOnlyRoute() {
  const token = localStorage.getItem('token')

  if (token) {
    return <Navigate to="/dashboard" replace/>
  }

  return <Outlet/> 
}

export default PublicOnlyRoute
