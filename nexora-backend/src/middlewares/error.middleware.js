import ApiError from "../utils/ApiError.js";
import logger from '../utils/logger.js';

export const errorHandler = (err, req, res, next) =>{
    let{ statusCode, message} = err;

    if (err.name === 'ValidationError') {
        // Mongoose validation error
        statusCode = 400;
        message = Object.values(err.errors).map(e => e.message).join(' | ');
    } else if (err.code === 11000) {
        // Mongoose duplicate key error
        const field = Object.keys(err.keyValue || {})[0] || 'field';
        statusCode = 400;
        message = `A record with this ${field} already exists`;
    } else if (!(err instanceof ApiError)) {
        statusCode = 500;
        message = "Internal Server Error";
    }

    console.error(`[ERROR] ${req.method} ${req.url} : ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    error: process.env.NODE_ENV === 'development' ? err.stack : null,
  });
};

