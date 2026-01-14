import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'

type User = { id: number; username: string; role: string }

const AuthContext = createContext<{ user: User | null; setUser: (u: User | null) => void }>({ user: null, setUser: ()=>{} })

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if(token){
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // fetch current user
      axios.get('http://localhost:3000/auth/me').then(r=>setUser(r.data)).catch(()=>{
        setUser(null)
      })
    }
  }, [])

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export const useAuth = ()=> useContext(AuthContext)
