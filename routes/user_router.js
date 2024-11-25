import express from 'express';
import { getUserById } from '../controllers/userController.js';

const router = express.Router();

// Route lấy thông tin người dùng theo ID
router.get('/user/:userId', getUserById);

export { router as UserRouter2 };
