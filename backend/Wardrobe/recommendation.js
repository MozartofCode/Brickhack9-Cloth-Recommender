// Filename: recommendation.js
// Author: Bertan Berker
// This file gives recommendations to the user based on their clothes


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


        // Parse the clothes data from the result
        const clothesList = result[0].clothes;

        // Separate the clothes into shirts and pants based on the first word in each element
        const shirts = [];
        const pants = [];

        clothesList.forEach((cloth) => {
          const firstWord = cloth.split(' ')[0];
          if (firstWord === 'tshirt' || firstWord === 'shirt') {
            shirts.push(cloth);
          } else if (firstWord === 'pants') {
            pants.push(cloth);
          }
        });

        // Create a recommendation object to hold the recommended clothing combinations
        const recommendations = [];

        // Define the color combinations based on the provided information 
        const colorCombinations = {
          red: ['orange', 'yellow', 'pink'],
          orange: ['red', 'yellow', 'pink'],
          yellow: ['orange', 'green', 'white'],
          green: ['yellow', 'blue', 'white'],
          blue: ['green', 'purple', 'white'],
          purple: ['blue', 'pink', 'white'],
          pink: ['red', 'purple', 'white'],
          white: ['any color'],
          black: ['any color'],
        };

        // Generate recommendations for each color of pants
        pants.forEach((pantsColor) => {
          const color = pantsColor.split(' ')[1];
          if (colorCombinations[color]) {
            colorCombinations[color].forEach((shirtColor) => {
              shirts.forEach((shirt) => {
                if (shirt.includes(shirtColor)) {
                  // add to array of recommendations
                  const shirtColorOnly = shirt.split(' ')[1];
                  const recommendation = `${color} pants - ${shirtColorOnly} shirt`;
                  recommendations.push(recommendation);
                }
              });
            });
          }
        });

        // Send the recommendations as a JSON response
        
        res.json({clothes: recommendations});


      } else {
        // If the user does not exist or has no clothes, return an empty array
        res.json({clothes: []});
      }
    }
  });


});



module.exports = router;