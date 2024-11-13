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
    required: function() { return this.paymentMethod === 'CreditCard' && this.isNew; }
  },
  expiryDate: {
    type: String,
    required: function() { return this.paymentMethod === 'CreditCard' && this.isNew; }
  },
  securityCode: {
    type: String,
    required: function() { return this.paymentMethod === 'CreditCard' && this.isNew; }
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

}, { timestamps: true }); 

export const Shipping = mongoose.model('Shipping', shippingSchema); 