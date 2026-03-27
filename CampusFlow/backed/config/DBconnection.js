const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',        // your pg username
  host: 'localhost',
  database: 'campusflow',
  password: '1234',
  port: 5432,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Error connecting to DB:', err.stack);
  }
  console.log('✅ Connected to PostgreSQL');
  release();
});

module.exports = pool;