import mongoose from 'mongoose';

const PhieuNhapSchema = new mongoose.Schema({
    CTPhieuNhap: { type: mongoose.Schema.Types.ObjectId, ref: 'CTPhieuNhap' },
    totalAmount: Number,
    date: { type: Date, default: Date.now }
});

const PhieuNhap = mongoose.model('PhieuNhap', PhieuNhapSchema);

export {  PhieuNhap};
