// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const asyncHandler = require("../middleware/asyncHandler");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Set this in your environment variables

// Register User
exports.registerUser = asyncHandler(async (req, res) => {
    const { name, username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
    }

    const user = new User({ name, username, password });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
});

// Login User
exports.loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, user: { name: user.name, username: user.username, id: user._id } });
});

// Logout User (client can simply clear the token)
exports.logoutUser = asyncHandler(async (req, res) => {
    // Logout is handled on the client-side by clearing the token.
    res.status(200).json({ message: "User logged out successfully" });
});
