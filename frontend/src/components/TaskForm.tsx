import React, { useState } from "react";
import type { TaskStatus } from "../types";

type Props = {
  onCreate: (payload: { title: string; subtitle?: string; status?: TaskStatus }) => Promise<void> | void;
};

const STATUS: TaskStatus[] = ["to do", "in progress", "done"];

export default function TaskForm({ onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("to do");
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      await onCreate({ title: title.trim(), subtitle: subtitle.trim() || undefined, status });
      setTitle("");
      setSubtitle("");
      setStatus("to do");
    } finally {
      setSaving(false);
    }
  };

  const invalid = !title.trim();

  return (
    <form className="col" onSubmit={submit} aria-label="Create task">
      <div className="row">
        <input
          className="input grow"             // ← expands to fill the row
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={saving}
          required
        />

        <select
          className="select select--sm"       // ← optional: keep a minimum width
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          disabled={saving}
          aria-label="Status"
        >
          {STATUS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <button
          className="btn btn-primary ml-auto" // ← pushes to the far right
          type="submit"
          disabled={saving || invalid}
        >
          {saving ? "Adding…" : "Add"}
        </button>
      </div>

      <input
        className="input"
        placeholder="Subtitle (optional)"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        disabled={saving}
      />

      <div className="helper">Create a task with title, (optional) subtitle, and status.</div>
    </form>
  );
}
