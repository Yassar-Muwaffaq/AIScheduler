import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

export default function Layout() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      <Navbar />
      
      <main >
        <Outlet />
      </main>
    </div>
  );
}
