import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  orders: [{ type: mongoose.Types.ObjectId, ref: 'Order' }] // Relación opcional (historial de órdenes)
});

const User = mongoose.model('User', userSchema);
export default User;
