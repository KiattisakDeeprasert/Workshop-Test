import type { TaskStatus } from "../types";

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const variant =
    status === "done" ? "success" :
    status === "in progress" ? "warn" :
    "muted";

  return (
    <span className={`badge badge-lg status-badge ${variant}`} aria-label={`status: ${status}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}
