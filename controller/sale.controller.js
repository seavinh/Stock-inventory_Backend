const Sale = require('../models/saleModel');
const SaleItem = require('../models/saleItemModel');
const Product = require('../models/productsModel');

// CREATE SALE + SALE ITEMS (auto price + strict stock check)
const createSaleWithItems = async (req, res) => {
  try {
    const { userId, paymentType, items, remark } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Sale items cannot be empty!" });
    }

    // 1️⃣ Create Sale first with empty saleItemId
    const sale = await Sale.create({
      userId,
      paymentType: paymentType || 'cash',
      salePrice: 0,
      saleItemId: [],
      remark: remark || ""
    });

    let totalSalePrice = 0;
    const saleItemsToInsert = [];
    const bulkProductOps = [];

    // 2️⃣ Prepare sale items + check stock strictly
    for (const item of items) {
      const { productId, categoryId, quantity, remarks } = item;

      const product = await Product.findById(productId);
      if (!product) {
        await Sale.findByIdAndDelete(sale._id);
        return res.status(400).json({ message: `Product with ID ${productId} not found!` });
      }

      if (product.stockQuantity === 0) {
        await Sale.findByIdAndDelete(sale._id);
        return res.status(400).json({ message: `Product "${product.productName}" is out of stock!` });
      }

      if (quantity > product.stockQuantity) {
        await Sale.findByIdAndDelete(sale._id);
        return res.status(400).json({ message: `Not enough stock for "${product.productName}". Available: ${product.stockQuantity}` });
      }

      const price = product.price;
      const totalPrice = price * quantity;
      totalSalePrice += totalPrice;

      saleItemsToInsert.push({
        saleId: sale._id,
        productId,
        categoryId: categoryId || product.categoryId,
        quantity,
        price,
        totalPrice,
        remarks: remarks || ""
      });

      bulkProductOps.push({
        updateOne: {
          filter: { _id: productId },
          update: { $inc: { stockQuantity: -quantity } }
        }
      });
    }

    // 3️⃣ Insert SaleItems
    const savedItems = await SaleItem.insertMany(saleItemsToInsert);

    // 4️⃣ Bulk update products stock
    if (bulkProductOps.length > 0) {
      await Product.bulkWrite(bulkProductOps);
    }

    // 5️⃣ Update Sale with total price + saleItem IDs
    sale.saleItemId = savedItems.map(item => item._id);
    sale.salePrice = totalSalePrice;
    await sale.save();

    // 6️⃣ Return populated sale
    const populatedSale = await Sale.findById(sale._id).populate({
      path: 'saleItemId',
      populate: { path: 'productId', select: 'productName price img' }
    }).populate('userId', 'userName role');

    res.status(201).json({
      message: "Sale created successfully!",
      sale: populatedSale,
      saleItems: savedItems
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET ALL SALES (populated)
const getSales = async (req, res) => {
  try {
    const data = await Sale.find()
      .sort({ createdAt: -1 })
      .populate({
        path: 'saleItemId',
        populate: { path: 'productId', select: 'productName price img' }
      })
      .populate('userId', 'userName role');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SALE BY ID
const getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate({
        path: 'saleItemId',
        populate: { path: 'productId', select: 'productName price img' }
      })
      .populate('userId', 'userName role');
    if (!sale) return res.status(404).json({ message: 'Sale not found' });
    res.json(sale);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE SALE (restores stock)
const deleteSale = async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('saleItemId');
    if (!sale) return res.status(404).json({ message: 'Sale not found' });

    // Restore product stock
    const bulkOps = sale.saleItemId.map(item => ({
      updateOne: {
        filter: { _id: item.productId },
        update: { $inc: { stockQuantity: item.quantity } }
      }
    }));

    if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
    }

    // Delete sale items
    await SaleItem.deleteMany({ saleId: sale._id });

    // Delete sale
    await Sale.findByIdAndDelete(req.params.id);

    res.json({ message: 'Sale deleted and stock restored successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createSaleWithItems,
  getSales,
  getSaleById,
  deleteSale
};