import path from "path";
import dotenv from "dotenv";

const NODE_ENV = process.env.NODE_ENV || "development";
const envFile = NODE_ENV === "production" ? ".env.production" : ".env.local";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

function parseCors(origins: string | undefined): (string | RegExp)[] {
  if (!origins || origins.trim() === "*") return ["*"];
  return origins.split(",").map(s => s.trim()).filter(Boolean);
}

const config = {
  env: NODE_ENV,
  port: Number(process.env.PORT || 8081),
  corsOrigins: parseCors(process.env.CORS_ORIGINS),
  mongoUri: process.env.MONGO_URI || ""
};

if (!config.mongoUri) {
  console.warn("⚠️  MONGO_URI is empty. Set it in your .env file.");
}

export default config;
