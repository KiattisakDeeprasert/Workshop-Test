import path from "path";
import dotenv from "dotenv";

const NODE_ENV = process.env.NODE_ENV || "development";
const envFile = NODE_ENV === "production" ? ".env.production" : ".env.local";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

function parseCors(origins: string | undefined): (string | RegExp)[] {
  if (!origins || origins.trim() === "*") return ["*"];
  return origins.split(",").map(s => s.trim()).filter(Boolean);
}

const num = (v: string | undefined, d: number) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : d;
};

const config = {
  env: NODE_ENV,
  port: num(process.env.PORT, 8081),
  corsOrigins: parseCors(process.env.CORS_ORIGINS),
  mongoUri: process.env.MONGO_URI || "",
  mongoDbName: process.env.MONGO_DB_NAME || "task_manager",
};

if (!config.mongoUri) {
  console.warn("⚠️  MONGO_URI is empty. Set it in your .env file.");
}

export default config;
