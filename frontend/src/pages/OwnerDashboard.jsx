import { useState, useEffect, useRef } from 'react'
import { hotelAPI, bookingAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, X, Upload, MapPin, Phone, LayoutDashboard, Hotel, CalendarCheck, Users } from 'lucide-react'
import './OwnerDashboard.css'

const EMPTY = { title:'', description:'', location:'', price:'', contact:'', status:'available', image: null }

export default function OwnerDashboard() {
  const { user } = useAuth()
  const [hotels,  setHotels]  = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(null)   // null | 'create' | 'edit'
  const [editing, setEditing] = useState(null)
  const [form,    setForm]    = useState(EMPTY)
  const [preview, setPreview] = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [deleting,setDeleting]= useState(null)
  const [updating, setUpdating] = useState(null)
  const fileRef = useRef()

  const fetchHotels = async () => {
    try {
      const { data } = await hotelAPI.getAll()
      // Only show this owner's hotels
      setHotels(data.filter(h => h.owner?._id === user?.id || h.owner?.id === user?.id || h.owner === user?.id))
    } catch { toast.error('Failed to load hotels') }
    finally  { setLoading(false) }
  }

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.ownerBookings()
      setBookings(data)
    } catch { toast.error('Failed to load bookings') }
  }

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchHotels(), fetchBookings()])
    }
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const openCreate = () => { setForm(EMPTY); setPreview(null); setEditing(null); setModal('create') }

  const openEdit = (hotel) => {
    setEditing(hotel)
    setForm({
      title: hotel.title, description: hotel.description,
      location: hotel.location, price: hotel.price,
      contact: hotel.contact, status: hotel.status || '', image: null
    })
    setPreview(hotel.image || null)
    setModal('edit')
  }

  const closeModal = () => { setModal(null); setEditing(null); setForm(EMPTY); setPreview(null) }

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleFile = e => {
    const file = e.target.files[0]
    if (!file) return
    setForm(p => ({ ...p, image: file }))
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = { ...form }
      if (!payload.image) delete payload.image
      if (modal === 'create') {
        await hotelAPI.create(payload)
        toast.success('Hotel listed successfully!')
      } else {
        await hotelAPI.update(editing._id, payload)
        toast.success('Hotel updated!')
      }
      closeModal()
      fetchHotels()
    } catch (err) {
      toast.error(err.message || 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this hotel listing? This cannot be undone.')) return
    setDeleting(id)
    try {
      await hotelAPI.delete(id)
      toast.success('Hotel deleted')
      fetchHotels()
    } catch (err) {
      toast.error(err.message || 'Delete failed')
    } finally { setDeleting(null) }
  }

  const handleUpdateBookingStatus = async (bookingId, status) => {
    setUpdating(bookingId)
    try {
      await bookingAPI.updateStatus(bookingId, { status })
      toast.success(`Booking ${status}`)
      fetchBookings()
    } catch (err) {
      toast.error(err.message || 'Update failed')
    } finally { setUpdating(null) }
  }

  const placeholder = `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80`

  const stats = [
    { label: 'Total Listings', value: hotels.length, icon: <Hotel size={20} /> },
    { label: 'Active',         value: hotels.filter(h => h.status === 'available').length, icon: <LayoutDashboard size={20} /> },
    { label: 'Total Bookings', value: bookings.length, icon: <CalendarCheck size={20} /> },
    { label: 'Confirmed',      value: bookings.filter(b => b.status === 'confirmed').length, icon: <Users size={20} /> },
  ]

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="dashboard-page__header">
        <div className="container">
          <div className="section-eyebrow">Owner Portal</div>
          <div className="dashboard-page__header-inner">
            <div>
              <h1 className="dashboard-page__title">My Dashboard</h1>
              <p className="dashboard-page__sub">Welcome back, {user?.name}. Manage your hotel listings here.</p>
            </div>
            <button className="btn btn-primary" onClick={openCreate}>
              <Plus size={18} /> Add Hotel
            </button>
          </div>
        </div>
      </div>

      <div className="container dashboard-page__body">
        {/* Stats */}
        <div className="dashboard-stats">
          {stats.map(s => (
            <div key={s.label} className="dashboard-stat">
              <div className="dashboard-stat__icon">{s.icon}</div>
              <div>
                <div className="dashboard-stat__value">{s.value}</div>
                <div className="dashboard-stat__label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Hotels Table */}
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">Your Listings</h2>
            <button className="btn btn-dark btn-sm" onClick={openCreate}>
              <Plus size={15} /> New Listing
            </button>
          </div>

          {loading ? (
            <div className="loading-screen"><div className="spinner" /><span>Loading…</span></div>
          ) : hotels.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏨</div>
              <h3>No hotels listed yet</h3>
              <p>Click "Add Hotel" to list your first property.</p>
              <button className="btn btn-primary" style={{marginTop:20}} onClick={openCreate}>
                <Plus size={16} /> Add First Hotel
              </button>
            </div>
          ) : (
            <div className="dashboard-hotels-list">
              {hotels.map(h => (
                <div key={h._id} className="dashboard-hotel-row">
                  <div className="dashboard-hotel-row__img">
                    <img src={h.image || placeholder} alt={h.title}
                      onError={e => { e.target.src = placeholder }} />
                  </div>
                  <div className="dashboard-hotel-row__info">
                    <div className="dashboard-hotel-row__name">{h.title}</div>
                    <div className="dashboard-hotel-row__meta">
                      <span><MapPin size={12} /> {h.location}</span>
                      <span><Phone size={12} /> {h.contact}</span>
                    </div>
                    <p className="dashboard-hotel-row__desc">{h.description}</p>
                  </div>
                  <div className="dashboard-hotel-row__right">
                    <div className="dashboard-hotel-row__price">
                      ₹{Number(h.price).toLocaleString()}<small>/night</small>
                    </div>
                    {h.status && (
                      <span className={`badge ${h.status === 'available' ? 'badge-green' : 'badge-red'}`}>
                        {h.status}
                      </span>
                    )}
                    <div className="dashboard-hotel-row__actions">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(h)}>
                        <Pencil size={14} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(h._id)}
                        disabled={deleting === h._id}>
                        <Trash2 size={14} />
                        {deleting === h._id ? 'Deleting…' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings Table */}
        <div className="dashboard-card">
          <div className="dashboard-card__header">
            <h2 className="dashboard-card__title">Bookings</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📅</div>
              <h3>No bookings yet</h3>
              <p>Bookings for your hotels will appear here.</p>
            </div>
          ) : (
            <div className="dashboard-bookings-list">
              {bookings.map(b => (
                <div key={b._id} className="dashboard-booking-row">
                  <div className="dashboard-booking-row__info">
                    <div className="dashboard-booking-row__hotel">{b.hotel?.title}</div>
                    <div className="dashboard-booking-row__user">
                      <Users size={12} /> {b.user?.name} ({b.user?.email})
                    </div>
                    <div className="dashboard-booking-row__dates">
                      {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="dashboard-booking-row__right">
                    <div className="dashboard-booking-row__price">
                      ₹{Number(b.totalPrice).toLocaleString()}
                    </div>
                    <span className={`badge ${b.status === 'booked' ? 'badge-green' : b.status === 'confirmed' ? 'badge-blue' : 'badge-red'}`}>
                      {b.status}
                    </span>
                    <div className="dashboard-booking-row__actions">
                      {b.status === 'booked' && (
                        <>
                          <button className="btn btn-success btn-sm" onClick={() => handleUpdateBookingStatus(b._id, 'confirmed')} disabled={updating === b._id}>
                            Confirm
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleUpdateBookingStatus(b._id, 'cancelled')} disabled={updating === b._id}>
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Modal ─── */}
      {modal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal dashboard-modal">
            <div className="modal-header">
              <h2 className="modal-title">{modal === 'create' ? 'List New Hotel' : 'Edit Hotel'}</h2>
              <button className="modal-close" onClick={closeModal}><X size={16} /></button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="dashboard-form-grid">
                  {/* Image Upload */}
                  <div className="form-group dashboard-form-full">
                    <label className="form-label">Hotel Photo</label>
                    <div
                      className="dashboard-upload-area"
                      onClick={() => fileRef.current.click()}
                      style={preview ? { backgroundImage: `url(${preview})` } : {}}
                    >
                      {!preview && (
                        <div className="dashboard-upload-placeholder">
                          <Upload size={28} />
                          <span>Click to upload image</span>
                          <small>JPG, PNG up to 5MB</small>
                        </div>
                      )}
                      {preview && <div className="dashboard-upload-change">Change Photo</div>}
                      <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="form-group dashboard-form-full">
                    <label className="form-label">Hotel Name</label>
                    <input type="text" name="title" className="form-input"
                      placeholder="e.g. The Grand Royale" value={form.title}
                      onChange={handleChange} required />
                  </div>

                  {/* Description */}
                  <div className="form-group dashboard-form-full">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-textarea"
                      placeholder="Describe your hotel, amenities, nearby attractions…"
                      value={form.description} onChange={handleChange} required rows={3} />
                  </div>

                  {/* Location */}
                  <div className="form-group">
                    <label className="form-label">Location / City</label>
                    <input type="text" name="location" className="form-input"
                      placeholder="e.g. Pune, Maharashtra" value={form.location}
                      onChange={handleChange} required />
                  </div>

                  {/* Contact */}
                  <div className="form-group">
                    <label className="form-label">Contact Number</label>
                    <input type="number" name="contact" className="form-input"
                      placeholder="10-digit number" value={form.contact}
                      onChange={handleChange} required />
                  </div>

                  {/* Price */}
                  <div className="form-group">
                    <label className="form-label">Price per Night (₹)</label>
                    <input type="number" name="price" className="form-input"
                      placeholder="e.g. 3500" value={form.price}
                      onChange={handleChange} required min={1} />
                  </div>

                  {/* Status */}
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Under Maintenance</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving…' : modal === 'create' ? 'List Hotel' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}