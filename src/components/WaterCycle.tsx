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
    <div className="bg-white p-4 rounded shadow">
      <div className="md:flex gap-4 items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{steps[idx].title}</h3>
          <p className="mt-2 text-sm text-slate-700">{steps[idx].text}</p>

          <div className="mt-4 flex gap-2 flex-wrap">
            <button onClick={() => { setPlaying(false); setIdx((i) => Math.max(0, i - 1)); }} className="px-3 py-1.5 rounded border">Anterior</button>
            <button onClick={() => setPlaying((p) => !p)} className={`px-3 py-1.5 rounded ${playing ? 'bg-red-500 text-white' : 'border'}`}>{playing ? 'Pausar' : 'Reproducir'}</button>
            <button onClick={() => { setPlaying(false); setIdx((i) => Math.min(steps.length - 1, i + 1)); }} className="px-3 py-1.5 rounded border">Siguiente</button>
            <button onClick={() => { setPlaying(false); setIdx(0); }} className="px-3 py-1.5 rounded border">Reiniciar</button>
          </div>
        </div>

        <div className="w-full md:w-64 mt-4 md:mt-0">
          <div className="border rounded p-2">
            <svg viewBox="0 0 200 140" className="w-full h-36">
              <rect x="0" y="110" width="200" height="30" fill="#60a5fa" opacity={idx === 3 ? 1 : 0.7} />
              <circle cx="160" cy="20" r="16" fill="#f59e0b" opacity={idx === 0 ? 1 : 0.6} />
              <g opacity={idx === 1 ? 1 : 0.6}>
                <ellipse cx="80" cy="40" rx="36" ry="14" fill="#eef6ff" />
                <ellipse cx="110" cy="40" rx="26" ry="12" fill="#eef6ff" />
              </g>
              {idx === 2 && (
                <g fill="#3b82f6">
                  <path d="M70 60 q2 6 6 0 q-4 6 -6 0" />
                  <path d="M96 66 q2 6 6 0 q-4 6 -6 0" />
                  <path d="M122 62 q2 6 6 0 q-4 6 -6 0" />
                </g>
              )}
            </svg>

            <div className="mt-2 grid grid-cols-2 gap-2">
              {steps.map((s, i) => (
                <button key={s.id} onClick={() => { setPlaying(false); setIdx(i); }} className={`text-xs px-2 py-1 rounded ${i === idx ? 'bg-emerald-500 text-white' : 'border'}`}>{s.title}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
