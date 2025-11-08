import express from 'express'
import Product from '../models/product.js'
import { authenticateJWT, requireRole } from '../middleware/authenticateJWT.js'

const router = express.Router()


router.get('/', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 })
  res.json(products)
})

router.post('/', authenticateJWT, requireRole('admin'), async (req, res) => {
  const product = await Product.create(req.body)
  res.status(201).json(product)
})

router.put('/:id', authenticateJWT, requireRole('admin'), async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
  res.json(updated)
})

router.delete('/:id', authenticateJWT, requireRole('admin'), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id)
  res.json({ message: 'Producto eliminado' })
})

export default router
