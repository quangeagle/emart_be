import { Promotion } from '../models/KhuyenMai.js';
import { category } from '../models/DanhMucSP.js';
import { Product } from '../models/Product.js';

export const createPromotion = async (req, res) => {
  try {
    const { code, discount, categoryId, startDate, endDate } = req.body;

    const categoryData = await category.findById(categoryId);
    if (!categoryData) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const newPromotion = new Promotion({
      code,
      discount,
      category: categoryId,
      startDate,
      endDate
    });
    const savedPromotion = await newPromotion.save();

    // Cập nhật giá mới cho các sản phẩm trong danh mục
    const products = await Product.find({ category: categoryId });
    await Promise.all(products.map(async (prod) => {
      try {
        // Tính toán giá mới dựa trên mức ưu đãi
        const newPrice = prod.price - (prod.price * discount / 100);
        // Cập nhật sản phẩm với giá mới
        await Product.findByIdAndUpdate(prod._id, { newPrice });
      } catch (err) {
        console.error(`Failed to update product ${prod._id}:`, err.message);
      }
    }));

    res.json(savedPromotion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPromotionByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const promotions = await promotion.find({ category: categoryId });
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
