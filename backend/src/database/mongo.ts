import mongoose from "mongoose";
import config from "../configs/env";

export async function connectMongo(): Promise<void> {
  if (!config.mongoUri) {
    throw new Error("MONGO_URI is not set");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(config.mongoUri);
  console.log("✅ MongoDB connected");
}

export async function disconnectMongo(): Promise<void> {
  await mongoose.disconnect();
}
