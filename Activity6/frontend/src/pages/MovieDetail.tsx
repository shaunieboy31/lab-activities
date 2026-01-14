import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../AuthProvider'

type Review = {
  id?: number
  rating: number
  comment?: string
  user?: { id?: number; username?: string }
}

type Movie = {
  id: number
  title: string
  description?: string
  averageRating?: number
}

export default function MovieDetail(){
  const { id } = useParams()
  const { user } = useAuth()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(()=>{
    if(!id) return
    setLoading(true)
    setError(null)
    Promise.all([
      axios.get(`http://localhost:3000/movies/${id}`),
      axios.get(`http://localhost:3000/movies/${id}/reviews`),
    ])
    .then(([mRes, rRes])=>{
      setMovie(mRes.data)
      setReviews(rRes.data || [])
    })
    .catch(err=>{
      console.error(err)
      setError('Failed to load movie data')
    })
    .finally(()=>setLoading(false))
  },[id])

  const submit = async ()=>{
    if(!id) return
    if (!comment.trim()) {
      setError('Please add a comment')
      return
    }
    setError(null)
    try{
      await axios.post(`http://localhost:3000/movies/${id}/reviews`, { rating, comment })
      const [rRes, mRes] = await Promise.all([
        axios.get(`http://localhost:3000/movies/${id}/reviews`),
        axios.get(`http://localhost:3000/movies/${id}`),
      ])
      setReviews(rRes.data || [])
      setMovie(mRes.data)
      setComment('')
    }catch(e){
      console.error(e)
      setError('Failed to submit review')
    }
  }

  const deleteReview = async (reviewId?: number) => {
    if (!reviewId) return
    if (!confirm('Delete this review?')) return
    try {
      await axios.delete(`http://localhost:3000/reviews/${reviewId}`)
      setReviews(reviews.filter(r => r.id !== reviewId))
    } catch (e) {
      console.error(e)
      setError('Failed to delete review')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div style={{color:'red'}}>{error}</div>
  if(!movie) return <div>No movie found</div>

  return (
    <div className="container">
      <h1>{movie.title}</h1>
      <p>{movie.description}</p>
      <p>Average rating: {movie.averageRating ?? 0}</p>

      <h2>Reviews</h2>
      <ul>
        {reviews.length === 0 && <li>No reviews yet</li>}
        {reviews.map((r, idx)=> (
          <li key={r.id ?? idx} style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>{r.rating} — {r.comment} {r.user ? <em>by {r.user.username}</em> : null}</div>
            {user?.role === 'admin' && <button onClick={() => deleteReview(r.id)} style={{marginLeft: 8}}>Delete</button>}
          </li>
        ))}
      </ul>

      <h3>Add review</h3>
      <label>Rating:
        <select value={rating} onChange={e=>setRating(Number(e.target.value))}>
          {[5,4,3,2,1].map(v=> <option key={v} value={v}>{v}</option>)}
        </select>
      </label>
      <br/>
      <label>Comment:
        <input value={comment} onChange={e=>setComment(e.target.value)} />
      </label>
      <br/>
      <button onClick={submit} disabled={!comment.trim()}>Submit</button>
    </div>
  )
}
