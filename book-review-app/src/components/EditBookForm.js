import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './css/EditBookForm.css'; // Import the CSS file

function EditBookForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookDetails() {
      try {
        const response = await axios.get(`http://localhost:3001/api/getBook/${id}`);
        const bookData = response.data;
        setTitle(bookData.title);
        setAuthor(bookData.author);
        setIsbn(bookData.isbn);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBookDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/api/updateBook/${id}`, {
        title,
        author,
        isbn,
      });
      navigate(`/book/${id}`); // Redirect to book detail page after update
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='edit-book-container'>
      <h2>Edit Book</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="isbn">ISBN:</label>
          <input
            type="text"
            id="isbn"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
          />
        </div>
        <button type="submit">Update Book</button>
      </form>
    </div>
  );
}

export default EditBookForm;
