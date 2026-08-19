// Wraps an async controller so any thrown/rejected error is forwarded
// to next(), instead of needing a try/catch in every single controller.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
