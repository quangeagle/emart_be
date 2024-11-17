import mongoose from 'mongoose';

// Định nghĩa schema cho Likelist
const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  versionId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Thêm versionId
  versionName: { type: String, required: true },
  versionPrice: { type: Number, required: true },
  versionImage: { type: String },
});

// Tạo mô hình Likelist với tên mô hình là 'Likelist'
const Likelist = mongoose.model('Likelist', favoriteSchema);

export { Likelist };
