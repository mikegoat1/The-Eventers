const express = require('express');
const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'password') {
        res.status(200).json({ message: 'Register successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;