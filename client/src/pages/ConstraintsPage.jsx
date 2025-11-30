import { useState } from "react";

export default function ConstraintsPage() {
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState("");

  const constraints = [
    {
      title: "Tugas Besar Web",
      category: "Kuliah",
      duration: "10 Hours",
      deadline: "Friday, 22:00",
    },
    {
      title: "Tugas Praktikum 2",
      category: "Tugas",
      duration: "12 Hours",
      deadline: "Monday, 23:59",
    },
    {
      title: "Lari Pagi",
      category: "Olahraga",
      duration: "30 Minutes",
      deadline: "—",
    },
    {
      title: "Kuliah Web",
      category: "Kuliah",
      duration: "2 Hours",
      deadline: "—",
    },
  ];

  const handleUpdate = () => {
    console.log({ type, value, priority });
  };

  return (
    <div className="min-h-screen w-full bg-black text-white px-10 py-16">
      {/* Title */}
      <h1 className="text-6xl font-light mb-10 text-blue-200">Constraints</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT FORM */}
        <div className="max-w-md">
          {/* Type */}
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

          {/* Value */}
          <div className="mb-6">
            <label className="block text-sm mb-2">Value</label>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-neutral-900 border border-neutral-700 focus:outline-none"
              placeholder="Enter value..."
            />
          </div>

          {/* Priority */}
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
            Update
          </button>
        </div>

        {/* RIGHT — CARDS */}
        <div className="flex flex-col space-y-5">
          {constraints.map((c, i) => (
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
          ))}
        </div>
      </div>

      {/* Bottom button */}
      <div className="w-full flex justify-center mt-14">
        <button className="px-16 py-4 rounded-md bg-gradient-to-r from-blue-900 to-blue-600 hover:opacity-90 transition">
          Generate
        </button>
      </div>
    </div>
  );
}
