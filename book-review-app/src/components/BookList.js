import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './css/BookList.css';

function BookList() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // Fetch books from backend
    async function fetchBooks() {
      try {
        const response = await axios.get('http://localhost:3001/api/getBooks');
        setBooks(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchBooks();
  }, []);

  return (
    <div className="book-list-container">
      <h2 className="title">Book List</h2>
      <ul className="book-list">
        {books.map((book) => (
          <li key={book._id} className="book-item">
            <Link to={`/book/${book._id}`} className="book-link">
              {book.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BookList;
