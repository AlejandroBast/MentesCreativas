import { Link } from "react-router-dom";
import Robot3D from "../components/Robot3D";

export default function Robot3DView() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Robot 3D</h2>
          <p className="text-sm text-slate-600">
            Rotar: arrastre izquierdo · Zoom: rueda/pinch · Desplazar: botón derecho / Shift+arrastre
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("robot3d-setview", { detail: "front" }))} 
            className="px-3 py-1.5 rounded border hover:bg-slate-50"
          >
            Frontal
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("robot3d-setview", { detail: "side" }))} 
            className="px-3 py-1.5 rounded border hover:bg-slate-50"
          >
            Lateral
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("robot3d-setview", { detail: "top" }))} 
            className="px-3 py-1.5 rounded border hover:bg-slate-50"
          >
            Superior
          </button>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent("robot3d-setview", { detail: "perspective" }))} 
            className="px-3 py-1.5 rounded border hover:bg-slate-50"
          >
            Perspectiva
          </button>
          <Link to="/" className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white">
            Volver al inicio
          </Link>
        </div>
      </div>

      <Robot3D />
    </div>
  );
}
