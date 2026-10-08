const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb');

const regd_users = express.Router();
const users = [];
const JWT_SECRET = process.env.JWT_SECRET || 'ibm-book-review-secret';

const isValid = (username) => users.some(user => user.username === username);
const authenticatedUser = (username, password) =>
  users.some(user => user.username === username && user.password === password);

// Login. Returns a JWT and also stores it in the session.
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const accessToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  if (req.session) req.session.authorization = { accessToken, username };
  return res.status(200).json({ message: 'Login successful', accessToken });
});

// Add or modify a review. Only the logged-in user's review can be changed.
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body || {};
  if (!books[isbn]) return res.status(404).json({ message: 'Book not found' });
  if (!review) return res.status(400).json({ message: 'Review is required' });

  books[isbn].reviews[req.user.username] = review;
  return res.status(200).json({
    message: 'Review successfully added/updated',
    reviews: books[isbn].reviews
  });
});

// Delete the logged-in user's own review.
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  if (!books[isbn]) return res.status(404).json({ message: 'Book not found' });
  if (!Object.prototype.hasOwnProperty.call(books[isbn].reviews, req.user.username)) {
    return res.status(404).json({ message: 'Review not found for this user' });
  }

  delete books[isbn].reviews[req.user.username];
  return res.status(200).json({ message: 'Review successfully deleted' });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
