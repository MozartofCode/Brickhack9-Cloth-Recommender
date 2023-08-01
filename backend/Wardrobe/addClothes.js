// Filename: addClothes.js
// Author: Bertan Berker
// This file adds a new cloth to a user's wardrobe

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


// Route to update the clothes array of a specific user
router.post('/', (req, res) => {
  const { username, cloth } = req.body;

  // First, find the user based on the username
  const findUserSql = 'SELECT * FROM users WHERE username = ?';

  // Use the connection pool to execute the query to find the user
  pool.query(findUserSql, [username], (err, result) => {
    if (err) {
      console.error('Error finding user:', err);
      res.status(500).json({ error: 'Error finding user' });
    } else {
      if (result.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        // Now, update the clothes array for the specified user using their username
        const updateClothesSql = 'UPDATE clothes SET clothes = JSON_ARRAY_APPEND(clothes, "$", ?) WHERE username = ?';

        // Use the connection pool to execute the query to update the clothes array
        pool.query(updateClothesSql, [cloth, username], (err, result) => {
          if (err) {
            console.error('Error updating user clothes:', err);
            res.status(500).json({ error: 'Error updating user clothes' });
          } else {
            // If the query is successful, return a success message
            console.log('Cloth added to wardrobe successfully in the backend:', cloth);
            res.json({ message: 'Cloth added to wardrobe successfully!' });
          }
        });
      }
    }
  });
});


module.exports = router;