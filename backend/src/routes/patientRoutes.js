const express = require("express");

const {
  getPatients,
  addPatient,
  updatePatient,
  updatePatientStatus,
  deletePatient,
} = require("../controllers/patientController");

const router = express.Router();

// GET all patients
router.get("/", getPatients);

// ADD a new patient
router.post("/", addPatient);

// UPDATE patient details
router.put("/:id", updatePatient);

// UPDATE only patient status
router.patch("/:id/status", updatePatientStatus);

// DELETE a patient
router.delete("/:id", deletePatient);

module.exports = router;


