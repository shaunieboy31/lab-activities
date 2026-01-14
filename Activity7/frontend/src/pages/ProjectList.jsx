import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api'
import ProjectForm from '../components/ProjectForm'

export default function ProjectList(){
  const [projects, setProjects] = useState([])
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState(null)
  const [tasksByProject, setTasksByProject] = useState({})

  const load = () => {
    api.get('/projects').then(res=>setProjects(res.data||[])).catch(err=>{
      console.error(err)
      setError('Failed to load projects')
    })
  }

  useEffect(()=>{ load() },[])

  const createProject = async (data) => {
    try {
      await api.post('/projects', data)
      await load()
    } catch (e) {
      console.error(e)
      setError('Failed to create project')
    }
  }

  const toggleTasks = async (projectId) => {
    const next = expanded === projectId ? null : projectId
    setExpanded(next)
    if (next && !tasksByProject[next]) {
      try {
        const res = await api.get(`/tasks/project/${projectId}`)
        setTasksByProject(prev => ({ ...prev, [projectId]: res.data || [] }))
      } catch (e) {
        console.error(e)
        setError('Failed to load tasks')
      }
    }
  }

  return (
    <div>
      <h1>Projects</h1>
      {error && <div className="error">{error}</div>}

      <h3>Create Project</h3>
      <ProjectForm onSubmit={createProject} />

      <ul className="list">
        {projects.map(p=> (
          <li key={p.id} className="card">
            <div>
              <strong>{p.name}</strong>
              <div className="sub">{p.status} {p.dueDate ? `· Due ${p.dueDate}` : ''}</div>
            </div>
            <div className="actions" style={{gap:8}}>
              <button onClick={()=>toggleTasks(p.id)}>{expanded===p.id ? 'Hide tasks' : 'View tasks'}</button>
              <Link to={`/projects/${p.id}`}>Open</Link>
            </div>
            {expanded===p.id && (
              <div className="task-list">
                {(tasksByProject[p.id]||[]).length === 0 && <div className="sub">No tasks yet</div>}
                <ul className="list" style={{marginTop:8}}>
                  {(tasksByProject[p.id]||[]).map(t => (
                    <li key={t.id} className="card" style={{padding:'8px 10px'}}>
                      <div>
                        <strong>{t.title}</strong>
                        <div className="sub">{t.status} {t.dueDate ? `· Due ${t.dueDate}` : ''} {t.assigneeName ? `· ${t.assigneeName}` : ''}</div>
                        {t.description && <div className="sub">{t.description}</div>}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
        {projects.length === 0 && <li>No projects yet</li>}
      </ul>
    </div>
  )
}
