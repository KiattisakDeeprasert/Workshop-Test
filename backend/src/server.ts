import { app } from "./app";
import config from "./configs/env";
import { connectMongo, disconnectMongo } from "./database/mongo";
import http from "http";

let server: http.Server | null = null;

async function start() {
  try {
    await connectMongo();

    server = app.listen(config.port, () => {
      console.log(`✅ API (${config.env}) at http://localhost:${config.port}`);
    });

    const shutdown = async (signal: string) => {
      console.log(`\n🔻 Received ${signal}, shutting down...`);
      try {
        await new Promise<void>((resolve, reject) => {
          if (!server) return resolve();
          server.close(err => (err ? reject(err) : resolve()));
        });
        await disconnectMongo();
        console.log("✅ Clean shutdown complete");
        process.exit(0);
      } catch (e) {
        console.error("❌ Error during shutdown:", e);
        process.exit(1);
      }
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();