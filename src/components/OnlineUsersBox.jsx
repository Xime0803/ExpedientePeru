import React, { useState, useEffect } from 'react';
import { 
  Users, ChevronDown, ChevronUp, Radio, Globe, Shield, Sparkles, 
  Clock, Calendar, Smartphone, Monitor, Tablet, Maximize2, Search, 
  X, RefreshCw, Eye, EyeOff, Lock, ShieldCheck, CheckCircle2
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { fetchRecentVisitors, subscribeVisitors } from '../services/dbService';
import { verifyAdminCredentials, getAdminSecurityStatus } from '../security/securityVault';
import CountryFlag from './CountryFlag';

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

  // ESTADO DE SEGURIDAD ADMINISTRATIVO (Bóveda Criptográfica SHA-256)
  const [isAdmin, setIsAdmin] = useState(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('exp_admin_active_session') === 'true';
  });
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Escuchar si el estado de bloqueo cambia al abrir el modal
  useEffect(() => {
    if (isAdminModalOpen) {
      const status = getAdminSecurityStatus();
      if (status.isLocked) {
        setLockoutRemaining(status.remainingSeconds);
      }
    }
  }, [isAdminModalOpen]);

  // Temporizador regresivo de bloqueo anti-fuerza bruta
  useEffect(() => {
    let timer;
    if (lockoutRemaining > 0) {
      timer = setInterval(() => {
        setLockoutRemaining(prev => {
          if (prev <= 1) {
            setAdminError("");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  const handleAdminVerify = async (e) => {
    e.preventDefault();
    if (!adminPin || isVerifyingAdmin) return;
    setIsVerifyingAdmin(true);
    setAdminError("");

    try {
      const result = await verifyAdminCredentials(adminPin);
      if (result.success) {
        setIsAdmin(true);
        sessionStorage.setItem('exp_admin_active_session', 'true');
        setIsAdminModalOpen(false);
        setAdminPin("");
        setActiveTab('history');
      } else {
        if (result.isLocked) {
          setLockoutRemaining(result.remainingSeconds);
        }
        setAdminError(result.message || "Clave de administrador incorrecta.");
      }
    } catch (err) {
      setAdminError("Error al verificar credenciales.");
    } finally {
      setIsVerifyingAdmin(false);
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('exp_admin_active_session');
    setActiveTab('online');
    setIsVisitorModalOpen(false);
  };

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
      (v.device && v.device.toLowerCase().includes(query)) ||
      (v.browser && v.browser.toLowerCase().includes(query))
    );
  });

  return (
    <>
      {/* ========================================================================= */}
      {/* CUADRO FLOTANTE INFERIOR DERECHO */}
      {/* ========================================================================= */}
      <div className={`z-30 w-72 sm:w-84 transition-all duration-300 font-sans ${
        isFloating ? 'fixed bottom-4 right-4' : 'relative w-full'
      }`}>
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

          {/* Navegación por pestañas: 'En Línea' vs 'Visitas (Solo Admin)' */}
          {isOpen && (
            <div className="grid grid-cols-2 bg-[#080c14] border-b border-slate-800 text-xs font-mono font-bold">
              {/* Pestaña 1: En Línea (Pública para toda la comunidad) */}
              <button
                type="button"
                onClick={() => setActiveTab('online')}
                className={`py-2 px-2.5 flex items-center justify-center space-x-1.5 transition-colors border-b-2 ${
                  activeTab === 'online'
                    ? 'border-emerald-500 text-emerald-300 bg-emerald-950/20'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>En Línea ({totalActivos})</span>
              </button>

              {/* Pestaña 2: Visitas (Protegida: Solo Admin) */}
              {isAdmin ? (
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`py-2 px-2.5 flex items-center justify-center space-x-1.5 transition-colors border-b-2 ${
                    activeTab === 'history'
                      ? 'border-cyan-500 text-cyan-300 bg-cyan-950/20'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                  title="Historial de ingresos (Sesión de Administrador activa)"
                >
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Visitas ({visitors.length})</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-600 font-bold ml-1">
                    ADMIN
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setAdminError("");
                    setAdminPin("");
                    setIsAdminModalOpen(true);
                  }}
                  className="py-2 px-2.5 flex items-center justify-center space-x-1.5 transition-colors border-b-2 border-transparent text-slate-400 hover:text-amber-300 group"
                  title="El registro de visitas es privado y exclusivo del administrador"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-500/80 group-hover:scale-110 transition-transform" />
                  <span>Visitas (Solo Admin)</span>
                </button>
              )}
            </div>
          )}

          {isOpen && (
            <>
              {/* PESTAÑA 1: USUARIOS EN LÍNEA EN VIVO (Pública) */}
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
                              <CountryFlag country={u.country} flag={u.flag} className="w-4 h-3" />
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

              {/* PESTAÑA 2: REGISTRO HISTÓRICO DE VISITANTES (SOLO ADMINISTRADOR) */}
              {activeTab === 'history' && (
                <div>
                  {!isAdmin ? (
                    /* Tarjeta de Protección para No Administradores */
                    <div className="p-4 text-center space-y-3 bg-[#0a0e18]">
                      <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                        <Lock className="w-5 h-5" />
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">Registro de Visitas Protegido</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed max-w-xs mx-auto">
                        Por privacidad y seguridad, la bitácora detallada de accesos con fecha y hora es visible exclusivamente para el administrador.
                      </p>
                      <button
                        onClick={() => {
                          setAdminError("");
                          setAdminPin("");
                          setIsAdminModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs shadow-md transition-colors inline-flex items-center space-x-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Desbloquear como Administrador</span>
                      </button>
                    </div>
                  ) : (
                    /* Vista Desbloqueada para el Administrador */
                    <div>
                      {/* Barra de Sesión Admin Activa */}
                      <div className="px-3 py-1.5 bg-amber-950/60 border-b border-amber-600/40 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-amber-300 font-bold flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>Auditoría Privada Admin</span>
                        </span>
                        <button
                          onClick={handleAdminLogout}
                          className="text-slate-300 hover:text-white underline hover:no-underline"
                          title="Cerrar sesión de administrador"
                        >
                          Cerrar Sesión
                        </button>
                      </div>

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
                                  <CountryFlag country={v.country} flag={v.flag} className="w-4 h-3" />
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
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: AUTORIZACIÓN EXCLUSIVA DE ADMINISTRADOR (BÓVEDA SHA-256) */}
      {/* ========================================================================= */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0e1422] border-2 border-amber-500/80 rounded-2xl w-full max-w-md p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Botón Cerrar */}
            <button
              onClick={() => {
                setIsAdminModalOpen(false);
                setAdminPin("");
                setAdminError("");
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Cabecera */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/70 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-950/60">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/60 text-[11px] font-mono font-bold text-amber-300">
                <Lock className="w-3.5 h-3.5" />
                <span>BÓVEDA PROTEGIDA • HISTORIAL DE VISITAS</span>
              </div>
              <h3 className="text-xl font-extrabold text-white">
                Autorización del Administrador
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm mx-auto">
                Ingresa tu clave de acceso autorizada para visualizar la auditoría detallada de visitas con fecha, hora y dispositivos.
              </p>
            </div>

            {/* Formulario */}
            <form onSubmit={handleAdminVerify} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-mono font-bold text-slate-300">
                  Clave de Acceso:
                </label>
                <div className="relative">
                  <input
                    type={showAdminPin ? "text" : "password"}
                    autoFocus
                    disabled={lockoutRemaining > 0 || isVerifyingAdmin}
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder={lockoutRemaining > 0 ? "Acceso Bloqueado" : "••••••••••••"}
                    className="w-full bg-[#070a12] border-2 border-slate-700 focus:border-amber-500 text-white font-mono text-center text-xl tracking-widest py-3 px-10 rounded-xl focus:outline-none transition-all disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPin(!showAdminPin)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                  >
                    {showAdminPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Alertas de error o bloqueo */}
              {lockoutRemaining > 0 ? (
                <div className="p-3 bg-red-950/80 border border-red-500/80 rounded-xl text-xs font-mono text-red-200 text-center flex items-center justify-center space-x-2">
                  <Clock className="w-4 h-4 text-red-400 animate-spin" />
                  <span>Panel bloqueado por seguridad. Espera {lockoutRemaining} segundos.</span>
                </div>
              ) : adminError ? (
                <div className="p-3 bg-red-950/60 border border-red-500/60 rounded-xl text-xs text-red-300 text-center font-bold">
                  {adminError}
                </div>
              ) : null}

              {/* Botón de desbloqueo */}
              <button
                type="submit"
                disabled={!adminPin.trim() || lockoutRemaining > 0 || isVerifyingAdmin}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-lg shadow-amber-950/50 flex items-center justify-center space-x-2"
              >
                {isVerifyingAdmin ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verificando Bóveda SHA-256...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Verificar y Desbloquear Historial</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 text-center font-mono flex items-center justify-center space-x-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protección criptográfica SHA-256 + Anti-Fuerza Bruta</span>
              </p>
            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: BITÁCORA DETALLADA DE VISITANTES CON FECHA Y HORA (SOLO ADMIN) */}
      {/* ========================================================================= */}
      {isVisitorModalOpen && isAdmin && (
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
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white">
                      Registro Oficial de Visitantes
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700 font-bold">
                      EXCLUSIVO ADMIN
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Historial de accesos e ingresos registrados con fecha, hora exacta, seudónimo y dispositivo.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={loadVisitors}
                  disabled={isRefreshing}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
                  <span>Actualizar</span>
                </button>
              </div>
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
                        <CountryFlag country={v.country} flag={v.flag} className="w-4 h-3" />
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
              <span className="text-slate-500 flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Auditoría privada protegida con Bóveda SHA-256</span>
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

    </>
  );
}
