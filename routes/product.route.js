const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerConfig'); // ✅ Import Multer

const { 
  createProduct, 
  getAllProducts, 
  getProductById, 
  updateProductById, 
  deleteProductById 
} = require('../controller/product.Controller');

// ✅ POST - បង្កើតផលិតផលជាមួយរូបភាព
router.post('/', upload.single('img'), createProduct);

// ✅ GET - ទាញផលិតផលទាំងអស់
router.get('/', getAllProducts);

// ✅ GET BY ID
router.get('/:id', getProductById);

// ✅ PATCH - Update ផលិតផលជាមួយរូបភាព
router.patch('/:id', upload.single('img'), updateProductById);

// ✅ DELETE
router.delete('/:id', deleteProductById);

module.exports = router;
