import React, { useState, useEffect } from 'react';
import { Users, ChevronDown, ChevronUp, Radio, Globe, Shield, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

export default function OnlineUsersBox({ 
  userProfile, 
  onOpenRegister, 
  isFloating = true 
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [realOnlineUsers, setRealOnlineUsers] = useState([]);

  // Supabase Realtime Presence: Solo usuarios 100% reales conectados en vivo
  useEffect(() => {
    // Si Supabase está configurado, usamos presencia en tiempo real
    if (isSupabaseConfigured && supabase) {
      const channel = supabase.channel('online-presence', {
        config: {
          presence: {
            key: userProfile?.nickname || 'anon-' + Math.random().toString(36).substring(7)
          }
        }
      });

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState();
          const list = [];
          Object.keys(state).forEach(key => {
            state[key].forEach(presence => {
              if (presence && presence.nickname) {
                list.push(presence);
              }
            });
          });
          setRealOnlineUsers(list);
        })
        .on('presence', { event: 'join' }, ({ newPresences }) => {
          // Usuario real se unió
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }) => {
          // Usuario real se desconectó
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED' && userProfile?.nickname) {
            await channel.track({
              id: userProfile.nickname,
              nickname: userProfile.nickname,
              country: userProfile.country || 'Perú',
              flag: userProfile.flag || '🇵🇪',
              onlineAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
          }
        });

      return () => {
        channel.unsubscribe();
      };
    } else {
      // Si corre en modo local (sin Supabase conectado aún), solo muestra al usuario real actual
      if (userProfile?.nickname) {
        setRealOnlineUsers([
          {
            id: 'current-local',
            nickname: userProfile.nickname,
            country: userProfile.country || 'Perú',
            flag: userProfile.flag || '🇵🇪',
            onlineAt: 'Ahora mismo',
            isCurrent: true
          }
        ]);
      } else {
        setRealOnlineUsers([]);
      }
    }
  }, [userProfile]);

  // Si el usuario actual está registrado pero aún no está en la lista de presencia, incluirlo
  const currentNickname = userProfile?.nickname;
  const isCurrentUserInList = currentNickname && realOnlineUsers.some(u => u.nickname === currentNickname);

  const displayList = [...realOnlineUsers];
  if (currentNickname && !isCurrentUserInList) {
    displayList.unshift({
      id: 'current-user-active',
      nickname: currentNickname,
      country: userProfile.country || 'Perú',
      flag: userProfile.flag || '🇵🇪',
      onlineAt: 'Ahora',
      isCurrent: true
    });
  }

  const totalActivos = displayList.length;

  // Renderizador de bandera nítida (evita que Windows muestre letras de texto 'PE')
  const renderFlag = (country, flagEmoji) => {
    if (country === 'Perú' || flagEmoji === '🇵🇪') {
      return (
        <span className="w-4 h-3 inline-flex rounded-[2px] overflow-hidden border border-slate-700 shrink-0 shadow-sm" title="Perú">
          <span className="w-1/3 h-full bg-red-600"></span>
          <span className="w-1/3 h-full bg-white"></span>
          <span className="w-1/3 h-full bg-red-600"></span>
        </span>
      );
    }
    if (country === 'Chile' || flagEmoji === '🇨🇱') {
      return (
        <span className="w-4 h-3 inline-flex flex-col rounded-[2px] overflow-hidden border border-slate-700 shrink-0 shadow-sm" title="Chile">
          <span className="w-full h-1/2 flex">
            <span className="w-1/2 h-full bg-blue-700"></span>
            <span className="w-1/2 h-full bg-white"></span>
          </span>
          <span className="w-full h-1/2 bg-red-600"></span>
        </span>
      );
    }
    if (country === 'EE.UU.' || flagEmoji === '🇺🇸') {
      return (
        <span className="w-4 h-3 inline-flex rounded-[2px] overflow-hidden border border-slate-700 shrink-0 shadow-sm bg-blue-900 text-[8px] text-white items-center justify-center font-bold" title="EE.UU.">
          USA
        </span>
      );
    }
    return <span className="text-xs shrink-0">{flagEmoji || '🌎'}</span>;
  };

  const containerClasses = isFloating
    ? "fixed bottom-5 right-5 z-40 w-72 sm:w-80 shadow-[0_10px_40px_rgba(0,0,0,0.85)]"
    : "w-full";

  return (
    <div className={containerClasses}>
      
      {/* Estado minimizado */}
      {!isOpen && isFloating ? (
        <button
          onClick={() => setIsOpen(true)}
          className="ml-auto flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-[#0b0f19] border-2 border-emerald-500/70 text-white font-mono text-xs font-bold shadow-2xl hover:scale-105 transition-all group backdrop-blur-md"
          title="Ver usuarios en línea reales"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-slate-200 group-hover:text-emerald-300">
            {totalActivos} {totalActivos === 1 ? 'activo' : 'activos'}
          </span>
          <ChevronUp className="w-4 h-4 text-emerald-400" />
        </button>
      ) : (
        /* Recuadro Oscuro de Usuarios Reales */
        <div className="bg-[#0b0f19] border-2 border-slate-700/90 hover:border-emerald-500/60 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200">
          
          {/* Cabecera */}
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className="px-3.5 py-2.5 bg-gradient-to-r from-[#0d1424] to-[#090d16] flex items-center justify-between cursor-pointer select-none border-b border-slate-800"
          >
            <div className="flex items-center space-x-2">
              {/* Punto verde pulsante */}
              <div className="relative flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400/60 animate-ping"></span>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-mono uppercase font-black tracking-wider text-white">
                  Usuarios en Línea
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/80 font-bold">
                  {totalActivos} {totalActivos === 1 ? 'real activo' : 'reales activos'}
                </span>
              </div>
            </div>

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

          {/* Lista de Usuarios 100% Reales */}
          {isOpen && (
            <>
              {totalActivos === 0 ? (
                /* Si no hay nadie registrado aún */
                <div className="p-4 text-center space-y-2">
                  <p className="text-xs text-slate-300">
                    Aún no te has registrado con un seudónimo.
                  </p>
                  <button
                    onClick={onOpenRegister}
                    className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-extrabold text-xs transition-colors shadow-md"
                  >
                    Ingresar mi Seudónimo y País
                  </button>
                </div>
              ) : (
                <div className="p-2 space-y-1 max-h-56 overflow-y-auto divide-y divide-slate-800/40 pr-1 select-none">
                  {displayList.map((u, idx) => {
                    const isSelf = u.isCurrent || u.nickname === currentNickname;
                    return (
                      <div 
                        key={u.id || idx}
                        className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors ${
                          isSelf 
                            ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-200' 
                            : 'hover:bg-slate-900/90 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center space-x-2 min-w-0">
                          {/* Punto Verde Individual */}
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400"></span>
                          
                          {/* Bandera Nítida */}
                          {renderFlag(u.country, u.flag)}
                          
                          {/* Seudónimo Real */}
                          <span className="truncate font-sans font-extrabold text-white text-xs sm:text-sm">
                            {u.nickname}
                          </span>

                          {isSelf && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 font-black">
                              TÚ
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-1 text-[10px] font-mono text-slate-400 shrink-0 ml-2">
                          <span className="text-slate-400">{u.country || 'Perú'}</span>
                          <span className="text-emerald-400 font-bold">• En línea</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Pie con estado real */}
              <div className="px-3 py-1.5 bg-[#080c14] border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Datos 100% en vivo</span>
                </span>
                <span className="text-slate-500">Sin usuarios simulados</span>
              </div>
            </>
          )}

        </div>
      )}

    </div>
  );
}
