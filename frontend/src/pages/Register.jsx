import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, ArrowRight, User, Hotel, Mail, Lock } from 'lucide-react'
import './Auth.css'

export default function Register() {
  const { register, loading, user } = useAuth()
  const navigate = useNavigate()

  const [form,    setForm]    = useState({ name: '', email: '', password: '', role: 'user' })
  const [showPwd, setShowPwd] = useState(false)
  const [error,   setError]   = useState('')

  if (user) {
    navigate(user.role === 'owner' ? '/dashboard' : '/hotels')
    return null
  }

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))
  const setRole = (role) => setForm(p => ({ ...p, role }))

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    const res = await register(form)
    if (res.ok) {
      toast.success('Account created! Welcome to LuxeStay 🎉')
      navigate(form.role === 'owner' ? '/dashboard' : '/hotels')
    } else {
      setError(res.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-page__visual auth-page__visual--register">
        <div className="auth-page__visual-overlay" />
        <div className="auth-page__visual-content">
          <div className="auth-page__brand">✦ LuxeStay</div>
          <h2 className="auth-page__visual-title">Join LuxeStay Today</h2>
          <p className="auth-page__visual-sub">Whether you're a traveller seeking the perfect stay or an owner ready to showcase your property — we've got you.</p>
          <div className="auth-page__perks">
            <div className="auth-page__perk">✦ Instant booking confirmation</div>
            <div className="auth-page__perk">✦ Verified hotel listings</div>
            <div className="auth-page__perk">✦ Secure JWT authentication</div>
          </div>
        </div>
      </div>

      <div className="auth-page__form-section">
        <div className="auth-card auth-card--wide">
          <div className="auth-card__header">
            <h1 className="auth-card__title">Create Account</h1>
            <p className="auth-card__sub">Fill in your details to get started</p>
          </div>

          {/* Role Selector */}
          <div className="auth-role-picker">
            <button
              type="button"
              className={`auth-role-btn ${form.role === 'user' ? 'active' : ''}`}
              onClick={() => setRole('user')}
            >
              <User size={20} />
              <span>I'm a Guest</span>
              <small>Book hotels &amp; manage trips</small>
            </button>
            <button
              type="button"
              className={`auth-role-btn ${form.role === 'owner' ? 'active' : ''}`}
              onClick={() => setRole('owner')}
            >
              <Hotel size={20} />
              <span>I'm an Owner</span>
              <small>List &amp; manage properties</small>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-card__form">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <User size={18} className="form-icon" />
              <div className="form-input-wrap">
                 <br />
                <input type="text" name="name" className="form-input"
                  placeholder="John Smith"
                  value={form.name} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <Mail size={18} className="form-icon" />
              <div className="form-input-wrap">
            
                <input type="email" name="email" className="form-input"
                  placeholder="you@example.com"
                  value={form.email} onChange={handleChange} required  />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
             <Lock size={18} className="form-icon" />
              <div className="auth-card__password-wrap">
                <div className="form-input-wrap">
                  <input
                    type={showPwd ? 'text' : 'password'}
                    name="password" className="form-input"
                    placeholder="Min. 6 characters"
                    value={form.password} onChange={handleChange} required />
                </div>
                <button type="button" className="auth-card__pwd-toggle" onClick={() => setShowPwd(v => !v)}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? 'Creating account…' : `Create ${form.role === 'owner' ? 'Owner' : 'Guest'} Account`} <ArrowRight size={18} />
            </button>
          </form>

          <div className="divider">or</div>

          <div className="auth-card__footer">
            <p>Already have an account?&nbsp;<Link to="/login" className="auth-card__link">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}