import { MongoClient, UUID } from "mongodb";

type MongoClientPromise = Promise<MongoClient>;

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: MongoClientPromise;
};

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not set");
}

const mongoDbName =
  process.env.MONGODB_DB_NAME ||
  (process.env.NODE_ENV === "production" ? "hytheria_live" : "hytheria_staging");

const client = new MongoClient(mongoUri);

const clientPromise = globalForMongo._mongoClientPromise ?? client.connect();

globalForMongo._mongoClientPromise = clientPromise;

export async function getDatabase() {
  const clientInstance = await clientPromise;
  return clientInstance.db(mongoDbName);
}

export default clientPromise;
