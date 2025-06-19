const Order = require('../models/Order');
const Dish = require('../models/Dish');
const AppError = require('../utils/AppError');

const catchAsync = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};

const getAllOrders = catchAsync(async (req, res, next) => {
    const orders = await Order.find().populate('items.dish');
    res.status(200).json(orders);
});

// --- Chef de Seção: Criar um Novo Pedido (POST /api/orders) ---
const createOrder = catchAsync(async (req, res, next) => {
    const { items, customerName, customerContact } = req.body;

    if (!items || items.length === 0) {
        return next(new AppError('Order must contain at least one item.', 400));
    }

    let totalAmount = 0;
    const processedItems = [];

    for (const item of items) {
        const dish = await Dish.findById(item.dish);
        if (!dish) {
            return next(
                new AppError(`Dish with ID ${item.dish} not found.`, 400)
            );
        }
        if (!dish.isAvailable) {
            return next(
                new AppError(
                    `Dish "${dish.name}" is currently not available.`,
                    400
                )
            );
        }
        if (item.quantity <= 0) {
            return next(
                new AppError(
                    `Quantity for dish "${dish.name}" must be at least 1.`,
                    400
                )
            );
        }

        processedItems.push({
            dish: dish._id,
            quantity: item.quantity,
            price: dish.price,
        });
        totalAmount += dish.price * item.quantity;
    }

    const newOrder = new Order({
        items: processedItems,
        totalAmount: totalAmount,
        customerName,
        customerContact,
        status: 'pending',
    });

    await newOrder.save();
    await newOrder.populate('items.dish');

    res.status(201).json(newOrder);
});

const getOrderById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id).populate('items.dish');

    if (!order) {
        return next(new AppError('Order not found with that ID.', 404));
    }
    res.status(200).json(order);
});

const updateOrder = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updates = req.body;

    if (updates.items) {
        let newTotalAmount = 0;
        const processedItems = [];

        for (const item of updates.items) {
            const dish = await Dish.findById(item.dish);
            if (!dish) {
                return next(
                    new AppError(`Dish with ID ${item.dish} not found.`, 400)
                );
            }
            if (!dish.isAvailable) {
                return next(
                    new AppError(
                        `Dish "${dish.name}" is currently not available.`,
                        400
                    )
                );
            }
            if (item.quantity <= 0) {
                return next(
                    new AppError(
                        `Quantity for dish "${dish.name}" must be at least 1.`,
                        400
                    )
                );
            }
            processedItems.push({
                dish: dish._id,
                quantity: item.quantity,
                price: dish.price,
            });
            newTotalAmount += dish.price * item.quantity;
        }
        updates.items = processedItems;
        updates.totalAmount = newTotalAmount;
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
    });

    if (!updatedOrder) {
        return next(new AppError('Order not found with that ID.', 404));
    }

    await updatedOrder.populate('items.dish');

    res.status(200).json(updatedOrder);
});

const deleteOrder = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
        return next(new AppError('Order not found with that ID.', 404));
    }
    res.status(204).send();
});

module.exports = {
    getAllOrders,
    createOrder,
    getOrderById,
    updateOrder,
    deleteOrder,
};
