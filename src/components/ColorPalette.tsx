interface Props {
  currentHex: string;
  onSetHex: (hex: number) => void;
  onRandom: () => void;
  onReset: () => void;
  currentModel?: "pizza" | "pastel";
  onSetModel?: (m: "pizza" | "pastel") => void;
}

const presets: { name: string; hex: number }[] = [
  { name: "Rojo", hex: 0xff4d4f },
  { name: "Verde", hex: 0x22c55e },
  { name: "Azul", hex: 0x3b82f6 },
];

export default function ColorPalette({ currentHex, onSetHex, onRandom, onReset, currentModel, onSetModel }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2" role="list" aria-label="Paleta de colores">
        {presets.map((p) => (
          <button
            key={p.name}
            onClick={() => onSetHex(p.hex)}
            aria-pressed={currentHex === p.hex.toString(16)}
            className="px-3 py-1.5 rounded-lg border flex items-center gap-2 text-sm"
            style={{ backgroundColor: `#${p.hex.toString(16).padStart(6, "0")}` }}
            title={p.name}
          >
            <span className="sr-only">{p.name}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onRandom}
        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 text-sm"
        aria-label="Color aleatorio"
      >
        Random
      </button>

      <button
        onClick={onReset}
        className="px-3 py-1.5 rounded-lg border text-sm"
        aria-label="Reiniciar color"
      >
        Reiniciar
      </button>

      <div className="ml-3 flex items-center gap-2 text-sm">
        <span className="inline-block w-5 h-5 rounded border" style={{ backgroundColor: `#${currentHex}` }} aria-hidden />
        <span aria-live="polite">#{currentHex.toUpperCase()}</span>
      </div>
      {/* Selector de modelo (pizza / pastel) - opcional si onSetModel es provisto */}
      <div className="ml-4 flex items-center gap-2">
        {onSetModel && (
          <>
            <button
              onClick={() => onSetModel("pizza")}
              className={`px-3 py-1.5 rounded-lg text-sm ${currentModel === "pizza" ? "bg-emerald-600 text-white" : "border"}`}
              aria-pressed={currentModel === "pizza"}
            >
              Pizza
            </button>
            <button
              onClick={() => onSetModel("pastel")}
              className={`px-3 py-1.5 rounded-lg text-sm ${currentModel === "pastel" ? "bg-emerald-600 text-white" : "border"}`}
              aria-pressed={currentModel === "pastel"}
            >
              Pastel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
