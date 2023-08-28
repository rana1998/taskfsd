const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const redis = require('redis');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
// const { MongoClient, ObjectID } = require('mongodb');

const { connect, getDb } = require('./connection'); // Adjust the path as needed
const { ObjectId } = require('mongodb');
const cors = require('cors'); // Import the cors package


const app = express();
// const port = 3000;
const port = 3001;

// Use the cors middleware
app.use(cors());

app.use(bodyParser.json());

// const db = getDb();

const bcrypt = require('bcrypt');

const saltRounds = 10; // Number of salt rounds for hashing

const plainPassword = 'myPassword';
bcrypt.hash(plainPassword, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error('Error hashing password:', err);
  } else {
    console.log('Hashed password:', hashedPassword);
  }
});


// const app = express();
// const port = 3000;

// // Middleware
// app.use(bodyParser.json());

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CSRF protection middleware
const csrfProtection = csrf({ cookie: true });


// Connect to MongoDB
connect().then(() => {
  // This code block will be executed after the connection is established

  // Access the MongoDB database instance
  const db = getDb();

  const redisClient = redis.createClient();

// Hash the password before storing it
const hashPassword = async (password) => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  };


const comparePasswords = async (enteredPassword, hashedPassword) => {
return bcrypt.compare(enteredPassword, hashedPassword);
};


const generateToken = (user) => {
  const secretKey = 'your_secret_key_here';
  const expiresIn = '1h'; // Token expiration time

  const payload = {
    userId: user._id, // Assuming your user document has an '_id' field
    username: user.username,
  };

  return jwt.sign(payload, secretKey, { expiresIn });
};

  

  // app.post('/signup', async (req, res) => {
  //   const { username, password } = req.body;
  
  //   try {
  //     // Use the 'db' instance to perform MongoDB operations
  //     const collection = db.collection('users');
  
  //     // Check if the user already exists
  //     const existingUser = await collection.findOne({ username });
  //     if (existingUser) {
  //       res.status(409).json({ message: 'Username already exists' });
  //       return;
  //     }
  
  //     // Hash the password using bcrypt
  //     const hashedPassword = await bcrypt.hash(password, 10);
  
  //     // Create a new user document with the hashed password
  //     const newUser = {
  //       username,
  //       password: hashedPassword,
  //     };
  
  //     // Insert the new user document into the 'users' collection
  //     await collection.insertOne(newUser);
  
  //     res.json({ message: 'User registered successfully' });
  //   } catch (error) {
  //     console.error('Error signing up:', error);
  //     res.sendStatus(500);
  //   }
  // });

  app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
  
    try {

      // Use the 'db' instance to perform MongoDB operations
      const collection = db.collection('users');
  
      // Check if the user already exists
      const existingUser = await collection.findOne({ username });
      if (existingUser) {
        res.status(409).json({ message: 'Username already exists' });
        return;
      }
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      // Store hashedPassword in your database
      // Create a new user document with the hashed password
      const newUser = {
        username,
        password: hashedPassword,
      };
  
      // Insert the new user document into the 'users' collection
      await collection.insertOne(newUser);
  
      // Create a JWT token
      const token = jwt.sign({ username }, 'your-secret-key');
  
      res.json({ message: 'User registered successfully', token });
    } catch (error) {
      console.error('Error signing up:', error);
      res.sendStatus(500);
    }
  });
  
  // app.post('/login', async (req, res) => {
  //   const { username, password } = req.body;
  
  //   try {
  //     // Use the 'db' instance to perform MongoDB operations
  //     const collection = db.collection('users');
  
  //     // Find the user by their username
  //     const user = await collection.findOne({ username });
  
  //     if (!user) {
  //       res.status(404).json({ message: 'User not found' });
  //       return;
  //     }
  
  //     // Compare the provided password with the hashed password stored in the database
  //     const isPasswordValid = await bcrypt.compare(password, user.password);
  
  //     if (isPasswordValid) {
  //       res.json({ message: 'Login successful' });
  //       // You can generate and send a JWT token here if needed
  //     } else {
  //       res.status(401).json({ message: 'Invalid credentials' });
  //     }
  //   } catch (error) {
  //     console.error('Error logging in:', error);
  //     res.sendStatus(500);
  //   }
  // });
  
  // Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Load hashedPassword from your database based on the username
    // Use the 'db' instance to perform MongoDB operations
    const collection = db.collection('users');
  
    // Find the user by their username
    const user = await collection.findOne({ username });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Create a JWT token
      const token = jwt.sign({ username }, 'your-secret-key');
      res.json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.sendStatus(500);
  }
});
  
  
  
  
  

  // app.post('/login', async (req, res) => {
  //   const { username, password } = req.body;
  
  //   try {
  //     // Use the 'db' instance to perform MongoDB operations
  //     const collection = db.collection('users');
  
  //     // Find the user by their username
  //     await collection.findOne({ username }, (err, user) => {
  //       if (err) {
  //         console.error('Error logging in:', err);
  //         res.sendStatus(500);
  //       } else if (!user) {
  //         res.status(404).json({ message: 'User not found' });
  //       } else {
  //         // Simulate password validation (replace with actual validation)
  //         const isPasswordValid = user.password === password;
  
  //         if (isPasswordValid) {
  //           res.json({ message: 'Login successful' });
  //           // You can generate and send a JWT token here if needed
  //         } else {
  //           res.status(401).json({ message: 'Invalid credentials' });
  //         }
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error logging in:', error);
  //     res.sendStatus(500);
  //   }
  // });
  

  app.post('/logout', (req, res) => {
    // Implement user logout logic
    const token = req.headers.authorization.split(' ')[1]; // Assuming the token is sent in the 'Authorization' header
  
    // You can perform some additional validation or checks if needed
  
    // Respond with a message indicating successful logout
    res.json({ message: 'User logged out successfully' });
  });
  
// Book CRUD routes

app.post('/api/addBook', async (req, res) => {
  const { title, author, isbn } = req.body;
  
  try {
    // Use the 'db' instance to perform MongoDB operations
    const booksCollection = db.collection('books');
  
    // Create a new book document
    const newBook = {
      title,
      author,
      isbn,
    };
  
    // Insert the new book document into the 'books' collection
    await booksCollection.insertOne(newBook);
  
    res.json({ message: 'Book added successfully' });
  } catch (error) {
    console.error('Error adding book:', error);
    res.sendStatus(500);
  }
});



app.put('/api/updateBook/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, isbn } = req.body;

  try {
    const collection = db.collection('books');
    
    const updatedBook = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { title, author, isbn } },
      { returnOriginal: false }
    );

    res.json(updatedBook.value);
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ message: 'Error updating book' });
  }
});



app.delete('/api/deleteBook/:id', async (req, res) => {
  const bookId = req.params.id;

  try {
    // Use the 'db' instance to perform MongoDB operations
    const booksCollection = db.collection('books');

    // Delete the book document from the 'books' collection
    await booksCollection.deleteOne({ _id: new ObjectId(bookId) });

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.sendStatus(500);
  }
});

app.get('/api/getBooks', async (req, res) => {
  try {
    const booksCollection = db.collection('books');
    const books = await booksCollection.find().toArray();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.sendStatus(500);
  }
});

app.get('/api/getBook/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const booksCollection = db.collection('books');
    const book = await booksCollection.findOne({ _id: new ObjectId(id) });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.sendStatus(500);
  }
});

  
// Protected route with JWT authentication
app.get('/profile', verifyToken, (req, res) => {
  jwt.verify(req.token, 'secretKey', (err, authData) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({ message: 'Access granted', authData });
    }
  });
});

// Book CRUD routes

// Search and Pagination routes

// Search for books by title or author
app.get('/search', verifyToken, (req, res) => {
    const { query } = req.query;
  
    // Implement searching for books by title or author using raw MongoDB query
    db.collection('books')
      .find({
        $or: [{ title: { $regex: query, $options: 'i' } }, { author: { $regex: query, $options: 'i' } }],
      })
      .toArray((err, books) => {
        if (err) {
          console.error('Error searching for books:', err);
          res.sendStatus(500);
        } else {
          res.json(books);
        }
      });
  });
  
  // Get paginated list of books
  app.get('/books', verifyToken, (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
  
    // Implement paginated list of books using raw MongoDB query
    db.collection('books')
      .find()
      .skip(skip)
      .limit(parseInt(limit))
      .toArray((err, books) => {
        if (err) {
          console.error('Error fetching paginated books:', err);
          res.sendStatus(500);
        } else {
          res.json(books);
        }
      });
  });


// Create a new book
app.post('/books', csrfProtection, (req, res) => {
    const { title, author, isbn } = req.body;
  
    // Implement adding a new book using raw MongoDB query
    db.collection('books').insertOne({ title, author, isbn }, (err, result) => {
      if (err) {
        console.error('Error adding a book:', err);
        res.sendStatus(500);
      } else {
        res.json(result.ops[0]);
      }
    });
  });


  
  // Add a new review
app.post('/reviews', (req, res) => {
    const { bookId, userId, rating, text } = req.body;
  
    // Implement adding a new review using raw MongoDB query
    db.collection('reviews').insertOne({ bookId, userId, rating, text }, (err, result) => {
      if (err) {
        console.error('Error adding a review:', err);
        res.sendStatus(500);
      } else {
        res.json(result.ops[0]);
      }
    });
  });
  
  // Get reviews for a book by its ID
  app.get('/reviews/:id', (req, res) => {
    const bookId = req.params.id;
  
    // Implement fetching reviews for a book by its ID using raw MongoDB query
    db.collection('reviews')
      .find({ bookId })
      .toArray((err, reviews) => {
        if (err) {
          console.error('Error fetching reviews:', err);
          res.sendStatus(500);
        } else {
          res.json(reviews);
        }
      });
  });
  
  // Delete a review by its ID
  app.delete('/reviews/:id', (req, res) => {
    const reviewId = req.params.id;
  
    // Implement deleting a review by its ID using raw MongoDB query
    db.collection('reviews').deleteOne({ _id: new ObjectID(reviewId) }, (err, result) => {
      if (err) {
        console.error('Error deleting review:', err);
        res.sendStatus(500);
      } else {
        res.json(result);
      }
    });
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});

// Verify token middleware
function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}
