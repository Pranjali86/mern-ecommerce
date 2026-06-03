const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Schema = blueprint of how a User document looks in MongoDB
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'], //cutom error message
        },
        email: {
            type: String,
            required: [true, 'Please add an email'], //no two users can have the same email
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
        },
        isAdmin: {
            type: Boolean,
            default: false, //normal users are not admins
        },
    },
    {
        timestamps: true, //auto adds createdAt and updatedAt fields
    }
);

// This runs BEFORE saving a user to DB
// It hashes the password automatically
userSchema.pre('save', async function (next) {
    // Only hash if password was changed (not on other updates)
    if (!this.isModified('password')) return next();

    // 10 = salt rounds (higher = more secure but slower)
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Custom method to compare entered password with hashed one
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
