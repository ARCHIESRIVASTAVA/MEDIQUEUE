const express = require("express");
const router = express.Router();

const {
  getPatients,
  addPatient,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

// GET all patients
router.get("/", getPatients);

// ADD a new patient
router.post("/", addPatient);

// UPDATE a patient by ID
router.put("/:id", updatePatient);

// DELETE a patient by ID
router.delete("/:id", deletePatient);

module.exports = router;
