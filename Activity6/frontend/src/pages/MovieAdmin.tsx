import React, { useEffect, useState } from 'react'
import axios from 'axios'
import MovieForm from '../components/MovieForm'
import { useAuth } from '../AuthProvider'
import { useNavigate } from 'react-router-dom'

type Movie = { id: number; title: string; description?: string; releaseDate?: string; averageRating?: number }

export default function MovieAdmin(){
  const [movies, setMovies] = useState<Movie[]>([])
  const [editing, setEditing] = useState<Movie | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { user, ready } = useAuth()
  const navigate = useNavigate()

  const load = async ()=>{
    try{
      const res = await axios.get('http://localhost:3000/movies')
      setMovies(res.data || [])
    }catch(e){
      console.error(e)
      setError('Failed to load movies')
    }
  }

  useEffect(()=>{ load() }, [])

  useEffect(()=>{
    if(!ready) return
    if(!user || user.role !== 'admin'){
      navigate('/login')
    }
  }, [user, ready])

  const createMovie = async (data: any)=>{
    await axios.post('http://localhost:3000/movies', data)
    await load()
  }

  const updateMovie = async (data: any)=>{
    if(!editing) return
    await axios.put(`http://localhost:3000/movies/${editing.id}`, data)
    setEditing(null)
    await load()
  }

  const removeMovie = async (id: number)=>{
    if(!confirm('Delete this movie?')) return
    await axios.delete(`http://localhost:3000/movies/${id}`)
    await load()
  }

  return (
    <div className="container">
      <h1>Movie Admin</h1>
      {error && <div style={{color:'red'}}>{error}</div>}

      <h2>{editing ? 'Edit movie' : 'Create movie'}</h2>
      <MovieForm initial={editing ?? undefined} onSubmit={editing ? updateMovie : createMovie} submitLabel={editing ? 'Update' : 'Create'} />

      <h2>Existing movies</h2>
      <ul>
        {movies.map(m=> (
          <li key={m.id} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
              <strong>{m.title}</strong> — {m.averageRating ?? 0}
              <div style={{fontSize:12, color:'#666'}}>{m.description}</div>
            </div>
            <div>
              <button onClick={()=>setEditing(m)}>Edit</button>
              <button onClick={()=>removeMovie(m.id)} style={{marginLeft:8}}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
