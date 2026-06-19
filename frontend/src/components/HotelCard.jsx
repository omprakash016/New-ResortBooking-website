import { useState } from 'react'
import { MapPin, Phone } from 'lucide-react'
import BookingModal from './BookingModal'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import './HotelCard.css'

export default function HotelCard({ hotel, onBookingSuccess }) {
  const { user, isUser } = useAuth()
  const navigate = useNavigate()
  const [showBooking, setShowBooking] = useState(false)

  const handleBook = () => {
    if (!user)    { navigate('/login');  return }
    if (!isUser)  { return }
    setShowBooking(true)
  }

  const placeholder = `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80`

  return (
    <>
      <article className="hotel-card">
        <div className="hotel-card__img-wrap">
          <img
            src={hotel.image || placeholder}
            alt={hotel.title}
            className="hotel-card__img"
            onError={e => { e.target.src = placeholder }}
          />
          <div className="hotel-card__overlay" />
          {hotel.status && (
            <span className={`hotel-card__status-badge ${hotel.status === 'available' ? 'available' : 'busy'}`}>
              {hotel.status}
            </span>
          )}
          <div className="hotel-card__price-badge">
            ₹{Number(hotel.price).toLocaleString()}<span>/night</span>
          </div>
        </div>

        <div className="hotel-card__body">
          <h3 className="hotel-card__title">{hotel.title}</h3>

          <div className="hotel-card__meta">
            <span className="hotel-card__meta-item">
              <MapPin size={13} />
              {hotel.location}
            </span>
            <span className="hotel-card__meta-item">
              <Phone size={13} />
              {hotel.contact}
            </span>
          </div>

          <p className="hotel-card__desc">{hotel.description}</p>

          <div className="hotel-card__owner">
            <div className="hotel-card__owner-avatar">
              {hotel.owner?.name?.charAt(0).toUpperCase() || 'O'}
            </div>
            <div>
              <span className="hotel-card__owner-label">Listed by</span>
              <span className="hotel-card__owner-name">{hotel.owner?.name || 'Owner'}</span>
            </div>
          </div>

          <div className="hotel-card__footer">
            <div className="hotel-card__price-info">
              <span className="hotel-card__price-num">₹{Number(hotel.price).toLocaleString()}</span>
              <span className="hotel-card__price-unit">per night</span>
            </div>
            {isUser ? (
              <button className="btn btn-primary btn-sm" onClick={handleBook}>
                Book Now
              </button>
            ) : !user ? (
              <button className="btn btn-outline btn-sm" onClick={() => navigate('/login')}>
                Sign in to Book
              </button>
            ) : (
              <span className="hotel-card__owner-tag">Owner Listing</span>
            )}
          </div>
        </div>
      </article>

      {showBooking && (
        <BookingModal
          hotel={hotel}
          onClose={() => setShowBooking(false)}
          onSuccess={() => { setShowBooking(false); onBookingSuccess?.() }}
        />
      )}
    </>
  )
}