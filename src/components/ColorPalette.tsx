interface Props {
  currentHex: string;
  // eslint-disable-next-line no-unused-vars
  onSetHex: (hex: number) => void;
  onRandom: () => void;
  onReset: () => void;
  currentModel?: "pizza" | "pastel";
  // eslint-disable-next-line no-unused-vars
  onSetModel?: (m: "pizza" | "pastel") => void;
}

type Preset = { name: string; hex: number };
const presets: ReadonlyArray<Preset> = [
  { name: "Rojo", hex: 0xff4d4f },
  { name: "Verde", hex: 0x22c55e },
  { name: "Azul", hex: 0x3b82f6 },
];

import { useEffect, useMemo, useState } from "react";

export default function ColorPalette({ currentHex, onSetHex, onRandom, onReset, currentModel, onSetModel }: Props) {
  const [hexInput, setHexInput] = useState<string>(() => `#${currentHex.toUpperCase()}`);
  const currentHexClean = useMemo(() => currentHex.replace(/^#/, "").padStart(6, "0").toUpperCase(), [currentHex]);

  // Sync local input when prop changes externally
  useEffect(() => {
    setHexInput(`#${currentHexClean}`);
  }, [currentHexClean]);

  const onPick = (val: string) => {
    const clean = val.replace("#", "");
    const n = parseInt(clean, 16);
    if (!Number.isNaN(n)) onSetHex(n);
  };

  const onHexChange = (val: string) => {
    setHexInput(val);
    const clean = val.replace(/[^0-9a-fA-F]/g, "").toUpperCase();
    if (clean.length === 6) {
      const n = parseInt(clean, 16);
      if (!Number.isNaN(n)) onSetHex(n);
    }
  };

  const copyToClipboard = async () => {
    try {
      await window.navigator.clipboard.writeText(`#${currentHexClean}`);
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2" role="list" aria-label="Paleta de colores">
        {presets.map((p) => (
          <button
            key={p.name}
            onClick={() => onSetHex(p.hex)}
            aria-pressed={currentHexClean === p.hex.toString(16).padStart(6, "0").toUpperCase()}
            className="w-8 h-8 rounded-lg border shadow-sm"
            style={{ backgroundColor: `#${p.hex.toString(16).padStart(6, "0")}` }}
            title={p.name}
          >
            <span className="sr-only">{p.name}</span>
          </button>
        ))}
      </div>

      {/* Color input nativo */}
      <label className="flex items-center gap-2 text-xs">
        <span>Color</span>
        <input
          type="color"
          value={`#${currentHexClean}`}
          onChange={(e) => onPick(e.target.value)}
          className="h-8 w-10 rounded border"
          aria-label="Selector de color"
        />
      </label>

      {/* HEX input */}
      <label className="flex items-center gap-2 text-xs">
        <span>HEX</span>
        <input
          value={hexInput}
          onChange={(e) => onHexChange(e.target.value)}
          className="px-2 py-1 rounded border text-sm w-28"
          spellCheck={false}
          aria-label="Código HEX"
        />
        <button onClick={copyToClipboard} className="px-2 py-1 rounded border text-xs">Copiar</button>
      </label>

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

      <div className="ml-1 flex items-center gap-2 text-sm">
        <span className="inline-block w-5 h-5 rounded border" style={{ backgroundColor: `#${currentHexClean}` }} aria-hidden />
        <span aria-live="polite">#{currentHexClean}</span>
      </div>

      {/* Selector de modelo (pizza / pastel) - opcional si onSetModel es provisto */}
      <div className="ml-2 flex items-center gap-2">
        {onSetModel && (
          <>
            <button
              onClick={() => onSetModel("pizza")}
              className={`px-3 py-1.5 rounded-lg text-sm ${currentModel === "pizza" ? "bg-blue-600 text-white" : "border"}`}
              aria-pressed={currentModel === "pizza"}
            >
              Pizza
            </button>
            <button
              onClick={() => onSetModel("pastel")}
              className={`px-3 py-1.5 rounded-lg text-sm ${currentModel === "pastel" ? "bg-blue-600 text-white" : "border"}`}
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
