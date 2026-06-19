import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ requiredRole }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />

  if (requiredRole && user.role !== requiredRole) {
    // Redirect owners to dashboard, users to hotels
    return <Navigate to={user.role === 'owner' ? '/dashboard' : '/hotels'} replace />
  }

  return <Outlet />
}