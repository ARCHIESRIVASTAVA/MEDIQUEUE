const pool = require("../config/db");

// GET all patients
const getPatients = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM patients ORDER BY token_number"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching patients",
    });
  }
};

// ADD a new patient
const addPatient = async (req, res) => {
  try {
    const { full_name, age, symptoms, severity } = req.body;

    const result = await pool.query(
      `INSERT INTO patients
      (full_name, age, symptoms, severity)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [full_name, age, symptoms, severity]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error adding patient",
    });
  }
};

const ALLOWED_STATUSES = ["waiting", "in_progress", "completed"];

// UPDATE an existing patient (full edit and/or status transition)
const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, age, symptoms, severity, status } = req.body;

    const fields = [];
    const values = [];
    let paramIndex = 1;

    // full_name: only validate/update if provided
    if (full_name !== undefined) {
      if (typeof full_name !== "string" || full_name.trim().length === 0) {
        return res.status(400).json({
          message: "full_name must not be empty",
        });
      }
      fields.push(`full_name = $${paramIndex++}`);
      values.push(full_name);
    }

    // age: only validate/update if provided
    if (age !== undefined) {
      if (typeof age !== "number" || Number.isNaN(age) || age <= 0) {
        return res.status(400).json({
          message: "age must be a positive number",
        });
      }
      fields.push(`age = $${paramIndex++}`);
      values.push(age);
    }

    // symptoms: only validate/update if provided
    if (symptoms !== undefined) {
      if (typeof symptoms !== "string" || symptoms.trim().length === 0) {
        return res.status(400).json({
          message: "symptoms must not be empty",
        });
      }
      fields.push(`symptoms = $${paramIndex++}`);
      values.push(symptoms);
    }

    // severity: only validate/update if provided
    if (severity !== undefined) {
      if (
        typeof severity !== "number" ||
        !Number.isInteger(severity) ||
        severity < 1 ||
        severity > 5
      ) {
        return res.status(400).json({
          message: "severity must be an integer between 1 and 5",
        });
      }
      fields.push(`severity = $${paramIndex++}`);
      values.push(severity);
    }

    // status: only validate/update if provided
    if (status !== undefined) {
      if (!ALLOWED_STATUSES.includes(status)) {
        return res.status(400).json({
          message: `status must be one of: ${ALLOWED_STATUSES.join(", ")}`,
        });
      }
      fields.push(`status = $${paramIndex++}`);
      values.push(status);
    }

    // At least one field must be present
    if (fields.length === 0) {
      return res.status(400).json({
        message: "At least one field must be provided to update",
      });
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE patients
      SET ${fields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating patient",
    });
  }
};

// DELETE a patient
const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM patients WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json({
      message: "Patient deleted successfully",
      patient: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error deleting patient",
    });
  }
};

module.exports = {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
};