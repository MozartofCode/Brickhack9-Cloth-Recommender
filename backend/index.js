const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

const port = 5000;

const corsOptions = {
  origin: 'http://localhost:3000', 
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware to parse incoming JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const registerRoute = require('./Accounts/register');
const loginRoute = require('./Accounts/login');
const clothesRouter = require('./Wardrobe/clothes');
const recommendationRouter = require('./Wardrobe/recommendation');
const imageRouter = require('./Wardrobe/image');
const addClothesRouter = require('./Wardrobe/addClothes');


app.use('/api/login', loginRoute);
app.use('/api/register', registerRoute);
app.use('/api/clothes', clothesRouter);
app.use('/api/recommendation', recommendationRouter);
app.use('/api/image', imageRouter);
app.use('/api/addClothes', addClothesRouter);



// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',      // MySQL Username
  password: '',  // MySQL password
  database: 'clothes_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});


pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
  connection.release();
});




app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});




