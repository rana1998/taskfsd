import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegistrationForm.css'; // Import your custom CSS file

function RegistrationForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/signup', {
        username,
        password,
      });

      console.log(response.data);

      if (response.data.message === 'User registered successfully') {
        localStorage.setItem('token', response.data.token);
        navigate('/books');
        window.location.reload(); // Reload the page to re-render NavBar
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="registration-form-container">
      <h2>Registration</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input-field"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
        />
        <button type="submit" className="submit-button">Register</button>
      </form>
    </div>
  );
}

export default RegistrationForm;
