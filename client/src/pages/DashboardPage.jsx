import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ userId = 1 }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://127.0.0.1:5000/api/schedule/day";

  // Convert Date → "Monday"
  const getBackendDay = (date) => {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  // Fetch tasks for chosen day
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const dayName = getBackendDay(selectedDate);

      const res = await axios.get(`${API_URL}/${userId}/${dayName}`);
      setTasks(res.data.schedule || []);
    } catch (err) {
      console.error(err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  // Generate aligned 7-day strip with center focused day
  const getAlignedDays = () => {
    const result = [];
    const centerIndex = 3; // posisi tengah

    for (let i = -3; i <= 3; i++) {
      const d = new Date(selectedDate);
      d.setDate(selectedDate.getDate() + i);
      result.push(d);
    }

    return result;
  };

  return (
    <div className="px-6 pt-28"> {/* pt-28 supaya berada di bawah navbar */}
      
      {/* DATE HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-white">
          {selectedDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h1>

        <p className="text-gray-400">
          You have total {tasks.length} tasks today
        </p>
      </div>

      {/* DAY SELECTOR */}
      <div className="flex justify-center gap-3 mb-10">
        {getAlignedDays().map((d) => {
          const active = d.toDateString() === selectedDate.toDateString();

          return (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`px-4 py-3 rounded-xl min-w-[85px] text-center transition-all duration-200
                ${active ? "bg-blue-500 text-white scale-105" : "bg-gray-800 text-gray-300"}
              `}
            >
              <div className="text-sm font-semibold">
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div className="text-lg">{d.getDate()}</div>
            </button>
          );
        })}
      </div>

      {/* TASK LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-gray-500">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="text-gray-400">No tasks on this day.</div>
        ) : (
          tasks.map((t) => (
            <div
              key={t.id}
              className="flex justify-between border-b border-gray-700 pb-4"
            >
              <div>
                <h2 className="text-lg text-white">{t.title}</h2>
                <p className="text-gray-400 text-sm">
                  {t.description || "No description"}
                </p>
              </div>
              <div className="text-gray-300">{t.time || "No time"}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
