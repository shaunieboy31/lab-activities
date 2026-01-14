import React from 'react'
import { Outlet, Link } from 'react-router-dom'

export default function App(){
  return (
    <div className="layout">
      <header className="topbar">
        <Link to="/" className="brand">Task Manager</Link>
      </header>
      <main className="content">
        <Outlet />
      </main>
    </div>
  )
}
