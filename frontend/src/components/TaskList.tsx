import { AnimatePresence } from "framer-motion";
import TaskItem from "./TaskItem";
import type { Task } from "../types";

type Props = {
  items: Task[];
  busyId: string | null;
  onChange: (id: string, patch: Partial<Pick<Task, "title" | "subtitle" | "status">>) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onRefresh?: () => void | Promise<void>;
};

export default function TaskList({ items, busyId, onChange, onDelete }: Props) {
  return (
    <ul className="list">
      <AnimatePresence initial={false}>
        {items.map(t => (
          <TaskItem
            key={t._id}
            task={t}
            busy={busyId === t._id}
            onChange={onChange}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}
