import express from 'express';
import { addToCart,getCart,removeFromCart,updateCartItemQuantity } from '../controllers/OrderController.js';

const router = express.Router();

// Thêm sản phẩm vào giỏ hàng
router.post('/add', addToCart);

// Lấy giỏ hàng của người dùng
router.get('/:userId', getCart);

router.post('/xoa', removeFromCart);
router.post('/update', updateCartItemQuantity);
export { router as OrderRouter };
