const Order = require('../models/orderModel');

// ── CREATE ORDER ────────────────────────────────────────
// POST /api/orders  (protected)
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    // check that order has items
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user: req.user._id, // from protect middleware
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ── GET ORDER BY ID ─────────────────────────────────────
// GET /api/orders/:id  (protected)
const getOrderById = async (req, res) => {
  try {
    // .populate() fetches the actual user data from User collection
    // instead of just the user id
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ── UPDATE ORDER TO PAID ────────────────────────────────
// PUT /api/orders/:id/pay  (protected)
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // mark order as paid
      order.isPaid = true;
      order.paidAt = Date.now();

      // save payment result from payment gateway (PayPal/Stripe)
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ── UPDATE ORDER TO DELIVERED ───────────────────────────
// PUT /api/orders/:id/deliver  (admin only)
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ── GET MY ORDERS ───────────────────────────────────────
// GET /api/orders/myorders  (protected)
const getMyOrders = async (req, res) => {
  try {
    // find all orders where user matches logged in user
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ── GET ALL ORDERS ──────────────────────────────────────
// GET /api/orders  (admin only)
const getAllOrders = async (req, res) => {
  try {
    // populate user name and id for each order
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders,
};