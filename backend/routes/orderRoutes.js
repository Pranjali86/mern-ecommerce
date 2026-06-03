const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// All order routes are protected — must be logged in
router.post('/', protect, createOrder);                           // place order
router.get('/myorders', protect, getMyOrders);                   // my orders
router.get('/:id', protect, getOrderById);                       // single order
router.put('/:id/pay', protect, updateOrderToPaid);              // mark paid
router.put('/:id/deliver', protect, isAdmin, updateOrderToDelivered); // mark delivered
router.get('/', protect, isAdmin, getAllOrders);                  // all orders (admin)

module.exports = router;