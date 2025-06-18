const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        trim: true,
    },
    imageUrl: {
        type: String,
        required: false,
        trim: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

dishSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

dishSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updateAt: Date.now() });
    next();
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
