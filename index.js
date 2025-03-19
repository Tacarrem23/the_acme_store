const express = require('express');
const app = express();
const client = require('./db');



const express = require('express');
const app = express();
const db = require('./db');

// Set up middleware
app.use(express.json()); // For parsing application/json

// Define a simple route to test the server
app.get('/', (req, res) => {
  res.send('Welcome to ACME Store!');
});

// Add more routes as needed for your application
// For example, a route for getting products
app.get('/products', (req, res) => {
  const products = db.getProducts(); // Use the data layer function
  res.json(products);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
