import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import { JWT_SECRET } from '../config.js'

const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ username, password: hashed, role })
    res.status(201).json(user)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' })

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return res.status(401).json({ message: 'Contraseña incorrecta' })

    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '2h' })
    res.json({ token })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
