import express from 'express';
import bcrypt from 'bcryptjs';
import { Supplier } from '../models/NhaCungCap.js';
import { User } from '../models/User.js';
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, username, password, email} = req.body;

  try {
    const user = await Supplier.findOne({ username });
    if (user) {
      return res.status(400).json({ success: false, message: 'Username đã tồn tại' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Supplier({
      name,
      username,
      password: hashedPassword,
      email,
     
    });

    await newUser.save();
    return res.status(201).json({ success: true, message: 'Đăng ký thành công!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Đăng ký thất bại. Vui lòng thử lại.', error });
  }
});
router.get('/count', async (req, res) => {
  try {
    const userCount = await User.countDocuments(); // Đếm tổng số người dùng trong database
    res.status(200).json({ count: userCount });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy số lượng người dùng' });
  }
});



export {router as UserRouter}
