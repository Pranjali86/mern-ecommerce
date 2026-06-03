require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/productModel');
const User = require('./models/userModel');
const connectDB = require('./config/db');

connectDB();

const products = [
  {
    name: 'iPhone 15 Pro',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
    brand: 'Apple',
    category: 'Electronics',
    description: 'The latest iPhone with A17 Pro chip and titanium design.',
    price: 999,
    countInStock: 10,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Samsung Galaxy S24',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400',
    brand: 'Samsung',
    category: 'Electronics',
    description: 'Flagship Android phone with AI features and 200MP camera.',
    price: 849,
    countInStock: 8,
    rating: 4.3,
    numReviews: 9,
  },
  {
    name: 'Sony WH-1000XM5',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
    brand: 'Sony',
    category: 'Electronics',
    description: 'Industry leading noise cancelling wireless headphones.',
    price: 349,
    countInStock: 15,
    rating: 4.8,
    numReviews: 25,
  },
  {
    name: 'MacBook Air M3',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
    brand: 'Apple',
    category: 'Computers',
    description: 'Supercharged by M3 chip. Incredibly thin and light laptop.',
    price: 1299,
    countInStock: 5,
    rating: 4.9,
    numReviews: 18,
  },
  {
    name: 'Nike Air Max 270',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    brand: 'Nike',
    category: 'Footwear',
    description: 'Lifestyle shoe with large Air unit for all-day comfort.',
    price: 150,
    countInStock: 20,
    rating: 4.2,
    numReviews: 31,
  },
  {
    name: 'Adidas Ultraboost 23',
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400',
    brand: 'Adidas',
    category: 'Footwear',
    description: 'Premium running shoes with Boost cushioning technology.',
    price: 190,
    countInStock: 12,
    rating: 4.4,
    numReviews: 22,
  },
];

const importData = async () => {
  try {
    // get admin user
    const adminUser = await User.findOne({ email: 'pranjali2@test.com' });

    // add user field to each product
    const sampleProducts = products.map((p) => ({
      ...p,
      user: adminUser._id,
    }));

    // delete existing products and insert new ones
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);

    console.log('✅ Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();