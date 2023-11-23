const { Error } = require('mongoose');
const  CaptureError = require('../utils/CaptureError');
const httpStatus = require('../utils/configs/httpStatus');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  // Mongoose error for duplicate field value.
  if (error.code === 11000) {
    const key = Object.keys(err.keyValue || {})[0];
    const value = (err.keyValue)[
      Object.keys(err.keyPattern || {})[0]
    ];

    let message = `A field value already exists. Field: "${key}", Value: "${value}"`;
    if (key === 'email') message = `${value} is already registered!`;
    error = new CaptureError(message, 400);
  }

  // Mongoose error for validation of data.
  if (err instanceof Error.ValidationError) {
    let message = error .errors?.[
      Object.keys(err.errors || {})[0]
    ].message;
    if (!message) message = error.message;
    error = new CaptureError(message, 400);
  }

  // Mongoose error for failed to cast invalid ObjectIds.
  if (err.name === 'CastError') {
    const message = `${error.message}. ${err.reason}`;
    error = new CaptureError(message, 400);
  }

  if (err.name === 'TokenExpiredError')
      error = new CaptureError('JWT has expired!', httpStatus.FORBIDDEN);

  if (err.name === 'JsonWebTokenError')
      error = new CaptureError(error.message, httpStatus.UNAUTHORIZED);

  const statusCode = error.statusCode || 500;
  const message =
    error.message || 'Unexpected error occurred! Internal server error!';

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

module.exports = errorHandler;