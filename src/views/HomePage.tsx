import { motion } from "framer-motion";
import { useEffect } from "react";

export default function HomeContent() {
  // --- Auditoría opcional: se ejecuta solo si axe-core está disponible ---
  useEffect(() => {
    (async () => {
      // Evitamos import.meta para compatibilidad con Jest/ts-jest
      if (process.env.NODE_ENV === "development") {
        try {
          const axe = await import("axe-core");
          axe.run(document, {}, (_err, results) => {
            if (results.violations.length > 0) {
              console.warn("⚠️ Violaciones de accesibilidad:", results.violations);
            }
          });
        } catch {
          console.info("axe-core no está instalado o no se pudo cargar, se omite auditoría.");
        }
      }
    })();
  }, []);

  return (
    <main
      className="flex flex-col items-center justify-center text-center py-16 px-6 
                 bg-transparent
                 text-slate-800 dark:text-slate-100 
                 font-sans min-h-[calc(100vh-3.5rem)] 
                 transition-colors duration-500"
      role="main"
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="w-full max-w-3xl"
      >
  <div className="relative rounded-3xl border border-sky-100/70 shadow-lg bg-white/85 backdrop-blur-sm dark:bg-slate-900/60 dark:border-slate-800/60 px-8 py-10">
        {/* --- SVG accesible --- */}
        <svg
          className="w-32 h-32 mx-auto mb-6"
          viewBox="0 0 841.9 595.3"
          xmlns="./public/mentecreativas.svg"
          role="img"
          aria-label="MentesCreativas icon"
        >
          <g fill="#61DAFB">
            <path d="M421 296.5c0-25.6 20.8-46.4 46.4-46.4s46.4 20.8 46.4 46.4-20.8 46.4-46.4 46.4-46.4-20.8-46.4-46.4z" />
            <path d="M421 183.5c-68.7 0-124.5 55.8-124.5 124.5s55.8 124.5 124.5 124.5 124.5-55.8 124.5-124.5S489.7 183.5 421 183.5zm0 219.8c-52.6 0-95.3-42.7-95.3-95.3s42.7-95.3 95.3-95.3 95.3 42.7 95.3 95.3-42.7 95.3-95.3 95.3z" />
          </g>
        </svg>

        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-slate-700 dark:text-slate-100">
          Bienvenido a Mentes Creativas!!
        </h2>

        <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto text-slate-700 dark:text-slate-300">
          Mentes Creativas te ayuda a mejorar tu entendimiento en {" "}
          <span className="font-bold text-blue-600 dark:text-blue-400">
            ciencias, tecnologia y matematicas!
          </span>.
        </p>

        <div className="space-x-4">

        </div>
  <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-sky-100/60 dark:ring-white/10" />
        </div>
      </motion.div>
    </main>
  );
}
