
import express from 'express';
import { getLowStockProducts,addProductToWarehouse } from '../controllers/warehouse.js';

const router = express.Router();
router.get('/low-stock-products', getLowStockProducts);
router.post('/products', addProductToWarehouse);

export { router as KhoRouter };

