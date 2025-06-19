const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
    {
        dish: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema({
    items: {
        type: [orderItemSchema],
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'completed', 'cancelled'],
        default: 'pending',
    },
    customerName: {
        type: String,
        trim: true,
        required: false,
    },
    customerContact: {
        type: String,
        trim: true,
        required: false,
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

orderSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

orderSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

// Creating the model 'Order'
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
