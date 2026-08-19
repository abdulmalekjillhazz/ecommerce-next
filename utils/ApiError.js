// Custom error class thrown throughout controllers/services.
// The global error middleware knows how to serialize this consistently.
class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors; // e.g. [{ field: 'email', message: 'Already in use' }]
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ApiError;
