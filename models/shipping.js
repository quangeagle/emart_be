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
  creditCardNumber: {
    type: String,
    required: function() { return this.paymentMethod === 'CreditCard'; }
  },
  expiryDate: {
    type: String,
    required: function() { return this.paymentMethod === 'CreditCard'; }
  },
  securityCode: {
    type: String,
    required: function() { return this.paymentMethod === 'CreditCard'; }
  },
  note: {
    type: String,
    default: ''
  },
  orderItems: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Shipping = mongoose.model('Shipping', shippingSchema); // Sửa tên model
