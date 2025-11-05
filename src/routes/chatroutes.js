const express = require('express');
const { authenticateJWT } = require('../middleware/authenticateJWT');

const router = express.Router();

router.get('/me', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
