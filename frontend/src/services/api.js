import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor for unified error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || 'Something went wrong'
    return Promise.reject({ message, status: err.response?.status })
  }
)

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  logout:   ()     => api.post('/auth/logout'),
}

// ─── Hotels ─────────────────────────────────────────────────────────────────
export const hotelAPI = {
  getAll: () => api.get('/hotel/getHotels'),

  create: (data) => {
    const form = new FormData()
    Object.keys(data).forEach(k => { if (data[k] !== null && data[k] !== undefined) form.append(k, data[k]) })
    return api.post('/hotel/create', form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },

  update: (id, data) => {
    const form = new FormData()
    Object.keys(data).forEach(k => { if (data[k] !== null && data[k] !== undefined) form.append(k, data[k]) })
    return api.put(`/hotel/update/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
  },

  delete: (id) => api.delete(`/hotel/delete/${id}`),
}

// ─── Bookings ────────────────────────────────────────────────────────────────
export const bookingAPI = {
  create:        (hotelId, data) => api.post(`/booking/create/${hotelId}`, data),
  cancel:        (bookingId)     => api.delete(`/booking/cancel/${bookingId}`),
  myBookings:    ()              => api.get('/booking/myBookings'),
  ownerBookings: ()              => api.get('/booking/ownerBookings'),
  updateStatus:  (bookingId, data) => api.put(`/booking/updateStatus/${bookingId}`, data),
}

export default api