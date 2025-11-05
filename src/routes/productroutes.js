const express = require('express');
const Product = require('../models/product');
const { authenticateJWT, requireRole } = require('../middleware/authenticateJWT');

const router = express.Router();

//publico
router.get('/', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});
//publico
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(product);
});

//admin
router.post('/', authenticateJWT, requireRole('admin'), async (req, res) => {
  const { title, description, price, image } = req.body;
  const product = new Product({ title, description, price, image, createdBy: req.user.id });
  await product.save();
  res.status(201).json(product);
});
//admin
router.put('/:id', authenticateJWT, requireRole('admin'), async (req, res) => {
  const updates = req.body;
  const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json(product);
});
//admin
router.delete('/:id', authenticateJWT, requireRole('admin'), async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
  res.json({ message: 'Eliminado' });
});

module.exports = router;
