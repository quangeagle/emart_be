import express from 'express';
import {
  createHanghoa,
  getAllHanghoas,
  getHanghoaById,
  updateHanghoa,
  deleteHanghoa,
} from '../controllers/HangHoaController.js';

const router = express.Router();

router.post('/create', createHanghoa);       // Create a new hanghoa
router.get('/all', getAllHanghoas);          // Get all hanghoas
router.get('/:id', getHanghoaById);          // Get a hanghoa by ID
router.put('/update/:id', updateHanghoa);    // Update hanghoa by ID
router.delete('/delete/:id', deleteHanghoa); // Delete hanghoa by ID

export { router as hanghoaRouter };
