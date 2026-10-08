const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const { authenticated } = require('./router/auth_users');
const { general } = require('./router/general');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ibm-book-review-secret';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/customer', session({
  secret: process.env.SESSION_SECRET || 'fingerprint_customer',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true }
}));

// JWT middleware protects only the review modification route.
app.use('/customer/auth', (req, res, next) => {
  const authHeader = req.headers.authorization;
  const sessionToken = req.session && req.session.authorization && req.session.authorization.accessToken;
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : sessionToken;

  if (!token) return res.status(401).json({ message: 'User not logged in' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'User not authenticated' });
    req.user = decoded;
    next();
  });
});

app.use('/customer', authenticated);
app.use('/', general);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
