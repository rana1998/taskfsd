// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// function LogoutButton() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     // Clear the JWT token from localStorage
//     localStorage.removeItem('token');
//     navigate('/login'); // Redirect to the login page
//   };

//   return <button onClick={handleLogout}>Logout</button>;
// }

// export default LogoutButton;


import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
  const navigate = useNavigate(); // Get the navigate function

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the token
    navigate('/login'); // Redirect to the login page
    window.location.reload(); // Reload the page to re-render NavBar
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default LogoutButton;

