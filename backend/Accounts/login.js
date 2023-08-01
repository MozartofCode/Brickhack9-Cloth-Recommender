// Filename: login.js
// Author: Bertan Berker
// This file handles the login functionality


const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clothes_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Route for handling user login
router.post('/', (req, res) => {
  const { username, password } = req.body;

  // Find the user in the database by the provided username
  const query = 'SELECT * FROM users WHERE username = ?';
  pool.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error querying the database:', err);
      return res.status(500).json({ error: 'Failed to login' });
    }

    // Check if the user with the provided username exists
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = results[0];
    
    // Compare the provided password with the password stored in the database
    if (password !== user.password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

      res.json({ message: 'Login successful!' });
    });
  });

module.exports = router;
