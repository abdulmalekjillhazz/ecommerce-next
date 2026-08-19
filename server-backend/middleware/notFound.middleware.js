const ApiError = require('../utils/ApiError');

// Catches any request that didn't match a route and forwards a 404
// into the global error handler, keeping the response shape consistent.
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

module.exports = notFound;
