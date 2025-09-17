import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Task, TaskStatus } from "../types";

type Props = {
  open: boolean;
  task: Task;
  onClose: () => void;
  onSave: (patch: Partial<Pick<Task, "title" | "subtitle" | "status">>) => Promise<void> | void;
  busy?: boolean;
  /** If true, clicking backdrop / pressing ESC won't close the dialog */
  persistent?: boolean; // default true
};

const STATUS: TaskStatus[] = ["to do", "in progress", "done"];

export default function TaskEditDialog({
  open,
  task,
  onClose,
  onSave,
  busy,
  persistent = true
}: Props) {
  const [title, setTitle] = useState(task.title);
  const [subtitle, setSubtitle] = useState(task.subtitle ?? "");
  const [status, setStatus] = useState<TaskStatus>(task.status);

  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(task.title);
      setSubtitle(task.subtitle ?? "");
      setStatus(task.status);
    }
  }, [open, task]);

  const invalid = !title.trim();

  const changed = useMemo(() => {
    return (
      title.trim() !== task.title ||
      (subtitle.trim() || undefined) !== (task.subtitle || undefined) ||
      status !== task.status
    );
  }, [title, subtitle, status, task]);

  const handleSave = async () => {
    if (invalid) return;
    const normalizedTitle = title.trim();
    const normalizedSubtitle = subtitle.trim();
    await onSave({
      title: normalizedTitle,
      status,
      subtitle: normalizedSubtitle === "" ? null : normalizedSubtitle
    });
  };

  // Lock background scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Focus trap + ESC handling
  useEffect(() => {
    if (!open) return;
    const root = dialogRef.current;
    if (!root) return;

    // focus first focusable
    const focusables = root.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        // Persistent or busy -> block ESC
        if (persistent || busy) {
          e.preventDefault();
          e.stopPropagation();
        } else {
          onClose();
        }
      }
      if (e.key === "Tab" && focusables.length > 0) {
        // simple focus trap
        const currentIndex = Array.prototype.indexOf.call(focusables, document.activeElement);
        if (e.shiftKey) {
          // back
          if (currentIndex <= 0) {
            e.preventDefault();
            (focusables[focusables.length - 1] as HTMLElement).focus();
          }
        } else {
          // forward
          if (currentIndex === focusables.length - 1) {
            e.preventDefault();
            (focusables[0] as HTMLElement).focus();
          }
        }
      }
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [open, persistent, busy, onClose]);

  // Backdrop click: close only if NOT persistent and NOT busy
  const onBackdropClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target !== e.currentTarget) return;
    if (!persistent && !busy) onClose();
    // else ignore click
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="dialog-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
          onClick={onBackdropClick}
        >
          <motion.div
            ref={dialogRef}
            className="dialog-card"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
            aria-labelledby="edit-task-title"
          >
            <div id="edit-task-title" className="dialog-title">Edit task</div>

            <div className="col" style={{ gap: 10 }}>
              <input
                className="input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                disabled={busy}
              />

              <input
                className="input"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="Subtitle (optional)"
                disabled={busy}
              />

              <select
                className="select"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                disabled={busy}
                aria-label="Status"
              >
                {STATUS.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="dialog-actions" style={{ marginTop: 16 }}>
              <button className="btn-ghost pill" onClick={onClose} disabled={busy}>Cancel</button>
              <button className="btn btn-primary pill" onClick={handleSave} disabled={busy || invalid || !changed}>
                {busy ? "Saving…" : "Save"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
