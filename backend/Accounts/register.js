// Filename: register.js
// Author: Bertan Berker
// This file handles the register functionality

const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Create a MySQL connection pool (same as before)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'clothes_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


router.post('/', (req, res) => {
  try {
    const { username, password } = req.body;
  
    // Perform the MySQL query to insert a new user into the users table
    pool.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, result) => {
      if (err) {
        console.error('Error inserting user into MySQL:', err);
        res.status(500).json({ error: 'Failed to register user' });
      } else {
        console.log('User registered successfully in users table!');
  
        const userId = result.insertId;

        // Perform the MySQL query to insert a new user into the clothes table
        pool.query('INSERT INTO clothes (user_id, username, clothes) VALUES (?, ?, ?)', [userId, username, '[]'], (err, result) => {
          if (err) {
            console.error('Error inserting user into clothes table:', err);
            res.status(500).json({ error: 'Failed to register user' });
          } else {
            console.log('User registered in clothes table successfully!');
            res.json({ message: 'User registered successfully!' });
          }
        });
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
  
});


module.exports = router;
