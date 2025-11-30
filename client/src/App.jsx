import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import TasksPage from "./pages/TasksPage.jsx";
import ConstraintsPage from "./pages/ConstraintsPage.jsx";
import AssistantPage from "./pages/AssistantPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/assistant" element={<AssistantPage />} />
        <Route path="/constraints" element={<ConstraintsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
    </Routes>
  );
}
