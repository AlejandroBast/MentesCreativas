import { useEffect, useRef, useState } from "react";

const steps: { id: string; title: string; text: string; color: string; description: string; }[] = [
  {
    id: "evap",
    title: "Evaporación",
    text: "El agua se convierte en vapor por la energía del sol.",
    color: "#E67E22",
    description: "Proceso de transformación del agua líquida en vapor de agua"
  },
  {
    id: "cond",
    title: "Condensación",
    text: "El vapor asciende y forma nubes cuando se enfría.",
    color: "#5B7C99",
    description: "El vapor se enfría y forma pequeñas gotitas de agua en las nubes"
  },
  {
    id: "precip",
    title: "Precipitación",
    text: "Las gotas se unen y caen como lluvia, nieve o granizo.",
    color: "#4A6FA5",
    description: "Las gotas se agrupan y caen hacia la tierra"
  },
  {
    id: "collect",
    title: "Acumulación",
    text: "El agua vuelve a ríos, lagos y océanos; parte se infiltra en el suelo.",
    color: "#2B6E8E",
    description: "El agua regresa a océanos, ríos y se filtra en el suelo"
  },
];

interface Particle {
  id: string;
  x: number;
  y: number;
  delay: number;
}

export default function WaterCycle() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      if (currentStep === 0) {
        for (let i = 0; i < 5; i++) {
          newParticles.push({
            id: `evap-${i}`,
            x: 100 + i * 60,
            y: 380,
            delay: i * 0.35,
          });
        }
      } else if (currentStep === 2) {
        for (let i = 0; i < 6; i++) {
          newParticles.push({
            id: `rain-${i}`,
            x: 180 + (i % 3) * 180,
            y: 140,
            delay: i * 0.25,
          });
        }
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, [currentStep]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = window.setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 4000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("watercycle-stage-changed", {
        detail: { index: currentStep, title: steps[currentStep].title },
      })
    );
  }, [currentStep]);

  const handlePrevious = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleStepClick = (index: number) => {
    setIsPlaying(false);
    setCurrentStep(index);
  };

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-50/70 via-white to-slate-100/90 dark:from-slate-950 dark:via-slate-900/80 dark:to-slate-900/70 p-8">
      <style>{`
        @keyframes evaporate {
          0% { 
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-160px) translateX(25px) scale(0.2);
            opacity: 0;
          }
        }
        
        @keyframes condenseMist {
          0% {
            transform: scale(0.8) translateY(40px);
            opacity: 0.2;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 0.8;
          }
        }
        
        @keyframes precipitate {
          0% {
            transform: translateY(-50px) scaleY(0.8);
            opacity: 0;
          }
          15% {
            opacity: 0.7;
          }
          85% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(150px) scaleY(0.5);
            opacity: 0;
          }
        }
        
        @keyframes gentleDrift {
          0%, 100% { transform: translateX(-10px) translateY(0px); }
          50% { transform: translateX(10px) translateY(-5px); }
        }
        
        @keyframes sunWarmth {
          0%, 100% {
            filter: drop-shadow(0 0 15px rgba(230, 126, 34, 0.6));
          }
          50% {
            filter: drop-shadow(0 0 25px rgba(230, 126, 34, 0.8));
          }
        }
        
        @keyframes waterFlow {
          0% {
            strokeDashoffset: 60;
          }
          100% {
            strokeDashoffset: 0;
          }
        }
        
        @keyframes subtleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        
        .evap-particle {
          animation: evaporate 3.2s cubic-bezier(0.33, 0.66, 0.66, 1) infinite;
        }
        
        .cloud-group {
          animation: gentleDrift 10s ease-in-out infinite;
        }
        
        .precipitate-drop {
          animation: precipitate 2.8s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
        }
        
        .water-current {
          stroke-dasharray: 60;
          animation: waterFlow 2.5s linear infinite;
        }
        
        .sun-warmth {
          animation: sunWarmth 3.5s ease-in-out infinite;
        }
        
        .mountain-accent {
          animation: subtleFloat 4s ease-in-out infinite;
        }
        
        .control-button {
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .control-button:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        
        .control-button:active:not(:disabled) {
          transform: translateY(0px);
        }
      `}</style>

      <div className="max-w-5xl mx-auto text-slate-900 dark:text-slate-100 space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900/90 dark:text-slate-100 mb-3">
            El Ciclo del Agua
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Descubre cómo el agua viaja continuamente a través de nuestro planeta
          </p>
        </div>

        {/* Main SVG Canvas */}
        <div className="bg-linear-to-b from-white/80 via-slate-50 to-slate-100 rounded-3xl p-6 shadow-[0_20px_45px_rgba(15,23,42,0.15)] mb-8 border border-slate-200/40 dark:bg-slate-900/80 dark:border-slate-700/40">
          <svg
            viewBox="0 0 800 520"
            className="w-full h-auto"
            role="img"
            aria-label={`Ciclo del agua: ${steps[currentStep].title}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#B8D4E8" />
                <stop offset="40%" stopColor="#D4E5F0" />
                <stop offset="100%" stopColor="#E8F1F5" />
              </linearGradient>

              <linearGradient id="oceanGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#5B8AC5" />
                <stop offset="100%" stopColor="#3D5A80" />
              </linearGradient>

              <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FDD835" />
                <stop offset="70%" stopColor="#E67E22" />
                <stop offset="100%" stopColor="#D45C32" />
              </radialGradient>

              <filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.15" />
              </filter>

              <filter id="cloudFilter">
                <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Sky background */}
            <rect width="800" height="520" fill="url(#skyGradient)" />

            <g>
              <circle
                cx="720"
                cy="75"
                r="40"
                fill="url(#sunGradient)"
                className="sun-warmth"
                opacity="0.9"
              />
              <circle
                cx="720"
                cy="75"
                r="30"
                fill="#FDD835"
                opacity="0.6"
              />
            </g>

            <path
              d="M 0 380 L 150 280 L 300 320 L 450 250 L 600 300 L 750 260 L 800 330 L 800 520 L 0 520 Z"
              fill="#8B7E7B"
              opacity="0.7"
            />

            <path
              d="M 0 380 L 150 280 L 300 320 L 450 250 L 600 300 L 750 260 L 800 330 L 800 380 L 0 380 Z"
              fill="#9B8E8B"
              opacity="0.3"
            />

            {/* Soil/Ground vegetation - natural green */}
            <rect y="380" width="800" height="140" fill="#7DB87D" opacity="0.25" />

            <ellipse cx="140" cy="425" rx="200" ry="55" fill="url(#oceanGradient)" opacity="0.85" />

            {/* Water surface ripples */}
            <path
              d="M 0 425 Q 50 420 100 425 T 200 425 T 300 425 T 400 425"
              stroke="#4A7BA7"
              strokeWidth="1.5"
              fill="none"
              opacity="0.3"
              className={currentStep === 3 ? "water-current" : ""}
            />

            <g opacity={currentStep === 1 ? 0.92 : 0.2} className={currentStep === 1 ? "cloud-group" : ""}>
              <ellipse cx="200" cy="105" rx="68" ry="38" fill="white" filter="url(#softShadow)" opacity="0.85" />
              <ellipse cx="260" cy="118" rx="56" ry="32" fill="white" opacity="0.8" filter="url(#softShadow)" />
              <ellipse cx="150" cy="125" rx="48" ry="28" fill="white" opacity="0.75" filter="url(#softShadow)" />
              <ellipse cx="290" cy="105" rx="40" ry="24" fill="white" opacity="0.7" filter="url(#softShadow)" />
            </g>

            <g opacity={currentStep === 1 ? 0.92 : 0.2} style={{ animationDelay: "3s" }} className={currentStep === 1 ? "cloud-group" : ""}>
              <ellipse cx="580" cy="140" rx="65" ry="36" fill="white" filter="url(#softShadow)" opacity="0.85" />
              <ellipse cx="635" cy="152" rx="52" ry="30" fill="white" opacity="0.8" filter="url(#softShadow)" />
              <ellipse cx="530" cy="158" rx="46" ry="26" fill="white" opacity="0.75" filter="url(#softShadow)" />
            </g>

            {/* Evaporation stage */}
            {currentStep === 0 && (
              <>
                <defs>
                  <marker
                    id="arrowEvap"
                    markerWidth="8"
                    markerHeight="8"
                    refX="7"
                    refY="2.5"
                    orient="auto"
                    markerUnits="strokeWidth"
                  >
                    <path d="M0,0 L0,5 L7,2.5 z" fill="#E67E22" opacity="0.5" />
                  </marker>
                </defs>

                {[0, 1, 2, 3, 4].map((i) => (
                  <g key={`evap-group-${i}`} style={{ animationDelay: `${i * 0.4}s` }}>
                    <line
                      x1={80 + i * 100}
                      y1="380"
                      x2={80 + i * 100}
                      y2="300"
                      stroke="#E67E22"
                      strokeWidth="1.5"
                      opacity="0.25"
                      markerEnd="url(#arrowEvap)"
                      strokeDasharray="3,3"
                    />
                  </g>
                ))}

                {particles.map((p) => (
                  <circle
                    key={p.id}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#E67E22"
                    opacity="0.5"
                    className="evap-particle"
                    style={{ animationDelay: `${p.delay}s` }}
                  />
                ))}

                <text
                  x="400"
                  y="500"
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="600"
                  fill="#5B4C47"
                  opacity="0.8"
                >
                  El calor del sol convierte lentamente el agua en vapor invisible
                </text>
              </>
            )}

            {/* Condensation stage */}
            {currentStep === 1 && (
              <>
                {[0, 1, 2, 3].map((i) => (
                  <path
                    key={`vapor-${i}`}
                    d={`M ${80 + i * 200} 350 Q ${110 + i * 200} 250 ${140 + i * 200} 140`}
                    stroke="#5B7C99"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.25"
                    strokeDasharray="4,4"
                  />
                ))}

                <text
                  x="400"
                  y="500"
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="600"
                  fill="#5B4C47"
                  opacity="0.8"
                >
                  El vapor asciende y se enfría, formando gotitas que crean nubes
                </text>
              </>
            )}

            {/* Precipitation stage */}
            {currentStep === 2 && (
              <>
                {particles.map((p) => (
                  <circle
                    key={p.id}
                    cx={p.x}
                    cy={p.y}
                    r="3.5"
                    fill="#4A6FA5"
                    className="precipitate-drop"
                    style={{ animationDelay: `${p.delay}s` }}
                    opacity="0.6"
                  />
                ))}

                <text
                  x="400"
                  y="500"
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="600"
                  fill="#5B4C47"
                  opacity="0.8"
                >
                  Las gotitas se agrupan y caen como lluvia hacia la tierra
                </text>
              </>
            )}

            {/* Accumulation stage */}
            {currentStep === 3 && (
              <>
                <path
                  d="M 400 350 Q 300 375 200 395 Q 150 415 140 430"
                  stroke="#2B6E8E"
                  strokeWidth="14"
                  fill="none"
                  opacity="0.5"
                  strokeLinecap="round"
                  filter="url(#softShadow)"
                />

                <path
                  d="M 500 360 Q 350 390 250 415 Q 180 435 140 430"
                  stroke="#5B8AC5"
                  strokeWidth="10"
                  fill="none"
                  opacity="0.35"
                  strokeLinecap="round"
                />

                {[0, 1, 2].map((i) => (
                  <circle
                    key={`flow-particle-${i}`}
                    cx="400"
                    cy="350"
                    r="2.5"
                    fill="#2B6E8E"
                    opacity="0.5"
                    style={{
                      animation: `waterFlow 3.2s linear infinite`,
                      animationDelay: `${i * 1.1}s`,
                    }}
                  />
                ))}

                <text
                  x="400"
                  y="500"
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="600"
                  fill="#5B4C47"
                  opacity="0.8"
                >
                  El agua fluye hacia ríos, lagos y océanos, iniciando nuevamente el ciclo
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Information Panel */}
        <div
          className="rounded-2xl p-8 mb-8 shadow-[0_20px_45px_rgba(15,23,42,0.15)] border border-white/30 dark:border-slate-800/60 border-l-4 bg-linear-to-br from-white/90 via-slate-50/80 to-blue-50/60 dark:from-slate-900/80 dark:via-slate-900/70 dark:to-slate-900/60 backdrop-blur-2xl"
          style={{ borderLeftColor: steps[currentStep].color }}
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl bg-white/70 dark:bg-slate-800/70"
            >
              {currentStep === 0 && "☀️"}
              {currentStep === 1 && "☁️"}
              {currentStep === 2 && "💧"}
              {currentStep === 3 && "🌊"}
            </div>
            <div>
              <h2 className="text-3xl font-semibold mb-1" style={{ color: steps[currentStep].color }}>
                {steps[currentStep].title}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm">{steps[currentStep].description}</p>
            </div>
          </div>
          <p className="text-slate-700 dark:text-slate-200 text-base leading-relaxed">
            {steps[currentStep].text}
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="control-button px-6 py-2.5 bg-white/80 dark:bg-slate-900/70 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-medium text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 shadow-sm disabled:shadow-none"
            aria-label="Paso anterior"
          >
            ← Anterior
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`control-button px-7 py-2.5 rounded-lg font-medium text-white shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
              isPlaying
                ? "bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400"
                : "bg-linear-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500"
            }`}
            aria-label={isPlaying ? "Pausar animación" : "Reproducir animación"}
          >
            {isPlaying ? "⏸ Pausar" : "▶ Reproducir"}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStep === steps.length - 1}
            className="control-button px-6 py-2.5 bg-white/80 dark:bg-slate-900/70 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg font-medium text-slate-700 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 shadow-sm disabled:shadow-none"
            aria-label="Siguiente paso"
          >
            Siguiente →
          </button>

          <button
            onClick={handleReset}
            className="control-button px-6 py-2.5 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium text-white shadow-sm"
            aria-label="Reiniciar animación"
          >
            🔄 Reiniciar
          </button>
        </div>

        {/* Step Indicators */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              className={`control-button px-4 py-2 rounded-lg font-medium transition shadow-sm ${
                index === currentStep
                  ? "text-white"
                  : "bg-white/80 text-slate-800 dark:bg-slate-900/50 dark:text-slate-100 border border-slate-200/70 dark:border-slate-800/60"
              }`}
              style={{
                backgroundColor: index === currentStep ? steps[index].color : undefined,
              }}
              aria-current={index === currentStep}
              aria-label={`${step.title} - ${index + 1} de ${steps.length}`}
            >
              {step.title}
            </button>
          ))}
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center items-center gap-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className="rounded-full transition-all duration-300"
              style={{
                width: index === currentStep ? "20px" : "6px",
                height: "6px",
                backgroundColor: index === currentStep ? steps[currentStep].color : "rgba(148,163,184,0.6)",
              }}
              aria-label={`Paso ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
