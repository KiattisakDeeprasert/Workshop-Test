import mongoose from "mongoose";
import config from "../configs/env";

export async function connectMongo(): Promise<void> {
  if (!config.mongoUri) {
    throw new Error("MONGO_URI is not set");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(config.mongoUri, {
    dbName: config.mongoDbName,
    serverSelectionTimeoutMS: 8000,
  });

  console.log(`✅ MongoDB connected (db: ${config.mongoDbName})`);

  mongoose.connection.on("error", (err) => {
    console.error("[db] connection error:", err);
  });
  mongoose.connection.on("disconnected", () => {
    console.warn("[db] disconnected");
  });
}

export async function disconnectMongo(): Promise<void> {
  await mongoose.disconnect();
}
