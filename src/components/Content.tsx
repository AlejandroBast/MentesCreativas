import { Outlet } from "react-router-dom";

export default function Content() {
  return (
    <div className="h-full w-full p-6">

      <div
        className="
          relative w-full h-full rounded-3xl overflow-hidden
          
          /* 🎨 GLASSMORPHISM PREMIUM */
          bg-[rgba(255,255,255,0.05)]
          dark:bg-[rgba(0,0,0,0.35)]
          backdrop-blur-2xl

          /* 🌈 DEGRADADO SUAVE */
          bg-gradient-to-br 
          from-purple-600/20 
          via-blue-600/10 
          to-indigo-600/20
          dark:from-slate-900/40 
          dark:via-slate-800/30 
          dark:to-slate-900/50

          /* ✨ BORDES LUMINOSOS */
          border border-white/20 dark:border-white/10

          /* 🌟 SOMBRA TIPO NEON SUAVE */
          shadow-[0_0_25px_-5px_rgba(0,0,0,0.6)]

          /* 🎬 ANIMACIÓN DE APARICIÓN */
          animate-contentFadeIn
        "
      >
        {/* ✨ BRILLO ANIMADO INTERNO */}
        <div
          className="
            pointer-events-none absolute inset-0 
            bg-gradient-to-tr from-white/5 to-transparent
            animate-subtleShine
            opacity-40
          "
        />

        {/* 🌟 Contenido real */}
        <div className="relative h-full w-full p-4 animate-slideUp">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
