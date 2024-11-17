


import { Product } from '../models/Product.js';
import { Supplier } from '../models/NhaCungCap.js';
import { category } from '../models/DanhMucSP.js';


export const createProduct = async (req, res) => {
  try {
    const { categoryId, name, description, imageUrl, versions, supplierId } = req.body;

    // Kiểm tra xem nhà cung cấp có tồn tại không
    const supplier = await Supplier.findById(supplierId);
    if (!supplier) {
      return res.status(400).json({ message: 'Supplier không tồn tại.' });
    }

    // Tìm danh mục và populate các unitOptions liên quan
    const Category = await category.findById(categoryId).populate('unitOptions');
    if (!Category) {
      return res.status(400).json({ message: 'Category không tồn tại.' });
    }

    // Tạo sản phẩm mới với thông tin về nhà cung cấp và danh mục
    const newProduct = new Product({
      name,
      description,
      imageUrl,
      category: categoryId,
      supplier: supplierId,
      status: 'pending',
      versions
    });

    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Admin duyệt sản phẩm
export const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const approvedProduct = await Product.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    );
    res.json(approvedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin từ chối sản phẩm
export const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const rejectedProduct = await Product.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    );
    res.json(rejectedProduct);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy tất cả sản phẩm
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy sản phẩm theo ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const productDetail = await Product.findById(id);

    if (!productDetail) {
      return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
    }

    res.json(productDetail);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy sản phẩm theo danh mục và chỉ lấy sản phẩm đã được duyệt
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ category: categoryId, status: 'approved' });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Xóa sản phẩm
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryId, supplierId, name, description, imageUrl, versions } = req.body;

    // Find the product by ID and update fields, set status to "pending"
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        category: categoryId,
        supplier: supplierId,
        name,
        description,
        imageUrl,
        versions,
        status: "pending"
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ message: err.message });
  }
};

// Lấy sản phẩm đang chờ duyệt
export const getPendingProducts = async (req, res) => {
  try {
    const pendingProducts = await Product.find({ status: 'pending' });
    res.json(pendingProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Lấy danh sách sản phẩm của nhà cung cấp hiện tại
export const getProductsBySupplier = async (req, res) => {
  try {
    const { supplierId } = req.params; // Lấy supplierId từ params

    const products = await Product.find({ supplier: supplierId });
    
    if (!products.length) {
      return res.status(404).json({ message: 'Không có sản phẩm nào của nhà cung cấp này.' });
    }
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

import mongoose from 'mongoose';

export const getSupplierProductStatistics = async (req, res) => {
  try {
    const { supplierId } = req.params; // Lấy Supplier ID từ params của request
    console.log("Supplier ID:", supplierId);

    // Kiểm tra nếu supplierId có hợp lệ hay không
    if (!mongoose.Types.ObjectId.isValid(supplierId)) {
      return res.status(400).json({ message: 'Invalid Supplier ID' }); // Trả về lỗi nếu ID không hợp lệ
    }

    const supplierObjectId = new mongoose.Types.ObjectId(supplierId); // Chuyển supplierId thành ObjectId hợp lệ

    // Tổng hợp số lượng sản phẩm theo trạng thái cho nhà cung cấp
    const productCounts = await Product.aggregate([
      { $match: { supplier: supplierObjectId } }, // Đảm bảo sử dụng ObjectId hợp lệ cho Supplier
      {
        $group: {
          _id: '$status', // Nhóm theo trạng thái sản phẩm
          count: { $sum: 1 } // Tính tổng số lượng sản phẩm cho mỗi trạng thái
        }
      }
    ]);

    // Log kết quả của việc tổng hợp
    console.log("Product counts after aggregation:", productCounts);

    // Khởi tạo các biến thống kê
    let totalProducts = 0;
    let pendingProducts = 0;
    let approvedProducts = 0;
    let rejectedProducts = 0;

    // Lặp qua kết quả tổng hợp để thiết lập số lượng cho từng trạng thái
    productCounts.forEach((item) => {
      console.log(`Processing item: ${JSON.stringify(item)}`); // Log từng item trong quá trình lặp

      totalProducts += item.count; // Tổng số sản phẩm
      if (item._id === 'pending') {
        pendingProducts = item.count; // Sản phẩm đang chờ duyệt
      } else if (item._id === 'approved') {
        approvedProducts = item.count; // Sản phẩm đã duyệt
      } else if (item._id === 'rejected') {
        rejectedProducts = item.count; // Sản phẩm bị từ chối
      }
    });

    // Log kết quả sau khi tính toán xong
    console.log("Stats after processing items - Total:", totalProducts, "Pending:", pendingProducts, "Approved:", approvedProducts, "Rejected:", rejectedProducts);

    // Đảm bảo các trạng thái không có sản phẩm được trả về 0
    const statuses = ['pending', 'approved', 'rejected'];
    statuses.forEach((status) => {
      if (!productCounts.some(item => item._id === status)) {
        console.log(`No products found for status: ${status}`); // Log nếu không có sản phẩm cho trạng thái này
        if (status === 'pending') pendingProducts = 0;
        else if (status === 'approved') approvedProducts = 0;
        else if (status === 'rejected') rejectedProducts = 0;
      }
    });

    // In ra các thống kê cuối cùng để kiểm tra
    console.log("Final Stats - Total:", totalProducts, "Pending:", pendingProducts, "Approved:", approvedProducts, "Rejected:", rejectedProducts);

    // Trả về kết quả thống kê dưới dạng JSON
    res.json({
      totalProducts,
      pendingProducts,
      approvedProducts,
      rejectedProducts
    });
  } catch (err) {
    // Xử lý lỗi nếu có
    console.error("Error occurred:", err);
    res.status(500).json({ message: err.message });
  }
};



export const getApprovedProducts = async (req, res) => {
  try {
    // Tìm tất cả các sản phẩm có trạng thái là 'approved'
    const approvedProducts = await Product.find({ status: 'approved' });
    
    // Kiểm tra nếu không có sản phẩm nào được duyệt
    if (approvedProducts.length === 0) {
      return res.status(404).json({ message: 'Không có sản phẩm nào đã được duyệt.' });
    }
    
    // Trả về danh sách sản phẩm đã được duyệt
    res.json(approvedProducts);
  } catch (err) {
    // Xử lý lỗi nếu có
    res.status(500).json({ message: err.message });
  }
};

export const getProductsBySupplierID = async (req, res) => {
  try {
    const { supplierId } = req.query;

    if (!supplierId) {
      return res.status(400).json({ message: 'Supplier ID is required' });
    }

    // Truy vấn sản phẩm theo supplierId
    const products = await Product.find({ supplier: supplierId });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this supplier.' });
    }

    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const calculateTotalQuantity = async (req, res) => {
  try {
    const products = await Product.find(); // Lấy tất cả sản phẩm

    // Tính toán tổng số lượng cho mỗi sản phẩm và phiên bản
    const totalQuantities = products.map(product => {
      const totalQuantity = product.versions.reduce((acc, version) => {
        // Tính tổng số lượng bằng cách nhân số lượng của phiên bản với số lượng trong một đơn vị
        return acc + (version.unitQuantity * version.quantity);
      }, 0);
      return { productId: product._id, name: product.name, totalQuantity };
    });

    res.json(totalQuantities); // Trả về kết quả tổng hợp
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
