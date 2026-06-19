import { useEffect, useState } from 'react'
import { hotelAPI } from '../services/api'
import HotelCard from '../components/HotelCard'
import toast from 'react-hot-toast'

export default function Hotels() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchHotels = async () => {
    setLoading(true)
    try {
      const { data } = await hotelAPI.getAll()
      setHotels(data)
    } catch (err) {
      toast.error(err.message || 'Failed to load hotels')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHotels() }, [])

  return (
    <div className="page-content">
      <div className="container">
        <div className="section-heading">
          <h1>Explore Hotels</h1>
          <p>Find comfortable stays, verified owner listings, and easy booking options.</p>
        </div>

        {loading ? (
          <div className="loading-screen"><div className="spinner" /><span>Loading hotels…</span></div>
        ) : hotels.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏨</div>
            <h3>No hotels available right now</h3>
            <p>Check back soon for new listings from our hotel partners.</p>
          </div>
        ) : (
          <div className="hotels-grid">
            {hotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
