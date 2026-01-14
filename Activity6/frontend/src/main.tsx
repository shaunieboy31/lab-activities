import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MovieList from './pages/MovieList'
import MovieDetail from './pages/MovieDetail'
import MovieAdmin from './pages/MovieAdmin'
import Auth from './pages/Auth'
import './styles.css'
import { AuthProvider } from './AuthProvider'

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MovieList/>} />
          <Route path="/movies/:id" element={<MovieDetail/>} />
          <Route path="/admin" element={<MovieAdmin/>} />
          <Route path="/login" element={<Auth/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
