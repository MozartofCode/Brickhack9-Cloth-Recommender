// Filename: clothes.js
// Author: Bertan Berker
// This file gets user's clothes

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


// Route to get the clothes of a specific user
router.get('/', (req, res) => {
  const { username } = req.query;

  // SQL query to get the clothes for the specified user
  const sql = 'SELECT clothes FROM clothes WHERE username = ?';

  // Use the connection pool to execute the query
  pool.query(sql, [username], (err, result) => {
    if (err) {
      console.error('Error fetching user clothes:', err);
      res.status(500).json({ error: 'Error fetching user clothes' });
    } else {
      // If the query is successful, return the clothes data as a JSON response
      if (result.length > 0) {
        res.json({ clothes: result[0].clothes });
      } else {
        // If the user does not exist or has no clothes, return an empty array
        res.json({ clothes: [] });
      }
    }
  });
});



module.exports = router;
