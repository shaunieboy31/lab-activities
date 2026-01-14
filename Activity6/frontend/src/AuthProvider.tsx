import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

type User = { id: number; username: string; role: string }

type AuthContextType = {
  user: User | null
  ready: boolean
  setUser: (u: User | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  ready: false,
  setUser: () => {},
  logout: () => {}
})

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      axios.get('http://localhost:3000/auth/me').then(r => setUser(r.data)).catch(() => {
        localStorage.removeItem('token')
        delete axios.defaults.headers.common['Authorization']
        setUser(null)
      }).finally(() => setReady(true))
    } else {
      setReady(true)
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, ready, setUser, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
