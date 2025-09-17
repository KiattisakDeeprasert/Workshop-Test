import { useCallback, useEffect, useState } from "react";
import { TasksAPI } from "../services/api";
import type { Task } from "../types";
import { useToast } from "./useToast";

export default function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const toast = useToast();

  const refetch = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const data = await TasksAPI.list();
      setTasks(data);
    } catch (e: any) {
      const msg = e?.message || "Failed to load tasks";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { refetch(); }, [refetch]);

  const createTask = async (payload: { title: string; subtitle?: string; status?: Task["status"] }) => {
    setError("");
    try {
      const created = await TasksAPI.create(payload);
      setTasks(prev => [created, ...prev]);
      toast.success("Task added");
    } catch (e: any) {
      const msg = e?.message || "Failed to add task";
      setError(msg);
      toast.error(msg);
    }
  };

  const updateTask = async (id: string, patch: Partial<Pick<Task, "title" | "subtitle" | "status">>) => {
    setError("");
    setBusyId(id);
    try {
      const updated = await TasksAPI.update(id, patch);
      setTasks(prev => prev.map(t => (t._id === id ? updated : t)));
      toast.success("Task updated");
    } catch (e: any) {
      const msg = e?.message || "Failed to update task";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusyId(null);
    }
  };

  const deleteTask = async (id: string) => {
    setError("");
    setBusyId(id);
    try {
      await TasksAPI.remove(id);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success("Task deleted");
    } catch (e: any) {
      const msg = e?.message || "Failed to delete task";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusyId(null);
    }
  };

  return { tasks, loading, error, busyId, createTask, updateTask, deleteTask, refetch };
}
