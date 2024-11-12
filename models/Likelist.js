import mongoose from 'mongoose';

// Định nghĩa schema cho Likelist
const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
});

// Tạo mô hình Likelist với tên mô hình là 'Likelist'
const Likelist = mongoose.model('Likelist', favoriteSchema);

export { Likelist };
