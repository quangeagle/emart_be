// // E:\emart\server\controllers\categoryController.js
// import { category } from '../models/DanhMucSP.js';

// const createCategory = async (req, res) => {
//   try {
//     const { hanghoaId, name } = req.body;
//     const newCategory = new category({ name, hanghoa: hanghoaId });
//     const savedCategory = await newCategory.save();
//     res.json(savedCategory);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const getCategoriesByHanghoa = async (req, res) => {
//   try {
//     const { hanghoaId } = req.params;
//     const categories = await category.find({ hanghoa: hanghoaId });
//     res.json(categories);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const deleteCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await category.findByIdAndDelete(id);
//     res.json({ message: 'Category deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const updateCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, hanghoaId } = req.body;
//     const updatedCategory = await category.findByIdAndUpdate(id, { name, hanghoa: hanghoaId }, { new: true });
//     res.json(updatedCategory);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// const getAllCategories = async (req, res) => {
//   try {
//     const categories = await category.find()
//     res.json(categories);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// export { createCategory, getCategoriesByHanghoa, deleteCategory, updateCategory, getAllCategories };
import { category } from '../models/DanhMucSP.js';

const createCategory = async (req, res) => {
  try {
    const { hanghoaId, name, unitOptions } = req.body;
    console.log('Received Data:', req.body);

    // Validate unitOptions format (Optional, if needed)
    if (unitOptions) {
      for (let option of unitOptions) {
        if (!Array.isArray(option.quantities)) {
          return res.status(400).json({ message: 'quantities must be an array' });  // Return ngay khi có lỗi
        }
      }
    }

    // Create new category with unitOptions
    const newCategory = new category({
      name,
      hanghoa: hanghoaId,
      unitOptions: unitOptions || []  // Set an empty array if unitOptions is not provided
    });

    const savedCategory = await newCategory.save();
    return res.json(savedCategory);  // Đảm bảo return sau khi gửi phản hồi
  } catch (err) {
    return res.status(500).json({ message: err.message });  // Return ngay sau khi gặp lỗi
  }
};

const getCategoriesByHanghoa = async (req, res) => {
  try {
    const { hanghoaId } = req.params;
    const categories = await category.find({ hanghoa: hanghoaId });
    return res.json(categories);  // Return sau khi gửi phản hồi
  } catch (err) {
    return res.status(500).json({ message: err.message });  // Return ngay sau khi gặp lỗi
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    await category.findByIdAndDelete(id);
    return res.json({ message: 'Category deleted' });  // Return sau khi gửi phản hồi
  } catch (err) {
    return res.status(500).json({ message: err.message });  // Return ngay sau khi gặp lỗi
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, hanghoaId, unitOptions } = req.body;

    // Validate unitOptions format (Optional, if needed)
    if (unitOptions) {
      for (let option of unitOptions) {
        if (!Array.isArray(option.quantities)) {
          return res.status(400).json({ message: 'quantities must be an array' });  // Return ngay khi có lỗi
        }
      }
    }

    // Update category with new fields
    const updatedCategory = await category.findByIdAndUpdate(
      id,
      {
        name,
        hanghoa: hanghoaId,
        unitOptions: unitOptions || []  // Update unitOptions if provided
      },
      { new: true }
    );

    return res.json(updatedCategory);  // Đảm bảo return sau khi gửi phản hồi
  } catch (err) {
    return res.status(500).json({ message: err.message });  // Return ngay sau khi gặp lỗi
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await category.find();
    return res.json(categories);  // Return sau khi gửi phản hồi
  } catch (err) {
    return res.status(500).json({ message: err.message });  // Return ngay sau khi gặp lỗi
  }
};

export { createCategory, getCategoriesByHanghoa, deleteCategory, updateCategory, getAllCategories };
