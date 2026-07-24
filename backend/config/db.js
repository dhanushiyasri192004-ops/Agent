import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
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
    console.warn(`Local MongoDB connection failed: ${error.message}. Starting persistent MongoDB database instance...`);
    try {
      const dbPath = path.join(process.cwd(), 'data_db');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create({
        instance: {
          dbPath: dbPath,
          storageEngine: 'wiredTiger',
        },
      });
      const mongoUri = mongoMemoryServer.getUri();
      
      console.log(`Persistent MongoDB database running at: ${mongoUri} (Storage: ${dbPath})`);
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (Persistent Storage): ${conn.connection.host}`);
      
      process.env.MONGODB_URI = mongoUri;
      await seedIfEmpty();
    } catch (fallbackError) {
      console.error(`Persistent MongoDB initialization failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
