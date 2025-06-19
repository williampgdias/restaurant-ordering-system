const AppError = require('../utils/AppError');

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        console.error('ERROR 💥', err);
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };
        error.message = err.message;

        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            error = new AppError(`Invalid ID: ${error.value}.`, 400);
        }

        if (error.code === 11000) {
            const value = error.keyValue
                ? Object.values(error.keyValue)[0]
                : '';
            const message = `Duplicate field value: ${value}. Please use another value!`;
            error = new AppError(message, 400);
        }

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map((el) => el.message);
            const message = `Invalid input data. ${errors.join('. ')}`;
            error = new AppError(message, 400);
        }

        sendErrorProd(error, res);
    }
};
