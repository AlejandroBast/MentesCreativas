import WaterCycle from "../components/WaterCycle";
import { Link } from "react-router-dom";

export default function WaterCycleView() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Ciclo del Agua</h2>
          <p className="text-sm text-slate-600">Explora las etapas del ciclo del agua y sigue la guía interactiva.</p>
        </div>
        <div>
          <Link to="/" className="px-3 py-1.5 rounded bg-emerald-600 text-white">Volver al inicio</Link>
        </div>
      </div>

      <WaterCycle />
    </div>
  );
}
