// Filename: image.js
// Author: Bertan Berker
// This file calls the python file to handle image processing and returns the color and the type of the cloth

const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const { spawn } = require('child_process');
const multer = require('multer');
const path = require('path');


// Set up storage for image uploads, temporary
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '..', 'Pictures');
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});


const upload = multer({ storage: storage })


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
router.post('/',  upload.single('image'), (req, res) => {

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const image = req.file.path;
 
  // Construct the absolute path to the Python script
  const pythonScriptPath = path.join(__dirname, '..', 'AI', 'AI.py');
  const pythonProcess = spawn('python', [pythonScriptPath, image], {
    stdio: ['pipe', 'pipe', 'pipe'], // This will capture stdout and stderr
  });
  
  let cloth = '';
  let color = '';
  let pythonStdout = '';
  let pythonStderr = '';
  
  pythonProcess.stdout.on('data', (data) => {
    pythonStdout += data.toString(); // Collect stdout data
  });
  
  pythonProcess.stderr.on('data', (data) => {
    pythonStderr += data.toString(); // Collect stderr data
  });
  
  pythonProcess.on('error', (err) => {
    console.error('Error executing Python script:', err);
    res.status(500).json({ error: 'Error executing Python script' });
  });
  
  pythonProcess.on('exit', (code) => {
    console.log('Python script exited with code:', code);
  
    if (code === 0) {
      // If the Python script exited successfully (code 0), handle the JSON response
      try {
        const result = JSON.parse(pythonStdout.trim());
        if (result.color) {
          color = result.color;
        }

        if (result.cloth) {
          cloth = result.cloth;
        }

        if (cloth.trim() === "jersey") {
          cloth = "tshirt";
        }

        if (cloth.trim() === "wool") {
          cloth = "pants";
        }

        color = color.toLowerCase();
        cloth = cloth.toLowerCase();

        console.log('Processed cloth and color:', color);        
        console.log('Processed cloth and color:', cloth);

        res.json({ "color": color, "cloth": cloth });
      } catch (jsonError) {
        console.error('Error parsing JSON response from Python script:', jsonError);
        res.status(500).json({ error: 'Error parsing JSON response from Python script' });
      }
    } else {
      // If the Python script exited with an error (non-zero code), handle the error
      console.error('Error from Python script:', pythonStderr);
      res.status(500).json({ error: 'Error from Python script' });
    }
  });
  
});



module.exports = router;