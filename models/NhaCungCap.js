// E:\emart\server\models\NhaCungCap.js
import mongoose from 'mongoose';

const SupplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  image: { type: String }, 
  address: { type: String }, 
});

const SupplierModel = mongoose.model('Supplier', SupplierSchema);

export { SupplierModel as Supplier };
