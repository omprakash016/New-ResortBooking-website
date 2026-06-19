import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/Protectedroute'

import Home           from './pages/Home'
import Hotels         from './pages/Hotels'
import Login          from './pages/Login'
import Register       from './pages/Register'
import MyBookings     from './pages/MyBookings'
import OwnerDashboard from './pages/OwnerDashboard'
import NotFound       from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              borderRadius: '8px',
              fontSize: '0.9rem',
            },
            success: { iconTheme: { primary: '#c9a84c', secondary: '#fff' } },
          }}
        />
        <Navbar />
        <main className="page-wrapper">
          <Routes>
            <Route path="/"         element={<Home />} />
            <Route path="/hotels"   element={<Hotels />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* User-only routes */}
            <Route element={<ProtectedRoute requiredRole="user" />}>
              <Route path="/my-bookings" element={<MyBookings />} />
            </Route>

            {/* Owner-only routes */}
            <Route element={<ProtectedRoute requiredRole="owner" />}>
              <Route path="/dashboard" element={<OwnerDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}