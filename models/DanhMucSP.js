import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    hanghoa: { type: mongoose.Schema.Types.ObjectId, ref: 'hanghoa', required: true }
});

const CategoryModel = mongoose.model('category', CategorySchema);

export { CategoryModel as category };







