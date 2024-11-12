// E:\emart\server\controllers\categoryController.js
import { category } from '../models/DanhMucSP.js';

const createCategory = async (req, res) => {
  try {
    const { hanghoaId, name } = req.body;
    const newCategory = new category({ name, hanghoa: hanghoaId });
    const savedCategory = await newCategory.save();
    res.json(savedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCategoriesByHanghoa = async (req, res) => {
  try {
    const { hanghoaId } = req.params;
    const categories = await category.find({ hanghoa: hanghoaId });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await category.findByIdAndDelete(id);
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, hanghoaId } = req.body;
    const updatedCategory = await category.findByIdAndUpdate(id, { name, hanghoa: hanghoaId }, { new: true });
    res.json(updatedCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await category.find()
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export { createCategory, getCategoriesByHanghoa, deleteCategory, updateCategory, getAllCategories };
