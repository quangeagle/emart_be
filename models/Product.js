


import mongoose from 'mongoose';


// Khai báo versionSchema trước khi sử dụng
const versionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  unit: { type: String, required: true }, 
  QuantityVersion: { type: Number, required: true }, 
  quantity: { type: Number, required: true },  
  totalQuantity: { type: Number, required: true }, 
  imageUrl: { type: String, required: true },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  discount: { type: Number, default: 0 },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  versions: [versionSchema]  // Sử dụng versionSchema đã khai báo
});



const Product = mongoose.model('Product', productSchema);

export { Product };
