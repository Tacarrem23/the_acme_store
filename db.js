
const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({
  connectionString: 'postgres://localhost/the_acme_store'
});

client.connect();
module.exports = client;

async function createTables() {
  await client.query(`
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );

    CREATE TABLE products (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL
    );

    CREATE TABLE favorites (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) NOT NULL,
      product_id UUID REFERENCES products(id) NOT NULL,
      UNIQUE(user_id, product_id)
    );
  `);
}
async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await client.query(
    'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
    [username, hashedPassword]
  );
  return result.rows[0];
}
async function fetchUsers() {
  const result = await client.query('SELECT * FROM users');
  return result.rows;
}

// Mock data for products
const products = [
  { id: 1, name: 'Widget A', price: 25.99 },
  { id: 2, name: 'Widget B', price: 15.49 },
  { id: 3, name: 'Widget C', price: 10.00 },
];

// Function to get all products
function getProducts() {
  return products;
}

module.exports = { getProducts };

