import { useState, useEffect } from 'react'
import { bookingAPI } from '../services/api'
import toast from 'react-hot-toast'
import { CalendarCheck, MapPin, Trash2, Clock } from 'lucide-react'
import './MyBookings.css'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [cancelling, setCancelling] = useState(null)

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const { data } = await bookingAPI.myBookings()
      setBookings(data)
    } catch (err) {
      console.error('Fetch bookings error:', err)
    } finally {
      setLoading(false)
    }
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchBookings() }, [])

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return
    setCancelling(id)
    try {
      await bookingAPI.cancel(id)
      toast.success('Booking cancelled')
      fetchBookings()
    } catch (err) {
      toast.error(err.message || 'Cancel failed')
    } finally { setCancelling(null) }
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'

  const nights = (b) => {
    if (!b.checkIn || !b.checkOut) return 0
    return Math.round((new Date(b.checkOut) - new Date(b.checkIn)) / 86400000)
  }

  const placeholder = `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80`

  const active    = bookings.filter(b => b.status === 'booked')
  const cancelled = bookings.filter(b => b.status === 'cancelled')

  return (
    <div className="mybookings-page">
      <div className="mybookings-page__header">
        <div className="container">
          <div className="section-eyebrow">Your Account</div>
          <h1 className="mybookings-page__title">My Bookings</h1>
          <p className="mybookings-page__sub">
            {loading ? 'Loading…' : `${bookings.length} total booking${bookings.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="container mybookings-page__body">
        {loading ? (
          <div className="loading-screen"><div className="spinner" /><span>Loading bookings…</span></div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📅</div>
            <h3>No bookings yet</h3>
            <p>Browse our hotels and make your first reservation.</p>
            <a href="/hotels" className="btn btn-primary" style={{marginTop:20}}>Explore Hotels</a>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div className="mybookings-section">
                <h2 className="mybookings-section__title">
                  <CalendarCheck size={20} /> Active Bookings <span className="badge badge-green">{active.length}</span>
                </h2>
                <div className="mybookings-grid">
                  {active.map(b => (
                    <div key={b._id} className="booking-card booking-card--active">
                      <div className="booking-card__img-wrap">
                        <img
                          src={b.hotel?.image || placeholder}
                          alt={b.hotel?.title || 'Hotel'}
                          onError={e => { e.target.src = placeholder }}
                        />
                      </div>
                      <div className="booking-card__body">
                        <div className="booking-card__top">
                          <div>
                            <h3 className="booking-card__hotel-name">{b.hotel?.title || 'Hotel'}</h3>
                            <span className="badge badge-green">Booked</span>
                          </div>
                          <div className="booking-card__price">
                            <span>₹{Number(b.totalPrice).toLocaleString()}</span>
                            <small>{nights(b)} night{nights(b) !== 1 ? 's' : ''}</small>
                          </div>
                        </div>

                        <div className="booking-card__dates">
                          <div className="booking-card__date">
                            <span className="booking-card__date-label">Check-In</span>
                            <span className="booking-card__date-val">{fmt(b.checkIn)}</span>
                          </div>
                          <div className="booking-card__date-arrow">→</div>
                          <div className="booking-card__date">
                            <span className="booking-card__date-label">Check-Out</span>
                            <span className="booking-card__date-val">{fmt(b.checkOut)}</span>
                          </div>
                        </div>

                        {b.hotel?.location && (
                          <div className="booking-card__location">
                            <MapPin size={13} /> {b.hotel.location}
                          </div>
                        )}

                        <div className="booking-card__meta">
                          <span className="booking-card__booked-on">
                            <Clock size={12} /> Booked on {fmt(b.createdAt)}
                          </span>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancel(b._id)}
                            disabled={cancelling === b._id}
                          >
                            <Trash2 size={14} />
                            {cancelling === b._id ? 'Cancelling…' : 'Cancel'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {cancelled.length > 0 && (
              <div className="mybookings-section">
                <h2 className="mybookings-section__title">
                  Cancelled Bookings <span className="badge badge-red">{cancelled.length}</span>
                </h2>
                <div className="mybookings-grid">
                  {cancelled.map(b => (
                    <div key={b._id} className="booking-card booking-card--cancelled">
                      <div className="booking-card__body">
                        <div className="booking-card__top">
                          <div>
                            <h3 className="booking-card__hotel-name">{b.hotel?.title || 'Hotel'}</h3>
                            <span className="badge badge-red">Cancelled</span>
                          </div>
                          <div className="booking-card__price muted">
                            <span>₹{Number(b.totalPrice).toLocaleString()}</span>
                            <small>{nights(b)} night{nights(b) !== 1 ? 's' : ''}</small>
                          </div>
                        </div>
                        <div className="booking-card__dates">
                          <div className="booking-card__date">
                            <span className="booking-card__date-label">Check-In</span>
                            <span className="booking-card__date-val">{fmt(b.checkIn)}</span>
                          </div>
                          <div className="booking-card__date-arrow">→</div>
                          <div className="booking-card__date">
                            <span className="booking-card__date-label">Check-Out</span>
                            <span className="booking-card__date-val">{fmt(b.checkOut)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}