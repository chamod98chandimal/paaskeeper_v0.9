// Test script to verify MongoDB connection
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

const opts = {
  bufferCommands: false,
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 30000,
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
  waitQueueTimeoutMS: 30000
};

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('URI:', MONGODB_URI.replace(/:[^:@]*@/, ':***@')); // Hide password
    
    const start = Date.now();
    await mongoose.connect(MONGODB_URI, opts);
    const connectionTime = Date.now() - start;
    
    console.log(`✅ MongoDB connected successfully in ${connectionTime}ms`);
    console.log('📊 Connection info:');
    console.log('- Database name:', mongoose.connection.db.databaseName);
    console.log('- Ready state:', mongoose.connection.readyState);
    console.log('- Host:', mongoose.connection.host);
    console.log('- Port:', mongoose.connection.port);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📋 Available collections:', collections.map(c => c.name).join(', ') || 'None');
    
    await mongoose.connection.close();
    console.log('🔌 Connection closed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.code) {
      console.error('Error code:', error.code);
    }
    
    process.exit(1);
  }
}

testConnection(); 