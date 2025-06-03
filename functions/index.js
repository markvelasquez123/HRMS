const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const functions = require("firebase-functions");



// Initialize Firebase Admin SDK
admin.initializeApp();

const app = express();

// Enable CORS
app.use(cors({ origin: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Import your route handlers
const signUpRoutes = require("./routes/signup");
const employeeRoutes = require("./routes/employee");
const applicantRoutes = require("./routes/applications");

// Mount the routes
app.use("/signup", signUpRoutes);
app.use("/employee", employeeRoutes);
app.use("/applications", applicantRoutes);


// Root route
app.get("/", (req, res) => {
  res.send("Hello from Firebase Functions!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  console.log('404 Not Found:', req.method, req.path);
  res.status(404).json({
    error: 'Not Found',
    path: req.path
  });
});

exports.api = functions.https.onRequest(app);
