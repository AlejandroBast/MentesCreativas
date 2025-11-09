import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaCalculator, FaRuler, FaKey, FaPalette, FaRobot, FaTint } from "react-icons/fa";

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
        `w-full text-left rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300
         hover:bg-slate-50 dark:hover:bg-slate-800 min-h-[40px]
         ${isActive ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300" : ""}`
      }
    >
      <div className="flex items-center gap-2 whitespace-normal">
        <span className="flex-none">{icon}</span>
        <span className="flex-1 text-sm break-words">{label}</span>
      </div>
    </NavLink>
  );

  return (
    <aside className="hidden md:block w-full md:w-[240px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="p-3 space-y-1">

        {/* Acordeón Main Items */}
        <button
          onClick={() => setOpenMain(!openMain)}
          className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 
                     hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
        >
          Menú Principal
          <span>{openMain ? "▲" : "▼"}</span>
        </button>
        {openMain && <div className="pl-4 space-y-1">{mainItems.map(renderNavItem)}</div>}

        {/* Acordeón Exercises */}
        <button
          onClick={() => setOpenExercises(!openExercises)}
          className="w-full text-left flex items-center justify-between rounded-lg px-3 py-2 text-slate-700 dark:text-slate-300 
                     hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
        >
          Ejercicios - Jtest
          <span>{openExercises ? "▲" : "▼"}</span>
        </button>
        {openExercises && <div className="pl-4 space-y-1">{exerciseItems.map(renderNavItem)}</div>}

      </div>
    </aside>
  );
}

