import { Link } from "react-router-dom";
import Robot3D from "../components/Robot3D";

export default function Robot3DView() {
  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-700 dark:text-slate-100">Robot 3D</h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-200">
            Rotar: arrastre izquierdo · Zoom: rueda/pinch · Desplazar: botón derecho / Shift+arrastre
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("robot3d-setview", { detail: "front" }))} 
            className="px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50 hover:bg-sky-100 text-slate-700 shadow-sm backdrop-blur-sm transition dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/80"
          >
            Frontal
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("robot3d-setview", { detail: "side" }))} 
            className="px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50 hover:bg-sky-100 text-slate-700 shadow-sm backdrop-blur-sm transition dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/80"
          >
            Lateral
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("robot3d-setview", { detail: "top" }))} 
            className="px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50 hover:bg-sky-100 text-slate-700 shadow-sm backdrop-blur-sm transition dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/80"
          >
            Superior
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("robot3d-setview", { detail: "perspective" }))} 
            className="px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50 hover:bg-sky-100 text-slate-700 shadow-sm backdrop-blur-sm transition dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/80"
          >
            Perspectiva
          </button>
          <Link to="/" className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition">
            Volver al inicio
          </Link>
        </div>
      </div>

      <div className="rounded-2xl border border-sky-200 dark:border-slate-800/60 bg-sky-50/50 dark:bg-slate-900/20 shadow-sm overflow-hidden">
        <Robot3D />
      </div>

      {/* Controles de movimiento en línea recta y lateral */}
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        <div />
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("robot3d-move", { detail: { dir: "forward" } }))}
          className="px-3 py-2 rounded-lg border border-sky-200 bg-sky-50 hover:bg-sky-100 text-slate-700 shadow-sm backdrop-blur-sm transition dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/80"
        >
          ↑
        </button>
        <div />
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("robot3d-move", { detail: { dir: "left" } }))}
          className="px-3 py-2 rounded-lg border border-sky-200 bg-sky-50 hover:bg-sky-100 text-slate-700 shadow-sm backdrop-blur-sm transition dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/80"
        >
          ←
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("robot3d-move", { detail: { dir: "back" } }))}
          className="px-3 py-2 rounded-lg border border-sky-200 bg-sky-50 hover:bg-sky-100 text-slate-700 shadow-sm backdrop-blur-sm transition dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/80"
        >
          ↓
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("robot3d-move", { detail: { dir: "right" } }))}
          className="px-3 py-2 rounded-lg border border-sky-200 bg-sky-50 hover:bg-sky-100 text-slate-700 shadow-sm backdrop-blur-sm transition dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900/80"
        >
          →
        </button>
      </div>
    </div>
  );
}
