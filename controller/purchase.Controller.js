const Purchase = require('../models/purchasesModel');
const PurchaseItem = require('../models/purchasesItemModel');
const Product = require('../models/productsModel')

// CREATE PURCHASE + PURCHASE ITEMS (ONE REQUEST)
const createPurchaseWithItems = async (req, res) => {
  try {
    const { supplierId, userId, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items cannot be empty!" });
    }

    // 1️⃣ CREATE PURCHASE FIRST WITH EMPTY purchaseItemId
    const purchase = new Purchase({
      supplierId,
      userId,
      PurchaseCost: 0, // we’ll calculate this later
      purchaseItemId: []
    });

    const savedPurchase = await purchase.save();

    // 2️⃣ CREATE PURCHASE ITEMS AND CALCULATE TOTAL COST
    let purchaseCost = 0;

    const purchaseItemsToInsert = [];

    for (const item of items) {
      const { productId, cost, quantity, remarks } = item;
      const totalCost = cost * quantity;

      purchaseCost += totalCost;

      purchaseItemsToInsert.push({
        purchaseId: savedPurchase._id,
        productId,
        cost,
        quantity,
        totalCost,
        remarks: remarks || ""
      });

      // 2a️⃣ Update product quantity if exists
      const product = await Product.findById(productId);
      if (product) {
        product.stockQuantity = (product.stockQuantity || 0) + quantity;
        await product.save();
      }
    }

    const savedItems = await PurchaseItem.insertMany(purchaseItemsToInsert);

    // 3️⃣ Update purchase with item IDs + total purchase cost
    const itemIds = savedItems.map(item => item._id);

    savedPurchase.purchaseItemId = itemIds;
    savedPurchase.PurchaseCost = purchaseCost;
    await savedPurchase.save();

    res.status(201).json({
      message: "Purchase + Purchase Items created successfully!",
      purchase: savedPurchase,
      purchaseItems: savedItems
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// GET ALL PURCHASES
const getPurchases = async (req, res) => {
  try {
    const data = await Purchase.find().populate("purchaseItemId");
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPurchaseWithItems,
  getPurchases
};

