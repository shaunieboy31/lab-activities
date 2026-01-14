import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import TaskForm from '../components/TaskForm'

export default function ProjectDetail(){
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [error, setError] = useState(null)

  const load = async ()=>{
    try{
      const [pRes, tRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/project/${id}`)
      ])
      setProject(pRes.data)
      setTasks(tRes.data||[])
    }catch(e){
      console.error(e)
      setError('Failed to load project')
    }
  }

  useEffect(()=>{ if(id) load() },[id])

  const createTask = async (data)=>{
    try{
      await api.post(`/tasks/${id}`, data)
      await load()
    }catch(e){
      console.error(e)
      setError('Failed to create task')
    }
  }

  const updateTask = async (taskId, data)=>{
    try{
      await api.put(`/tasks/${taskId}`, data)
      await load()
    }catch(e){
      console.error(e)
      setError('Failed to update task')
    }
  }

  const deleteTask = async (taskId)=>{
    try{
      await api.delete(`/tasks/${taskId}`)
      setTasks(tasks.filter(t=>t.id!==taskId))
    }catch(e){
      console.error(e)
      setError('Failed to delete task')
    }
  }

  if(!project) return <div>Loading...</div>

  return (
    <div>
      <h1>{project.name}</h1>
      <p>{project.description}</p>
      <p>Status: {project.status} {project.dueDate ? `· Due ${project.dueDate}` : ''}</p>

      <h3>Tasks</h3>
      <ul className="list">
        {tasks.map(t=> (
          <li key={t.id} className="card">
            <div>
              <strong>{t.title}</strong>
              <div className="sub">{t.status} {t.dueDate ? `· Due ${t.dueDate}` : ''} {t.assigneeName ? `· ${t.assigneeName}` : ''}</div>
              {t.description && <div className="sub">{t.description}</div>}
            </div>
            <div className="actions">
              <select value={t.status} onChange={(e)=>updateTask(t.id, { status: e.target.value })}>
                <option value="todo">todo</option>
                <option value="doing">doing</option>
                <option value="done">done</option>
              </select>
              <button onClick={()=>deleteTask(t.id)}>Delete</button>
            </div>
          </li>
        ))}
        {tasks.length === 0 && <li>No tasks yet</li>}
      </ul>

      <h3>Create Task</h3>
      <TaskForm onSubmit={createTask} />
      {error && <div className="error">{error}</div>}
    </div>
  )
}
