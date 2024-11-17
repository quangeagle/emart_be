// controllers/shippingController.js
import { Shipping } from '../models/shipping.js';

// Tạo đơn hàng mới
const createShipping = async (req, res) => {
  const {
    userId,
    address,
    name,
    phone,
    email,
    selectedDate,
    selectedTime,
    paymentMethod,
   
    note,
    orderItems, 
  } = req.body;

  try {
    const newShipping = new Shipping({
      userId,
      address,
      name,
      phone,
      email,
      selectedDate,
      selectedTime,
      paymentMethod,
      
      note,
      orderItems,
      status: 'pending',
    });
    console.log("New Shipping Object:", newShipping); // Kiểm tra trước khi lưu
    await newShipping.save();
    res.status(201).json(newShipping);
  } catch (error) {
    console.error("Error in createShipping:", error); // Log lỗi chi tiết
  res.status(500).json({ message: 'Failed to create shipping record', error: error.message });
  }
};

// Lấy tất cả đơn hàng
const getAllShippingOrders = async (req, res) => {
  try {
    const orders = await Shipping.find().populate('orderItems.productId'); // Populate nếu cần thông tin sản phẩm
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve shipping orders' });
  }
};

// Xử lý thanh toán
const processPayment = async (req, res) => {
  try {
    const { orderID, status } = req.body;
    const order = await Shipping.findById(orderID).populate('orderItems.productId');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status === 200) {
      order.status = 'paid';
      await order.save({ validateBeforeSave: false }); // Bỏ qua validation
      res.status(200).json({ message: 'Payment successful', order });
    } else {
      res.status(400).json({ message: 'Payment failed' });
    }
  } catch (error) {
    console.log("Error in processPayment", error.message);
    res.status(500).json({ message: 'Error processing payment', error });
  }
};

const getShippingByUserId = async (req, res) => {
  const { userId } = req.params; // Lấy userId từ params

  try {
    const orders = await Shipping.find({ userId });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve shipping orders for this user' });
  }
};
// Export các hàm để sử dụng ở các file khác
export { createShipping, getAllShippingOrders,processPayment,getShippingByUserId };
