import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('Please define the MONGODB_URI environment variable');

const globalForMongoose = globalThis;

export default async function dbConnect() {
  if (globalForMongoose.mongoose?.conn) return globalForMongoose.mongoose.conn;
  if (!globalForMongoose.mongoose) globalForMongoose.mongoose = { conn: null, promise: null };
  if (!globalForMongoose.mongoose.promise) {
    globalForMongoose.mongoose.promise = mongoose.connect(MONGODB_URI).then((m) => m);
  }
  globalForMongoose.mongoose.conn = await globalForMongoose.mongoose.promise;
  return globalForMongoose.mongoose.conn;
}
