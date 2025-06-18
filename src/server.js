const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Welcome to the Restaurant Ordering System API!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}. The kitchen is open!`);
});
