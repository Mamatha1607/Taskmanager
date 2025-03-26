const express = require('express');
const pool = require('../db'); // Database connection
const bcrypt = require('bcryptjs'); // Password hashing
const jwt = require('jsonwebtoken'); // Token generation
require('dotenv').config();

const router = express.Router();

// Debugging Middleware - Log all incoming requests
router.use((req, res, next) => {
    console.log("Incoming Request:", req.method, req.url);
    console.log("Request Headers:", req.headers);
    console.log("Request Body:", req.body);
    next();
});

// ✅ User Signup (Register)
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // ✅ Hash the password before storing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Insert new user into database
        const newUser = await pool.query(
            `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
            [name, email, hashedPassword]
        );

        const { password: _, ...userWithoutPassword } = newUser.rows[0];

        // ✅ Generate JWT token with name and email
        const token = jwt.sign(
            {
                id: userWithoutPassword.id,
                name: userWithoutPassword.name,
                email: userWithoutPassword.email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user: userWithoutPassword });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
});

// ✅ User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.rows[0].password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // ✅ Generate JWT token with name and email
        const token = jwt.sign(
            {
                id: user.rows[0].id,
                name: user.rows[0].name,
                email: user.rows[0].email
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user.rows[0].id,
                name: user.rows[0].name,
                email: user.rows[0].email
            }
        });
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: 'Server error', message: err.message });
    }
});

module.exports = router;
