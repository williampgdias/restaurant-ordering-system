const Order = require('../models/Order');
const Dish = require('../models/Dish');

async function getAllOrders(req, res) {
    try {
        const orders = await Order.find().populate('items.dish');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            message: 'Error fetching orders.',
            error: error.message,
        });
    }
}

async function createOrder(req, res) {
    try {
        const { items, customerName, customerContact } = req.body;
        if (!items || items.length === 0) {
            return res
                .status(400)
                .json({ message: 'Order must contain at least one item.' });
        }

        let totalAmount = 0;
        const processedItems = [];

        for (const item of items) {
            const dish = await Dish.findById(item.dish);
            if (!dish) {
                return res
                    .status(400)
                    .json({ message: `Dish with ID ${item.dish} not found.` });
            }
            if (!dish.isAvailable) {
                return res.status(400).json({
                    message: `Dish "${dish.name}" is currently not available.`,
                });
            }
            if (item.quantity <= 0) {
                return res.status(400).json({
                    message: `Quantity for dish "${dish.name}" must be at least 1.`,
                });
            }

            processedItems.push({
                dish: dish._id,
                quantity: item.quantity,
                price: dish.price,
            });

            totalAmount += dish.price * item.quantity;
        }

        // Create new order with the processed items and the total amount
        const newOrder = new Order({
            items: processedItems,
            totalAmount: totalAmount,
            customerName,
            customerContact,
            status: 'pending',
        });

        // Save the order to the database
        await newOrder.save();

        // Populate the items with dish details
        await newOrder.populate('items.dish');

        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            message: 'Error creating order.',
            error: error.message,
        });
    }
}

// Function to get an order by ID
async function getOrderById(req, res) {
    try {
        const { id } = req.params;
        // Encontra o pedido pelo ID e popula os detalhes dos pratos
        const order = await Order.findById(id).populate('items.dish');

        if (!order) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error('Error fetching order by ID:', error);
        res.status(500).json({
            message: 'Error fetching order.',
            error: error.message,
        });
    }
}

// Function to update an order
async function updateOrder(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.items) {
            let newTotalAmount = 0;
            const processedItems = [];

            for (const item of updates.items) {
                const dish = await Dish.findById(item.dish);
                if (!dish) {
                    return res.status(400).json({
                        message: `Dish with ID ${item.dish} not found.`,
                    });
                }
                if (!dish.isAvailable) {
                    return res.status(400).json({
                        message: `Dish "${dish.name}" is currently not available.`,
                    });
                }
                if (item.quantity <= 0) {
                    return res.status(400).json({
                        message: `Quantity for dish "${dish.name}" must be at least 1.`,
                    });
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

        // Update the order with the provided updates
        const updatedOrder = await Order.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }

        // Populate the updated order with dish details
        await updatedOrder.populate('items.dish');

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(400).json({
            message: 'Error updating order.',
            error: error.message,
        });
    }
}

// Function to delete an order
async function deleteOrder(req, res) {
    try {
        const { id } = req.params;
        const deletedOrder = await Order.findByIdAndDelete(id);

        if (!deletedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({
            message: 'Error deleting order.',
            error: error.message,
        });
    }
}

module.exports = {
    getAllOrders,
    createOrder,
    getOrderById,
    updateOrder,
    deleteOrder,
};
