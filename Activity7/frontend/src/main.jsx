import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import ProjectList from './pages/ProjectList'
import ProjectDetail from './pages/ProjectDetail'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}> 
          <Route index element={<ProjectList />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
