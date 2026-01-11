import express from 'express';
import User from '../models/user.js';
import Order from '../models/order.js';
import { authenticateJWT, requireRole } from '../middleware/authenticateJWT.js';

const router = express.Router();

router.use(authenticateJWT, requireRole('admin'));

// Listar todos los usuarios
router.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Listar todos los pedidos
router.get('/orders', async (req, res) => {
  const orders = await Order.find().populate('user').populate('items.product');
  res.json(orders);
});

// Filtrar pedidos por estado
router.get('/orders/:status', async (req, res) => {
  const orders = await Order.find({ status: req.params.status }).populate('user').populate('items.product');
  res.json(orders);
});

export default router;