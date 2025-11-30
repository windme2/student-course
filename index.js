require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');

// Serve frontend static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
const studentRoutes = require("./routes/students");
const courseRoutes = require("./routes/courses");
const enrollmentRoutes = require("./routes/enrollments");

// Use Routes
app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);

// Root Route (Health Check)
app.get("/", (req, res) => {
  // If public/index.html exists, it will be served by the static middleware.
  res.json({ message: "Welcome to Student Course Management API" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
