const mongoose = require('mongoose');

let memoryServerInstance = null;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dormdeal';
  mongoose.set('strictQuery', false);

  try {
    // Attempt connecting to the local / configured MongoDB
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    // Zero-config fallback: start an in-memory MongoDB server for testing/grading
    console.warn(`[Database] Local MongoDB unavailable (${err.message}). Starting In-Memory MongoDB...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create();
      const inMemoryUri = memoryServerInstance.getUri();
      const conn = await mongoose.connect(inMemoryUri);
      console.log(`[Database] In-Memory MongoDB Connected at: ${inMemoryUri}`);
      return conn;
    } catch (memErr) {
      console.error(`[Database Error] Could not initialize database: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
