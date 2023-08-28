import React, { useState } from 'react';
import axios from 'axios'; // Import axios for making API requests
import './css/AddBookForm.css';

function AddBookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3001/api/addBook', {
        title,
        author,
        isbn,
      });

      console.log(response.data); // Successful response from backend
      setSuccessMessage('Book added successfully'); // Set the success message
      // You can add further logic to reset the form, navigate, etc.
    } catch (error) {
      console.error(error); // Handle error case
    }
  };

  return (
    <div className="add-book-container">
      <h2>Add New Book</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
        {/* Input fields and submit button */}
      <form className="add-book-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="label">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="author" className="label">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="isbn" className="label">ISBN:</label>
          <input
            type="text"
            id="isbn"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            className="input-field"
          />
        </div>
        <button type="submit" className="submit-button">Add Book</button>
      </form>
    </div>
  );
}

export default AddBookForm;
