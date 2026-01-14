import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../AuthProvider'

type Movie = {
  id: number
  title: string
  description?: string
  averageRating?: number
}

export default function MovieList(){
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(()=>{
    axios.get('http://localhost:3000/movies')
      .then(res=>setMovies(res.data))
      .catch(err=>console.error(err))
  },[])

  const { user } = useAuth()

  return (
    <div className="container">
      <h1>Movies</h1>
      <div style={{marginBottom:12}}>
        {user?.role === 'admin' && <a href="/admin">Admin: create/edit movies</a>}
        {!user && <span style={{marginLeft:12}}><a href="/login">Login / Signup</a></span>}
      </div>
      <ul>
        {movies.map(m=> (
          <li key={m.id}>
            <Link to={`/movies/${m.id}`}>
              <strong>{m.title}</strong> - {m.averageRating ?? 0}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
