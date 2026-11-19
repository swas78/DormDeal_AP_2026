const mongoose = require('mongoose');

let mongoMemoryServerInstance = null;

const connectDB = async () => {
  // If already connected, reuse existing connection
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campuskart';
    
    // Attempt connecting to the configured or default MongoDB instance
    mongoose.set('strictQuery', false);
    
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 2500, // Quick timeout to fallback if no local server
      });
      console.log(`[Database] MongoDB Connected to host: ${conn.connection.host} (${conn.connection.name})`);
      return conn;
    } catch (directErr) {
      // If external or local MongoDB isn't running and MONGO_URI wasn't explicitly set to an Atlas cluster
      if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('127.0.0.1') || process.env.MONGO_URI.includes('localhost')) {
        console.warn(`[Database] Direct MongoDB connection failed (${directErr.message}).`);
        console.log('[Database] Initializing In-Memory MongoDB Server for demonstration & development...');
        
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongoMemoryServerInstance = await MongoMemoryServer.create();
        const inMemoryUri = mongoMemoryServerInstance.getUri();
        
        const conn = await mongoose.connect(inMemoryUri);
        console.log(`[Database] In-Memory MongoDB Connected at: ${inMemoryUri}`);
        return conn;
      } else {
        throw directErr;
      }
    }
  } catch (error) {
    console.error(`[Database Error] Failed to connect: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
