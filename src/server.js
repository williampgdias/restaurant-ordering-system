const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const dishRoutes = require('./routes/dishRoutes');
const orderRoutes = require('./routes/orderRoutes');
const AppError = require('./utils/AppError');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

mongoose
    .connect(DATABASE_URL)
    .then(() => {
        console.log(
            'Connected to MongoDB (Docker). Our garden is ready for planting!'
        );
    })
    .catch((err) => {
        console.error('Could not connect to MongoDB:', err);
        process.exit(1);
    });

app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant Ordering System API!');
});

app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. The kitchen is open!`);
});
