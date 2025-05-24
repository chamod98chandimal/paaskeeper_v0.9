// import mongoose from 'mongoose';

// const MONGODB_URI = process.env.MONGODB_URI;

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable');
// }

// // Correct global type declaration
// declare global {
//   var mongoose: {
//     conn: typeof mongoose | null;
//     promise: Promise<typeof mongoose> | null;
//   } | undefined;
// }

// // Initialize the global cache if not already present
// global.mongoose = global.mongoose || { conn: null, promise: null };
// const cached = global.mongoose;

// async function connectDB() {
//   if (cached.conn) {
//     return cached.conn;
//   }

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(MONGODB_URI);
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// export default connectDB;


import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const uri = process.env.MONGODB_URI;
const options = { 
  appName: "paaskeeper",
  maxPoolSize: 10,
  minPoolSize: 5
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect().catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
    throw err;
  });
}

clientPromise = global._mongoClientPromise;

export default async function connectDB() {
  try {
    return await clientPromise;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}


