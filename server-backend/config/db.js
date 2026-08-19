const mongoose = require('mongoose');

// Establishes the single MongoDB connection used by the whole app.
// Fails fast (process.exit) if the connection cannot be established,
// since the API is useless without a database.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
