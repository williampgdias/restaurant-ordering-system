const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');

// Define routes for orders
router
    .route('/')
    .get(orderController.getAllOrders)
    .post(orderController.createOrder);

// Define routes for a specific order by ID
router
    .route('/:id')
    .get(orderController.getOrderById)
    .put(orderController.updateOrder)
    .delete(orderController.deleteOrder);

module.exports = router;
