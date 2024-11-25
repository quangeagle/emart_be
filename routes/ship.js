// routes/shippingRoutes.js
import express from 'express';
import { createShipping, getAllShippingOrders,processPayment} from '../controllers/shippingController.js'; // Import cả hai hàm

const router = express.Router();

// Route để tạo đơn hàng
router.post('/themship', createShipping);

// Route để lấy tất cả đơn hàng
router.get('/orders', getAllShippingOrders);
router.post('/processPayment', processPayment);


export { router as shippingRoutes };
