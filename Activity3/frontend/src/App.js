import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Book from './components/Book';
import AuthorsCat from './components/AuthorsCat';
import Categories from './components/Categories';

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <img
           src="convince-logo.png"
           alt="ConVINCE Logo"
           className="logo"
        />         
         <h1 className="title">ConVINCE Library</h1>
          <p className="subtitle">
            Collaboration of New Visionaries Innovating New Concepts and Excellence
          </p>
        </header>



        <main className="content">
          <Routes>
            <Route path="/" element={<Book />} />
            <Route path="/authors" element={<AuthorsCat />} />
            <Route path="/categories" element={<Categories />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
