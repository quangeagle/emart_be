import { Likelist } from '../models/Likelist.js';
import { Product } from '../models/Product.js'; // Sử dụng tên đúng là 'Product'
import { User } from '../models/User.js';

// Thêm sản phẩm vào danh sách yêu thích
const addFavorite = async (req, res) => {
  try {
    const { userId, productId, versionId, versionName, versionPrice, versionImage } = req.body;

    // Kiểm tra sự tồn tại của người dùng và sản phẩm
    const user = await User.findById(userId);
    const product = await Product.findById(productId);

    if (!user || !product) {
      return res.status(404).json({ message: 'Người dùng hoặc sản phẩm không tồn tại' });
    }

    // Kiểm tra xem sản phẩm phiên bản này đã có trong danh sách yêu thích chưa
    const existingFavorite = await Likelist.findOne({ userId, productId, versionId });
    if (existingFavorite) {
      return res.status(400).json({ message: 'Sản phẩm này đã có trong danh sách yêu thích' });
    }

    // Thêm sản phẩm vào danh sách yêu thích
    const newFavorite = new Likelist({
      userId,
      productId,
      versionId,
      versionName,
      versionPrice,
      versionImage,
    });
    await newFavorite.save();

    res.status(201).json({ message: 'Sản phẩm đã được thêm vào danh sách yêu thích', favorite: newFavorite });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra', error });
  }
};

// Xóa sản phẩm khỏi danh sách yêu thích
const removeFavorite = async (req, res) => {
  try {
    const { userId, productId, versionId } = req.body;

    // Kiểm tra xem sản phẩm phiên bản này có trong danh sách yêu thích không
    const result = await Likelist.deleteOne({ userId, productId, versionId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Sản phẩm này không có trong danh sách yêu thích' });
    }

    res.json({ message: 'Sản phẩm đã được xóa khỏi danh sách yêu thích' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra', error });
  }
};

// Lấy danh sách yêu thích của người dùng
const getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    // Lấy danh sách yêu thích của người dùng với thông tin sản phẩm và phiên bản
    const favorites = await Likelist.find({ userId })

    if (favorites.length === 0) {
      return res.status(404).json({ message: 'Danh sách yêu thích trống' });
    }

    res.json({ favorites });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra', error });
  }
};

export { addFavorite, removeFavorite, getFavorites };
