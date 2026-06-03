const Product = require('../models/productModel');

// ── GET ALL PRODUCTS ────────────────────────────────────
// GET /api/products
const getProducts = async (req, res) => {
  try {
    // keyword search — if ?keyword=phone in URL, filter by name
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};
    // $regex = pattern match, 'i' = case insensitive

    const products = await Product.find({ ...keyword });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ── GET SINGLE PRODUCT ──────────────────────────────────
// GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    // req.params.id = the :id part from the URL

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ── CREATE PRODUCT ──────────────────────────────────────
// POST /api/products  (admin only)
const createProduct = async (req, res) => {
  try {
    const { name, price, image, brand, category, description, countInStock } =
      req.body;

    const product = new Product({
      name,
      price,
      image,
      brand,
      category,
      description,
      countInStock,
      user: req.user._id, // admin who created it (set by protect middleware)
      rating: 0,
      numReviews: 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ── UPDATE PRODUCT ──────────────────────────────────────
// PUT /api/products/:id  (admin only)
const updateProduct = async (req, res) => {
  try {
    const { name, price, image, brand, category, description, countInStock } =
      req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // update only the fields that were sent
      product.name = name || product.name;
      product.price = price || product.price;
      product.image = image || product.image;
      product.brand = brand || product.brand;
      product.category = category || product.category;
      product.description = description || product.description;
      product.countInStock = countInStock ?? product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ── DELETE PRODUCT ──────────────────────────────────────
// DELETE /api/products/:id  (admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ── CREATE REVIEW ───────────────────────────────────────
// POST /api/products/:id/reviews  (logged in users)
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      // check if user already reviewed this product
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      // create the new review
      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review); // add to reviews array
      product.numReviews = product.reviews.length;

      // recalculate average rating
      product.rating =
        product.reviews.reduce((acc, r) => acc + r.rating, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
};