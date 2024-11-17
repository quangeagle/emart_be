// models/shipping.js
import mongoose from 'mongoose';

const shippingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  selectedDate: {
    type: Date,
    required: true
  },
  selectedTime: {
    type: String,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'CreditCard'],
    required: true
  },
 
  
  
  note: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'canceled'],
    default: 'pending', 
  },
  orderItems: [{
    versionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product.versions', // Điều này tham chiếu đến phiên bản của sản phẩm
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true }
  }],
}, { timestamps: true });


export const Shipping = mongoose.model('Shipping', shippingSchema); 