import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
let cached = global.mongoClient;

if (!cached) {
  cached = global.mongoClient = { client: null };
}

export async function connectToDatabase() {
  if (!cached.client) {
    const client = new MongoClient(uri);
    await client.connect();
    cached.client = client;
  }
  return cached.client.db();
}
