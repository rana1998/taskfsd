
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';
import AddBookForm from './components/AddBookForm';
import BookList from './components/BookList';
import BookDetail from './components/BookDetail';
import EditBookForm from './components/EditBookForm';
import './App.css'; // Import your custom CSS file

import LogoutButton from './LogoutButton'; 

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  console.log(isAuthenticated);
  return (
    <Router>
      <div>
        <nav className="navbar">
          <ul>
            {!isAuthenticated && (
              <li>
                <Link to="/signup">Sign Up</Link>
              </li>
            )}
            {!isAuthenticated && (
              <li>
                <Link to="/login">Log In</Link>
              </li>
            )}
            {isAuthenticated && (
              <li>
                <LogoutButton />
              </li>
            )}
          </ul>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/signup" />} />
            <Route path="/signup" element={<RegistrationForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/add" element={<AddBookForm />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/book/:id" element={<BookDetail />} />
            <Route path="/edit/:id" element={<EditBookForm />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

