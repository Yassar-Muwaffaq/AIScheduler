// src/pages/TasksPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import DurationSelector from "../components/DurationSelector.jsx";
import CategorySelector from "../components/CategorySelector.jsx";
import TaskCard from "../components/TaskCard.jsx";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
});

const USER_ID = 1; // TODO: ganti setelah login system jadi ada

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [duration, setDuration] = useState(null);
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);

    try {
      // === LOAD TASKS ===
      const t = await API.get(`/tasks/${USER_ID}`);
      setTasks(t.data);

      // === LOAD USER CONSTRAINTS (CATEGORY) ===
      const c = await API.get(`/constraints/user/${USER_ID}`);
      setCategories(c.data);
    } catch (err) {
      console.error("Load error:", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e) {
    e?.preventDefault();

    if (!name.trim()) {
      alert("Task name required");
      return;
    }

    const payload = {
      user_id: USER_ID,
      name,
      duration: duration ?? null,
      deadline: deadline || null,
      category: category || null,
    };

    try {
      setLoading(true);

      // === CREATE TASK ===
      const res = await API.post("/tasks/", payload);
      setTasks((prev) => [res.data, ...prev]);

      // reload categories (optional)
      const catRes = await API.get(`/constraints/user/${USER_ID}`);
      setCategories(catRes.data);

      setName("");
      setDuration(null);
      setDeadline("");
      setCategory("");
    } catch (err) {
      console.error("Add task error:", err);
    }

    setLoading(false);
  }

  async function handleDelete(id) {
    try {
      setLoading(true);

      await API.delete(`/tasks/${id}`);

      setTasks((prev) => prev.filter((t) => t.id !== id));

      const catRes = await API.get(`/constraints/user/${USER_ID}`);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Delete error:", err);
    }

    setLoading(false);
  }

  async function handleAddCategory(newCat) {
    if (!newCat) return;

    try {
      const res = await API.post("/constraints/task", {
        user_id: USER_ID,
        name: newCat,
      });

      setCategories((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("Category add error:", err);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-16 px-8 relative">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-dm font-normal mb-12 bg-gradient-to-r from-[#00A6FF] via-[#67CAFF] to-white bg-clip-text text-transparent">
          Tasks
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
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

              <DurationSelector value={duration} onChange={setDuration} />

              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Deadline (optional)
                </label>
                <input
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-white/5 border border-white/10 text-white"
                />
              </div>

              <CategorySelector
                value={category}
                onChange={setCategory}
                onAddCategory={handleAddCategory}
                available={categories.map((c) => c.name)}
              />

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 rounded-md bg-gradient-to-r from-blue-700 to-blue-500 text-white font-semibold shadow"
                >
                  Add +
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

          {/* Right — Task list */}
          <div className="pb-20">
            <div className="space-y-4">
              {loading && tasks.length === 0 ? (
                <div className="text-gray-400">Loading tasks...</div>
              ) : tasks.length === 0 ? (
                <div className="text-gray-400">No tasks yet — add one!</div>
              ) : (
                tasks.map((t) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onDelete={() => handleDelete(t.id)}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <button
          className="fixed bottom-6 right-6 px-8 py-3 rounded-xl bg-gradient-to-r from-black to-blue-500 text-white font-semibold shadow-xl"
        >
          Next
        </button>

      </div>
    </div>
  );
}
