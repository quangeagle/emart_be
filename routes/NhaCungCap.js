// E:\emart\server\routes\NhaCungCap.js
import express from 'express';
import { createSupplier , getAllSuppliers,getIN4,PUTIN4,countSuppliers} from '../controllers/supplierController.js';

const router = express.Router();

router.post('/add', createSupplier);
router.get('/seen', getAllSuppliers); 
router.get('/sum', countSuppliers); 
router.get('/:supplierId', getIN4); 
router.put('/:supplierId', PUTIN4); 


export { router as supplierRouter };
