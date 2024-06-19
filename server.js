const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3030;

// Create a connection to the MySQL database
const dbConnection = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Ganti dengan username MySQL Anda
  password: '', // Ganti dengan password MySQL Anda
  database: 'sensor_data'
});

// Connect to the database
dbConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id', dbConnection.threadId);
});

// Serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Endpoint to get sensor data
app.get('/data', (req, res) => {
  const query = 'SELECT * FROM sensor_readings ORDER BY timestamp DESC';
  dbConnection.query(query, (err, results) => {
    if (err) {
      console.error('Failed to fetch data from MySQL:', err.stack);
      res.status(500).send('Failed to fetch data from MySQL');
      return;
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
