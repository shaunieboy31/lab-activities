import React, { useState } from 'react'

export default function ProjectForm({ onSubmit }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState('open')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      await onSubmit({ name: name.trim(), description: description.trim(), dueDate, status })
      setName('')
      setDescription('')
      setDueDate('')
      setStatus('open')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="form">
      <input placeholder="Project name" value={name} onChange={e=>setName(e.target.value)} required />
      <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
      <select value={status} onChange={e=>setStatus(e.target.value)}>
        <option value="open">open</option>
        <option value="in-progress">in-progress</option>
        <option value="done">done</option>
      </select>
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create project'}</button>
    </form>
  )
}
