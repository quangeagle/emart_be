import express from 'express';
import { createProduct, getProductsByCategory, deleteProduct, updateProduct , getAllProducts,getProductById, approveProduct,
    rejectProduct,getPendingProducts,getProductsBySupplier,getSupplierProductStatistics,getApprovedProducts,getProductsBySupplierID } from '../controllers/productController.js';

const router = express.Router();
router.get('/choduyet', getPendingProducts);
router.put('/duyet/:id', approveProduct);  // Duyệt sản phẩm
router.put('/tuchoi/:id', rejectProduct);  // Từ chối sản phẩm
router.post('/themSP', createProduct);
router.get('/category/:categoryId', getProductsByCategory);
router.delete('/xoaSP/:id', deleteProduct);
router.put('/suaSP/:id', updateProduct);
router.get('/get', getAllProducts);
router.get('/products/:id', getProductById);
router.get('/supplier/:supplierId', getProductsBySupplier);
router.get('/:supplierId/statistics', getSupplierProductStatistics);
router.get('/approved', getApprovedProducts);
router.get('/products', getProductsBySupplierID);
export { router as productRouter };
