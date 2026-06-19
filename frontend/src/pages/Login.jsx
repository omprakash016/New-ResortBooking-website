import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import './Auth.css'

export default function Login() {
  const { login, loading, user } = useAuth()
  const navigate = useNavigate()

  const [form,    setForm]    = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [error,   setError]   = useState('')

  // Already logged in
  if (user) {
    navigate(user.role === 'owner' ? '/dashboard' : '/hotels')
    return null
  }

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    const res = await login(form)
    if (res.ok) {
      toast.success('Welcome back!')
      navigate(user?.role === 'owner' ? '/dashboard' : '/hotels')
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__visual">
        <div className="auth-page__visual-overlay" />
        <div className="auth-page__visual-content">
          <div className="auth-page__brand">✦ LuxeStay</div>
          <h2 className="auth-page__visual-title">Welcome Back to Luxury</h2>
          <p className="auth-page__visual-sub">Sign in to manage your bookings, discover new destinations, and enjoy seamless travel experiences.</p>
        </div>
      </div>

      <div className="auth-page__form-section">
        <div className="auth-card">
          <div className="auth-card__header">
            <h1 className="auth-card__title">Sign In</h1>
            <p className="auth-card__sub">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-card__form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-input"
                placeholder="you@example.com"
                value={form.email} onChange={handleChange} required autoComplete="email" />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="auth-card__password-wrap">
                <input
                  type={showPwd ? 'text' : 'password'}
                  name="password" className="form-input"
                  placeholder="Your password"
                  value={form.password} onChange={handleChange} required autoComplete="current-password" />
                <button type="button" className="auth-card__pwd-toggle" onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="divider">or</div>

          <div className="auth-card__footer">
            <p>Don't have an account?&nbsp;<Link to="/register" className="auth-card__link">Create one</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}