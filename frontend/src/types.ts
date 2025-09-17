export type TaskStatus = "to do" | "in progress" | "done";

export interface Task {
  _id: string;
  title: string;
  subtitle?: string | null;
  status: TaskStatus;
  createdAt?: string;
  updatedAt?: string;
}