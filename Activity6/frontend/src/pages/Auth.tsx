import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Auth(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState<'login'|'signup'>('login')
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const submit = async (e: React.FormEvent) =>{
    e.preventDefault()
    setError(null)
    if(!username.trim()) return setError('Username required')
    if(!password) return setError('Password required')
    try{
      const body = { username: username.trim(), password }
      if(mode === 'signup'){
        await axios.post('http://localhost:3000/auth/signup', body)
      }
      const res = await axios.post('http://localhost:3000/auth/login', body)
      const token = res.data?.access_token
      if(token){
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        navigate('/')
      } else {
        setError('No token returned')
      }
    }catch(err:any){
      console.error(err)
      setError(err?.response?.data?.message || err.message || 'Auth failed')
    }
  }

  return (
    <div className="container">
      <h1>{mode === 'login' ? 'Login' : 'Sign up'}</h1>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={submit}>
        <div>
          <label>Username: <input value={username} onChange={e=>setUsername(e.target.value)} required /></label>
        </div>
        <div>
          <label>Password: <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></label>
        </div>
        <div style={{marginTop:8}}>
          <button type="submit">{mode === 'login' ? 'Login' : 'Sign up'}</button>
          <button type="button" onClick={()=>setMode(mode === 'login' ? 'signup' : 'login')} style={{marginLeft:8}}>
            {mode === 'login' ? 'Switch to Sign up' : 'Switch to Login'}
          </button>
        </div>
      </form>
    </div>
  )
}
