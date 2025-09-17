import { Request, Response } from "express";
import mongoose from "mongoose";
import { Task, ITask, TaskStatus } from "../models/Task";

const ALLOWED_STATUSES = ["to do", "in progress", "done"] as const;
type AllowedStatus = typeof ALLOWED_STATUSES[number];
const isValidStatus = (v: unknown): v is AllowedStatus =>
  typeof v === "string" && (ALLOWED_STATUSES as readonly string[]).includes(v);

// GET /tasks
export async function getAll(_req: Request, res: Response) {
  const tasks = await Task.find().sort({ createdAt: -1 });
  res.json(tasks);
}

// POST /tasks  body: { title, subtitle?, status? }
export async function create(req: Request, res: Response) {
  const body = (req.body || {}) as {
    title?: unknown;
    subtitle?: unknown;
    status?: unknown;
  };

  if (typeof body.title !== "string" || !body.title.trim()) {
    return res.status(400).json({ error: "title is required (non-empty string)" });
  }
  const title = body.title.trim();

  let subtitle: string | undefined = undefined;
  if (body.subtitle !== undefined) {
    if (typeof body.subtitle !== "string") {
      return res.status(400).json({ error: "subtitle must be a string" });
    }
    subtitle = body.subtitle.trim();
  }

  let status: TaskStatus = "to do";
  if (body.status !== undefined) {
    if (!isValidStatus(body.status)) {
      return res
        .status(400)
        .json({ error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` });
    }
    status = body.status;
  }

  const task = await Task.create({ title, subtitle, status });
  res.status(201).json(task);
}

// PUT /tasks/:id  body: { title?, subtitle?, status? }
export async function update(req: Request, res: Response) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const body = req.body ?? {};

  // Build update doc with $set / $unset so we can remove subtitle properly
  const $set: Partial<Pick<ITask, "title" | "subtitle" | "status">> = {};
  const $unset: Record<string, unknown> = {};

  if ("title" in body) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return res.status(400).json({ error: "title must be a non-empty string" });
    }
    $set.title = body.title.trim();
  }

  if ("subtitle" in body) {
    if (
      body.subtitle === null ||
      (typeof body.subtitle === "string" && body.subtitle.trim() === "")
    ) {
      $unset.subtitle = "";
    } else if (typeof body.subtitle === "string") {
      $set.subtitle = body.subtitle.trim();
    } else {
      return res.status(400).json({ error: "subtitle must be a string or null" });
    }
  }

  if ("status" in body) {
    if (!isValidStatus(body.status)) {
      return res
        .status(400)
        .json({ error: `status must be one of: ${ALLOWED_STATUSES.join(", ")}` });
    }
    $set.status = body.status as AllowedStatus;
  }

  if (Object.keys($set).length === 0 && Object.keys($unset).length === 0) {
    const current = await Task.findById(id);
    if (!current) return res.status(404).json({ error: "Task not found" });
    return res.json(current);
  }

  const updateDoc: Record<string, unknown> = {};
  if (Object.keys($set).length) updateDoc.$set = $set;
  if (Object.keys($unset).length) updateDoc.$unset = $unset;

  const updated = await Task.findByIdAndUpdate(id, updateDoc, {
    new: true,
    runValidators: true
  });

  if (!updated) return res.status(404).json({ error: "Task not found" });
  res.json(updated);
}

// DELETE /tasks/:id
export async function remove(req: Request, res: Response) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  const deleted = await Task.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ error: "Task not found" });
  res.json(deleted);
}
