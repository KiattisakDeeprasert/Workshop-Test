import React, { createContext, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastType = "success" | "error" | "info";
type Toast = { id: string; message: string; type: ToastType; ttl: number };

type Ctx = {
  success: (msg: string, ttl?: number) => void;
  error: (msg: string, ttl?: number) => void;
  info: (msg: string, ttl?: number) => void;
};

const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = (type: ToastType, message: string, ttl = 2800) => {
    const id = Math.random().toString(36).slice(2);
    const item: Toast = { id, message, type, ttl };
    setToasts(prev => [...prev, item]);
    window.setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, ttl);
  };

  const api = useMemo<Ctx>(() => ({
    success: (m, ttl) => push("success", m, ttl),
    error: (m, ttl) => push("error", m, ttl),
    info: (m, ttl) => push("info", m, ttl),
  }), []);

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div style={{ position: "fixed", right: 16, top: 16, zIndex: 60, display: "grid", gap: 10 }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ type: "spring", stiffness: 280, damping: 22 }}
              className={`toast ${t.type}`}
              role="status"
              aria-live="polite"
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
