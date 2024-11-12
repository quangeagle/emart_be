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
    creditCardNumber,
    expiryDate,
    securityCode,
    note,
    orderItems
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
      creditCardNumber,
      expiryDate,
      securityCode,
      note,
      orderItems
    });

    await newShipping.save();
    res.status(201).json(newShipping);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create shipping record' });
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

// Export các hàm để sử dụng ở các file khác
export { createShipping, getAllShippingOrders };
