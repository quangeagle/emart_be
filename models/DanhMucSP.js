// import mongoose from "mongoose";

// const CategorySchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     hanghoa: { type: mongoose.Schema.Types.ObjectId, ref: 'hanghoa', required: true }
// });

// const CategoryModel = mongoose.model('category', CategorySchema);

// export { CategoryModel as category };




import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    hanghoa: { type: mongoose.Schema.Types.ObjectId, ref: 'hanghoa', required: true },
    unitOptions: [
        {
            unitName: { type: String, required: true },
            quantities: { type: [Number], required: true }  // Mảng lưu trữ nhiều số lượng cho mỗi đơn vị
        }
    ]
});


const CategoryModel = mongoose.model('category', CategorySchema);

export { CategoryModel as category };



