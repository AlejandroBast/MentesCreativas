import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  currentHex: string;
  // eslint-disable-next-line no-unused-vars
  onSetHex: (hex: number) => void;
  onRandom: () => void;
  onReset: () => void;
  currentModel?: "pizza" | "pastel";
  // eslint-disable-next-line no-unused-vars
  onSetModel?: (model: "pizza" | "pastel") => void;
}

// 🎨 Paleta de colores
const presets = [
  { name: "Rojo", hex: 0xff7a8c },
  { name: "Verde", hex: 0x5ee4a0 },
  { name: "Azul", hex: 0x82b1ff },
  { name: "Naranja", hex: 0xffb07d },
  { name: "Rosa", hex: 0xff8ec2 },
  { name: "Morado", hex: 0xbd9df6 },
];

// 🖼️ Imágenes que funcionan
const gifs = [
  { 
    name: "Matemáticas", 
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad0' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%234ECDC4;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2344A08D;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad0)' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='60' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3E🔢%3C/text%3E%3Ctext x='50%25' y='80%25' font-size='28' fill='white' text-anchor='middle' dominant-baseline='middle'%3ENumeros y Operaciones%3C/text%3E%3C/svg%3E", 
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", 
    facts: [
      "¡El número Pi (π) tiene infinitos decimales y nunca se repiten!",
      "¡El cero fue inventado en India hace más de 1500 años!",
      "¡Fibonacci encontró una secuencia numérica que aparece en la naturaleza!"
    ]
  },
  { 
    name: "Español", 
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FF4757;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23FF6348;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad1)' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='60' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3E📚%3C/text%3E%3Ctext x='50%25' y='80%25' font-size='28' fill='white' text-anchor='middle' dominant-baseline='middle'%3ELectura y Vocabulario%3C/text%3E%3C/svg%3E", 
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", 
    facts: [
      "¡El español tiene más de 100,000 palabras diferentes!",
      "¡La palabra más larga del español es 'electroencefalografista'!",
      "¡El español es el segundo idioma más hablado en el mundo!"
    ]
  },
  { 
    name: "Inglés", 
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad2' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FFD93D;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23FFA500;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad2)' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='60' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3E🌍%3C/text%3E%3Ctext x='50%25' y='80%25' font-size='28' fill='white' text-anchor='middle' dominant-baseline='middle'%3EEnglish Words%3C/text%3E%3C/svg%3E", 
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3", 
    facts: [
      "¡El inglés es el idioma oficial de 67 países del mundo!",
      "¡Shakespeare inventó más de 1700 palabras en inglés!",
      "¡La palabra 'queue' es la única palabra en inglés que se pronuncia igual sin sus últimas 4 letras!"
    ]
  },
  { 
    name: "Sociales", 
    url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cdefs%3E%3ClinearGradient id='grad3' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%234ECDC4;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2344A08D;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad3)' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='60' font-weight='bold' fill='white' text-anchor='middle' dominant-baseline='middle'%3E🌎%3C/text%3E%3Ctext x='50%25' y='80%25' font-size='28' fill='white' text-anchor='middle' dominant-baseline='middle'%3EHistoria y Cultura%3C/text%3E%3C/svg%3E", 
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3", 
    facts: [
      "¡Colombia tiene más de 1800 especies de aves, es el país más biodiverso del mundo!",
      "¡La Gran Muralla China es visible desde el espacio!",
      "¡Machu Picchu fue construida sin usar mortero, solo piedras encajadas!"
    ]
  },
];

export default function ColorPalette({
  currentHex,
  onSetHex,
  onRandom,
  onReset,
  currentModel,
  onSetModel,
}: Props) {
  const [hexInput, setHexInput] = useState<string>(() => `#${currentHex.toUpperCase()}`);
  const [selectedGif, setSelectedGif] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [currentFact, setCurrentFact] = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentHexClean = useMemo(
    () => currentHex.replace(/^#/, "").padStart(6, "0").toUpperCase(),
    [currentHex]
  );

  useEffect(() => setHexInput(`#${currentHexClean}`), [currentHexClean]);

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
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("No se pudo copiar el código HEX", error);
    }
  };

  const playAnimeAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    const facts = gifs[selectedGif]?.facts || [];
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    setCurrentFact(randomFact);
    setShowFact(true);
    setTimeout(() => setShowFact(false), 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-8 p-6 rounded-2xl w-full"
    >
      {/* ========== CONTROLES ==========*/}
      <motion.div
        className="
          flex flex-wrap items-center gap-4 p-6 rounded-2xl
          bg-gradient-to-br from-white/90 via-slate-100/80 to-slate-50/70
          dark:from-slate-900/80 dark:via-slate-900/70 dark:to-slate-800/80
          backdrop-blur-xl border border-white/40 dark:border-slate-800/60
          shadow-[0_3px_25px_-4px_rgba(15,23,42,0.25)]
        "
      >
        {/* Presets */}
        <div className="flex items-center gap-2">
          {presets.map((p) => (
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ y: -2 }}
              key={p.name}
              onClick={() => onSetHex(p.hex)}
              className="w-10 h-10 rounded-xl border-2 shadow-md hover:scale-110 transition-all"
              style={{ backgroundColor: `#${p.hex.toString(16).padStart(6, "0")}` }}
              title={p.name}
            />
          ))}
        </div>

        {/* Selector color */}
        <label className="flex items-center gap-2 text-xs font-medium">
          <input
            type="color"
            value={`#${currentHexClean}`}
            onChange={(e) => onPick(e.target.value)}
            className="h-9 w-12 rounded border shadow-sm cursor-pointer"
          />
        </label>

        {/* Input HEX */}
        <label
          htmlFor="hex-code"
          className="flex flex-col gap-2 text-xs font-medium"
        >
          <span>Código HEX</span>
          <div className="flex items-center gap-2">
            <span>#</span>
            <input
              id="hex-code"
              value={hexInput}
              onChange={(e) => onHexChange(e.target.value)}
              className="
                px-2 py-1 rounded-lg border text-sm w-28 font-mono
                bg-white/90 dark:bg-slate-700/60 shadow-sm
                focus:ring-2 ring-blue-500
              "
              spellCheck={false}
            />
            <button
              onClick={copyToClipboard}
              className="px-3 py-1.5 rounded-lg text-xs bg-blue-600 text-dark shadow-md hover:bg-blue-700"
            >
              {copied ? "✓" : "Copiar"}
            </button>
          </div>
        </label>

        {/* Botones */}
        <button
          onClick={onRandom}
          className="px-4 py-2 rounded-xl text-sm bg-sky-400 text-white hover:bg-sky-500"
        >
          Random
        </button>

        <button
          onClick={onReset}
          className="px-4 py-2 rounded-xl text-sm border border-slate-200 hover:bg-slate-100 dark:hover:bg-slate-200"
        >
          Reset
        </button>

        {/* Preview */}
        <div className="ml-auto flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg border shadow-inner"
            style={{ backgroundColor: `#${currentHexClean}` }}
          />
          <span className="font-mono text-xs">#{currentHexClean}</span>
        </div>

        {/* Modelo */}
        {onSetModel && (
          <div className="flex gap-2 ml-2">
            {["pizza", "pastel"].map((model) => (
              <button
                key={model}
                onClick={() => onSetModel(model as "pizza" | "pastel")}
                className={`px-3 py-1.5 rounded-xl text-sm ${
                  currentModel === model
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* ========== GALERÍA GIFs ==========*/}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="
          p-6 rounded-2xl
          bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 
          dark:from-blue-900/30 dark:via-blue-900/20 dark:to-purple-900/40
          backdrop-blur-xl border border-slate-100/60 dark:border-purple-900/30 
          shadow-[0_3px_25px_-4px_rgba(15,23,42,0.1)]
        "
      >
        <h3 className="text-lg font-bold mb-4">✨ Galería Animada</h3>
        
        <motion.div
          key={selectedGif}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-4"
        >
          <motion.img
            src={gifs[selectedGif].url}
            alt={gifs[selectedGif].name}
            className="w-48 h-auto rounded-xl shadow-lg border border-white/30 cursor-pointer"
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={playAnimeAudio}
          />
        </motion.div>

        {/* Dato Educativo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: showFact ? 1 : 0, y: showFact ? 0 : 10 }}
          className="bg-gradient-to-r from-yellow-50/90 to-orange-50/80 dark:from-yellow-400/80 dark:to-orange-400/70 p-4 rounded-xl mb-4 text-center text-sm font-semibold text-slate-900 dark:text-slate-100"
        >
          💡 {currentFact}
        </motion.div>
        
        {/* Audio oculto */}
        <audio ref={audioRef} src={gifs[selectedGif]?.audio} />

        <div className="flex gap-2 justify-center flex-wrap">
          {gifs.map((gif, idx) => (
            <button
              key={gif.name}
              onClick={() => setSelectedGif(idx)}
              className={`
                px-4 py-2 rounded-xl text-sm shadow-md transition-all
                ${selectedGif === idx
                  ? "bg-blue-600 text-white"
                  : "bg-slate-200 dark:bg-slate-600 hover:bg-slate-300"}
              `}
            >
              {gif.name}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ========== PALETA VISUAL ==========*/}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="
          p-6 rounded-2xl
          bg-gradient-to-br from-white to-pink-50 
          dark:from-purple-900/30 dark:via-pink-900/20 dark:to-red-900/30
          backdrop-blur-xl border border-white/40 dark:border-pink-900/30 
          shadow-[0_3px_25px_-4px_rgba(15,23,42,0.2)]
        "
      >
        <h3 className="text-lg font-bold mb-4">🎨 Paleta Visual</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <motion.div
              key={preset.name}
              whileHover={{ y: -5, scale: 1.05 }}
              className="
                p-4 rounded-xl shadow-md
                bg-white/70 dark:bg-slate-700/40
                backdrop-blur border border-white/30
                text-center cursor-pointer transition-all
              "
              onClick={() => onSetHex(preset.hex)}
            >
              <div
                className="w-full h-20 rounded-lg mb-2 shadow-inner border-2"
                style={{ backgroundColor: `#${preset.hex.toString(16).padStart(6, "0")}` }}
              />
              <p className="text-sm font-semibold">{preset.name}</p>
              <p className="text-xs font-mono">#{preset.hex.toString(16).padStart(6, "0").toUpperCase()}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ========== VISTA CREATIVA ==========*/}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="
          p-6 rounded-2xl
          bg-gradient-to-br from-white to-slate-50 
          dark:from-emerald-900/30 dark:via-teal-900/20 dark:to-slate-900/40
          backdrop-blur-xl border border-white/40 dark:border-emerald-900/30 
          shadow-[0_3px_25px_-4px_rgba(15,23,42,0.18)]
        "
      >
        <h3 className="text-lg font-bold mb-4">🌈 Modo Creativo</h3>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="h-40 rounded-xl shadow-lg border-4 flex items-center justify-center text-white text-lg font-bold drop-shadow-lg"
          style={{ 
            backgroundColor: `#${currentHexClean}`,
            borderColor: `#${currentHexClean}`
          }}
        >
          #{currentHexClean}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
