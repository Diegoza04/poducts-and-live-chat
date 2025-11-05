const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username y password son requeridos' });
  try {
    const existing = await User.findOne({ username });
    if (existing) return res.status(409).json({ message: 'Usuario ya existe' });

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({ username, passwordHash, role: role || 'user' });
    await user.save();
    res.status(201).json({ message: 'Usuario creado', user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear usuario', error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'username y password son requeridos' });
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Credenciales inválidas' });

    const payload = { id: user._id, username: user.username, role: user.role };
    const token = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ message: 'Error en login', error: err.message });
  }
});

module.exports = router;
