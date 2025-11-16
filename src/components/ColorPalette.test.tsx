import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  currentHex: string;
  onSetHex: (hex: number) => void;
  onRandom: () => void;
  onReset: () => void;
}

const presets = [
  { label: "Rojo", value: "#ff0000" },
  { label: "Verde", value: "#00ff00" },
  { label: "Azul", value: "#0000ff" },
  { label: "Amarillo", value: "#ffff00" },
  { label: "Cian", value: "#00ffff" },
  { label: "Magenta", value: "#ff00ff" },
];

export default function ColorPalette({
  currentHex,
  onSetHex,
  onRandom,
  onReset,
}: Props) {
  const [hexValue, setHexValue] = React.useState(currentHex);
  const [copied, setCopied] = React.useState(false);

  const handleInput = (hex: string) => {
    setHexValue(hex);
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onSetHex(parseInt(hex.replace("#", ""), 16));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard?.writeText(currentHex.toUpperCase());
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-3xl shadow-2xl 
                 bg-white/70 dark:bg-slate-900/50 
                 backdrop-blur-lg border border-white/20 
                 space-y-6"
    >
      {/* Color Actual */}
      <motion.div
        layout
        className="h-28 rounded-2xl shadow-inner border cursor-pointer"
        style={{ background: currentHex, transition: "background 0.5s ease" }}
        whileHover={{ scale: 1.05, boxShadow: "0px 0px 30px rgba(0,0,0,0.2)" }}
      />

      {/* Código HEX */}
      <div className="relative">
        <label className="block font-semibold text-sm text-slate-600 dark:text-slate-300 mb-1">
          Código HEX
        </label>
        <motion.input
          layout
          value={hexValue}
          onChange={(e) => handleInput(e.target.value)}
          className="
            mt-1 w-full p-3 rounded-xl border 
            bg-white/80 dark:bg-slate-800/60
            focus:ring-2 ring-blue-500 
            font-mono text-lg transition-all
          "
        />
        <AnimatePresence>
          {copied && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-3 top-1 text-xs text-green-500 font-semibold"
            >
              Copiado!
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Presets */}
      <motion.div layout className="flex flex-wrap gap-3">
        {presets.map((preset) => (
          <motion.button
            whileHover={{
              scale: 1.1,
              backgroundColor: preset.value,
              color: "#fff",
            }}
            whileTap={{ scale: 0.95 }}
            key={preset.value}
            onClick={() =>
              onSetHex(parseInt(preset.value.replace("#", ""), 16))
            }
            className="
              px-4 py-2 rounded-2xl font-medium shadow-md
              bg-slate-200 dark:bg-slate-800 
              transition-all
            "
          >
            {preset.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Acciones */}
      <motion.div layout className="flex gap-4 justify-between">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={copyToClipboard}
          className="
            flex-1 py-3 rounded-2xl font-semibold
            bg-blue-500 text-white shadow-lg
            hover:bg-blue-600 transition-all
          "
        >
          Copiar
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onRandom}
          className="
            flex-1 py-3 rounded-2xl font-semibold
            bg-purple-500 text-white shadow-lg
            hover:bg-purple-600 transition-all
          "
        >
          Aleatorio
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="
            flex-1 py-3 rounded-2xl font-semibold
            bg-red-500 text-white shadow-lg
            hover:bg-red-600 transition-all
          "
        >
          Reset
        </motion.button>
      </motion.div>

      {/* Imagen Naruto */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex justify-center pt-4"
      >
        <motion.img
          src="https://media.tenor.com/56MWG2qr0LkAAAAM/naruto.gif"
          alt="Naruto GIF"
          className="w-32 h-auto rounded-xl shadow-md"
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.9 }}
        />
      </motion.div>
    </motion.div>
  );
}
