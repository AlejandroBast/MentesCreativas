// src/components/Navbar.tsx
import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // Iconos modernos

const Navbar: React.FC = () => {
  const [isDark, setIsDark] = useState<boolean>(false);

  // 🔄 Inicializa tema guardado
  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      root.classList.add("dark");
      setIsDark(true);
    } else {
      root.classList.remove("dark");
    }
  }, []);

  // 🌗 Alternar tema
  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");

    const newTheme = root.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
    setIsDark(newTheme === "dark");
  };

  return (
    <nav
      className="
        w-full h-16 px-6 flex items-center justify-between
        backdrop-blur-xl 
        border-b border-white/10
        shadow-lg

        /* 🎨 Fondo dinámico con degradado sutil */
        bg-gradient-to-r from-white/60 via-white/40 to-white/60
        dark:from-[#0f0f11]/60 dark:via-[#121214]/40 dark:to-[#0f0f11]/60
      "
    >
      {/* ✨ Título con brillo suave */}
      <h1
        className="
          text-xl font-semibold tracking-wide
          bg-clip-text text-transparent
          bg-gradient-to-r from-indigo-500 to-purple-500
          dark:from-indigo-300 dark:to-purple-300
          animate-pulseSlow
        "
      >
        Mi App
      </h1>

      {/* 🌗 Botón cambiar tema con animación */}
      <button
        onClick={toggleTheme}
        className="
          relative px-4 py-2 rounded-xl flex items-center gap-2
          font-medium transition-all duration-300

          /* 🎨 Colores del botón */
          bg-neutral-200/80 hover:bg-neutral-300/90
          dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80

          border border-neutral-300/60 dark:border-neutral-700/60
          shadow-md dark:shadow-none

          hover:scale-[1.03] active:scale-[0.97]
        "
      >
        {isDark ? (
          <>
            <Sun className="w-5 h-5 text-yellow-400 animate-spinSlow" />
            Modo Claro
          </>
        ) : (
          <>
            <Moon className="w-5 h-5 text-blue-500 animate-float" />
            Modo Oscuro
          </>
        )}
      </button>
    </nav>
  );
};

export default Navbar;
