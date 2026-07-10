const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const patientRoutes = require("./routes/patientRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use("/patients", patientRoutes);

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "✅ Connected to PostgreSQL!",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Database connection failed");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});