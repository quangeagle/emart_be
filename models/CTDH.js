import mongoose from 'mongoose';

const CTDHSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipping' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: String,
      quantity: Number,
      price: Number,
      imageUrl : String 
      
    }
  ],
  totalAmount: Number,
  date: { type: Date, default: Date.now }
});

const CTDH = mongoose.model('CTDH', CTDHSchema);

export { CTDH };
