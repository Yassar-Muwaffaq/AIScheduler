// src/components/Navbar.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Tasks", path: "/tasks" },
    { name: "Constraints", path: "/constraints" },
    { name: "Assistant", path: "/assistant" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  const navigate = useNavigate();

  const [hovered, setHovered] = useState(navItems[0].name);

  const containerRef = useRef(null);
  const btnRefs = useRef([]);
  btnRefs.current = [];

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  function addBtnRef(el) {
    if (el && !btnRefs.current.includes(el)) btnRefs.current.push(el);
  }

  const recalcIndicator = (targetName = hovered) => {
    const index = navItems.findIndex((i) => i.name === targetName);
    const el = btnRefs.current[index];
    const container = containerRef.current;
    if (!el || !container) return;

    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    const left = elRect.left - containerRect.left + container.scrollLeft;
    const width = elRect.width;

    window.requestAnimationFrame(() => {
      setIndicatorStyle({ left: Math.round(left), width: Math.round(width) });
    });
  };

  useEffect(() => {
    recalcIndicator(hovered);

    const onResize = () => recalcIndicator(hovered);
    window.addEventListener("resize", onResize);
    const fontCheck = setTimeout(() => recalcIndicator(hovered), 200);

    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(fontCheck);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    recalcIndicator(hovered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered]);

  return (
    <header className="py-6 px-8 flex justify-center absolute top-0 left-0 w-full z-30">
      <nav
        ref={containerRef}
        className="relative bg-gray-800/40 backdrop-blur-md rounded-full p-2 flex items-center gap-2 border border-gray-600/50"
      >
        {/* Sliding Blue Indicator */}
        <div
          aria-hidden
          className="absolute top-1 bottom-1 bg-blue-600/60 rounded-full transition-all duration-300 pointer-events-none"
          style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
        />

        {navItems.map((item, idx) => {
          const isActive = hovered === item.name;
          return (
            <button
              key={item.name}
              ref={addBtnRef}
              onMouseEnter={() => setHovered(item.name)}
              onClick={() => navigate(item.path)}
              className={`relative z-10 px-4 py-1 text-sm font-medium rounded-full transition-colors duration-150
                ${isActive ? "text-white" : "text-gray-300 hover:text-white"}`}
            >
              {item.name}
            </button>
          );
        })}
      </nav>
    </header>
  );
};

export default Navbar;
