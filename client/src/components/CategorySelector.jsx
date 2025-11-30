// src/components/CategorySelector.jsx
import { useState, useEffect } from "react";

/**
 * Props:
 *  - value (string or "")
 *  - onChange (fn)
 *  - onAddCategory (fn) -> called when adding new category (should return created item or promise)
 *  - available (array of strings)
 */
export default function CategorySelector({ value, onChange, onAddCategory, available = [] }) {
  const [openAdd, setOpenAdd] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [showAll, setShowAll] = useState(false);

  // default categories and user-added are provided in available prop
  const visibleLimit = 3;
  const many = available.length > visibleLimit;

  useEffect(() => {
    if (!openAdd) setNewCat("");
  }, [openAdd]);

  async function handleAdd() {
    if (!newCat.trim()) return;
    // allow async return
    const created = await onAddCategory(newCat.trim());
    onChange(newCat.trim());
    setOpenAdd(false);
  }

  return (
    <div>
      <label className="block text-sm text-gray-300 mb-2">Category</label>

      <div className="flex items-center gap-3">
        {/* main select */}
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white"
        >
          <option value="">-- choose category --</option>
          {available.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setOpenAdd((s) => !s)}
          className="px-3 py-2 rounded-md bg-white/5 text-gray-200 hover:bg-white/10"
        >
          {openAdd ? "Cancel" : "Add"}
        </button>
      </div>

      {/* add input */}
      {openAdd && (
        <div className="mt-2 flex gap-2">
          <input
            className="flex-1 px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white"
            placeholder="New category (e.g. ProjectX)"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
          />
          <button onClick={handleAdd} className="px-3 py-2 rounded-md bg-blue-600 text-white">
            Save
          </button>
        </div>
      )}

      {/* pills preview */}
      <div className="mt-3 flex flex-wrap gap-2 items-center">
        {(many && !showAll ? available.slice(0, visibleLimit) : available).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onChange(c)}
            className={`text-sm px-3 py-1 rounded-full ${
              value === c ? "bg-white/20 text-white border border-white/40" : "bg-white/5 text-gray-200"
            }`}
          >
            {c}
          </button>
        ))}

        {many && (
          <button
            type="button"
            onClick={() => setShowAll((s) => !s)}
            className="text-sm px-2 py-1 rounded-md text-gray-300 bg-white/5"
          >
            {showAll ? "Show less" : `+${available.length - visibleLimit} more`}
          </button>
        )}
      </div>
    </div>
  );
}
