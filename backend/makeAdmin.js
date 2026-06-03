const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/userModel');
  await User.findOneAndUpdate(
    { email: 'pranjali@test.com' },
    { isAdmin: true }
  );
  console.log('User updated to admin!');
  process.exit();
});