const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} = require('../controllers/productController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getProducts);                    // GET all products
router.get('/:id', getProductById);              // GET single product

// Protected + Admin routes
router.post('/', protect, isAdmin, createProduct);          // CREATE product
router.put('/:id', protect, isAdmin, updateProduct);        // UPDATE product
router.delete('/:id', protect, isAdmin, deleteProduct);     // DELETE product

// Protected — logged in users only
router.post('/:id/reviews', protect, createProductReview);  // ADD review

module.exports = router;