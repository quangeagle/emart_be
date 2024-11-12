// E:\emart\server\routes\KhuyenMai.js
import express from 'express';
import { createPromotion, getPromotionByCategory } from '../controllers/promotionController.js';

const router = express.Router();

router.post('/add', createPromotion);
router.get('/category/:categoryId', getPromotionByCategory);

export { router as promotionRouter };
