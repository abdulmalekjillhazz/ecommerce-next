import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error('Please define the MONGO_URI environment variable');

const globalForMongoose = globalThis;

export default async function dbConnect() {
  if (globalForMongoose.mongoose?.conn) return globalForMongoose.mongoose.conn;
  if (!globalForMongoose.mongoose) globalForMongoose.mongoose = { conn: null, promise: null };
  if (!globalForMongoose.mongoose.promise) {
    globalForMongoose.mongoose.promise = mongoose.connect(MONGO_URI).then((m) => m);
  }
  globalForMongoose.mongoose.conn = await globalForMongoose.mongoose.promise;
  return globalForMongoose.mongoose.conn;
}
