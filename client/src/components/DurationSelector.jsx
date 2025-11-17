// src/components/DurationSelector.jsx

/**
 * Props:
 *  - value (number|null)
 *  - onChange (fn) -> receives number or null
 *  - allowFreeInput (boolean)
 */
const presets = [15, 30, 45, 60, 120];

export default function DurationSelector({ value, onChange }) {
  return (
    <div className="w-full">
      <label className="block text-sm text-gray-300 mb-2">Duration (minutes)</label>

      {/* free numeric input */}
      <input
        type="number"
        min="1"
        placeholder="Free input (minutes)"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none"
      />

      {/* preset buttons (separate row) */}
      <div className="mt-3 flex gap-2 justify-end">
        {presets.map((p) => {
          const active = value === p;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                active
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white/5 text-gray-200 hover:bg-blue-600/60 hover:text-white"
              }`}
            >
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}
