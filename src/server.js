const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const dishRoutes = require('./routes/dishRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

// Connect to MongoDB
mongoose
    .connect(DATABASE_URL)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
        process.exit(1);
    });

app.use('/api/dishes', dishRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant Ordering System API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. The kitchen is open!`);
});
