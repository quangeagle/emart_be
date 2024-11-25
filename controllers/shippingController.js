


import { Shipping } from '../models/shipping.js';
import { Product } from '../models/Product.js';
import { Pointer } from "pointer-wallet"; 
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.VITE_POINTER_SECRET_KEY;
const pointerPayment = new Pointer(secretKey); 
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
    // Kiểm tra tồn kho
    for (const item of orderItems) {
      const product = await Product.findOne({ 'versions._id': item.versionId });
      const version = product?.versions.id(item.versionId);

      if (!product || !version) {
        return res.status(404).json({ message: `Sản phẩm không tồn tại cho phiên bản ID ${item.versionId}` });
      }

      if (version.totalQuantity < item.quantity) {
        return res.status(400).json({ message: `Số lượng tồn kho không đủ cho phiên bản ${version.name}` });
      }
    }

    // Đặt trạng thái ban đầu
    const initialStatus = paymentMethod === 'COD' ? 'processing' : 'pending';

    // Tạo đơn hàng mới
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
      status: initialStatus,
    });

    // Trừ tồn kho ngay lập tức
    for (const item of orderItems) {
      const product = await Product.findOne({ 'versions._id': item.versionId });
      const version = product.versions.id(item.versionId);

      version.totalQuantity -= item.quantity;
      await product.save();
    }

    // Lưu đơn hàng
    await newShipping.save();

    // Kiểm tra với CreditCard (đặt hẹn 10 phút để xử lý trạng thái)
    if (paymentMethod === 'CreditCard') {
      setTimeout(async () => {
        const order = await Shipping.findById(newShipping._id);

        // Nếu đơn hàng vẫn ở trạng thái "pending"
        if (order && order.status === 'pending') {
          for (const item of order.orderItems) {
            const product = await Product.findOne({ 'versions._id': item.versionId });
            const version = product.versions.id(item.versionId);

            // Hoàn lại số lượng tồn kho
            version.totalQuantity += item.quantity;
            await product.save();
          }

          // Chuyển trạng thái đơn hàng thành "canceled"
          order.status = 'canceled';
          await order.save();
        }
      }, 10 * 60 * 1000); // 10 phút
    }

    res.status(201).json(newShipping);
  } catch (error) {
    console.error('Error in createShipping:', error);
    res.status(500).json({ message: 'Lỗi khi tạo đơn hàng', error: error.message });
  }
};

// Lấy tất cả đơn hàng
const getAllShippingOrders = async (req, res) => {
  try {
    const orders = await Shipping.find().populate('orderItems.productId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve shipping orders', error: error.message });
  }
};

// Xử lý thanh toán
const processPayment = async (req, res) => {
  try {
    const { orderID, status } = req.body;

    // Tìm đơn hàng
    const order = await Shipping.findById(orderID);

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Nếu thanh toán thành công
    if (status === 200) {
      order.status = 'paid';
      await order.save();

      res.status(200).json({ message: 'Thanh toán thành công', order });
    } else {
      // Hoàn lại tồn kho nếu thanh toán thất bại
      for (const item of order.orderItems) {
        const product = await Product.findOne({ 'versions._id': item.versionId });
        const version = product.versions.id(item.versionId);

        version.totalQuantity += item.quantity;
        await product.save();
      }

      order.status = 'canceled';
      await order.save();

      res.status(400).json({ message: 'Thanh toán thất bại', order });
    }
  } catch (error) {
    console.error('Error in processPayment:', error);
    res.status(500).json({ message: 'Lỗi khi xử lý thanh toán', error: error.message });
  }
};

const cancelOrder1 = async (req, res) => {
  try {
    const { orderId } = req.body;
    console.log("Received orderId:", orderId);

    
    const order = await Shipping.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("Order found:", order); 
    const pointerSecretKey = 'sk_pointerf97ad5e90eb156b9a2b5d18e44bb37f8c89c2f0db611038a751c3bc7e0ec63c6';
    if (!pointerSecretKey) {
      return res.status(500).json({ message: 'Pointer Wallet secret key is missing' });
    }
    const headers = {
      'Authorization': `Bearer ${pointerSecretKey}`,
      'Content-Type': 'application/json',
    };
    if (order.status === 'canceled') {
      return res.status(400).json({ message: 'Order has already been canceled' });
    }

    if (order.status === 'paid') {
      return res.status(400).json({ message: 'Paid orders cannot be canceled' });
    }
    console.log("Order ID to cancel:", order._id);
    const orderID =order._id;
    console.log("Using transactionId:", orderID);

    // Call cancelOrder API (cập nhật với Pointer Wallet hoặc hệ thống thanh toán của bạn)
    const cancelResponse = await pointerPayment.cancelOrder(orderID , { headers });
    console.log('Pointer Wallet cancel response:', cancelResponse); // Log response from Pointer Wallet

    if (cancelResponse.status === 200) {
      // Trừ lại số lượng sản phẩm theo versionId giống như lúc tạo đơn hàng
      for (const item of order.orderItems) {
        const product = await Product.findOne({ 'versions._id': item.versionId });
        if (product) {
          const version = product.versions.id(item.versionId);
          version.totalQuantity += item.quantity; // Tăng số lượng sản phẩm lại vào kho (giảm đi số lượng đã đặt)
          await product.save();
          console.log(`Updated quantity for product version: ${version.name}, new quantity: ${version.totalQuantity}`);
        }
      }

    
      order.status = 'canceled';
      await order.save();

      return res.status(200).json({ message: 'Order canceled successfully', order });
    } else {
      return res.status(400).json({ message: 'Failed to cancel order via Pointer Wallet', details: cancelResponse });
    }
  } catch (error) {
    console.error('Error in cancelOrder:', error);  // Log full error message
    res.status(500).json({ message: 'Error canceling order', error: error.message });
  }
};

export { createShipping, getAllShippingOrders, processPayment,cancelOrder1 };


///////////////////////////////////////////////////////
// const mongoose = require('mongoose');
// const moment = require('moment-timezone'); // Import moment-timezone
// const Order = require('../models/Order');
// const User = require('../models/User');
// const { Tour } = require('../models/Tour');
// const { sendOrderConfirmationEmail } = require('../service/mailtrap/email');

// require('dotenv').config(); 
// const { Pointer } = require("pointer-wallet");
// const secretKey = process.env.VITE_POINTER_SECRET_KEY;
// const pointerPayment = new Pointer(secretKey); 

// const updateAvailabilityOnCreateOrder = async (tourId, bookingDate, adultCount, childCount) => {
//   const tour = await Tour.findById(tourId);

//   if (!tour) {
//     throw new Error("Tour not found");
//   }

//   const bookingDateLocal = moment(bookingDate).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
//   const selectedAvailability = tour.availabilities.find(avail => {
//     const availDateLocal = moment(avail.date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD');
//     return availDateLocal === bookingDateLocal;
//   });

//   if (!selectedAvailability) {
//     throw new Error("No availability found for the selected date");
//   }

//   const totalSeatsRequested = adultCount + childCount;
//   if (selectedAvailability.availableSeats < totalSeatsRequested) {
//     throw new Error("Not enough available spots for the selected date");
//   }

//   // Giảm số lượng chỗ trống cho ngày đã chọn
//   selectedAvailability.availableSeats -= totalSeatsRequested;
//   await tour.save();
// };

// const updateAvailabilityOnCancelOrder = async (tourId, bookingDate, adultCount, childCount) => {
//   const tour = await Tour.findById(tourId);

//   if (!tour) {
//     throw new Error("Tour not found");
//   }

//   const availability = tour.availabilities.find(avail => 
//     moment(avail.date).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD') === moment(bookingDate).tz('Asia/Ho_Chi_Minh').format('YYYY-MM-DD')
//   );

//   if (!availability) {
//     throw new Error("No availability found for the selected date");
//   }

//   // Tăng số lượng chỗ trống khi hủy đơn hàng
//   availability.availableSeats += adultCount + childCount;
//   await tour.save();
// };

// const createOrder = async (req, res) => {
//   try {
//     const {
//       totalValue,
//       customerInfo,
//       passengerInfo,
//       tour, 
//       adultPrice,
//       childPrice,
//       adultCount,
//       childCount,
//       bookingDate,
//       paymentMethod,
//     } = req.body;

//     if (!tour) {
//       return res.status(400).json({ message: "Tour is required" });
//     }

//     if (adultCount <= 0 && childCount <= 0) {
//       return res.status(400).json({ message: "At least one ticket must be purchased" });
//     }

//     // Kiểm tra và cập nhật số lượng chỗ trống trong tour
//     await updateAvailabilityOnCreateOrder(tour, bookingDate, adultCount, childCount);

//     // Tạo đơn hàng mới
//     const newOrder = new Order({
//       orderDate: moment().tz('Asia/Ho_Chi_Minh').toDate(),
//       totalValue,
//       user: req.user._id,
//       customerInfo,
//       passengerInfo,
//       tour,
//       adultPrice,
//       childPrice,
//       adultCount,
//       childCount,
//       bookingDate,
//       status: 'pending',
//       paymentMethod,
//     });

//     const savedOrder = await newOrder.save();

//     // Cập nhật lịch sử đơn hàng của người dùng
//     await User.updateOne(
//       { _id: req.user._id },
//       { $push: { orderHistory: savedOrder._id } }
//     );

//     // Cập nhật trạng thái đơn hàng sau 1 phút nếu chưa thanh toán
//     setTimeout(async () => {
//       const orderToProcess = await Order.findById(savedOrder._id);
//       if (orderToProcess && orderToProcess.status === 'pending') {
//         orderToProcess.status = 'processing';
//         await orderToProcess.save();
//         console.log(Order ${savedOrder._id} updated to 'processing'.);
//       }
//     }, 1 * 60 * 1000); // 1 phút

//     res.status(201).json({ message: 'Order created successfully', order: savedOrder });
//   } catch (error) {
//     console.log("Error in createOrder controller", error.message);
//     res.status(500).json({ message: 'Error creating order', error: error.message });
//   }
// };


// // Lấy các đơn hàng của người dùng
// const getUserOrders = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     console.log(userId)
//     const currentDate = new Date().toISOString().slice(0, 10); 

//     const user = await User.findById(userId).populate({
//       match: { bookingDate: { $gte: currentDate } }, 
//       path: 'orderHistory',
//       populate: { path: 'tour' }
//     });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const orders = user.orderHistory;

//     const groupedOrders = orders.reduce((result, order) => {
//       const date = new Date(order.bookingDate);
//       const monthYear = ${date.getMonth() + 1}-${date.getFullYear()};

//       if (!result[monthYear]) {
//         result[monthYear] = [];
//       }
//       result[monthYear].push(order);

//       return result;
//     }, {});

//     res.status(200).json(groupedOrders);
//   } catch (error) {
//     console.log("Error fetching orders", error.message);
//     res.status(500).json({ message: 'Error fetching orders', error });
//   }
// };

// // Xử lý thanh toán
// const processPayment = async (req, res) => {
//   try {
//     console.log(req.body)
//     const { orderID, status } = req.body;

//     const order = await Order.findById(orderID).populate('user');
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     if (status === 200) {
//       order.status = 'paid';
//       await order.save();
    
//       // Gửi email xác nhận
//       const tour = await Tour.findById(order.tour);
//       const email = order.user.email;
    
//       const emailContent = {
//         orderId: order._id,
//         totalValue: order.totalValue.toLocaleString(),
//         bookingDate: order.bookingDate,
//         tour: tour,
//         status: order.status,
//       };
    
//       try {
//         await sendOrderConfirmationEmail(email, emailContent);
//         console.log("Email confirmation sent to:", order.user.email);
//       } catch (emailError) {
//         console.error("Error sending email:", emailError.message);
//       }
    
//       res.status(200).json({ message: 'Payment successful', order });
//     } else {
//       // Hoàn lại số lượng chỗ trống nếu thanh toán thất bại
//       await Tour.updateOne(
//         { _id: order.tour },
//         { $inc: { availableSpots: order.adultCount + order.childCount } }
//       );

//       res.status(400).json({ message: 'Payment failed' });
//     }
//   } catch (error) {
//     console.log("Error in processPayment", error.message);
//     res.status(500).json({ message: 'Error processing payment', error });
//   }
// };

// const cancelOrder = async (req, res) => {
//   try {
//     const { orderId } = req.body;
//     console.log("Received orderId:", orderId);

//     const order = await Shipping.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }
    
//     console.log("Order found:", order); // Log order details

//     if (order.status === 'canceled') {
//       return res.status(400).json({ message: 'Order has already been canceled' });
//     }
    
//     if (order.status === 'paid') {
//       return res.status(400).json({ message: 'Paid orders cannot be canceled' });
//     }

//     console.log("Transaction ID from order:", order.transactionId); // Log transactionId
    
//     // Call cancelOrder API
//     const cancelResponse = await pointerPayment.cancelOrder(order.transactionId);
//     console.log('Pointer Wallet cancel response:', cancelResponse); // Log response from Pointer Wallet

//     if (cancelResponse.status === 200) {
//       await updateAvailabilityOnCancelOrder(order.tour, order.bookingDate, order.adultCount, order.childCount);
//       await User.findByIdAndUpdate(order.user, { $inc: { cancellationCount: 1 } }, { new: true });
//       order.status = 'canceled';
//       await order.save();

//       return res.status(200).json({ message: 'Order canceled successfully', order });
//     } else {
//       return res.status(400).json({ message: 'Failed to cancel order via Pointer Wallet', details: cancelResponse });
//     }
//   } catch (error) {
//     console.error('Error in cancelOrder:', error);  // Log full error message
//     res.status(500).json({ message: 'Error canceling order', error: error.message });
//   }
// };




// const cancelPaidOrder = async (req, res) => {
//   try {
//     const { orderId } = req.body; // Lấy orderId từ request body
//     console.log("Received orderId:", orderId); // Log để kiểm tra orderId

//     // Tìm đơn hàng theo orderId
//     const order = await Order.findById(orderId);
//     if (!order) {
//       return res.status(404).json({ message: "Order not found" }); // Đơn hàng không tồn tại
//     }

//     console.log("Order found:", order); // Log chi tiết đơn hàng

//     // Kiểm tra trạng thái đơn hàng
//     if (order.status === 'canceled') {
//       return res.status(400).json({ message: 'Order has already been canceled' });
//     }

//     if (order.status !== 'paid') {
//       return res.status(400).json({ message: 'This function is only for canceling paid orders' });
//     }

//     console.log("Transaction ID from order:", order.transactionId); // Log transactionId

//     // Gọi API Pointer Wallet để hủy đơn hàng
//     const cancelResponse = await pointerPayment.cancelOrder(order.transactionId);
//     console.log('Pointer Wallet cancel response:', cancelResponse); // Log phản hồi từ Pointer Wallet

//     // Kiểm tra phản hồi từ API Pointer Wallet
//     if (cancelResponse.status === 200) {
//       // Cập nhật số lượng chỗ trống trong tour
//       await updateAvailabilityOnCancelOrder(order.tour, order.bookingDate, order.adultCount, order.childCount);

//       // Cập nhật trạng thái đơn hàng thành "canceled"
//       order.status = 'canceled';
//       await order.save();

//       // Gửi phản hồi thành công
//       return res.status(200).json({ message: 'Paid order canceled successfully', order });
//     } else {
//       return res.status(400).json({ message: 'Failed to cancel order via Pointer Wallet', details: cancelResponse });
//     }
//   } catch (error) {
//     console.error('Error in cancelPaidOrder:', error); // Log lỗi chi tiết
//     res.status(500).json({ message: 'Error canceling paid order', error: error.message });
//   }
// };

// module.exports = {
//   createOrder,
//   getUserOrders,
//   processPayment,
//   cancelOrder,
//   cancelPaidOrder
// };