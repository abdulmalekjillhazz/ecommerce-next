const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
const app = require('./app');
const connectDB = require('./config/db');
const validateEnv = require('./config/env');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  validateEnv();
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();
