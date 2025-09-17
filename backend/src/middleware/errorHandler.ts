import { Request, Response, NextFunction } from "express";

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("[ERROR]", err);
  res.status(500).json({ error: "Internal Server Error" });
}
