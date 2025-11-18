import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/UI/Card";
import { Settings, Palette, Bot, Droplet, BarChart3, Rocket, Clock, Activity, BookOpen, Zap, PlayCircle, Target, Trophy, AlertCircle, CheckCircle, CalendarDays } from "lucide-react";

export default function HomeContent() {
  const STAT_KEY = "mc:stats";
  type Stats = Record<string, number>;
  const readStats = (): Stats => {
    try {
      const raw = window.localStorage.getItem(STAT_KEY);
      return raw ? (JSON.parse(raw) as Stats) : {};
    } catch {
      return {} as Stats;
    }
  };
  const writeStats = (s: Stats) => {
    try {
      window.localStorage.setItem(STAT_KEY, JSON.stringify(s));
      window.dispatchEvent(new CustomEvent("stats:updated", { detail: s }));
    } catch { void 0; }
  };
  const [stats, setStats] = useState<Stats>(() => readStats());
  const inc = (k: string, v = 1) => {
    const s = readStats();
    s[k] = (s[k] || 0) + v;
    s["click_total"] = (s["click_total"] || 0) + v;
    writeStats(s);
    setStats(s);
  };
  useEffect(() => {
    const onUpdate = (ev: CustomEvent) => {
      const detail = ev.detail as Stats;
      setStats({ ...(detail || {}) });
    };
    window.addEventListener("stats:updated", onUpdate as EventListener);
    return () => window.removeEventListener("stats:updated", onUpdate as EventListener);
  }, []);
  const A11Y_KEY = "mc:a11y";
  type A11y = { highContrast: boolean; reduceMotion: boolean; focusVisible: boolean };
  const readA11y = (): A11y => {
    try {
      const raw = window.localStorage.getItem(A11Y_KEY);
      return raw ? (JSON.parse(raw) as A11y) : { highContrast: false, reduceMotion: false, focusVisible: true };
    } catch {
      return { highContrast: false, reduceMotion: false, focusVisible: true } as A11y;
    }
  };
  const [a11y, setA11y] = useState<A11y>(() => readA11y());
  useEffect(() => {
    try {
      window.localStorage.setItem(A11Y_KEY, JSON.stringify(a11y));
      document.documentElement.classList.toggle("a11y-hc", !!a11y.highContrast);
      document.documentElement.classList.toggle("a11y-rm", !!a11y.reduceMotion);
      document.documentElement.classList.toggle("a11y-focus", !!a11y.focusVisible);
      window.dispatchEvent(new CustomEvent("a11y:changed", { detail: a11y }));
    } catch { void 0; }
  }, [a11y]);

  const StatTile = useMemo(() => {
    return function StatTile({ label, value }: { label: string; value: string | number }) {
      return (
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3">
          <p className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      );
    };
  }, []);

  const StatItem = useMemo(() => {
    return function StatItem({ label, value }: { label: string; value: string | number }) {
      return (
        <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3">
          <p className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      );
    };
  }, []);
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
    <main className="flex flex-col gap-8 py-10 px-6 text-slate-800 dark:text-slate-100 min-h-[calc(100vh-3.5rem)]" role="main">
      <motion.section initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="w-full max-w-6xl mx-auto">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 relative rounded-3xl border border-sky-100/70 bg-white/90 dark:bg-slate-900/70 backdrop-blur-sm shadow-sm px-8 py-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Bienvenido a Mentes Creativas</h2>
                <p className="mt-2 text-sm md:text-base text-slate-600 dark:text-slate-300">Aprende con experiencias interactivas de ciencias, tecnología y matemáticas.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link to="/color3d" onClick={() => inc("click_color3d")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition">
                    <Palette className="w-4 h-4" /> Matemáticas 3D
                  </Link>
                  <Link to="/robot3d" onClick={() => inc("click_robot3d")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition">
                    <Bot className="w-4 h-4" /> Robot 3D
                  </Link>
                  <Link to="/watercycle" onClick={() => inc("click_watercycle")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white shadow-sm transition">
                    <Droplet className="w-4 h-4" /> Ciclo del Agua
                  </Link>
                  <Link to="/settings" onClick={() => inc("click_settings")} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-900 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 shadow-sm transition">
                    <Settings className="w-4 h-4" /> Configuración
                  </Link>
                </div>
              </div>
              
            </div>
            <span className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-sky-100/60 dark:ring-slate-700/60" />
          </div>
          <Card title="Resumen" actions={<Link to="/settings" className="text-xs px-2 py-1 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white">Ajustes</Link>}>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/60 p-3">
                <p className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">Progreso</p>
                <p className="text-xl font-bold">72%</p>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                  <div className="h-2 rounded-full bg-emerald-500" style={{ width: "72%" }} />
                </div>
              </div>
              <StatTile label="Módulos" value={3} />
              <StatTile label="Sesiones" value={12} />
              <StatTile label="Puntuación" value={5} />
            </div>
          </Card>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15, duration: 0.5 }} className="w-full max-w-6xl mx-auto">
        <Card title="Estadísticas" actions={<span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Live</span>}>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <StatItem label="Clicks totales" value={stats.click_total || 0} />
            <StatItem label="Matemáticas 3D" value={stats.click_color3d || 0} />
            <StatItem label="Robot 3D" value={stats.click_robot3d || 0} />
            <StatItem label="Ciclo del Agua" value={stats.click_watercycle || 0} />
            <StatItem label="Configuración" value={stats.click_settings || 0} />
          </div>
        </Card>
      </motion.section>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12, duration: 0.5 }} className="w-full max-w-6xl mx-auto">
        <Card title="Configuración rápida" actions={<span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Accesibilidad</span>}>
          <form className="grid gap-3 md:grid-cols-3" aria-label="Opciones de accesibilidad rápidas">
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={a11y.highContrast} onChange={(e) => setA11y((p) => ({ ...p, highContrast: e.target.checked }))} aria-checked={a11y.highContrast} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Alto contraste</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={a11y.reduceMotion} onChange={(e) => setA11y((p) => ({ ...p, reduceMotion: e.target.checked }))} aria-checked={a11y.reduceMotion} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Reducir movimiento</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" checked={a11y.focusVisible} onChange={(e) => setA11y((p) => ({ ...p, focusVisible: e.target.checked }))} aria-checked={a11y.focusVisible} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900" />
              <span className="text-sm text-slate-700 dark:text-slate-200">Foco visible</span>
            </label>
          </form>
        </Card>
      </motion.section>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }} className="w-full max-w-6xl mx-auto">
        <div className="grid gap-6 md:grid-cols-3">
          <Card title="Acciones rápidas" actions={<Link to="/robot3d" className="text-xs px-2 py-1 rounded-md bg-indigo-600 text-white">Abrir Robot</Link>}>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/robot3d" className="flex items-center gap-2 rounded-lg border border-slate-200/80 dark:border-slate-700/60 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                <Rocket className="w-4 h-4 text-indigo-600" /> Animar Robot
              </Link>
              <Link to="/color3d" className="flex items-center gap-2 rounded-lg border border-slate-200/80 dark:border-slate-700/60 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                <Palette className="w-4 h-4 text-emerald-600" /> Paleta 3D
              </Link>
              <Link to="/watercycle" className="flex items-center gap-2 rounded-lg border border-slate-200/80 dark:border-slate-700/60 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                <Droplet className="w-4 h-4 text-sky-600" /> Ciclo del Agua
              </Link>
              <Link to="/settings" className="flex items-center gap-2 rounded-lg border border-slate-200/80 dark:border-slate-700/60 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                <Settings className="w-4 h-4 text-slate-600" /> Preferencias
              </Link>
            </div>
          </Card>
          <Card title="Actividad" actions={<span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Hoy</span>}>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-2"><Clock className="w-4 h-4" /> 10:24 · Robot 3D · Defensa orbital</li>
              <li className="flex items-center gap-2"><Activity className="w-4 h-4" /> 09:58 · Color 3D · Ajuste de paleta</li>
              <li className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> 09:15 · Ciclo del Agua · Etapas</li>
            </ul>
          </Card>
          <Card title="Estado" actions={<span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">OK</span>}>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 dark:bg-slate-900/60 px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300"><BarChart3 className="w-3 h-3" /> Rendimiento</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 dark:bg-slate-900/60 px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300"><Zap className="w-3 h-3" /> Animaciones</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 dark:bg-slate-900/60 px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300"><PlayCircle className="w-3 h-3" /> Interacciones</span>
            </div>
          </Card>
        </div>
      </motion.section>

      <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }} className="w-full max-w-6xl mx-auto">
        <div className="grid gap-6 md:grid-cols-4">
          <Card title="Objetivo semanal" actions={<span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Activo</span>}>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm"><Target className="w-4 h-4 text-indigo-600" /> Completar 3 módulos</div>
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800">
                <div className="h-2 rounded-full bg-indigo-500" style={{ width: "40%" }} />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">1 de 3</p>
            </div>
          </Card>
          <Card title="Racha" actions={<span className="text-xs px-2 py-1 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">3 días</span>}>
            <div className="flex items-center gap-3">
              <Trophy className="w-6 h-6 text-amber-500" />
              <div>
                <p className="text-sm">Aprendiendo de forma constante</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">Sigue así</p>
              </div>
            </div>
          </Card>
          <Card title="Próximos" actions={<span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Agenda</span>}>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Ciclo del Agua · Mañana</li>
              <li className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Robot 3D · Jueves</li>
            </ul>
          </Card>
          <Card title="Notificaciones" actions={<span className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">2</span>}>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-rose-600" /> Nueva guía de color</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-600" /> Progreso guardado</li>
            </ul>
          </Card>
        </div>
      </motion.section>
    </main>
  );
}
