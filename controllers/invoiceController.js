// controllers/invoiceController.js
import { Invoice } from '../models/invoice.js';
import { Shipping } from '../models/shipping.js';

export const createInvoice = async (req, res) => {
    const { orderId } = req.body;
  
    try {
      // Populate cả thông tin sản phẩm và thông tin người dùng
      const order = await Shipping.findById(orderId).populate('orderItems.productId').populate('userId');
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      const totalAmount = order.orderItems.reduce((sum, item) => sum + item.quantity * item.productId.price, 0);
  
      const newInvoice = new Invoice({
        orderId,
        customerId: order.userId._id, // Đảm bảo rằng userId được lưu trữ đúng cách
        items: order.orderItems.map(item => ({
          productId: item.productId._id,
          productName: item.productId.name,
          quantity: item.quantity,
          price: item.productId.price
        })),
        totalAmount,
        date: new Date()
      });
  
      await newInvoice.save();
      res.status(201).json({ invoice: newInvoice });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to create invoice' });
    }
  };
export const getInvoiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const invoice = await Invoice.findById(id).populate('items.productId');
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve invoice' });
  }
};

export const getAllInvoices = async (req, res) => {
    try {
      const invoices = await Invoice.find().populate('items.productId').populate('customerId').populate('orderId');
      res.status(200).json(invoices);
    } catch (error) {
      res.status(500).json({ message: 'Failed to retrieve invoices' });
    }
  };




  export const getInvoices = async (req, res) => {
    try {
      const invoices = await Invoice.find().populate('customerId').populate('orderId').populate('items.productId');
      res.status(200).json(invoices);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ message: 'Error fetching invoices' });
    }
  };