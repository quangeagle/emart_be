import mongoose from 'mongoose';

const WarehouseSchema = new mongoose.Schema({
  
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
});

const Warehouse = mongoose.model('Warehouse', WarehouseSchema);

export { Warehouse };   