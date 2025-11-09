// server/routes/chatroutes.js
import express from 'express';
import Message from '../models/message.js';
import { authenticateJWT } from '../middleware/authenticateJWT.js';

const router = express.Router();

router.get('/history', authenticateJWT, async (req, res) => {
  try {
    const docs = await Message.find().sort({ createdAt: -1 }).limit(100).lean();
    res.json(docs.reverse());
  } catch (e) {
    res.status(500).json({ message: 'No se pudo cargar el historial' });
  }
});

export default router;
