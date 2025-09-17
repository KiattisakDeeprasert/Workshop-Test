import React, { useState } from "react";
import { motion } from "framer-motion";
import StatusBadge from "./StatusBadge";
import ConfirmDialog from "./ConfirmDialog";
import TaskEditDialog from "./TaskEditDialog";
import type { Task } from "../types";

type Props = {
  task: Task;
  busy?: boolean;
  onChange: (id: string, patch: Partial<Pick<Task, "title" | "subtitle" | "status">>) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
};

export default function TaskItem({ task, busy, onChange, onDelete }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onDelete(task._id);
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const handleSave = async (patch: Partial<Pick<Task, "title" | "subtitle" | "status">>) => {
    try {
      setSaving(true);
      await onChange(task._id, patch);
      setEditOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.li
        className="item"
        aria-busy={busy}
        layout
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 24, mass: 0.6 }}
        whileHover={{ y: -2 }}
      >
        {/* Left content (clamped) */}
        <div className="item-content">
          <div className="item-title">{task.title}</div>
          {task.subtitle && <div className="item-subtitle">{task.subtitle}</div>}
        </div>

        {/* Fixed-width actions */}
        <div className="actions">
          <StatusBadge status={task.status} />

          {/* Edit (pencil) */}
          <motion.button
            className="icon-btn"
            whileTap={{ scale: 0.98 }}
            onClick={() => setEditOpen(true)}
            disabled={busy}
            aria-label="Edit task"
            title="Edit"
          >
            {/* pencil icon */}
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </motion.button>

          {/* Delete (trash) */}
          <motion.button
            className="icon-btn danger"
            whileTap={{ scale: 0.98 }}
            onClick={() => setConfirmOpen(true)}
            disabled={busy}
            aria-label="Delete task"
            title="Delete"
          >
            {/* trash icon */}
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6" />
              <path d="M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
          </motion.button>
        </div>
      </motion.li>

      {/* Delete confirm */}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete this task?"
        description={`“${task.title}” will be permanently removed.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onClose={() => !deleting && setConfirmOpen(false)}
        busy={deleting}
      />

      {/* Edit dialog */}
      <TaskEditDialog
        open={editOpen}
        task={task}
        onClose={() => !saving && setEditOpen(false)}
        onSave={handleSave}
        busy={saving}
      />
    </>
  );
}
