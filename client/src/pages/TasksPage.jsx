// src/pages/TasksPage.jsx
import React, { useEffect, useState } from "react";
import { fakeApi } from "../api/fakeApi";
import TaskCard from "../components/TaskCard";
import DurationSelector from "../components/DurationSelector";
import CategorySelector from "../components/CategorySelector";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  // form state
  const [name, setName] = useState("");
  const [duration, setDuration] = useState(null);
  const [deadline, setDeadline] = useState(""); // datetime-local string or ""
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const t = await fakeApi.getTasks();
    setTasks(t);
    const cats = await fakeApi.getCategories();
    setCategories(cats);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e) {
    e?.preventDefault();
    if (!name.trim()) {
      alert("Please enter a name for the task.");
      return;
    }
    const payload = {
      name: name.trim(),
      duration: duration ?? null,
      deadline: deadline || null,
      category: category || null,
    };
    setLoading(true);
    const newTask = await fakeApi.addTask(payload);
    setTasks((s) => [newTask, ...s]);
    // refresh categories list
    const cats = await fakeApi.getCategories();
    setCategories(cats);
    // reset
    setName("");
    setDuration(null);
    setDeadline("");
    setCategory("");
    setLoading(false);
  }

  async function handleDelete(id) {
    setLoading(true);
    await fakeApi.deleteTask(id);
    setTasks((s) => s.filter((t) => t.id !== id));
    const cats = await fakeApi.getCategories();
    setCategories(cats);
    setLoading(false);
  }

  async function handleAddCategory(newCat) {
    // simulate by creating a temporary taskless category (we'll just push to categories)
    if (!newCat) return;
    if (categories.includes(newCat)) return;
    setCategories((s) => [newCat, ...s]);
    // no API call required here - fakeApi.getCategories reads from tasks
  }

  return (
    <div className="min-h-screen bg-black text-white py-16 px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-dm font-normal mb-12 bg-gradient-to-r from-[#00A6FF] via-[#67CAFF] to-white bg-clip-text text-transparent">
          Tasks
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT: FORM */}
          <div>
            <form onSubmit={handleAdd} className="space-y-6">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white"
                  placeholder="Task name"
                />
              </div>

              <div>
                <DurationSelector value={duration} onChange={setDuration} />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Deadline (optional)</label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div>
                <CategorySelector
                  value={category}
                  onChange={setCategory}
                  onAddCategory={handleAddCategory}
                  available={categories}
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold shadow"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add +"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setName("");
                    setDuration(null);
                    setDeadline("");
                    setCategory("");
                  }}
                  className="px-4 py-2 rounded-md bg-white/5 text-gray-200"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT: TASK LIST */}
          <div>
            <div className="space-y-4">
              {loading && tasks.length === 0 ? (
                <div className="text-gray-400">Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="text-gray-400">No tasks yet — add one!</div>
              ) : (
                tasks.map((t) => <TaskCard key={t.id} task={t} onDelete={handleDelete} />)
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-black to-blue-500 text-white font-semibold">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
