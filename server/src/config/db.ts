import { MongoClient, Db, ServerApiVersion, GridFSBucket } from "mongodb";

import dotenv from "dotenv";

dotenv.config();
const dbName = process.env.DATABASE_NAME as string;
const MONGODB_URL = process.env.MONGODB_URL as string;
if (!MONGODB_URL) {
  throw new Error("MONGODB_URL is not defined in the environment variables");
}

let db: Db;
let client: MongoClient | null = null;

export async function connectToDatabase(): Promise<Db | null> {
  if (db) return db;

  client = new MongoClient(MONGODB_URL, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  try {
    await client.connect();
    await client.db(dbName).command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    console.log("Connected to MongoDB");
    const database = client.db(dbName);
    return database;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return null;
  }
}

// Add a function to close the connection when needed
export async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

export async function getGridFSBucket() {
  try {
    const db = await connectToDatabase();
    if (db) {
      const bucket = new GridFSBucket(db);
      return bucket;
    }
  } catch (error) {
    console.error("error getting GridFSBucket", error);
  }
}
