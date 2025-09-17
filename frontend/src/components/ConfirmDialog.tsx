import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  busy?: boolean;
};

export default function ConfirmDialog({
  open,
  title = "Delete item?",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  busy
}: Props) {
  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose(); // click backdrop to close
          }}
        >
          <motion.div
            className="dialog-card"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 240, damping: 22 }}
          >
            <div className="dialog-title">🗑️ {title}</div>
            <div className="dialog-desc">{description}</div>
            <div className="dialog-actions">
              <motion.button
                className="btn-ghost"
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={busy}
              >
                {cancelText}
              </motion.button>
              <motion.button
                className="btn"
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                disabled={busy}
              >
                {busy ? "Deleting…" : confirmText}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
