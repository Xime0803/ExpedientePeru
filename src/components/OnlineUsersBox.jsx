import React, { useState, useEffect } from 'react';
import { 
  Users, ChevronDown, ChevronUp, Radio, Globe, Shield, Sparkles, 
  Clock, Calendar, Smartphone, Monitor, Tablet, Maximize2, Search, 
  X, RefreshCw, Eye
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { fetchRecentVisitors, subscribeVisitors } from '../services/dbService';

export default function OnlineUsersBox({ 
  userProfile, 
  onOpenRegister, 
  isFloating = true 
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('online'); // 'online' | 'history'
  const [realOnlineUsers, setRealOnlineUsers] = useState([]);
  const [visitors, setVisitors] = useState([]);
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. Supabase Realtime Presence: Solo usuarios 100% reales conectados en vivo
  useEffect(() => {
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

  // 2. Cargar y suscribir historial de visitantes con fecha y hora
  const loadVisitors = async () => {
    setIsRefreshing(true);
    const data = await fetchRecentVisitors(120);
    if (data) {
      setVisitors(data);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    loadVisitors();

    const unsub = subscribeVisitors((newVisitor) => {
      setVisitors(prev => [newVisitor, ...prev.filter(v => v.id !== newVisitor.id)].slice(0, 150));
    });

    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, []);

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

  // Renderizador de bandera nítida
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

  // Icono de dispositivo
  const getDeviceIcon = (deviceStr = '') => {
    const s = deviceStr.toLowerCase();
    if (s.includes('móvil') || s.includes('phone') || s.includes('android')) {
      return <Smartphone className="w-3 h-3 text-cyan-400 shrink-0" />;
    }
    if (s.includes('tablet') || s.includes('ipad')) {
      return <Tablet className="w-3 h-3 text-purple-400 shrink-0" />;
    }
    return <Monitor className="w-3 h-3 text-amber-400 shrink-0" />;
  };

  const filteredVisitors = visitors.filter(v => {
    if (!searchFilter.trim()) return true;
    const query = searchFilter.toLowerCase();
    return (
      (v.visitorAlias && v.visitorAlias.toLowerCase().includes(query)) ||
      (v.formattedDate && v.formattedDate.toLowerCase().includes(query)) ||
      (v.country && v.country.toLowerCase().includes(query)) ||
      (v.device && v.device.toLowerCase().includes(query))
    );
  });

  const containerClasses = isFloating
    ? "fixed bottom-5 right-5 z-40 w-80 sm:w-88 shadow-[0_10px_40px_rgba(0,0,0,0.85)]"
    : "w-full";

  return (
    <div className={containerClasses}>
      
      {/* Estado minimizado */}
      {!isOpen && isFloating ? (
        <button
          onClick={() => setIsOpen(true)}
          className="ml-auto flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-[#0b0f19] border-2 border-emerald-500/70 text-white font-mono text-xs font-bold shadow-2xl hover:scale-105 transition-all group backdrop-blur-md"
          title="Ver usuarios en línea y registro de visitantes"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-slate-200 group-hover:text-emerald-300">
            {totalActivos} {totalActivos === 1 ? 'activo' : 'activos'} • {visitors.length} visitas
          </span>
          <ChevronUp className="w-4 h-4 text-emerald-400" />
        </button>
      ) : (
        /* Recuadro Oscuro de Usuarios y Visitas */
        <div className="bg-[#0b0f19] border-2 border-slate-700/90 hover:border-emerald-500/60 rounded-2xl overflow-hidden shadow-2xl transition-all duration-200">
          
          {/* Cabecera Principal */}
          <div 
            onClick={() => setIsOpen(!isOpen)}
            className="px-3.5 py-2.5 bg-gradient-to-r from-[#0d1424] to-[#090d16] flex items-center justify-between cursor-pointer select-none border-b border-slate-800"
          >
            <div className="flex items-center space-x-2">
              <div className="relative flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400/60 animate-ping"></span>
              </div>

              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-mono uppercase font-black tracking-wider text-white">
                  Comunidad en Línea
                </span>
                <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700/80 font-bold">
                  {totalActivos} en vivo
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

          {/* Navegación por pestañas: 'En Línea' vs 'Registro de Visitas' */}
          {isOpen && (
            <div className="grid grid-cols-2 bg-[#080c14] border-b border-slate-800 text-xs font-mono font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('online')}
                className={`py-2 px-3 flex items-center justify-center space-x-1.5 transition-colors border-b-2 ${
                  activeTab === 'online'
                    ? 'border-emerald-500 text-emerald-300 bg-emerald-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>En Línea ({totalActivos})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`py-2 px-3 flex items-center justify-center space-x-1.5 transition-colors border-b-2 ${
                  activeTab === 'history'
                    ? 'border-cyan-500 text-cyan-300 bg-cyan-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Visitas ({visitors.length})</span>
              </button>
            </div>
          )}

          {isOpen && (
            <>
              {/* PESTAÑA 1: USUARIOS EN LÍNEA EN VIVO */}
              {activeTab === 'online' && (
                <div>
                  {totalActivos === 0 ? (
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
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0 shadow-sm shadow-emerald-400"></span>
                              {renderFlag(u.country, u.flag)}
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

                  <div className="px-3 py-1.5 bg-[#080c14] border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Datos 100% en vivo</span>
                    </span>
                    <span className="text-slate-500">Sin usuarios simulados</span>
                  </div>
                </div>
              )}

              {/* PESTAÑA 2: REGISTRO HISTÓRICO DE VISITANTES (FECHA Y HORA) */}
              {activeTab === 'history' && (
                <div>
                  <div className="p-2 space-y-1.5 max-h-56 overflow-y-auto divide-y divide-slate-800/40 pr-1 select-none">
                    {visitors.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-400 font-mono">
                        Registrando ingresos de visitantes...
                      </div>
                    ) : (
                      visitors.slice(0, 15).map((v, idx) => (
                        <div 
                          key={v.id || idx}
                          className="px-2.5 py-2 rounded-xl text-xs bg-slate-900/60 hover:bg-slate-900 transition-colors space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1.5 min-w-0">
                              {renderFlag(v.country, v.flag)}
                              <span className="truncate font-sans font-bold text-white text-xs">
                                {v.visitorAlias}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1 text-[10px] font-mono text-cyan-300">
                              {getDeviceIcon(v.device)}
                              <span className="truncate max-w-[90px]">{v.device}</span>
                            </div>
                          </div>

                          {/* Fecha y Hora Exacta de Ingreso */}
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                            <span className="flex items-center text-amber-300/90 font-medium">
                              <Clock className="w-3 h-3 mr-1 text-amber-400 shrink-0" />
                              {v.formattedDate}
                            </span>
                            <span className="text-slate-500">{v.browser}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Botón para abrir la Bitácora Completa */}
                  <div className="p-2 bg-[#080c14] border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-400">
                      Total: <strong className="text-cyan-400">{visitors.length}</strong> ingresos
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsVisitorModalOpen(true)}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-[10px] font-mono font-bold flex items-center space-x-1 transition-colors"
                    >
                      <Maximize2 className="w-3 h-3" />
                      <span>Ver Bitácora Completa</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: BITÁCORA DETALLADA DE VISITANTES CON FECHA Y HORA */}
      {/* ========================================================================= */}
      {isVisitorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1422] border-2 border-cyan-500/80 rounded-2xl w-full max-w-3xl p-5 sm:p-7 shadow-2xl relative space-y-4 max-h-[90vh] flex flex-col">
            
            {/* Botón Cerrar */}
            <button
              onClick={() => setIsVisitorModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabecera del Modal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/70 flex items-center justify-center text-cyan-400 shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center space-x-2">
                    <span>Registro Oficial de Visitantes</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-700">
                      Hora Perú (America/Lima)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Historial de accesos e ingresos registrados con fecha, hora exacta, seudónimo y dispositivo.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={loadVisitors}
                disabled={isRefreshing}
                className="self-start sm:self-auto px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
                <span>Actualizar</span>
              </button>
            </div>

            {/* Buscador y Resumen */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Buscar por fecha, seudónimo, dispositivo..."
                  className="w-full bg-[#070a12] border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="text-xs font-mono text-slate-400 flex items-center space-x-2 self-start sm:self-auto">
                <span>Total de ingresos: <strong className="text-cyan-400">{filteredVisitors.length}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
                  Tiempo Real
                </span>
              </div>
            </div>

            {/* Tabla de Registros */}
            <div className="flex-1 overflow-y-auto border border-slate-800 rounded-xl bg-[#070a12]">
              {filteredVisitors.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 font-mono space-y-1">
                  <Clock className="w-6 h-6 text-slate-600 mx-auto mb-2" />
                  <p>No se encontraron ingresos con ese filtro de búsqueda.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-800/80">
                  {filteredVisitors.map((v, idx) => (
                    <div 
                      key={v.id || idx}
                      className="p-3 hover:bg-slate-900/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      {/* Fecha y Hora */}
                      <div className="flex items-center space-x-2.5 min-w-[200px]">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-mono font-bold text-amber-300 text-xs">
                            {v.formattedDate}
                          </p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            Ingreso #{filteredVisitors.length - idx}
                          </p>
                        </div>
                      </div>

                      {/* Seudónimo / Identidad */}
                      <div className="flex items-center space-x-2 min-w-[170px]">
                        {renderFlag(v.country, v.flag)}
                        <span className="font-sans font-bold text-white text-xs sm:text-sm">
                          {v.visitorAlias}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          ({v.country || 'Perú'})
                        </span>
                      </div>

                      {/* Dispositivo y Navegador */}
                      <div className="flex items-center space-x-2 text-[11px] font-mono text-cyan-300 shrink-0">
                        {getDeviceIcon(v.device)}
                        <span>{v.device}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-400">{v.browser}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pie del Modal */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="text-slate-500">
                Auditoría en vivo de accesos a Expediente Perú
              </span>
              <button
                type="button"
                onClick={() => setIsVisitorModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
              >
                Cerrar Bitácora
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
