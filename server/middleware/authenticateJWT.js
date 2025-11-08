import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ message: 'Falta token' })
  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(403).json({ message: 'Token inválido' })
  }
}

export function authenticateSocket(socket, next) {
  const token = socket.handshake.auth?.token
  if (!token) return next(new Error('Auth error'))
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    socket.user = decoded
    next()
  } catch (err) {
    next(new Error('Auth error'))
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: 'No autorizado' })
    }
    next()
  }
}
