// src/components/TaskCard.jsx
import { X } from "lucide-react";

export default function TaskCard({ task, onDelete }) {
  const readable = (iso) => {
    if (!iso) return "No deadline";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString("en-US", {
        weekday: "long",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="relative border border-white/15 rounded-3xl p-6 bg-white/5 shadow-lg flex flex-col gap-4">
      {/* Delete button */}
      <button
        onClick={() => onDelete(task.id)}
        className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-red-600 transition"
      >
        <X size={16} />
      </button>

      {/* Title */}
      <h2 className="text-2xl font-medium text-white tracking-tight">
        {task.name}
      </h2>

      {/* Info Bar */}
      <div className="w-full bg-white/7 border border-white/10 rounded-2xl px-6 py-3 flex items-center justify-between text-sm text-white/90 gap-4">
        
        <InfoItem label="Category" value={task.category || "-"} />

        <Dot />

        <InfoItem
          label="Duration"
          value={task.duration ? `${task.duration} Minute` : "-"}
        />

        <Dot />

        <InfoItem label="Deadline" value={readable(task.deadline)} />

        {/* Second category if exists */}
        {task.category2 ? (
          <>
            <Dot />
            <InfoItem label="Category" value={task.category2} />
          </>
        ) : null}
      </div>
    </div>
  );
}

/* small component for cleaner layout */
function InfoItem({ label, value }) {
  return (
    <div className="flex flex-col leading-tight">
      <div className="text-[10px] text-white/60">{label}</div>
      <div className="text-sm text-white truncate">{value}</div>
    </div>
  );
}

/* dot separator */
function Dot() {
  return <div className="text-white/30 text-xl select-none">•</div>;
}
