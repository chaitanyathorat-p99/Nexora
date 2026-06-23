import mongoose from "mongoose";
import dotenv from "dotenv";
import ApiError from '../utils/ApiError.js'
dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_DB_URI;

    if (!mongoUri) {
      throw new Error("Missing MongoDB connection string. Set MONGODB_URI in .env.");
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    //  throw new ApiError(401, error.message);
    console.log(error)
    process.exit(1);
  }
};



export default connectDB;
