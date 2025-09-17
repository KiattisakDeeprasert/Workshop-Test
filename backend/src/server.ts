import { app } from "./app";
import config from "./configs/env";
import { connectMongo } from "./database/mongo";

async function start() {
  try {
    await connectMongo();
    app.listen(config.port, () => {
      console.log(`✅ API (${config.env}) running at http://localhost:${config.port}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

start();
