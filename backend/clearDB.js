import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const clearDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/agent-management';
    console.log(`Connecting to database to clear collections: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    
    const collections = Object.keys(mongoose.connection.collections);
    for (const name of collections) {
      console.log(`Dropping collection: ${name}`);
      try {
        await mongoose.connection.collections[name].drop();
      } catch (err) {
        console.warn(`Could not drop collection ${name}: ${err.message}`);
      }
    }
    
    console.log('Database cleared successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDB();
