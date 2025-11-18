import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaPalette, FaRobot, FaTint } from "react-icons/fa";

interface SidebarItem {
  label: string;
  route: string;
  icon?: React.ReactNode;
}

const mainItems: SidebarItem[] = [
  { label: "Inicio", route: "/", icon: <span className="text-indigo-600"><FaHome /></span> },
  
];


// rutas menu ejercicios - jtest
const exerciseItems: SidebarItem[] = [
 
  { label: "Cambiar color 3D - Matemáticas", route: "/color3d", icon: <span className="text-emerald-600"><FaPalette /></span> },
  { label: "Robot 3D - Tecnología", route: "/robot3d", icon: <span className="text-indigo-600"><FaRobot /></span> },
  { label: "Ciclo del Agua - Ciencias", route: "/watercycle", icon: <span className="text-sky-600"><FaTint /></span> },
];

export default function Sidebar() {
  const [openMain, setOpenMain] = useState(false);
  const [openExercises, setOpenExercises] = useState(false);
  const STAT_KEY = "mc:stats";
  const incRoute = (route: string) => {
    try {
      const raw = window.localStorage.getItem(STAT_KEY);
      const s = raw ? JSON.parse(raw) : {};
      const key = `click_${route.replace(/\W+/g, "").toLowerCase()}`;
      s[key] = (s[key] || 0) + 1;
      s["click_total"] = (s["click_total"] || 0) + 1;
      window.localStorage.setItem(STAT_KEY, JSON.stringify(s));
      window.dispatchEvent(new CustomEvent("stats:updated", { detail: s }));
    } catch { void 0; }
  };

  const renderNavItem = ({ label, route, icon }: SidebarItem) => (
    <NavLink
      key={route}
      to={route}
      aria-label={label}
      onClick={() => incRoute(route)}
      className={({ isActive }) =>
        `relative block w-full text-left rounded-lg pl-4 pr-3 py-2 text-slate-700 dark:text-slate-200
         hover:bg-linear-to-r hover:from-white/60 hover:to-white/40 dark:hover:from-slate-900/60 dark:hover:to-slate-900/40 min-h-10 transition-colors ring-1 ring-transparent hover:ring-slate-200/70 dark:hover:ring-slate-700/60
         ${isActive ? "bg-linear-to-r from-slate-100 to-slate-50 text-slate-900 dark:bg-linear-to-r dark:from-slate-800/80 dark:to-slate-800 dark:text-white ring-1 ring-slate-200/70 dark:ring-slate-700/60" : ""}`
      }
    >
      <div className="flex items-center gap-2 whitespace-normal">
        <span className="flex-none">{icon}</span>
        <span className="flex-1 text-sm break-words">
          {route === "/robot3d" ? "Robot	 3D - Tecnología" : label}
        </span>
      </div>
    </NavLink>
  );

  return (
    <aside className="hidden md:block w-full md:w-[240px] border-r border-slate-200/60 dark:border-slate-800/40 bg-linear-to-b from-indigo-50/80 via-sky-50/70 to-emerald-50/80 dark:bg-linear-to-b dark:from-slate-950/80 dark:via-slate-900/80 dark:to-slate-950/80 backdrop-blur-xl">
      <div className="p-3 space-y-1">

        {/* Acordeón Main Items */}
        <button
          onClick={() => setOpenMain(!openMain)}
          aria-expanded={openMain}
          className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 font-medium transition-colors duration-300 bg-transparent hover:bg-white/40 dark:hover:bg-slate-900/40"
        >
          <span className="text-sm font-semibold tracking-wide bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600 dark:from-indigo-300 dark:to-purple-300">Menú Principal</span>
          <span className="text-xs opacity-70">{openMain ? "▲" : "▼"}</span>
        </button>
  {openMain && <div className="space-y-1">{mainItems.map(renderNavItem)}</div>}

        {/* Acordeón Exercises */}
        <button
          onClick={() => setOpenExercises(!openExercises)}
          aria-expanded={openExercises}
          className="w-full text-left flex items-center justify_between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-100 font-medium transition-colors duration-300 bg-transparent hover:bg-white/40 dark:hover:bg-slate-900/40"
        >
          <span className="text-sm font-semibold tracking-wide bg-clip-text text-transparent bg-linear-to-r from-emerald-600 to-sky-600 dark:from-emerald-300 dark:to-sky-300">Ejercicios · Jtest</span>
          <span className="text-xs opacity-70">{openExercises ? "▲" : "▼"}</span>
        </button>
        {openExercises && <div className="space-y-1">{exerciseItems.map(renderNavItem)}</div>}

      </div>
    </aside>
  );
}

