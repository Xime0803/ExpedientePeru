import React, { useState, useEffect } from 'react';
import { Users, ChevronDown, ChevronUp, Radio, Globe, Shield, Sparkles, X, Minimize2, Maximize2 } from 'lucide-react';

const defaultCommunityUsers = [
  { id: 'u-1', nickname: 'InvestigadorHuamanga', country: 'Ayacucho', flag: '🇵🇪', status: 'En expedientes' },
  { id: 'u-2', nickname: 'CronistaTrujillo', country: 'La Libertad', flag: '🇵🇪', status: 'En el mapa' },
  { id: 'u-3', nickname: 'LectorColca', country: 'Arequipa', flag: '🇵🇪', status: 'En debate' },
  { id: 'u-4', nickname: 'MisteriosLima', country: 'Lima', flag: '🇵🇪', status: 'Comentando' },
  { id: 'u-5', nickname: 'ArchivoYungay', country: 'Áncash', flag: '🇵🇪', status: 'En expedientes' },
  { id: 'u-6', nickname: 'SeguidorCusco', country: 'Cusco', flag: '🇵🇪', status: 'En el mapa' },
  { id: 'u-7', nickname: 'ForensePisco', country: 'Ica', flag: '🇵🇪', status: 'Leyendo' },
  { id: 'u-8', nickname: 'ViajeroPuno', country: 'Puno', flag: '🇵🇪', status: 'En vivo' },
  { id: 'u-9', nickname: 'AmazonasReal', country: 'Amazonas', flag: '🇵🇪', status: 'Votando' },
  { id: 'u-10', nickname: 'CelendinActivo', country: 'Cajamarca', flag: '🇵🇪', status: 'Leyendo' },
  { id: 'u-11', nickname: 'ComunidadSantiago', country: 'Chile', flag: '🇨🇱', status: 'En vivo' },
  { id: 'u-12', nickname: 'PeruanoEnMiami', country: 'EE.UU.', flag: '🇺🇸', status: 'En expedientes' }
];

export default function OnlineUsersBox({ 
  userProfile, 
  onOpenRegister, 
  isFloating = true 
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [onlineCount, setOnlineCount] = useState(14);

  // Subtle fluctuation to make community presence feel live
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(12, Math.min(24, prev + delta));
      });
    }, 14000);
    return () => clearInterval(interval);
  }, []);

  const currentUserItem = {
    id: 'current-user',
    nickname: userProfile?.nickname || 'Tú (Visitante)',
    country: userProfile?.country || 'Perú',
    flag: userProfile?.flag || '🇵🇪',
    isCurrent: true,
    status: userProfile?.nickname ? 'En línea' : 'Sin registrar'
  };

  const displayList = [currentUserItem, ...defaultCommunityUsers];

  // Floating wrapper vs embedded wrapper
  const containerClasses = isFloating
    ? "fixed bottom-5 right-5 z-40 w-72 sm:w-80 shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
    : "w-full";

  return (
    <div className={containerClasses}>
      
      {/* If minimized floating pill */}
      {!isOpen && isFloating ? (
        <button
          onClick={() => setIsOpen(true)}
          className="ml-auto flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-[#0b0f19] border-2 border-emerald-500/70 text-white font-mono text-xs font-bold shadow-2xl hover:scale-105 transition-all group backdrop-blur-md"
          title="Ver usuarios en línea"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-slate-200 group-hover:text-emerald-300">
            {onlineCount} en línea
          </span>
          <ChevronUp className="w-4 h-4 text-emerald-400" />
        </button>
      ) : (
        /* The Dark Box Component */
        <div className="bg-[#0b0f19] border-2 border-slate-700/80 hover:border-emerald-500/50 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200">
          
          {/* Header */}
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className="px-3.5 py-2.5 bg-gradient-to-r from-[#0d1424] to-[#090d16] flex items-center justify-between cursor-pointer select-none border-b border-slate-800"
          >
            <div className="flex items-center space-x-2">
              {/* Pulsing Green Dot */}
              <div className="relative flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400/60 animate-ping"></span>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-mono uppercase font-black tracking-wider text-white">
                  Usuarios en Línea
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/80 font-bold">
                  {onlineCount} activos
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(!isOpen);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                title={isOpen ? "Minimizar" : "Expandir"}
              >
                {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* User List with Green Dots and Pseudonyms */}
          {isOpen && (
            <>
              <div className="p-2 space-y-1 max-h-56 overflow-y-auto divide-y divide-slate-800/40 pr-1 select-none">
                {displayList.map(u => (
                  <div 
                    key={u.id}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
                      u.isCurrent 
                        ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 font-bold' 
                        : 'hover:bg-slate-900/90 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      {/* Individual Green Dot */}
                      <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400/80"></span>
                      <span className="text-sm shrink-0">{u.flag}</span>
                      
                      {/* Pseudonym */}
                      <span className="truncate font-sans font-bold text-slate-100">
                        {u.nickname}
                      </span>

                      {u.isCurrent && (
                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-500 text-slate-950 font-black">
                          TÚ
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1.5 text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                      <span className="hidden sm:inline text-slate-500">{u.country}</span>
                      <span className="text-emerald-400/90 font-semibold">• {u.status}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Pseudonym Prompt if not registered */}
              {!userProfile?.nickname ? (
                <div className="px-3 py-2 bg-slate-900/80 border-t border-slate-800 text-center">
                  <button
                    onClick={onOpenRegister}
                    className="text-[11px] font-mono text-amber-400 hover:text-amber-300 hover:underline font-bold"
                  >
                    + Registrar mi seudónimo y país
                  </button>
                </div>
              ) : (
                <div className="px-3 py-1.5 bg-[#080c14] border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center space-x-1.5 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Canales Oficiales YouTube & TikTok</span>
                  </span>
                  <span className="text-slate-500">En vivo</span>
                </div>
              )}
            </>
          )}

        </div>
      )}

    </div>
  );
}
