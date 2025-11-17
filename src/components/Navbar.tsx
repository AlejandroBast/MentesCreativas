// src/components/Navbar.tsx
import { Moon, Sun } from "lucide-react"; // Iconos modernos
import { useTheme } from "../hooks/useTheme";

const Navbar = () => {
  const { isDark } = useTheme();

  return (
    <nav
        className="
        w-full h-16 px-6 flex items-center justify-between
        backdrop-blur-xl 
        border-b border-slate-200/60
        shadow-sm

        /* 🎨 Fondo dinámico con degradado sutil */
        bg-linear-to-r from-white/95 via-slate-100/80 to-white/90
        dark:bg-linear-to-r dark:from-slate-900/90 dark:via-slate-900/80 dark:to-slate-900/80
      "
    >
      {/* ✨ Título con brillo suave */}
      <h1
        className="
          text-xl font-semibold tracking-wide
          bg-clip-text text-transparent
          bg-linear-to-r from-indigo-500 to-purple-500
          dark:from-indigo-300 dark:to-purple-300
          animate-pulseSlow
        "
      >
        Mi App
      </h1>

      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/70 dark:border-slate-700/60 shadow-sm">
        {isDark ? (
          <>
            <Sun className="w-4 h-4 text-yellow-400 animate-spinSlow" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Modo Oscuro</span>
          </>
        ) : (
          <>
            <Moon className="w-4 h-4 text-blue-500 animate-float" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">Modo Claro</span>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
