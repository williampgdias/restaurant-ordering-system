const Dish = require('../models/Dish');
const AppError = require('../utils/AppError');

const catchAsync = (fn) => (req, res, next) => {
    fn(req, res, next).catch(next);
};

const getAllDishes = catchAsync(async (req, res, next) => {
    const dishes = await Dish.find();
    res.status(200).json(dishes);
});

const createDish = catchAsync(async (req, res, next) => {
    const newDish = new Dish(req.body);
    await newDish.save();
    res.status(201).json(newDish);
});

const getDishById = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const dish = await Dish.findById(id);

    if (!dish) {
        return next(new AppError('Dish not found with that ID.', 404));
    }
    res.status(200).json(dish);
});

const updateDish = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const updatedDish = await Dish.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!updatedDish) {
        return next(new AppError('Dish not found with that ID.', 404));
    }
    res.status(200).json(updatedDish);
});

const deleteDish = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedDish = await Dish.findByIdAndDelete(id);

    if (!deletedDish) {
        return next(new AppError('Dish not found with that ID.', 404));
    }
    res.status(204).send();
});

module.exports = {
    getAllDishes,
    createDish,
    getDishById,
    updateDish,
    deleteDish,
};
