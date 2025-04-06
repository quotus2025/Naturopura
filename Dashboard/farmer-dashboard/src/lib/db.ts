import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'naturopura';

export async function connectToDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    const client = await MongoClient.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const db = client.db(DB_NAME);
    console.log('Using database:', DB_NAME);
    
    // Ensure the users collection exists
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Existing collections:', collectionNames);
    
    if (!collectionNames.includes('users')) {
      console.log('Creating users collection...');
      await db.createCollection('users');
      console.log('Users collection created');
    }
    
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
} 