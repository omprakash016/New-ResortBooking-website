import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { hotelAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import HotelCard from '../components/HotelCard'
import { ArrowRight, Shield, Star, Clock, MapPin} from 'lucide-react'
import './Home.css'

export default function Home() {
  const { user } = useAuth()
  const [featured, setFeatured] = useState(null)

  useEffect(() => {
    hotelAPI.getAll()
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setFeatured(data.slice(0, 3))
        } else {
          setFeatured([])
        }
      })
      .catch(() => setFeatured([]))
  }, [])

  const stats = [
    { value: '500+', label: 'Hotels Listed' },
    { value: '12K+', label: 'Happy Guests' },
    { value: '48',   label: 'Cities Covered' },
    { value: '4.9★', label: 'Average Rating' },
  ]

  const features = [
    { icon: <Shield size={24} />, title: 'Secure Bookings',   desc: 'Your payment and personal data are protected with industry-grade encryption and JWT authentication.' },
    { icon: <Star   size={24} />, title: 'Verified Hotels',   desc: 'Every listing is reviewed and managed by verified owners with direct contact details.' },
    { icon: <Clock  size={24} />, title: 'Instant Confirm',   desc: 'Get real-time booking confirmation the moment you complete your reservation.' },
    { icon: <MapPin size={24} />, title: 'Prime Locations',   desc: 'Discover hotels in sought-after destinations across cities, beaches, and mountains.' },
  ]

  return (
    <div className="home">
      {/* ─── HERO ─── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__bg-overlay" />
        </div>
        <div className="hero__content container">
          <div className="hero__eyebrow">
            <span className="hero__eyebrow-dot" />
            Premium Hotel Experience
          </div>
          <h1 className="hero__title">
            Find Your Perfect<br />
            <em>Home Away From Home</em>
          </h1>
          <p className="hero__subtitle">
            Discover handpicked hotels with verified listings, instant booking, and seamless experiences — all in one place.
          </p>
          <div className="hero__cta">
            <Link to="/hotels" className="btn btn-primary btn-lg">
              Explore Hotels <ArrowRight size={18} />
            </Link>
            {!user && (
              <Link to="/register" className="btn btn-outline btn-lg">
                List Your Property
              </Link>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="hero__stats">
          <div className="container">
            <div className="hero__stats-grid">
              {stats.map(s => (
                <div key={s.label} className="hero__stat">
                  <span className="hero__stat-value">{s.value}</span>
                  <span className="hero__stat-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED HOTELS ─── */}
      {featured && featured.length > 0 && (
        <section className="home-section container">
          <div className="section-header">
            <div className="section-eyebrow">Top Picks</div>
            <h2 className="section-title">Featured Hotels</h2>
            <p className="section-sub">Explore our most popular listings loved by thousands of travellers.</p>
          </div>
          <div className="grid-3">
            {featured.map(h => <HotelCard key={h._id} hotel={h} />)}
          </div>
          <div className="home-section__more">
            <Link to="/hotels" className="btn btn-dark">
              View All Hotels <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      )}

      {/* ─── WHY LUXESTAY ─── */}
      <section className="home-features">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <div className="section-eyebrow" style={{ justifyContent: 'center' }}>Why LuxeStay</div>
            <h2 className="section-title">Travel With Confidence</h2>
          </div>
          <div className="home-features__grid">
            {features.map(f => (
              <div key={f.title} className="home-feature-card">
                <div className="home-feature-card__icon">{f.icon}</div>
                <h3 className="home-feature-card__title">{f.title}</h3>
                <p className="home-feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      {!user && (
        <section className="home-cta container">
          <div className="home-cta__inner">
            <div className="home-cta__content">
              <h2 className="home-cta__title">Own a Hotel? List It Today.</h2>
              <p className="home-cta__sub">Join hundreds of property owners already earning on LuxeStay. Registration is free and takes under 2 minutes.</p>
            </div>
            <div className="home-cta__actions">
              <Link to="/register?role=owner" className="btn btn-primary btn-lg">
                Start Listing <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}