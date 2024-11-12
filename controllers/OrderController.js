// import { Cart } from '../models/Order.js';
// import { User } from '../models/User.js';
// import { product } from '../models/product.js';
// import mongoose from 'mongoose';

// // Thêm sản phẩm vào giỏ hàng
//  const addToCart = async (req, res) => {
//   try {
//     const { userId, productId, quantity } = req.body;

//     const user = await User.findById(userId);
//     const Product = await product.findById(productId);

//     if (!user || !Product) {
//       return res.status(404).json({ message: 'Người dùng hoặc sản phẩm không tồn tại' });
//     }

//     // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
//     const existingCartItem = await Cart.findOne({ userId, productId });
//     if (existingCartItem) {
//       // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
//       existingCartItem.quantity += quantity;
//       await existingCartItem.save();
//       return res.json({ message: 'Sản phẩm đã được cập nhật trong giỏ hàng', cartItem: existingCartItem });
//     }

//     // Thêm sản phẩm vào giỏ hàng
//     const newCartItem = new Cart({ userId, productId, quantity });
//     await newCartItem.save();

//     res.status(201).json({ message: 'Sản phẩm đã được thêm vào giỏ hàng', cartItem: newCartItem });
//   } catch (error) {
//     console.error('Error adding to cart:', error);
//     res.status(500).json({ message: 'Có lỗi xảy ra', error });
//   }
// };

// // Lấy giỏ hàng của người dùng
// const getCart = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: 'userId không hợp lệ' });
//     }

//     const cartItems = await Cart.find({ userId }).populate('productId');

//     if (cartItems.length === 0) {
//       return res.status(404).json({ message: 'Giỏ hàng trống' });
//     }

//     res.json({ cartItems });
//   } catch (error) {
//     console.error('Error fetching cart:', error);
//     res.status(500).json({ message: 'Có lỗi xảy ra', error });
//   }
// };


// export { addToCart, getCart };



import { Cart } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js'; // Đảm bảo rằng tên model là 'Product' và không bị nhầm lẫn với 'product'
import mongoose from 'mongoose';

// Thêm sản phẩm vào giỏ hàng
const addToCart = async (req, res) => {
    try {
      const { userId, productId, quantity } = req.body;
  
      // Kiểm tra sự tồn tại của người dùng và sản phẩm
      const user = await User.findById(userId);
      const product = await Product.findById(productId);
  
      if (!user || !product) {
        return res.status(404).json({ message: 'Người dùng hoặc sản phẩm không tồn tại' });
      }
  
      // Kiểm tra số lượng sản phẩm còn lại
      if (product.quantity < quantity) {
        return res.status(400).json({ message: 'Không đủ sản phẩm trong kho' });
      }
  
      // Giảm số lượng sản phẩm
      product.quantity -= quantity;
      await product.save();
  
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      let existingCartItem = await Cart.findOne({ userId, productId });
  
      if (existingCartItem) {
        // Cập nhật số lượng nếu sản phẩm đã có trong giỏ hàng
        existingCartItem.quantity += quantity;
        await existingCartItem.save();
        return res.json({ message: 'Sản phẩm đã được cập nhật trong giỏ hàng', cartItem: existingCartItem });
      }
  
      // Thêm sản phẩm vào giỏ hàng
      const newCartItem = new Cart({ userId, productId, quantity });
      await newCartItem.save();
  
      res.status(201).json({ message: 'Sản phẩm đã được thêm vào giỏ hàng', cartItem: newCartItem });
    } catch (error) {
      console.error('Error adding to cart:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
  };

// Lấy giỏ hàng của người dùng
const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'userId không hợp lệ' });
    }

    const cartItems = await Cart.find({ userId }).populate('productId');

    if (cartItems.length === 0) {
      return res.status(404).json({ message: 'Giỏ hàng trống' });
    }

    res.json({ cartItems });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra', error });
  }
};



const removeFromCart = async (req, res) => {
    try {
      const { userId, productId } = req.body;
  
      // Kiểm tra sự tồn tại của người dùng và sản phẩm
      const user = await User.findById(userId);
      const product = await Product.findById(productId);
  
      if (!user || !product) {
        return res.status(404).json({ message: 'Người dùng hoặc sản phẩm không tồn tại' });
      }
  
      // Tìm sản phẩm trong giỏ hàng
      const cartItem = await Cart.findOne({ userId, productId });
  
      if (!cartItem) {
        return res.status(404).json({ message: 'Sản phẩm không tồn tại trong giỏ hàng' });
      }
  
      // Tăng số lượng sản phẩm trong kho khi xóa khỏi giỏ hàng
      product.quantity += cartItem.quantity;
      await product.save();
  
      // Xóa sản phẩm khỏi giỏ hàng
      await Cart.deleteOne({ _id: cartItem._id });
  
      res.status(200).json({ message: 'Sản phẩm đã được xóa khỏi giỏ hàng' });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ message: 'Có lỗi xảy ra', error });
    }
  };


const updateCartItemQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    const cartItem = await Cart.findOne({ userId, productId });
    if (!cartItem) {
      return res.status(404).json({ message: 'Sản phẩm không có trong giỏ hàng' });
    }

    cartItem.quantity = quantity;
    await cartItem.save();
    res.status(200).json({ message: 'Số lượng sản phẩm đã được cập nhật', cartItem });
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra', error });
  }
};

export { addToCart, getCart, removeFromCart, updateCartItemQuantity };
