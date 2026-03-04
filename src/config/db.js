const mongoose = require("mongoose");
require("colors");
const dotenv = require("dotenv");
dotenv.config(); // Load .env

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`.bgYellow);
  } catch (error) {
    console.log(`Error db: ${error}`.bgRed);
    process.exit(1);
  }
};

module.exports = connectDB;
