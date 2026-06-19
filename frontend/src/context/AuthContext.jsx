/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('luxe_user')) || null }
    catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const persist = (u) => {
    setUser(u)
    if (u) localStorage.setItem('luxe_user', JSON.stringify(u))
    else    localStorage.removeItem('luxe_user')
  }

  const register = useCallback(async (payload) => {
    setLoading(true)
    try {
      const { data } = await authAPI.register(payload)
      persist(data.user)
      return { ok: true }
    } catch (e) {
      return { ok: false, message: e.message }
    } finally { setLoading(false) }
  }, [])

  const login = useCallback(async (payload) => {
    setLoading(true)
    try {
      const { data } = await authAPI.login(payload)
      persist(data.user)
      return { ok: true }
    } catch (e) {
      return { ok: false, message: e.message }
    } finally { setLoading(false) }
  }, [])

  const logout = useCallback(async () => {
    try { await authAPI.logout() }
    catch (err) {
      console.error('Logout error:', err)
    }
    persist(null)
  }, [])

  const isOwner = user?.role === 'owner'
  const isUser  = user?.role === 'user'
  const isAdmin = user?.role === 'Admin'

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, isOwner, isUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}

export default useAuth;