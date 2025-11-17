import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenedor principal */}
      <div className="flex flex-col flex-1 relative overflow-hidden">

        {/* NAVBAR */}
        <Navbar />

        {/* FIGURAS DE FONDO ANIMADAS */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-[1]">
          {/* 🔵 Círculo grande flotando con gradiente */}
          <div className="animated-bg-element element-circle element-1"></div>

          {/* 🟣 Cuadrado con rotación y escala */}
          <div className="animated-bg-element element-square element-2"></div>

          {/* 🔶 Triángulo con movimiento complejo */}
          <div className="animated-bg-element element-triangle element-3"></div>

          {/* 💎 Diamante pulsante */}
          <div className="animated-bg-element element-diamond element-4"></div>

          {/* 🌟 Estrella deformable */}
          <div className="animated-bg-element element-star element-5"></div>

          {/* 🎆 Líneas dinámicas */}
          <div className="animated-bg-element element-line element-6"></div>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <main
          className="
            flex-1 overflow-y-auto p-6 md:p-8 

            /* FONDO */
            bg-linear-to-br from-slate-50 via-white to-white
            dark:bg-linear-to-br dark:from-slate-950/80 dark:via-slate-900/80 dark:to-slate-900/70
            backdrop-blur-xl

            /* BORDES + SOMBRA */
            border-t border-slate-200/70 dark:border-slate-700/40
            shadow-inner

            /* Para que se vea sobre las figuras */
            relative z-5
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
