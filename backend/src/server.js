const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const app = express();

// Allow both local frontend and deployed Vercel frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mediqueue-cyan.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

app.use(express.json());

// Connect to Neon PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Home route: checks backend and database connection
app.get("/", async (req, res) => {
  try {
    await pool.query("SELECT NOW()");

    res.status(200).json({
      message: "Connected to PostgreSQL!",
      time: new Date().toISOString()
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      message: "Database connection failed",
      error: error.message
    });
  }
});

// Get all patients
app.get("/api/patients", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM patients ORDER BY token_number ASC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching patients:", error);

    res.status(500).json({
      message: "Unable to fetch patients",
      error: error.message
    });
  }
});

// Add a new patient
app.post("/api/patients", async (req, res) => {
  try {
    const {
      full_name,
      age,
      symptoms,
      severity,
      status = "Waiting"
    } = req.body;

    if (
      !full_name ||
      age === undefined ||
      !symptoms ||
      severity === undefined
    ) {
      return res.status(400).json({
        message:
          "Full name, age, symptoms and severity are required"
      });
    }

    // Generate the next token number
    const tokenResult = await pool.query(
      "SELECT COALESCE(MAX(token_number), 0) + 1 AS next_token FROM patients"
    );

    const nextToken = tokenResult.rows[0].next_token;

    const result = await pool.query(
      `INSERT INTO patients
      (full_name, age, symptoms, severity, status, token_number)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        full_name,
        age,
        symptoms,
        severity,
        status,
        nextToken
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding patient:", error);

    res.status(500).json({
      message: "Unable to add patient",
      error: error.message
    });
  }
});

// Update patient status
app.put("/api/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "Patient status is required"
      });
    }

    const result = await pool.query(
      `UPDATE patients
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating patient:", error);

    res.status(500).json({
      message: "Unable to update patient",
      error: error.message
    });
  }
});

// Delete a patient
app.delete("/api/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM patients WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    res.status(200).json({
      message: "Patient deleted successfully",
      patient: result.rows[0]
    });
  } catch (error) {
    console.error("Error deleting patient:", error);

    res.status(500).json({
      message: "Unable to delete patient",
      error: error.message
    });
  }
});

// Use Render's port in deployment
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});