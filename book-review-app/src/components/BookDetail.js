import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './css/BookDetail.css'; // Import your custom CSS file

function BookDetail() {
  const [book, setBook] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function fetchBookDetails() {
      try {
        const response = await axios.get(`http://localhost:3001/api/getBook/${id}`);
        setBook(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBookDetails();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit/${id}`); // Update the edit route
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/deleteBook/${id}`);
      navigate('/books');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="book-detail-container">
      <h2>Book Details</h2>
      <p><strong>Title:</strong> {book.title}</p>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>ISBN:</strong> {book.isbn}</p>
      <div className="button-group">
        <button className="edit-button" onClick={handleEdit}>Edit</button>
        <button className="delete-button" onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
}

export default BookDetail;
