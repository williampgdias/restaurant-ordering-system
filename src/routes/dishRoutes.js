const express = require('express');
const router = express.Router();
const dishController = require('../controllers/DishController');

router
    .route('/')
    .get(dishController.getAllDishes)
    .post(dishController.createDish);

router
    .route('/:id')
    .get(dishController.getDishById)
    .put(dishController.updateDish)
    .delete(dishController.deleteDish);

module.exports = router;
