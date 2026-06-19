import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Menu, X, LogOut,  LayoutDashboard, CalendarCheck } from 'lucide-react'
import './Navbar.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate  = useNavigate()
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setOpen(false); setDropOpen(false) }, [location])

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const isHome = location.pathname === '/'

  return (
    <header className={`navbar ${scrolled || !isHome ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Brand */}
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo-icon">✦</span>
          <span className="navbar__logo-text">LuxeStay</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar__links">
          <Link to="/"       className={`navbar__link ${location.pathname === '/'       ? 'active' : ''}`}>Home</Link>
          <Link to="/hotels" className={`navbar__link ${location.pathname === '/hotels' ? 'active' : ''}`}>Hotels</Link>
          {user?.role === 'user'  && <Link to="/my-bookings" className={`navbar__link ${location.pathname === '/my-bookings' ? 'active' : ''}`}>My Bookings</Link>}
          {user?.role === 'owner' && <Link to="/dashboard"   className={`navbar__link ${location.pathname === '/dashboard'   ? 'active' : ''}`}>Dashboard</Link>}
        </nav>

        {/* Desktop Auth */}
        <div className="navbar__actions">
          {!user ? (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          ) : (
            <div className="navbar__user" onClick={() => setDropOpen(!dropOpen)}>
              <div className="navbar__avatar">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="navbar__user-info">
                <span className="navbar__user-name">{user.name}</span>
                <span className="navbar__user-role">{user.role}</span>
              </div>
              {dropOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <p className="navbar__dropdown-name">{user.name}</p>
                    <p className="navbar__dropdown-email">{user.email}</p>
                  </div>
                  <div className="navbar__dropdown-divider" />
                  {user.role === 'user'  && (
                    <Link to="/my-bookings" className="navbar__dropdown-item">
                      <CalendarCheck size={15} /> My Bookings
                    </Link>
                  )}
                  {user.role === 'owner' && (
                    <Link to="/dashboard" className="navbar__dropdown-item">
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                  )}
                  <button onClick={handleLogout} className="navbar__dropdown-item navbar__dropdown-item--danger">
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button className="navbar__hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="navbar__mobile">
          <Link to="/"       className="navbar__mobile-link">Home</Link>
          <Link to="/hotels" className="navbar__mobile-link">Hotels</Link>
          {user?.role === 'user'  && <Link to="/my-bookings" className="navbar__mobile-link">My Bookings</Link>}
          {user?.role === 'owner' && <Link to="/dashboard"   className="navbar__mobile-link">Dashboard</Link>}
          <div className="navbar__mobile-divider" />
          {!user ? (
            <>
              <Link to="/login"    className="btn btn-ghost btn-full">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-full">Get Started</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="btn btn-danger btn-full">
              <LogOut size={16} /> Sign Out
            </button>
          )}
        </div>
      )}
    </header>
  )
}