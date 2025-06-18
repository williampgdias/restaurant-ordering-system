const Dish = require('../models/Dish');

async function getAllDishes(req, res) {
    try {
        const dishes = await Dish.find();
        res.status(200).json(dishes);
    } catch (error) {
        console.error('Error fetching dishes:', error);
        res.status(500).json({
            message: 'Error fetching dishes.',
            error: error.message,
        });
    }
}

async function createDish(req, res) {
    try {
        const newDish = new Dish(req.body);
        await newDish.save();
        res.status(201).json(newDish);
    } catch (error) {
        console.error('Error creating dish:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Dish name already exists.',
                error: error.message,
            });
        }
        res.status(400).json({
            message: 'Error creating dish.',
            error: error.message,
        });
    }
}

async function getDishById(req, res) {
    try {
        const { id } = req.params;
        const dish = await Dish.findById(id);
        if (!dish) {
            return res.status(404).json({ message: 'Dish not found.' });
        }
        res.status(200).json(dish);
    } catch (error) {
        console.error('Error fetching dish by ID:', error);
        res.status(500).json({
            message: 'Error fetching dish by ID.',
            error: error.message,
        });
    }
}

async function updateDish(req, res) {
    try {
        const { id } = req.params;
        const updatedDish = await Dish.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updatedDish) {
            return res.status(404).json({ message: 'Dish not found.' });
        }
        res.status(200).json(updatedDish);
    } catch (error) {
        console.error('Error updating dish:', error);
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Dish name already exists.',
                error: error.message,
            });
        }
        res.status(400).json({
            message: 'Error updating dish.',
            error: error.message,
        });
    }
}

async function deleteDish(req, res) {
    try {
        const { id } = req.params;
        const deletedDish = await Dish.findByIdAndDelete(id);
        if (!deletedDish) {
            return res.status(404).json({ message: 'Dish not found.' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting dish:', error);
        res.status(500).json({
            message: 'Error deleting dish.',
            error: error.message,
        });
    }
}

module.exports = {
    getAllDishes,
    createDish,
    getDishById,
    updateDish,
    deleteDish,
};
