import express from 'express';
import { authenticateJWT } from '../middleware/authenticateJWT.js';

const router = express.Router();

router.get('/history', authenticateJWT, async (req, res) => {
  res.json([
    { user: 'System', message: 'Bienvenido al chat', createdAt: new Date() }
  ]);
});

export default router; 
