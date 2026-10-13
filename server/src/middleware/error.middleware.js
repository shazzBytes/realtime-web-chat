function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;

  res.locals.error = {
    message: err.message,
    ...(process.env.NODE_ENV === "production" ? {} : { stack: err.stack }),
  };

  res.status(statusCode).json({
    message: statusCode === 500 ? "Internal Server error" : err.message,
  });
}

module.exports = errorHandler;
