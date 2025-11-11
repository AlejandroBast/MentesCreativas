import { useEffect, useRef, useState } from "react";

const steps = [
  { id: "evap", title: "Evaporación", text: "El agua se convierte en vapor por la energía del sol." },
  { id: "cond", title: "Condensación", text: "El vapor asciende y forma nubes cuando se enfría." },
  { id: "precip", title: "Precipitación", text: "Las gotas se unen y caen como lluvia, nieve o granizo." },
  { id: "collect", title: "Acumulación", text: "El agua vuelve a ríos, lagos y océanos; parte se infiltra en el suelo." },
];

export default function WaterCycle() {
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (playing) {
      timer.current = window.setInterval(() => {
        setIdx((i) => (i + 1) % steps.length);
      }, 2500);
    }
    return () => {
      if (timer.current) window.clearInterval(timer.current);
      timer.current = null;
    };
  }, [playing]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("watercycle-stage-changed", { detail: { index: idx, title: steps[idx].title } }));
  }, [idx]);

  return (
    <div className="bg-gray-400 p-4 rounded shadow">
      {/* Animaciones CSS locales para el SVG */}
      <style>{`
        @keyframes rise { 0%{ transform: translateY(8px); opacity:.2 } 100%{ transform: translateY(-14px); opacity:1 } }
        @keyframes fall { 0%{ transform: translateY(-10px); opacity:.2 } 100%{ transform: translateY(18px); opacity:1 } }
        @keyframes steam { 0%{ opacity:.2 } 50%{ opacity:.6 } 100%{ opacity:1 } }
        @keyframes drift { 0%{ transform: translateX(-4px) } 100%{ transform: translateX(4px) } }
        .evap-arrow { animation: rise 1.4s infinite ease-in; }
        .precip-drop { animation: fall 1.1s infinite ease-in; }
        .steam { animation: steam 2s infinite ease-in-out; }
        .cloud { animation: drift 6s infinite ease-in-out alternate; }
      `}</style>

      <div className="md:flex gap-4 items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{steps[idx].title}</h3>
          <p className="mt-2 text-sm text-slate-900">{steps[idx].text}</p>

          <div className="mt-4 flex gap-2 flex-wrap">
            <button onClick={() => { setPlaying(false); setIdx((i) => Math.max(0, i - 1)); }} className="px-3 py-1.5 rounded border">Anterior</button>
            <button onClick={() => setPlaying((p) => !p)} className={`px-3 py-1.5 rounded ${playing ? 'bg-red-500 text-white' : 'border'}`}>{playing ? 'Pausar' : 'Reproducir'}</button>
            <button onClick={() => { setPlaying(false); setIdx((i) => Math.min(steps.length - 1, i + 1)); }} className="px-3 py-1.5 rounded border">Siguiente</button>
            <button onClick={() => { setPlaying(false); setIdx(0); }} className="px-3 py-1.5 rounded border">Reiniciar</button>
          </div>
        </div>

        <div className="w-full md:w-80 mt-4 md:mt-0">
          <div className="border rounded p-2 bg-white/70">
            <svg viewBox="0 0 240 160" className="w-full h-44">
              {/* Agua acumulada */}
              <rect x="0" y="120" width="240" height="40" fill="#60a5fa" opacity={idx === 3 ? 1 : 0.7} />
              {/* Sol */}
              <circle cx="200" cy="28" r="16" fill="#f59e0b" opacity={idx === 0 ? 1 : 0.6} />
              {/* Vapor (evaporación) */}
              {idx === 0 && (
                <g className="steam" fill="#93c5fd">
                  <path className="evap-arrow" style={{ animationDelay: "0ms" }} d="M40 120 l6 -12 l6 12" />
                  <path className="evap-arrow" style={{ animationDelay: "200ms" }} d="M70 120 l6 -12 l6 12" />
                  <path className="evap-arrow" style={{ animationDelay: "400ms" }} d="M100 120 l6 -12 l6 12" />
                </g>
              )}

              {/* Nubes (condensación) */}
              <g className={idx === 1 ? "cloud" : ""} opacity={idx >= 1 ? 1 : 0.5}>
                <ellipse cx="90" cy="50" rx="36" ry="14" fill="#eef6ff" />
                <ellipse cx="120" cy="50" rx="26" ry="12" fill="#eef6ff" />
                <ellipse cx="150" cy="50" rx="20" ry="10" fill="#eef6ff" />
              </g>

              {/* Precipitación */}
              {idx === 2 && (
                <g fill="#3b82f6">
                  <path className="precip-drop" style={{ animationDelay: "0ms" }} d="M90 60 q2 6 6 0 q-4 6 -6 0" />
                  <path className="precip-drop" style={{ animationDelay: "120ms" }} d="M110 66 q2 6 6 0 q-4 6 -6 0" />
                  <path className="precip-drop" style={{ animationDelay: "240ms" }} d="M130 62 q2 6 6 0 q-4 6 -6 0" />
                </g>
              )}

              {/* Ríos (acumulación y flujo) */}
              {idx === 3 && (
                <g>
                  <path d="M0 120 C 40 110, 80 130, 120 120 S 200 140, 240 120" stroke="#3b82f6" strokeWidth="3" fill="none" />
                  <polygon points="200,125 208,120 200,115" fill="#3b82f6" />
                </g>
              )}
            </svg>

            <div className="mt-2 grid grid-cols-2 gap-2">
              {steps.map((s, i) => (
                <button key={s.id} onClick={() => { setPlaying(false); setIdx(i); }} className={`text-xs px-2 py-1 rounded ${i === idx ? 'bg-blue-600 text-white' : 'border'}`}>{s.title}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
