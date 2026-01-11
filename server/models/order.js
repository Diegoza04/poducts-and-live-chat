import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Producto relacionado
      quantity: { type: Number, required: true },
      price: { type: Number, required: true } // Precio al momento de la compra
    }
  ],
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  total: { type: Number, required: true } // Suma total de la orden
});

const Order = mongoose.model('Order', orderSchema);
export default Order;