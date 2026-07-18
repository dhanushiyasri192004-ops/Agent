import mongoose from 'mongoose';
import { seedIfEmpty } from './seedHelper.js';

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    console.log(`Connecting to MongoDB at: ${process.env.MONGODB_URI}`);
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedIfEmpty();
  } catch (error) {
    console.warn(`Local MongoDB connection failed: ${error.message}. Starting in-memory fallback...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const mongoUri = mongoMemoryServer.getUri();
      
      console.log(`Starting in-memory MongoDB at: ${mongoUri}`);
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
      
      process.env.MONGODB_URI = mongoUri;
      await seedIfEmpty();
    } catch (fallbackError) {
      console.error(`In-Memory MongoDB fallback failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
