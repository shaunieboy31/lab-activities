import React, { useState } from 'react'

export default function TaskForm({ onSubmit }){
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
   const [assigneeName, setAssigneeName] = useState('')

  const submit = async (e)=>{
    e.preventDefault()
    if(!title.trim()) return
    await onSubmit({ title: title.trim(), description: description.trim(), dueDate, assigneeName: assigneeName.trim() || undefined })
    setTitle('')
    setDescription('')
    setDueDate('')
    setAssigneeName('')
  }

  return (
    <form onSubmit={submit} className="form">
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
      <input placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} />
      <input placeholder="Assignee name" value={assigneeName} onChange={e=>setAssigneeName(e.target.value)} />
      <button type="submit">Create</button>
    </form>
  )
}
