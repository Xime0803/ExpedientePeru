import React, { useState, useEffect, useRef } from 'react';
import { 
  Lock, 
  Unlock, 
  X, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Heart, 
  Trophy, 
  Sparkles, 
  Edit3, 
  Check, 
  AlertCircle,
  RotateCcw,
  ShieldAlert,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  verifyAdminCredentials, 
  getAdminSecurityStatus, 
  sanitizeSecureText 
} from '../security/securityVault';

export default function AdminGratitudeModal({ 
  isOpen, 
  onClose, 
  supporters, 
  onUpdateSupporters 
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("Lima, Perú");
  const [countryFlag, setCountryFlag] = useState("🇵🇪");
  const [method, setMethod] = useState("Yape");
  const [message, setMessage] = useState("");
  const [amountOrTier, setAmountOrTier] = useState("Colaborador Destacado");

  // Inactivity Auto-logout Timer (15 minutes)
  const autoLogoutTimerRef = useRef(null);

  // Check Lockout on Mount or Open
  useEffect(() => {
    if (isOpen) {
      const status = getAdminSecurityStatus();
      if (status.isLocked) {
        setLockoutSeconds(status.remainingSeconds);
      }
    }
  }, [isOpen]);

  // Lockout Countdown
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds(prev => {
        if (prev <= 1) {
          setErrorMessage("");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Reset Inactivity Timer
  const resetInactivityTimer = () => {
    if (autoLogoutTimerRef.current) clearTimeout(autoLogoutTimerRef.current);
    if (isAuthenticated) {
      autoLogoutTimerRef.current = setTimeout(() => {
        setIsAuthenticated(false);
        setErrorMessage("Sesión cerrada automáticamente por inactividad de 15 minutos.");
      }, 15 * 60 * 1000);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      resetInactivityTimer();
    }
    return () => {
      if (autoLogoutTimerRef.current) clearTimeout(autoLogoutTimerRef.current);
    };
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const handleVerifyPin = async (e) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    setIsLoading(true);
    setErrorMessage("");

    const result = await verifyAdminCredentials(pinInput);
    setIsLoading(false);

    if (result.success) {
      setIsAuthenticated(true);
      setPinInput("");
      setErrorMessage("");
    } else {
      setErrorMessage(result.message || "Clave no autorizada.");
      if (result.isLocked) {
        setLockoutSeconds(result.remainingSeconds || 30);
      }
    }
  };

  const handleSaveSupporter = (e) => {
    e.preventDefault();
    const cleanName = sanitizeSecureText(name);
    if (!cleanName) return;

    resetInactivityTimer();

    const cleanLocation = sanitizeSecureText(location) || "Perú";
    const cleanMessage = sanitizeSecureText(message) || "Aporte voluntario verificado.";
    const cleanTier = sanitizeSecureText(amountOrTier) || "Colaborador Destacado";

    if (editingId) {
      // Edit existing
      const updated = supporters.map(s => {
        if (s.id === editingId) {
          return {
            ...s,
            name: cleanName,
            location: cleanLocation,
            countryFlag,
            method,
            message: cleanMessage,
            amountOrTier: cleanTier
          };
        }
        return s;
      });
      onUpdateSupporters(updated);
      setEditingId(null);
    } else {
      // Create new
      const newSupporter = {
        id: "sup-" + Date.now(),
        name: cleanName,
        location: cleanLocation,
        countryFlag: countryFlag || "🇵🇪",
        method,
        message: cleanMessage,
        amountOrTier: cleanTier,
        date: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      onUpdateSupporters([newSupporter, ...supporters]);
    }

    // Reset Form
    setName("");
    setLocation("Lima, Perú");
    setMessage("");
    setAmountOrTier("Colaborador Destacado");
  };

  const handleStartEdit = (supporter) => {
    resetInactivityTimer();
    setEditingId(supporter.id);
    setName(supporter.name);
    setLocation(supporter.location);
    setCountryFlag(supporter.countryFlag || "🇵🇪");
    setMethod(supporter.method || "Yape");
    setMessage(supporter.message || "");
    setAmountOrTier(supporter.amountOrTier || "Colaborador Destacado");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName("");
    setLocation("Lima, Perú");
    setMessage("");
  };

  const handleDelete = (id) => {
    resetInactivityTimer();
    if (window.confirm("¿Estás seguro de quitar a esta persona del muro de agradecimientos?")) {
      const updated = supporters.filter(s => s.id !== id);
      onUpdateSupporters(updated);
    }
  };

  const handleResetToDefault = () => {
    resetInactivityTimer();
    if (window.confirm("¿Deseas restaurar la lista oficial inicial de colaboradores verificados?")) {
      const initialOfficial = [
        {
          id: "sup-01",
          name: "Don Roberto Montenegro y Familia",
          location: "Lima, Perú",
          countryFlag: "🇵🇪",
          method: "Yape",
          amountOrTier: "Mecenas de Oro",
          message: "Aporte solidario para financiar la revisión de archivos del Caso Sheraton.",
          date: "Oct 2026"
        },
        {
          id: "sup-02",
          name: "Sra. Carmen Rosa Benavides",
          location: "Arequipa, Perú",
          countryFlag: "🇵🇪",
          method: "Plin",
          amountOrTier: "Patrocinador de Crónicas",
          message: "Gracias por investigar con tanto respeto el enigma del Cañón del Colca.",
          date: "Oct 2026"
        },
        {
          id: "sup-03",
          name: "Ing. Carlos T. Huamán",
          location: "Trujillo, Perú",
          countryFlag: "🇵🇪",
          method: "Dale",
          amountOrTier: "Colaborador Destacado",
          message: "Un saludo para todo el equipo de YouTube @XimeFer8322 y TikTok @epicclips_83.",
          date: "Oct 2026"
        },
        {
          id: "sup-04",
          name: "Comunidad de Seguidores en Santiago",
          location: "Santiago, Chile",
          countryFlag: "🇨🇱",
          method: "Yape",
          amountOrTier: "Benefactor Internacional",
          message: "Peruanos en el exterior apoyando las investigaciones de crónicas patrias.",
          date: "Oct 2026"
        }
      ];
      onUpdateSupporters(initialOfficial);
    }
  };

  const handleClearAll = () => {
    resetInactivityTimer();
    if (window.confirm("¿Deseas dejar la lista completamente vacía (0 personas)?")) {
      onUpdateSupporters([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-[#0f172a] border-2 border-amber-500/70 rounded-3xl w-full max-w-2xl p-5 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-700">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center shadow-lg shadow-amber-950/50 shrink-0">
            <Trophy className="w-6 h-6 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase font-bold text-amber-400 tracking-wider">
                BÓVEDA PROTEGIDA • GESTIÓN ADMIN
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400 inline" />
                <span>ANTI-TAMPER SHA-256</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Gestión del Cuadro de Agradecimientos
            </h2>
          </div>
        </div>

        {/* STEP 1: CRYPTOGRAPHIC AUTHENTICATION & RATE LIMITING */}
        {!isAuthenticated ? (
          <div className="py-7 space-y-5 max-w-md mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-slate-900 border-2 border-amber-500/60 flex items-center justify-center mx-auto text-amber-400 shadow-xl relative">
              <Lock className="w-8 h-8" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 border-2 border-slate-900 flex items-center justify-center text-white text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-bold text-white">
                Acceso Exclusivo del Administrador
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Ingresa tu clave maestra autorizada para acceder a la gestión del muro.
              </p>
            </div>

            <form onSubmit={handleVerifyPin} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    disabled={lockoutSeconds > 0 || isLoading}
                    value={pinInput}
                    onChange={(e) => {
                      setPinInput(e.target.value.replace(/\D/g, '')); // Solo dígitos numéricos
                      setErrorMessage("");
                    }}
                    placeholder={lockoutSeconds > 0 ? `Bloqueado (${lockoutSeconds}s)` : "••••••••••••"}
                    className="w-full text-center tracking-widest text-xl font-mono py-3.5 pl-10 pr-10 rounded-2xl bg-slate-950 border-2 border-slate-700 focus:border-amber-400 focus:outline-none text-white placeholder-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                    title={showPassword ? "Ocultar" : "Mostrar"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-700/80 text-xs text-red-300 font-bold flex items-center justify-center space-x-1.5 animate-in fade-in">
                    <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {lockoutSeconds > 0 && (
                  <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-600/80 text-xs text-amber-200 font-mono font-bold flex items-center justify-center space-x-2">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>Seguridad Anti-Fuerza Bruta Activa: espera {lockoutSeconds}s</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={lockoutSeconds > 0 || isLoading || !pinInput.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-950/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>Verificando Bóveda Criptográfica...</span>
                  </>
                ) : (
                  <span>Desbloquear Panel de Gestión</span>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <p className="flex items-center justify-center space-x-1 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Protección criptográfica SHA-256 + Rate-Limiting activo.</span>
              </p>
              <p className="text-slate-500">
                Las contraseñas no se almacenan en texto plano en el navegador.
              </p>
            </div>
          </div>
        ) : (
          /* STEP 2: MANAGEMENT INTERFACE */
          <div className="py-4 space-y-6">
            
            {/* Form to Add or Edit */}
            <form onSubmit={handleSaveSupporter} className="bg-slate-900/90 border-2 border-slate-700 rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{editingId ? "Editar Colaborador" : "Inscribir a una Persona para Agradecerle"}</span>
                </h3>
                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="text-xs text-slate-400 hover:text-white underline"
                  >
                    Cancelar edición
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                    Nombre o Seudónimo: *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Don Alberto Ramos, María Elena S..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                    Ciudad y País:
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={countryFlag}
                      onChange={(e) => setCountryFlag(e.target.value)}
                      className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2.5 text-sm text-white focus:outline-none"
                    >
                      <option value="🇵🇪">🇵🇪 Perú</option>
                      <option value="🇺🇸">🇺🇸 EE.UU.</option>
                      <option value="🇪🇸">🇪🇸 España</option>
                      <option value="🇨🇱">🇨🇱 Chile</option>
                      <option value="🇦🇷">🇦🇷 Argentina</option>
                      <option value="🇲🇽">🇲🇽 México</option>
                      <option value="🇨🇴">🇨🇴 Colombia</option>
                      <option value="🇮🇹">🇮🇹 Italia</option>
                      <option value="🌎">🌎 Otro</option>
                    </select>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Ej. Lima, Arequipa, Cusco..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                    Canal de Apoyo / Insignia:
                  </label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Yape">💜 Apoyo por Yape</option>
                    <option value="Plin">💙 Apoyo por Plin</option>
                    <option value="Dale">💚 Apoyo por Dale</option>
                    <option value="Mecenas">👑 Mecenas de Honor</option>
                    <option value="Investigador">🕵️ Aporte para Expedición</option>
                    <option value="YouTube">🔴 Miembro de YouTube</option>
                    <option value="TikTok">🎵 Seguidor Destacado TikTok</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                    Título Honorífico / Categoría:
                  </label>
                  <select
                    value={amountOrTier}
                    onChange={(e) => setAmountOrTier(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Colaborador Destacado">Colaborador Destacado</option>
                    <option value="Mecenas de Oro">Mecenas de Oro</option>
                    <option value="Patrocinador de Crónicas">Patrocinador de Crónicas</option>
                    <option value="Benefactor del Archivo">Benefactor del Archivo</option>
                    <option value="Aporte Voluntario Especial">Aporte Voluntario Especial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-slate-300 mb-1">
                  Dedicatoria o Mensaje de Agradecimiento:
                </label>
                <textarea
                  rows="2"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ej. Gracias por financiar la hemeroteca del Caso Villanueva Torres y apoyar la producción..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-amber-950/40 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{editingId ? "Guardar Cambios del Colaborador" : "Inscribir en la Ruleta de Agradecimientos"}</span>
              </button>
            </form>

            {/* List of Current Supporters in Roulette */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Personas Actualmente en la Ruleta ({supporters.length})</span>
                </h4>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleResetToDefault}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700 flex items-center space-x-1"
                    title="Restaurar ejemplos de prueba iniciales"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Ejemplos</span>
                  </button>

                  <button
                    onClick={handleClearAll}
                    className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-red-950 text-red-300 hover:bg-red-900 border border-red-800 flex items-center space-x-1"
                    title="Dejar vacío para empezar desde cero"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Vaciar Todo</span>
                  </button>
                </div>
              </div>

              {supporters.length === 0 ? (
                <div className="text-center py-8 bg-slate-900/60 border border-dashed border-slate-700 rounded-2xl">
                  <Heart className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-300 font-bold">
                    El muro está actualmente en cero (vacío).
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Usa el formulario superior para inscribir a la primera persona que colaboró voluntariamente por Yape, Plin o Dale.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {supporters.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-3 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{item.countryFlag || "🇵🇪"}</span>
                          <span className="font-extrabold text-white text-sm">{item.name}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-amber-950 text-amber-300 border border-amber-800">
                            {item.method} • {item.amountOrTier}
                          </span>
                        </div>
                        <p className="text-slate-300 italic">
                          "{item.message}"
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          {item.location} • {item.date || "2026"}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => handleStartEdit(item)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors"
                          title="Editar"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 transition-colors"
                          title="Quitar del muro"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Footer Controls */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Sesión activa protegida (Cierre automático en 15 min)</span>
              </span>
              <button
                onClick={() => setIsAuthenticated(false)}
                className="hover:text-amber-400 underline font-bold text-red-400 hover:text-red-300"
              >
                Cerrar Sesión Segura
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
