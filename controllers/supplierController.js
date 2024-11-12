// E:\emart\server\controllers\supplierController.js
import { Supplier } from '../models/NhaCungCap.js';

export const createSupplier = async (req, res) => {
  try {
    const newSupplier = new Supplier(req.body);
    const savedSupplier = await newSupplier.save();
    res.json(savedSupplier);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getIN4 = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.supplierId);
    res.json(supplier);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching supplier data' });
  }
};
export const PUTIN4 =  async (req, res) => {
  try {
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.supplierId,
      req.body,
      { new: true }
    );
    res.json(updatedSupplier);
  } catch (err) {
    res.status(500).json({ message: 'Error updating supplier data' });
  }
};

export const countSuppliers = async (req, res) => {
  try {
    const supplierCount = await Supplier.countDocuments();
    res.json({ count: supplierCount });
  } catch (err) {
    res.status(500).json({ message: 'Error counting suppliers' });
  }
};


