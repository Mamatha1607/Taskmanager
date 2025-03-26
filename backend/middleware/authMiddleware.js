const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware to verify JWT token
const authenticateUser = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided or malformed.' });
    }

    const token = authHeader.split(' ')[1]; // ✅ FIX: Extract only the token

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔓 Token decoded user:", decoded);
        req.user = decoded; // Store user info in request object
        next();
    } catch (err) {
        console.error("❌ Token verification failed:", err.message);
        res.status(400).json({ error: 'Invalid token' });
    }
};

module.exports = authenticateUser;
