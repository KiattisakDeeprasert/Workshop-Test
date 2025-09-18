import type { TaskStatus } from "../types";

const OPTIONS: TaskStatus[] = ["to do", "in progress", "done"];

type Props = {
  value: TaskStatus;
  onChange: (v: TaskStatus) => void;
  disabled?: boolean;
};

export default function StatusPicker({ value, onChange, disabled }: Props) {
  return (
    <div className="chip-group" role="radiogroup" aria-label="Status">
      {OPTIONS.map(opt => {
        const active = opt === value;
        return (
          <button
            key={opt}
            type="button"
            className={`chip ${active ? "active" : ""}`}
            data-status={opt}
            onClick={() => !disabled && onChange(opt)}
            disabled={disabled}
            aria-pressed={active}
            role="radio"
            aria-checked={active}
            title={opt}
          >
            <span className="chip-dot" />
            {opt}
          </button>
        );
      })}
    </div>
  );
}
