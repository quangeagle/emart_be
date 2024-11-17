import express from 'express';
import { Admin } from '../models/Admin.js';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { PointerStrategy } from 'sso-pointer';
import dotenv from 'dotenv';
import { Supplier } from '../models/NhaCungCap.js';
import { User } from '../models/User.js';
dotenv.config();

const router = express.Router();
const pointer = new PointerStrategy(
    process.env.POINTER_CLIENT_ID,
    process.env.POINTER_CLIENT_SECRET
  );

// Hàm xác thực token chung
const verifyToken = (req, res, next) => {
  // Lấy token từ Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.error('Không có Authorization header'); // Log lỗi nếu không có header
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }

  const token = authHeader.split(' ')[1]; // Lấy token từ Authorization header

  if (!token) {
    console.error('Không có token'); // Log lỗi nếu không có token
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }

  // Kiểm tra tính hợp lệ của token
  jwt.verify(token, process.env.USER_KEY, (err, decoded) => {
    if (err) {
      console.error('Token không hợp lệ hoặc đã hết hạn:', err); // Log chi tiết lỗi
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }

    // Lưu thông tin người dùng vào request
    req.userId = decoded.userId;
    req.email = decoded.email;
    req.role = decoded.role || 'user';
    
    // Tiếp tục với middleware tiếp theo
    next();
  });
};

// Đăng nhập cho Admin và User
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kiểm tra nếu là admin
        const admin = await Admin.findOne({ username });
        if (admin) {
            const validPassword = await bcrypt.compare(password, admin.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Sai mật khẩu' });
            }
            const token = jwt.sign({ username: admin.username, role: admin.role, userId: admin._id }, process.env.ADMIN_KEY, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
            return res.json({ login: true, role: admin.role, username: admin.username, userId: admin._id });
        }

        // Kiểm tra nếu là user
        const user = await Supplier.findOne({ username });
        if (user) {
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Sai mật khẩu' });
            }
            const token = jwt.sign({ username: user.username, role: 'ncc', userId: user._id }, process.env.USER_KEY, { expiresIn: '1h' });
            return res.json({ login: true, role: 'ncc', username: user.username, userId: user._id, token }); // Trả token về
        }
        return res.status(404).json({ message: 'Người dùng không tồn tại' });
    } catch (error) {
        console.error('Lỗi máy chủ:', error.message); // Log lỗi
        res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
    }
});

// Xác thực Admin
const verifyAdmin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(403).json({ message: 'Admin không hợp lệ' });
    }
    jwt.verify(token, process.env.ADMIN_KEY, (err, decoded) => {
        if (err) {
            console.error('Token không hợp lệ:', err); // Log chi tiết lỗi
            return res.status(403).json({ message: 'Token không hợp lệ' });
        }
        req.username = decoded.username;
        req.role = decoded.role;
        if (req.role.startsWith('admin')) {
            next();
        } else {
            return res.status(403).json({ message: 'Quyền không hợp lệ' });
        }
    });
};

// Callback sau khi nhận code từ SSO Pointer
router.get('/callback', async (req, res) => {
  const { code } = req.query;
  console.log('Received code:', code);
  try {
      const accessTokenData = await pointer.getAccessToken(code);
      console.log('Access Token Data:', accessTokenData);

      const {user: { _id: userId, email } } = accessTokenData;

     

      // Kiểm tra xem người dùng đã tồn tại trong database chưa
      let user = await User.findOne({email });

      if (!user) {
    

          const newUser = new User({
            _id: userId,
              email,
        
          });
          user = await newUser.save();
          console.log('Người dùng mới đã được tạo:', user);
      } else {
          // Cập nhật thông tin nếu cần
          user.email = email;
          await user.save();
          console.log('Người dùng đã tồn tại và đã được cập nhật:', user);
      }

      const token = jwt.sign({ email:  user.email, role: 'ncc' , userId: user._id}, process.env.USER_KEY, { expiresIn: '1h' });
      return res.json({ login: true, role: 'ncc', email:  user.email, userId: user._id, token });
  } catch (error) {
      console.error('Error in callback:', error.message); // Log lỗi
      return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message, error: error.message, stack: error.stack });
  }
});

// Route để xác minh người dùng
router.get('/verify', verifyToken, (req, res) => {
    try {
        return res.json({ login: true, role: req.role, email: req.email, userId: req.userId });
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});
// Route để đăng xuất
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ logout: true });
});

export { router as AdminRouter, verifyAdmin };


// import express from 'express';
// import { Supplier } from '../models/NhaCungCap.js';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import { PointerStrategy } from 'sso-pointer';
// import dotenv from 'dotenv';

// dotenv.config();

// const router = express.Router();
// const pointer = new PointerStrategy(process.env.POINTER_API_KEY);

// // Hàm xác thực token chung
// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) {
//     return res.status(403).json({ message: 'Token không hợp lệ' });
//   }
//   const token = authHeader.split(' ')[1];
//   if (!token) {
//     return res.status(403).json({ message: 'Token không hợp lệ' });
//   }
//   jwt.verify(token, process.env.USER_KEY, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ message: 'Token không hợp lệ' });
//     }
//     req.userId = decoded.userId;
//     req.username = decoded.username;
//     req.role = decoded.role || 'user';
//     next();
//   });
// };

// // Đăng nhập cho Admin và Supplier
// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Kiểm tra nếu là admin
//     const admin = await Admin.findOne({ username });
//     if (admin) {
//       const validPassword = await bcrypt.compare(password, admin.password);
//       if (!validPassword) {
//         return res.status(401).json({ message: 'Sai mật khẩu' });
//       }
//       const token = jwt.sign(
//         { username: admin.username, role: admin.role, userId: admin._id },
//         process.env.ADMIN_KEY,
//         { expiresIn: '1h' }
//       );
//       res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'lax' });
//       return res.json({ login: true, role: admin.role, username: admin.username, userId: admin._id });
//     }

//     // Kiểm tra nếu là nhà cung cấp
//     const supplier = await Supplier.findOne({ username });
//     if (supplier) {
//       const validPassword = await bcrypt.compare(password, supplier.password);
//       if (!validPassword) {
//         return res.status(401).json({ message: 'Sai mật khẩu' });
//       }
//       const token = jwt.sign(
//         { username: supplier.username, role: 'supplier', userId: supplier._id },
//         process.env.USER_KEY,
//         { expiresIn: '1h' }
//       );
//       return res.json({ login: true, role: 'supplier', username: supplier.username, userId: supplier._id, token });
//     }

//     return res.status(404).json({ message: 'Người dùng không tồn tại' });
//   } catch (error) {
//     console.error('Lỗi máy chủ:', error.message);
//     res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
//   }
// });

// // Callback sau khi nhận code từ SSO Pointer
// router.get('/callback', async (req, res) => {
//   const { code } = req.query;
//   try {
//     const accessTokenData = await pointer.getAccessToken(code);
//     const { id: userId, email } = accessTokenData;

//     if (!userId || !email) {
//       return res.status(400).json({ message: 'User ID và email là bắt buộc' });
//     }

//     let supplier = await Supplier.findOne({ _id: userId });

//     if (!supplier) {
//       const generatedUsername = email.split('@')[0];
//       const newSupplier = new Supplier({
//         _id: userId,
//         email,
//         username: generatedUsername,
//       });
//       supplier = await newSupplier.save();
//     } else {
//       supplier.email = email;
//       await supplier.save();
//     }

//     const token = jwt.sign(
//       { username: supplier.username, role: 'supplier', userId: supplier._id },
//       process.env.USER_KEY,
//       { expiresIn: '1h' }
//     );
//     return res.json({ login: true, role: 'supplier', username: supplier.username, userId: supplier._id, token });
//   } catch (error) {
//     console.error('Error in callback:', error.message);
//     return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
//   }
// });

// export { router as AdminRouter };

