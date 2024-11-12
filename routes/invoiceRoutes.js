// routes/invoiceRoutes.js
import express from 'express';
import { createInvoice, getInvoiceById, getAllInvoices ,getInvoices} from '../controllers/invoiceController.js';

const router = express.Router();

// Route để tạo hóa đơn
router.post('/create', createInvoice);

// Route để lấy hóa đơn theo ID
router.get('/:id', getInvoiceById);

// Route để lấy tất cả hóa đơn
router.get('/get', getAllInvoices);
router.get('/', getInvoices);
export { router as invoiceRoutes };
