// E:\emart\server\routes\DanhMucSP.js
import express from 'express';
import { createCategory, getCategoriesByHanghoa, deleteCategory, updateCategory, getAllCategories } from '../controllers/categoryController.js';

const router = express.Router();

router.post('/them', createCategory);  // Create a new category with a hanghoa link
router.get('/byhanghoa/:hanghoaId', getCategoriesByHanghoa);  // Get categories by hanghoa
router.get('/xem', getAllCategories);  // View all categories
router.delete('/delete/:id', deleteCategory);  // Delete category by ID
router.put('/update/:id', updateCategory);  // Update category details
    
export { router as categoryRouter };
