const pool = require("../config/db");

// GET all patients in queue priority order
const getPatients = async (req, res) => {
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

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching patients:", error);

    res.status(500).json({
      message: "Error fetching patients",
    });
  }
};

// ADD a new patient
const addPatient = async (req, res) => {
  try {
    const { full_name, age, symptoms, severity } = req.body;

    if (!full_name || !age || !symptoms || !severity) {
      return res.status(400).json({
        message: "Please fill in all patient details",
      });
    }

    // Find the next token number
    const tokenResult = await pool.query(`
      SELECT COALESCE(MAX(token_number), 0) + 1 AS next_token
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
      VALUES ($1, $2, $3, $4, 'waiting', $5)
      RETURNING *
      `,
      [full_name, age, symptoms, severity, nextToken]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding patient:", error);

    res.status(500).json({
      message: "Error adding patient",
    });
  }
};

// UPDATE patient details
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const { full_name, age, symptoms, severity } = req.body;

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
      [full_name, age, symptoms, severity, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating patient:", error);

    res.status(500).json({
      message: "Error updating patient",
    });
  }
};

// UPDATE patient status
const updatePatientStatus = async (req, res) => {
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

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating patient status:", error);

    res.status(500).json({
      message: "Error updating patient status",
    });
  }
};

// DELETE a patient
const deletePatient = async (req, res) => {
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

    res.status(200).json({
      message: "Patient deleted successfully",
      patient: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting patient:", error);

    res.status(500).json({
      message: "Error deleting patient",
    });
  }
};

// Export every controller function
module.exports = {
  getPatients,
  addPatient,
  updatePatient,
  updatePatientStatus,
  deletePatient,
};