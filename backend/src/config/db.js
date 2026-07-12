const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  ssl: {
    rejectUnauthorized: false,
  },
});

pool
  .connect()
  .then((client) => {
    console.log(
      "Connected to Neon PostgreSQL database"
    );

    client.release();
  })
  .catch((error) => {
    console.error(
      "Database connection error:",
      error.message
    );
  });

module.exports = pool;