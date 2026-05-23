function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;

  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      details: Object.values(error.errors).map((item) => item.message),
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid resource id" });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      message: "Duplicate value",
      details: Object.keys(error.keyPattern || {}),
    });
  }

  if (!error.isOperational) {
    console.error(error);
  }

  res.status(statusCode).json({
    message: error.message || "Internal server error",
    details: error.details || undefined,
  });
}

module.exports = errorHandler;
