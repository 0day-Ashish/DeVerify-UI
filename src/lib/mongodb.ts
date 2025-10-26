import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI ?? "";
if (!uri) throw new Error("Missing MONGODB_URI in environment");

declare global {
  // allow caching across module reloads in development
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  var __mongoClientPromise__: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;
if (!global.__mongoClientPromise__) {
  const client = new MongoClient(uri);
  global.__mongoClientPromise__ = client.connect();
}
clientPromise = global.__mongoClientPromise__ as Promise<MongoClient>;

export default clientPromise;