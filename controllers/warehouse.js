import { Warehouse } from '../models/warehouse.js';
import { Product } from '../models/Product.js';

// 1. Lấy danh sách sản phẩm trong kho có số lượng dưới 10
export const getLowStockProducts = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.warehouseId).populate('products.product');
    
    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    // Lọc các sản phẩm có số lượng dưới 10
    const lowStockProducts = warehouse.products.filter(p => p.quantity < 10);

    res.json(lowStockProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// 3. Thêm sản phẩm vào kho
export const addProductToWarehouse = async (req, res) => {
  const { productId, quantity } = req.body;

  try {

    const product = await Product.findById(productId);

    if (!warehouse || !product) {
      return res.status(404).json({ message: 'Warehouse or Product not found' });
    }

    // Kiểm tra xem sản phẩm đã tồn tại trong kho chưa
    const productInWarehouse = warehouse.products.find(p => p.product.toString() === productId);

    if (productInWarehouse) {
      // Nếu sản phẩm đã tồn tại, tăng số lượng
      productInWarehouse.quantity += quantity;
    } else {
      // Nếu sản phẩm chưa tồn tại, thêm mới
      warehouse.products.push({ product: productId, quantity });
    }

    await warehouse.save();
    res.json(warehouse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



