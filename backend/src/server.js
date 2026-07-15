const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Pool } = require("pg");

dotenv.config();

const app = express();

// Allow local frontend and deployed Vercel frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://mediqueue-cyan.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Connect to Neon PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// HOME ROUTE
// Checks whether backend and database are working
app.get("/", async (req, res) => {
  try {
    await pool.query("SELECT NOW()");

    return res.status(200).json({
      message: "Connected to PostgreSQL!",
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database connection error:", error);

    return res.status(500).json({
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// GET ALL PATIENTS
app.get("/api/patients", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT *
      FROM patients
      ORDER BY
        CASE
          WHEN status = 'waiting' THEN 1
          WHEN status = 'in_progress' THEN 2
          WHEN status = 'completed' THEN 3
          ELSE 4
        END,
        CASE
          WHEN status = 'waiting' THEN severity
        END DESC,
        token_number ASC
    `);

    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching patients:", error);

    return res.status(500).json({
      message: "Unable to fetch patients",
      error: error.message,
    });
  }
});

// ADD A NEW PATIENT
app.post("/api/patients", async (req, res) => {
  try {
    const {
      full_name,
      age,
      symptoms,
      severity,
      status = "waiting",
    } = req.body;

    if (
      !full_name ||
      age === undefined ||
      age === "" ||
      !symptoms ||
      severity === undefined ||
      severity === ""
    ) {
      return res.status(400).json({
        message:
          "Full name, age, symptoms and severity are required",
      });
    }

    // Generate the next token number
    const tokenResult = await pool.query(`
      SELECT
      COALESCE(MAX(token_number), 0) + 1
      AS next_token
      FROM patients
    `);

    const nextToken = tokenResult.rows[0].next_token;

    const result = await pool.query(
      `
      INSERT INTO patients
      (
        full_name,
        age,
        symptoms,
        severity,
        status,
        token_number
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        full_name.trim(),
        Number(age),
        symptoms.trim(),
        Number(severity),
        status,
        nextToken,
      ]
    );

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding patient:", error);

    return res.status(500).json({
      message: "Unable to add patient",
      error: error.message,
    });
  }
});

// UPDATE COMPLETE PATIENT DETAILS
// This route is used by the Edit and Save buttons
app.put("/api/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const {
      full_name,
      age,
      symptoms,
      severity,
    } = req.body;

    if (
      !full_name ||
      age === undefined ||
      age === "" ||
      !symptoms ||
      severity === undefined ||
      severity === ""
    ) {
      return res.status(400).json({
        message: "All patient details are required",
      });
    }

    const result = await pool.query(
      `
      UPDATE patients
      SET
        full_name = $1,
        age = $2,
        symptoms = $3,
        severity = $4
      WHERE id = $5
      RETURNING *
      `,
      [
        full_name.trim(),
        Number(age),
        symptoms.trim(),
        Number(severity),
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(
      "Error updating patient details:",
      error
    );

    return res.status(500).json({
      message: "Patient details could not be updated",
      error: error.message,
    });
  }
});

// UPDATE ONLY PATIENT STATUS
// Used by Call Patient and Mark Completed
app.patch(
  "/api/patients/:id/status",
  async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const allowedStatuses = [
        "waiting",
        "in_progress",
        "completed",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid patient status",
        });
      }

      const result = await pool.query(
        `
        UPDATE patients
        SET status = $1
        WHERE id = $2
        RETURNING *
        `,
        [status, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Patient not found",
        });
      }

      return res.status(200).json(
        result.rows[0]
      );
    } catch (error) {
      console.error(
        "Error updating patient status:",
        error
      );

      return res.status(500).json({
        message:
          "Patient status could not be updated",
        error: error.message,
      });
    }
  }
);

// DELETE A PATIENT
app.delete("/api/patients/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM patients
      WHERE id = $1
      RETURNING *
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      message: "Patient deleted successfully",
      patient: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting patient:", error);

    return res.status(500).json({
      message: "Unable to delete patient",
      error: error.message,
    });
  }
});

// Start the backend server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server is running on port ${PORT}`
  );
});