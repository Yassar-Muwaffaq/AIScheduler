// src/pages/TasksPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import DurationSelector from "../components/DurationSelector.jsx";
import CategorySelector from "../components/CategorySelector.jsx";
import TaskCard from "../components/TaskCard.jsx";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  // timeout: 5000,
});

const USER_ID = 1; // TODO: replace when login implemented

// helpers
function apiTaskToUi(task) {
  // Backend task model fields (based on models you showed):
  // - duration_minutes
  // - deadline_day (YYYY-MM-DD) and deadline_time (HH:MM:SS)
  // - category (string)
  // - name, id
  const ui = {
    id: task.id,
    name: task.name,
    category: task.category || null,
    category2: task.category2 || null,
    // duration prefer duration_minutes but fallback to duration
    duration: task.duration_minutes ?? task.duration ?? null,
    // combine deadline_day + deadline_time to iso string if present
    deadline: null,
    // keep raw for debugging if needed
    _raw: task,
  };

  if (task.deadline_day && task.deadline_time) {
    // ensure time has seconds
    const time = task.deadline_time.length === 5 ? `${task.deadline_time}:00` : task.deadline_time;
    ui.deadline = `${task.deadline_day}T${time}`;
  } else if (task.deadline) {
    ui.deadline = task.deadline;
  } else if (task.deadline_iso) {
    ui.deadline = task.deadline_iso;
  }

  return ui;
}

function uiPayloadToApi(payload) {
  // payload: { user_id, name, duration, deadline, category }
  const out = {
    user_id: payload.user_id,
    name: payload.name,
    category: payload.category ?? null,
  };

  // duration -> duration_minutes and mode
  if (payload.duration) {
    out.mode = "duration";
    out.duration_minutes = payload.duration;
  }

  // deadline (datetime-local string like "2025-11-30T14:00")
  if (payload.deadline) {
    // try to parse and split
    try {
      const d = new Date(payload.deadline);
      if (!Number.isNaN(d.getTime())) {
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");
        const mi = String(d.getMinutes()).padStart(2, "0");
        // backend expects date and time separately
        out.deadline_day = `${yyyy}-${mm}-${dd}`;
        out.deadline_time = `${hh}:${mi}:00`;
      } else {
        // fallback: send as raw field if parsing failed
        out.deadline = payload.deadline;
      }
    } catch {
      out.deadline = payload.deadline;
    }
  }

  return out;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [duration, setDuration] = useState(null);
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);

    try {
      // === LOAD TASKS ===
      const t = await API.get(`/tasks/${USER_ID}`);
      // backend returns { tasks: [...] }
      const rawTasks = t.data && Array.isArray(t.data.tasks) ? t.data.tasks : (Array.isArray(t.data) ? t.data : []);
      const mapped = rawTasks.map(apiTaskToUi);
      setTasks(mapped);
    } catch (err) {
      console.error("Load error (tasks):", err);
      setError("Failed to load tasks. See console for details.");
      setTasks([]);
    }

    try {
      // === LOAD USER CONSTRAINTS (CATEGORY) ===
      const c = await API.get(`/constraints/user/${USER_ID}`);
      // backend shape may vary: try multiple keys
      let raw = [];
      if (Array.isArray(c.data)) raw = c.data;
      else if (Array.isArray(c.data.constraints)) raw = c.data.constraints;
      else if (Array.isArray(c.data.global_constraints)) raw = c.data.global_constraints;
      else raw = c.data?.items ?? [];

      // if constraint items store value as JSON with .name, extract that
      const names = raw.map((it) => {
        if (!it) return null;
        if (typeof it === "string") return it;
        if (it.name) return it.name;
        if (it.value && typeof it.value === "object" && it.value.name) return it.value.name;
        if (it.value && typeof it.value === "string") {
          try {
            const parsed = JSON.parse(it.value);
            return parsed.name ?? it.value;
          } catch {
            return it.value;
          }
        }
        if (it.type) return it.type;
        return null;
      }).filter(Boolean);

      // unique
      setCategories(Array.from(new Set(names)));
    } catch (err) {
      console.error("Load error (constraints):", err);
      // don't set error here; categories optional
      setCategories([]);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      setError(null);

      const apiPayload = uiPayloadToApi(payload);
      const res = await API.post("/tasks/", apiPayload);

      // backend returns created object (may be bare task or wrapped)
      const created = res.data && res.data.id ? res.data : (res.data.task ?? res.data);

      const uiTask = apiTaskToUi(created);
      setTasks((prev) => [uiTask, ...prev]);

      // reload categories (optional)
      try {
        const catRes = await API.get(`/constraints/user/${USER_ID}`);
        let raw = [];
        if (Array.isArray(catRes.data)) raw = catRes.data;
        else if (Array.isArray(catRes.data.constraints)) raw = catRes.data.constraints;
        else if (Array.isArray(catRes.data.global_constraints)) raw = catRes.data.global_constraints;
        else raw = catRes.data?.items ?? [];

        const names = raw.map((it) => {
          if (!it) return null;
          if (typeof it === "string") return it;
          if (it.name) return it.name;
          if (it.value && typeof it.value === "object" && it.value.name) return it.value.name;
          if (it.value && typeof it.value === "string") {
            try {
              const parsed = JSON.parse(it.value);
              return parsed.name ?? it.value;
            } catch {
              return it.value;
            }
          }
          if (it.type) return it.type;
          return null;
        }).filter(Boolean);

        setCategories(Array.from(new Set(names)));
      } catch (errCat) {
        // ignore
      }

      setName("");
      setDuration(null);
      setDeadline("");
      setCategory("");
    } catch (err) {
      console.error("Add task error:", err);
      setError("Failed to add task. See console for details.");
    }

    setLoading(false);
  }

  async function handleDelete(id) {
    try {
      setLoading(true);
      setError(null);

      await API.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));

      try {
        const catRes = await API.get(`/constraints/user/${USER_ID}`);
        let raw = [];
        if (Array.isArray(catRes.data)) raw = catRes.data;
        else if (Array.isArray(catRes.data.constraints)) raw = catRes.data.constraints;
        else raw = catRes.data?.items ?? [];

        const names = raw.map((it) => {
          if (!it) return null;
          if (typeof it === "string") return it;
          if (it.name) return it.name;
          if (it.value && typeof it.value === "object" && it.value.name) return it.value.name;
          return null;
        }).filter(Boolean);

        setCategories(Array.from(new Set(names)));
      } catch (err) {
        // ignore
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete task. See console for details.");
    }
    setLoading(false);
  }

  async function handleAddCategory(newCat) {
    if (!newCat) return;

    try {
      // Construct a generic task-constraint payload that backend likely accepts:
      const payload = {
        // backend TaskConstraint model had task_id foreign key, but for user-level categories
        // many backends accept { user_id, type, value, priority }
        user_id: USER_ID,
        type: "category",
        value: { name: newCat },
        priority: 1,
      };

      const res = await API.post("/constraints/task", payload);
      // backend may return created constraint
      let created = res.data;
      // try to extract name
      let name = null;
      if (typeof created === "string") name = created;
      else if (created.name) name = created.name;
      else if (created.value && typeof created.value === "object" && created.value.name) name = created.value.name;
      else if (created.value && typeof created.value === "string") {
        try {
          const parsed = JSON.parse(created.value);
          name = parsed.name ?? newCat;
        } catch {
          name = newCat;
        }
      } else name = newCat;

      setCategories((prev) => Array.from(new Set([name, ...prev])));
      return created;
    } catch (err) {
      console.error("Category add error:", err);
      setError("Failed to add category. See console for details.");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-16 px-8 relative">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-dm font-normal mb-12 bg-gradient-to-r from-[#00A6FF] via-[#67CAFF] to-white bg-clip-text text-transparent">
          Tasks
        </h1>

        {error && <div className="mb-6 text-sm text-red-400">{error}</div>}

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
                available={categories}
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

        {/* FIXED NEXT BUTTON */}
        <button
          className="fixed bottom-6 right-6 px-8 py-3 rounded-xl bg-gradient-to-r from-black to-blue-500 text-white font-semibold shadow-xl"
        >
          Next
        </button>

      </div>
    </div>
  );
}
