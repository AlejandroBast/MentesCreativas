import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Robot3D from "../components/Robot3D";

export default function Robot3DView() {
  const accessoryOptions = useMemo(
    () => [
      { id: "wings", label: "Alas aerodinámicas", helper: "Extiende paneles laterales" },
      { id: "boosters", label: "Cohetes traseros", helper: "Activa motores para el jetpack" },
      { id: "shield", label: "Escudo frontal", helper: "Añade una barrera holográfica" },
    ] as const,
    []
  );
  type AccessoryName = (typeof accessoryOptions)[number]["id"];
  type AccessoryState = Record<AccessoryName, boolean>;
  const [accessoryState, setAccessoryState] = useState<AccessoryState>({ wings: false, boosters: false, shield: false });
  const [gameScore, setGameScore] = useState(0);
  const [gameRunning, setGameRunning] = useState(false);
  const [life, setLife] = useState({ value: 100, max: 100 });
  const [gameOver, setGameOver] = useState(false);

  const toggleAccessory = (name: AccessoryName) => {
    setAccessoryState((prev) => {
      const next = { ...prev, [name]: !prev[name] };
      window.dispatchEvent(new CustomEvent("robot3d-accessory", { detail: { name, enabled: next[name] } }));
      return next;
    });
  };

  useEffect(() => {
    const onScore = (ev: CustomEvent) => {
      const score = Number((ev.detail as { score?: number })?.score ?? 0);
      setGameScore(score);
    };
    window.addEventListener("robot3d-game-score", onScore as EventListener);
    return () => window.removeEventListener("robot3d-game-score", onScore as EventListener);
  }, []);

  useEffect(() => {
    const onLife = (ev: CustomEvent) => {
      const detail = ev.detail as { value?: number; max?: number };
      let computedValue = 0;
      setLife((prev) => {
        const max = typeof detail?.max === "number" ? detail.max : prev.max;
        const value = typeof detail?.value === "number" ? detail.value : prev.value;
        computedValue = Math.max(0, Math.min(max, value));
        return { max, value: computedValue };
      });
      if (computedValue > 0) setGameOver(false);
    };
    window.addEventListener("robot3d-life", onLife as EventListener);
    return () => window.removeEventListener("robot3d-life", onLife as EventListener);
  }, []);

  useEffect(() => {
    const onGameOver = () => {
      setGameOver(true);
      setGameRunning(false);
    };
    window.addEventListener("robot3d-game-over", onGameOver as EventListener);
    return () => window.removeEventListener("robot3d-game-over", onGameOver as EventListener);
  }, []);

  const startGame = () => {
    setGameOver(false);
    setGameRunning(true);
    setGameScore(0);
    setLife((prev) => ({ ...prev, value: prev.max }));
    window.dispatchEvent(new CustomEvent("robot3d-game", { detail: { action: "start" } }));
  };
  const stopGame = () => {
    setGameRunning(false);
    setGameOver(false);
    window.dispatchEvent(new CustomEvent("robot3d-game", { detail: { action: "stop" } }));
  };

  const lifePercent = Math.max(0, Math.min(100, Math.round((life.value / life.max) * 100) || 0));
  const lifeHearts = Array.from({ length: life.max }, (_, idx) => idx < life.value);

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100">Robot 3D</h2>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300">
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

      <div className="rounded-2xl border border-sky-100 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/20 shadow-sm overflow-hidden">
        <Robot3D />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {accessoryOptions.map((option) => (
          <label
            key={option.id}
            className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm transition hover:border-sky-300 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:border-sky-500"
          >
            <input
              type="checkbox"
              checked={accessoryState[option.id]}
              onChange={() => toggleAccessory(option.id)}
              className="mt-1 h-4 w-4 accent-sky-500"
            />
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{option.label}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{option.helper}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="space-y-2 rounded-2xl border border-indigo-200/70 bg-indigo-50/80 px-4 py-3 shadow-sm dark:border-indigo-900/60 dark:bg-indigo-950/50">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">Mini-juego: Defensa orbital</p>
            <p className="text-xs text-indigo-700/80 dark:text-indigo-200/80">
              Haz clic sobre los proyectiles luminosos para destruirlos antes de que lleguen al robot. Solo cuentas con 5 golpes
              antes de que el escudo colapse.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-indigo-900 shadow-sm dark:bg-slate-900/70 dark:text-indigo-100">
              Puntuación: {gameScore}
            </span>
            {gameRunning ? (
              <button
                onClick={stopGame}
                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold shadow-sm hover:bg-red-600 transition"
              >
                Detener juego
              </button>
            ) : (
              <button
                onClick={startGame}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 transition"
              >
                Iniciar juego
              </button>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-900/80 dark:text-indigo-100/80">
            <span>Vidas (5 toques máximos)</span>
            <span>
              {life.value} / {life.max}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-white/60 dark:bg-slate-900/60">
            <div
              className="h-full rounded-full bg-linear-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all"
              style={{ width: `${lifePercent}%` }}
            />
          </div>
          <div className="flex gap-1">
            {lifeHearts.map((alive, idx) => (
              <span
                key={idx}
                className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shadow-sm transition ${
                  alive
                    ? "bg-emerald-400 text-white"
                    : "bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                }`}
              >
                ♥
              </span>
            ))}
          </div>
        </div>
        {gameOver && (
          <div className="rounded-xl border border-rose-200/80 bg-rose-50/90 px-3 py-2 text-sm font-semibold text-rose-600 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
            ¡Perdiste! Vuelve a intentarlo.
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("robot3d-walk", { detail: { mode: "start", pattern: "figure8" } }))}
          className="px-4 py-2 rounded-lg bg-emerald-500 text-white font-medium shadow-sm hover:bg-emerald-600 transition"
        >
          Caminar
        </button>
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("robot3d-walk", { detail: { mode: "stop" } }))}
          className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 font-medium shadow-sm hover:bg-slate-50 transition dark:bg-slate-900/60 dark:border-slate-700 dark:text-slate-200"
        >
          Detenerse
        </button>
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
