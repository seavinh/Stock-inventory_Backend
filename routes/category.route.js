const express = require('express');
const categoryModel = require('../models/categoriesModel');
const router = express.Router();
const mongoose = require('mongoose');
const { createCategory } = require('../controller/category.Controller');
const { getAllCategories } = require('../controller/category.Controller');
const { getCategoryById } = require('../controller/category.Controller');
const { updateCategoryById } = require('../controller/category.Controller');
const { deleteCategoryById } = require('../controller/category.Controller');

// post controller
router.post('/', createCategory);

// get controller
router.get('/', getAllCategories);

// get by id controller
router.get('/:id', getCategoryById);

// update by id controller
router.patch('/:id', updateCategoryById);

// delete by id controller
router.delete('/:id', deleteCategoryById);

module.exports = router;