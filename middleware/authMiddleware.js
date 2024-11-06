// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const authenticate = asyncHandler((req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
});

module.exports = authenticate;
