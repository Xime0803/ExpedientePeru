import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Trophy, 
  ChevronUp, 
  ChevronDown, 
  Pause, 
  Play, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  Flame,
  Award
} from 'lucide-react';

export default function GratitudeRoulette({ 
  supporters = [], 
  onOpenAdmin 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState('down'); // 'down' | 'up'
  const timerRef = useRef(null);

  const total = supporters.length;

  // Auto-cycling Roulette Effect (rolls smoothly every 3.8 seconds)
  useEffect(() => {
    if (isPaused || total <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 3800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, total]);

  const handleNext = () => {
    if (total === 0) return;
    setDirection('down');
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    if (total === 0) return;
    setDirection('up');
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Helper to get 3 consecutive visible supporters to give the feel of a real rolling roulette wheel
  const getVisibleSupporters = () => {
    if (total === 0) return [];
    if (total === 1) return [supporters[0]];
    if (total === 2) return [supporters[currentIndex], supporters[(currentIndex + 1) % 2]];

    const first = supporters[currentIndex];
    const second = supporters[(currentIndex + 1) % total];
    const third = supporters[(currentIndex + 2) % total];
    return [first, second, third];
  };

  const visibleList = getVisibleSupporters();

  const getMethodBadge = (method) => {
    switch (method?.toLowerCase()) {
      case 'yape':
        return {
          bg: 'bg-purple-950/90 text-purple-200 border-purple-500/70',
          dot: 'bg-purple-400',
          label: 'Yape Oficial'
        };
      case 'plin':
        return {
          bg: 'bg-cyan-950/90 text-cyan-200 border-cyan-500/70',
          dot: 'bg-cyan-400',
          label: 'Plin Oficial'
        };
      case 'dale':
        return {
          bg: 'bg-emerald-950/90 text-emerald-200 border-emerald-500/70',
          dot: 'bg-emerald-400',
          label: 'Dale Oficial'
        };
      default:
        return {
          bg: 'bg-amber-950/90 text-amber-200 border-amber-500/70',
          dot: 'bg-amber-400',
          label: method || 'Mecenas de Honor'
        };
    }
  };

  return (
    <div className="relative bg-gradient-to-r from-[#111728] via-[#141d33] to-[#101726] border-2 border-amber-500/50 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden">
      
      {/* Decorative Golden Ambient Glow */}
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-12 -left-12 w-44 h-44 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header of the Gratitude Roulette */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-700/80 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-950/60 shrink-0">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-extrabold flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
                <span>CUADRO DE HONOR EN CONSTANTE ROTACIÓN</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-red-950 text-red-300 border border-red-800 font-bold hidden xs:inline">
                EN VIVO
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Agradecimientos a Colaboradores & Mecenas
            </h3>
          </div>
        </div>

        {/* Roulette Controls & Admin Access */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          {total > 1 && (
            <div className="flex items-center space-x-1 bg-slate-900/90 border border-slate-700 rounded-xl px-2 py-1">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="p-1 rounded text-slate-300 hover:text-amber-400 transition-colors"
                title={isPaused ? "Reanudar ruleta automática" : "Pausar para leer con calma"}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <Pause className="w-3.5 h-3.5" />}
              </button>

              <span className="text-[10px] font-mono text-slate-400 px-1 border-l border-slate-800">
                {isPaused ? "Pausado" : "Girando"}
              </span>

              <button
                onClick={handlePrev}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Ver anterior"
              >
                <ChevronUp className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Ver siguiente"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Admin Exclusive Access Button */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-xs font-mono font-bold transition-all shadow-md group"
            title="Panel de gestión exclusivo para el administrador del canal"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Gestión Admin</span>
          </button>
        </div>
      </div>

      {/* ROULETTE STAGE: VERTICAL CONTINUOUS WHEEL */}
      <div 
        className="mt-4 relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {total === 0 ? (
          /* Empty State */
          <div className="py-7 px-4 bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl text-center space-y-2">
            <Heart className="w-8 h-8 text-amber-500/80 mx-auto animate-pulse" />
            <h4 className="text-base font-bold text-white">
              Cuadro de Honor Oficial del Canal
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Los colaboradores que apoyan por <strong>Yape, Plin o Dale al 916839878</strong> son reconocidos aquí por el administrador en constante rotación.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-lg transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Inscribir Colaboradores (Solo Admin)</span>
              </button>
            </div>
          </div>
        ) : (
          /* Vertical Scrolling Roulette Cards */
          <div className="space-y-3 relative overflow-hidden transition-all duration-500">
            {visibleList.map((item, idx) => {
              const badge = getMethodBadge(item.method);
              const isMainFocus = idx === 0;

              return (
                <div
                  key={`${item.id}-${idx}`}
                  className={`rounded-2xl p-4 sm:p-5 transition-all duration-300 border-2 ${
                    isMainFocus
                      ? 'bg-gradient-to-r from-[#18233c] to-[#121a2c] border-amber-400/80 shadow-xl shadow-amber-950/30 scale-[1.01]'
                      : 'bg-[#0d1424]/80 border-slate-800 opacity-80 hover:opacity-100 hidden sm:block'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    {/* Left: Supporter Details */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xl sm:text-2xl">{item.countryFlag || "🇵🇪"}</span>
                        
                        <h4 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center space-x-1.5">
                          <span>{item.name}</span>
                          <Award className="w-4 h-4 text-amber-400 fill-amber-400 inline" />
                        </h4>

                        {/* Payment / Tier Badge */}
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border flex items-center space-x-1.5 ${badge.bg}`}>
                          <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                          <span>{badge.label}</span>
                        </span>

                        <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                          {item.amountOrTier || "Colaborador"}
                        </span>
                      </div>

                      {/* Dedication / Message */}
                      <p className="text-sm sm:text-base text-slate-200 italic font-sans leading-relaxed">
                        "{item.message}"
                      </p>
                    </div>

                    {/* Right: Location & Date Badge */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between text-xs font-mono text-slate-400 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                      <span className="text-amber-300 font-bold">{item.location}</span>
                      <span className="text-slate-500">{item.date || "Oct 2026"}</span>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Info Notice */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <p className="flex items-center space-x-1.5 text-center sm:text-left">
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline shrink-0" />
          <span>
            Panel exclusivo verificado: Solo el administrador del canal puede inscribir y publicar colaboradores en esta ruleta.
          </span>
        </p>
        <span className="font-mono text-amber-400 font-bold shrink-0">
          {total} en ruleta
        </span>
      </div>

    </div>
  );
}
