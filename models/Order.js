import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  versionId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Thêm versionId
  versionName: { type: String, required: true },
  versionPrice: { type: Number, required: true },
  versionImage: { type: String },
  quantity: { type: Number, required: true },
});

export const Cart = mongoose.model('Cart', cartSchema);
