
const { MongoClient } = require('mongodb');
require('dotenv').config();

let db = null;
let client = null;

const connectToDatabase = async () => {
  if (db) return db;
  
  try {
    // Use environment variable, with fallback to ensure it works in production
    const mongoUri = process.env.MONGODB_URI || process.env.VITE_MONGODB_URI;
    const dbName = process.env.MONGODB_DB_NAME || process.env.VITE_MONGODB_DB_NAME || 'lyzLawFirm';
    
    if (!mongoUri) {
      console.error('MongoDB URI is not defined in environment variables');
      throw new Error('MongoDB URI is not defined');
    }
    
    console.log(`Connecting to MongoDB database: ${dbName}`);
    client = new MongoClient(mongoUri);
    await client.connect();
    
    db = client.db(dbName);
    console.log('Database connected successfully');
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

const getDb = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
};

const closeConnection = async () => {
  if (client) {
    await client.close();
    console.log('Database connection closed');
  }
};

module.exports = {
  connectToDatabase,
  getDb,
  closeConnection
};
