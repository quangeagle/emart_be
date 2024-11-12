
import express from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/likelistController.js';

const router = express.Router();

// Route để thêm sản phẩm vào danh sách yêu thích
router.post('/add', addFavorite);

// Route để xóa sản phẩm khỏi danh sách yêu thích
router.post('/remove', removeFavorite);

// Route để lấy danh sách yêu thích của người dùng
router.get('/:userId', getFavorites);

export default router;
