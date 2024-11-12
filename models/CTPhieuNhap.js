import mongoose from 'mongoose';

const CTPhieuNhapSchema = new mongoose.Schema({

    items: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
          productName: String,
          quantity: Number,
          price: Number,  
          newPrice: Number, 
          imageUrl: String ,
          unit:String,
        }
      ],
  totalAmount: Number,
  date: { type: Date, default: Date.now }
});

const CTPhieuNhap = mongoose.model('CTPhieuNhap', CTPhieuNhapSchema);

export { CTPhieuNhap };
