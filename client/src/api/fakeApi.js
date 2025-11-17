// src/api/fakeApi.js
import { mockTasks } from "../data/mockTasks";

let tasks = [...mockTasks];
let nextId = tasks.length + 1;

export const fakeApi = {
  getTasks: () =>
    new Promise((res) => setTimeout(() => res([...tasks]), 300)),

  addTask: (task) =>
    new Promise((res) =>
      setTimeout(() => {
        const newTask = { id: nextId++, ...task };
        tasks = [newTask, ...tasks];
        res(newTask);
      }, 300)
    ),

  deleteTask: (id) =>
    new Promise((res) =>
      setTimeout(() => {
        tasks = tasks.filter((t) => t.id !== id);
        res({ success: true });
      }, 200)
    ),

  // for category persistence simulation
  getCategories: () =>
    new Promise((res) =>
      setTimeout(() => {
        const unique = Array.from(new Set(tasks.map((t) => t.category).filter(Boolean)));
        const defaults = ["Tugas", "Olahraga", "Kuliah"];
        const merged = Array.from(new Set([...defaults, ...unique]));
        res(merged);
      }, 150)
    ),
};
