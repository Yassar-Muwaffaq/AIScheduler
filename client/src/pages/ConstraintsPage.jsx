import { useEffect, useState } from "react";
import axios from "axios";

const API = axios.create({ baseURL: "http://127.0.0.1:5000/api" });
const USER_ID = 1;

export default function ConstraintsPage() {
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // GET all constraints for the user
  async function load() {
    setLoading(true);
    try {
      const res = await API.get(`/constraints/user/${USER_ID}`);

      let raw = [];

      if (Array.isArray(res.data)) raw = res.data;
      else if (Array.isArray(res.data.constraints)) raw = res.data.constraints;
      else if (Array.isArray(res.data.global_constraints)) raw = res.data.global_constraints;
      else raw = res.data?.items ?? [];

      const normalized = raw.map((it) => ({
        raw: it,
        title: it?.name || it?.type || "Unknown",
        category: it?.type ?? "constraint",
        duration: it?.duration ? `${it.duration} Hours` : "-",
        deadline: it?.deadline ?? "-",
      }));

      setItems(normalized);
    } catch (err) {
      console.error("Load constraints error:", err);
      setItems([]);
    }
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  // POST create new constraint
  async function handleUpdate() {
    try {
      const payload = {
        user_id: USER_ID,
        type: type || "generic",
        value: value || "",
        priority:
          priority === "low" ? 1 :
          priority === "mid" ? 2 :
          priority === "high" ? 3 : 2,
      };

      const res = await API.post("/constraints/task", payload);
      console.log("created:", res.data);

      await load();

      setType("");
      setValue("");
      setPriority("");
    } catch (err) {
      console.error("create constraint error:", err);
      alert("Failed to create constraint — check console.");
    }
  }

  return (
    <div className="min-h-screen w-full bg-black text-white px-10 py-16">
      <h1 className="text-6xl font-light mb-10 text-blue-200">Constraints</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT FORM */}
        <div className="max-w-md">
          <div className="mb-6">
            <label className="block text-sm mb-2">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none"
            >
              <option value="">Select Type</option>
              <option value="task">Task</option>
              <option value="deadline">Deadline</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2">Value</label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none"
              placeholder="Enter value..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm mb-2">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none"
            >
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="mid">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            onClick={handleUpdate}
            className="px-6 py-2 bg-white text-black rounded-md hover:bg-neutral-300 transition"
          >
            Create
          </button>
        </div>

        {/* RIGHT LIST */}
        <div className="flex flex-col space-y-5">
          {loading ? (
            <div>Loading...</div>
          ) : items.length === 0 ? (
            <div>No constraints yet</div>
          ) : (
            items.map((c, i) => (
              <div
                key={i}
                className={`rounded-xl border ${
                  i === 0
                    ? "bg-white text-black border-neutral-300"
                    : "bg-neutral-900 border-neutral-700"
                } p-5`}
              >
                <h2 className="text-xl font-semibold mb-3">{c.title}</h2>

                <div className="grid grid-cols-3 gap-4 text-sm opacity-80">
                  <div>
                    <p className="text-xs uppercase mb-1">Category</p>
                    <p>{c.category}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase mb-1">Duration</p>
                    <p>{c.duration}</p>
                  </div>

                  <div>
                    <p className="text-xs uppercase mb-1">Deadline</p>
                    <p>{c.deadline}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      <div className="w-full flex justify-center mt-14">
        <button className="px-16 py-4 rounded-md bg-gradient-to-r from-blue-900 to-blue-600 hover:opacity-90 transition">
          Generate
        </button>
      </div>
    </div>
  );
}
