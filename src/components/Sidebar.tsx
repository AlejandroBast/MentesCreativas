import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaPalette, FaRobot, FaTint } from "react-icons/fa";

interface SidebarItem {
  label: string;
  route: string;
  icon?: React.ReactNode;
}

const mainItems: SidebarItem[] = [
  { label: "Inicio", route: "/", icon: <FaHome /> },
  
];


// rutas menu ejercicios - jtest
const exerciseItems: SidebarItem[] = [
 
  { label: "Cambiar color 3D - Matemáticas", route: "/color3d", icon: <FaPalette /> },
  { label: "Robot 3D - Tecnología", route: "/robot3d", icon: <FaRobot /> },
  { label: "Ciclo del Agua - Ciencias", route: "/watercycle", icon: <FaTint /> },
];

export default function Sidebar() {
  const [openMain, setOpenMain] = useState(false);
  const [openExercises, setOpenExercises] = useState(false);

  const renderNavItem = ({ label, route, icon }: SidebarItem) => (
    <NavLink
      key={route}
      to={route}
      className={({ isActive }) =>
        `block w-full text-left rounded-lg pl-4 pr-3 py-2 text-slate-700 dark:text-slate-200
         hover:bg-sky-100 dark:hover:bg-slate-800 min-h-[40px] transition-colors
         ${isActive ? "bg-sky-200/70 text-slate-900 dark:bg-slate-800 dark:text-white" : ""}`
      }
    >
      <div className="flex items-center gap-2 whitespace-normal">
        <span className="flex-none">{icon}</span>
        <span className="flex-1 text-sm break-words">{label}</span>
      </div>
    </NavLink>
  );

  return (
    <aside className="hidden md:block w-full md:w-[240px] border-r border-sky-200 dark:border-slate-800 bg-sky-100/90 dark:bg-slate-900/60 backdrop-blur-sm">
      <div className="p-3 space-y-1">

        {/* Acordeón Main Items */}
        <button
          onClick={() => setOpenMain(!openMain)}
          aria-expanded={openMain}
          className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-slate-900 dark:text-slate-900
                     hover:bg-slate-700/40 dark:hover:bg-teal-500/40 font-medium transition-colors duration-300"
        >
          <span className="text-sm font-semibold tracking-wide">Menú Principal</span>
          <span className="text-xs opacity-70">{openMain ? "▲" : "▼"}</span>
        </button>
  {openMain && <div className="space-y-1">{mainItems.map(renderNavItem)}</div>}

        {/* Acordeón Exercises */}
        <button
          onClick={() => setOpenExercises(!openExercises)}
          aria-expanded={openExercises}
          className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200
                     hover:bg-sky-100 dark:hover:bg-slate-800 font-medium transition-colors duration-300"
        >
          <span className="text-sm font-semibold tracking-wide">Ejercicios · Jtest</span>
          <span className="text-xs opacity-70">{openExercises ? "▲" : "▼"}</span>
        </button>
        {openExercises && <div className="space-y-1">{exerciseItems.map(renderNavItem)}</div>}

      </div>
    </aside>
  );
}

