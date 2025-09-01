const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();

// --- Middleware Setup ---
// For development, allow all origins.
// For production, specify exact frontend URL.
app.use(cors());
app.use(express.json());

// --- Routes ---
app.get('/api/test', (req, res) => {
    console.log('Received a request on /api/test');
    res.json({ message: 'Hello from the backend!'})
});

// Registration Route
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required.' });
    }

    try {
        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Insert new user into the database
        const newUser = await db.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, passwordHash]
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: newUser.rows[0]
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Check Username Availability Route
app.get('/api/check-username', async (req, res) => {
    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is required.' });
    }

    try {
        const result = await db.query('SELECT 1 FROM users WHERE username = $1', [username]);
        const isAvailable = result.rows.length === 0;
        res.json({ available: isAvailable });
    } catch (error) {
        console.error('Error checking username availability:', error);
        res.status(500).json({ message: 'Server error checking username availability.' });
    }
});

// Check Email Availability Route
app.get('/api/check-email', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const result = await db.query('SELECT 1 FROM users WHERE email = $1', [email]);
        const isAvailable = result.rows.length === 0;
        res.json({ available: isAvailable });
    } catch (error) {
        console.error('Error checking email availability:', error);
        res.status(500).json({ message: 'Server error checking email availability.' });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    try {
        // Find user by username
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Compare password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // On successful login, create a JWT payload
        const payload = {
            user: {
                id: user.id,
                username: user.username
            }
        };

        // Sign the token with the secret key, setting it to expire in 1 hour
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send the token back to the client
        res.json({ token });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// --- Server Startup ---
// Use a different port than the React app (3000) to avoid conflicts
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});