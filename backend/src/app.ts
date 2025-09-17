import express from "express";
import cors from "cors";
import config from "./configs/env";
import taskRoutes from "./routes/task_routes";
import notFound from "./middleware/notFound";
import errorHandler from "./middleware/errorHandler";
import apiRouter from "./routes";

export const app = express();

app.use(
  cors({
    origin: config.corsOrigins.includes("*") ? true : config.corsOrigins,
    credentials: true
  })
);
app.use(express.json());

// Health check
app.get("/", (_req, res) => {
  res.json({ service: "Run-Backend-Workshop-Successfuly"});
});

// Routes
app.use("/api", apiRouter);

// 404 & error
app.use(notFound);
app.use(errorHandler);
