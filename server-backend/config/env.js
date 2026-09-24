const required = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRES_IN',
];

const validateEnv = () => {
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

module.exports = validateEnv;
