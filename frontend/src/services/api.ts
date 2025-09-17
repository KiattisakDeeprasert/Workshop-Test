import type { Task, TaskStatus } from "../types";

const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8081";
const API = `${BASE}/api`;

async function http<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const res = await fetch(input, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const TasksAPI = {
  list: () => http<Task[]>(`${API}/tasks`),
  create: (data: { title: string; subtitle?: string; status?: TaskStatus }) =>
    http<Task>(`${API}/tasks`, { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, patch: Partial<Pick<Task, "title" | "subtitle" | "status">>) =>
    http<Task>(`${API}/tasks/${id}`, { method: "PUT", body: JSON.stringify(patch) }),
  remove: (id: string) =>
    http<Task>(`${API}/tasks/${id}`, { method: "DELETE" })
};