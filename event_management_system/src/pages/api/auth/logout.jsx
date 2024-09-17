const express = require('express');
const router = express.Router();

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    const { username, password } = req.body;

    if( username === 'admin' && password === 'password') {
        res.status(200).json({ message: 'Logout successful' });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});
    module.exports = router;