const jwt = require('jsonwebtoken');
const config = require('../config');

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization || req.query.token;
  if (!authHeader) return res.status(401).json({ message: 'Token requerido' });


  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  try {
    const payload = jwt.verify(token, config.JWT_SECRET);
    req.user = payload; 
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'No autenticado' });
    if (req.user.role !== role) return res.status(403).json({ message: 'Permiso denegado' });
    next();
  };
}

module.exports = { authenticateJWT, requireRole };
