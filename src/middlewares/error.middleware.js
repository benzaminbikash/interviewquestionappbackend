const notFound = async (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl} `);
  res.status(400);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  res.status(statusCode);
  res.send({ message: error.message, status: "fail", stack: error.stack });
};

module.exports = { notFound, errorHandler };
