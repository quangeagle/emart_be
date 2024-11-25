import { User } from '../models/User.js';

// Lấy thông tin người dùng qua userId
export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    // Kiểm tra xem userId có được truyền vào không
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Tìm người dùng theo ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Trả về thông tin người dùng
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};
