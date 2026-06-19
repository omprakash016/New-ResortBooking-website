import { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function BookingModal({ hotel, onClose, onSuccess }) {
  const [form, setForm] = useState({ checkIn: '', checkOut: '' });
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const nights = () => {
    if (!form.checkIn || !form.checkOut) return 0;
    const diff = new Date(form.checkOut) - new Date(form.checkIn);
    return Math.max(0, Math.floor(diff / 86400000));
  };

  const totalPrice = () => {
    const n = nights();
    return n > 0 ? `₹${(n * hotel.price).toLocaleString('en-IN')}` : '—';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.checkIn || !form.checkOut) {
      toast.error('Please select both dates');
      return;
    }
    if (new Date(form.checkOut) <= new Date(form.checkIn)) {
      toast.error('Check-out must be after check-in');
      return;
    }
    setLoading(true);
    try {
      await api.post(`/booking/create/${hotel._id}`, form);
      toast.success('Reservation confirmed!');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div>
            <p style={styles.eyebrow}>Reserve</p>
            <h3 style={styles.title}>{hotel.title}</h3>
            <p style={styles.location}>◈ {hotel.location}</p>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Price info */}
            <div style={styles.priceInfo}>
              <span style={styles.priceLabel}>Rate</span>
              <span style={styles.priceValue}>
                ₹{Number(hotel.price).toLocaleString('en-IN')}
                <span style={styles.perNight}> / night</span>
              </span>
            </div>

            <div className="divider" style={{ margin: '0' }} />

            <div style={styles.dateGrid}>
              <div className="form-group">
                <label className="form-label">Check-in</label>
                <input
                  type="date"
                  className="form-input"
                  min={today}
                  value={form.checkIn}
                  onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Check-out</label>
                <input
                  type="date"
                  className="form-input"
                  min={form.checkIn || today}
                  value={form.checkOut}
                  onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Summary */}
            {nights() > 0 && (
              <div style={styles.summary}>
                <div style={styles.summaryRow}>
                  <span>{nights()} night{nights() > 1 ? 's' : ''}</span>
                  <span>{totalPrice()}</span>
                </div>
                <div className="divider" style={{ margin: '12px 0' }} />
                <div style={{ ...styles.summaryRow, fontWeight: 500 }}>
                  <span>Total</span>
                  <span style={{ color: '#c9a55a', fontFamily: "'Playfair Display', serif", fontSize: '1.1rem' }}>
                    {totalPrice()}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-gold" disabled={loading}>
              {loading ? <><span className="spinner" style={{ width: 16, height: 16 }} /> Reserving...</> : 'Confirm Reservation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  eyebrow: {
    fontSize: '0.68rem',
    fontWeight: 500,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#c9a55a',
    marginBottom: '6px',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.4rem',
    fontWeight: 600,
    color: '#f0e8d8',
  },
  location: {
    fontSize: '0.8rem',
    color: 'rgba(240,232,216,0.5)',
    marginTop: '4px',
  },
  closeBtn: {
    background: 'transparent',
    border: '1px solid rgba(240,232,216,0.1)',
    color: 'rgba(240,232,216,0.4)',
    width: 32,
    height: 32,
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.8rem',
    flexShrink: 0,
    fontFamily: "'Jost', sans-serif",
  },
  priceInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: '0.72rem',
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'rgba(240,232,216,0.4)',
  },
  priceValue: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#c9a55a',
  },
  perNight: {
    fontSize: '0.75rem',
    fontFamily: "'Jost', sans-serif",
    color: 'rgba(240,232,216,0.5)',
    fontWeight: 300,
  },
  dateGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px',
  },
  summary: {
    background: 'rgba(201,165,90,0.04)',
    border: '1px solid rgba(201,165,90,0.12)',
    borderRadius: '4px',
    padding: '16px 20px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.88rem',
    color: 'rgba(240,232,216,0.7)',
    fontWeight: 300,
  },
};