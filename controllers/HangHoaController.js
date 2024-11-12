import { hanghoa } from '../models/HangHoa.js';

// Create new HangHoa
export const createHanghoa = async (req, res) => {
  try {
    const { name } = req.body;
    const newHanghoa = new hanghoa({ name });
    const savedHanghoa = await newHanghoa.save();
    res.status(201).json(savedHanghoa);
  } catch (err) {
    res.status(500).json({ message: 'Error creating hanghoa', error: err.message });
  }
};

// Get all HangHoa
export const getAllHanghoas = async (req, res) => {
  try {
    const hanghoas = await hanghoa.find();
    res.json(hanghoas);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hanghoas', error: err.message });
  }
};

// Get a single HangHoa by ID
export const getHanghoaById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundHanghoa = await hanghoa.findById(id);

    if (!foundHanghoa) {
      return res.status(404).json({ message: 'Hanghoa not found' });
    }

    res.json(foundHanghoa);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching hanghoa', error: err.message });
  }
};

// Update HangHoa by ID
export const updateHanghoa = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const updatedHanghoa = await hanghoa.findByIdAndUpdate(id, { name }, { new: true });

    if (!updatedHanghoa) {
      return res.status(404).json({ message: 'Hanghoa not found' });
    }

    res.json(updatedHanghoa);
  } catch (err) {
    res.status(500).json({ message: 'Error updating hanghoa', error: err.message });
  }
};

// Delete HangHoa by ID
export const deleteHanghoa = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHanghoa = await hanghoa.findByIdAndDelete(id);

    if (!deletedHanghoa) {
      return res.status(404).json({ message: 'Hanghoa not found' });
    }

    res.json({ message: 'Hanghoa deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting hanghoa', error: err.message });
  }
};
