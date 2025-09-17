import mongoose, { Schema, Document, Model } from "mongoose";

export type TaskStatus = "to do" | "in progress" | "done";

export interface ITask extends Document {
  title: string;
  subtitle?: string;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true, default: undefined },
    status: {
      type: String,
      enum: ["to do", "in progress", "done"],
      default: "to do",
      required: true
    }
  },
  { timestamps: true }
);

export const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
