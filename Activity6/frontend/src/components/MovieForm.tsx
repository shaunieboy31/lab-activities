import React, { useState, useEffect } from 'react'

type Props = {
  initial?: { title?: string; description?: string; releaseDate?: string }
  onSubmit: (data: { title: string; description?: string; releaseDate?: string }) => Promise<void>
  submitLabel?: string
}

export default function MovieForm({ initial, onSubmit, submitLabel = 'Save' }: Props){
  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [releaseDate, setReleaseDate] = useState(initial?.releaseDate ?? '')
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setTitle(initial?.title ?? '')
    setDescription(initial?.description ?? '')
    setReleaseDate(initial?.releaseDate ?? '')
  },[initial])

  const submit = async (e: React.FormEvent) =>{
    e.preventDefault()
    if(!title.trim()) return
    setLoading(true)
    try{
      await onSubmit({ title: title.trim(), description: description.trim(), releaseDate })
      setTitle('')
      setDescription('')
      setReleaseDate('')
    }finally{setLoading(false)}
  }

  return (
    <form onSubmit={submit} style={{marginBottom:16}}>
      <div>
        <label>Title: <input value={title} onChange={e=>setTitle(e.target.value)} required /></label>
      </div>
      <div>
        <label>Description: <input value={description} onChange={e=>setDescription(e.target.value)} /></label>
      </div>
      <div>
        <label>Release Date: <input value={releaseDate} onChange={e=>setReleaseDate(e.target.value)} placeholder="YYYY-MM-DD" /></label>
      </div>
      <div>
        <button type="submit" disabled={loading}>{submitLabel}</button>
      </div>
    </form>
  )
}
