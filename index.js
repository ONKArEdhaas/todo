const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Add this to serve static files
require("dotenv").config({ path: "./.env" });

// Connect to MongoDB
const dbURL = process.env.NODE_ENV === 'production' ? process.env.OTHER : process.env.MONGODB_URL;

mongoose.connect(process.env.OTHER, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 150000, // 
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const app = express();

// CORS configuration to allow requests from the React frontend in development and production
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 'https://todo-24ow.onrender.com' : 'http://localhost:5173',
    credentials: true,  // Allow credentials (cookies) to be sent along with requests
}));

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1", require("./routes/mailRoutes"));
app.use("/api/v1", require("./routes/taskData"));
app.use("/api/v1", require("./routes/companyRoutes"));
app.use("/api/v1", require("./routes/employeeRoutes"));
app.use("/api/v1", require("./routes/emailRoutes"));
app.use('/api/v1', require('./routes/habitRoutes'));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/v1", require("./routes/gpt"));

// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the React app (build folder)
    app.use(express.static(path.join(__dirname, 'public')));

    // Catch-all route to serve index.html for React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
}

// 404 Handler
app.use("*", (req, res) => {
    res.status(404).json({ message: "Resource not found" });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error(err); // Log error details for debugging
    res.status(500).json({ message: err.message || "Something went wrong" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
