const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./.env" });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Routes
app.use("/api/v1", require("./routes/taskData"));
app.use("/api/auth", require("./routes/authRoutes"));

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
