import React, { useState } from 'react';
import { 
  ShieldAlert, Radio, Search, Users, FileText, MapPin, Newspaper, 
  MessageSquare, Award, Send, Heart, Video, Smartphone, Sparkles, 
  Type, Menu, X, ChevronRight, UserCheck, Globe, HelpCircle 
} from 'lucide-react';
import CountryFlag from './CountryFlag';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  userProfile, 
  onOpenRegister,
  unreadChatCount,
  onOpenSupport,
  fontScale,
  setFontScale
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'expedientes', label: 'Expedientes Reales', icon: FileText, count: 8 },
    { id: 'recomendaciones', label: 'Recomendar Historias', icon: Sparkles, highlight: true },
    { id: 'mapa', label: 'Mapa del Perú', icon: MapPin },
    { id: 'noticias', label: 'Noticias & Primicias', icon: Newspaper, count: 4 },
    { id: 'chat', label: 'Sala de Debate', icon: MessageSquare, badge: unreadChatCount > 0 ? unreadChatCount : null },
    { id: 'votacion', label: 'Votar Video', icon: Award },
    { id: 'buzon', label: 'Buzón Confidencial', icon: Send },
  ];

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080d18]/98 backdrop-blur-md border-b-2 border-slate-700 shadow-2xl transition-all">
      
      {/* 1. BARRA SUPERIOR DE AYUDA VISUAL, CANALES Y DONACIONES */}
      <div className="bg-[#101726] border-b border-slate-700 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Canales Oficiales para Seguidores */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden sm:inline font-bold text-slate-300">Canales Oficiales:</span>
          <a
            href="https://www.youtube.com/@XimeFer8322"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black transition-all text-xs shadow-md shadow-red-950 shrink-0"
            title="Abrir canal oficial de YouTube @XimeFer8322"
          >
            <Video className="w-4 h-4 shrink-0" />
            <span>YouTube <span className="hidden md:inline">@XimeFer8322</span></span>
          </a>

          <a
            href="https://www.tiktok.com/@epicclips_83"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-600 font-black transition-all text-xs shadow-sm shrink-0"
            title="Abrir canal oficial de TikTok @epicclips_83"
          >
            <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>TikTok <span className="hidden md:inline">@epicclips_83</span></span>
          </a>
        </div>

        {/* CONTROLES DE ACCESIBILIDAD Y TAMAÑO DE LETRA (Amigable para Adultos Mayores) */}
        <div className="flex items-center gap-2.5 shrink-0 ml-auto">
          
          {/* Selector Explícito de Tamaño de Letra */}
          <div className="flex items-center bg-[#070b14] border-2 border-amber-500/70 rounded-xl p-1 shadow-inner shrink-0">
            <span className="hidden lg:flex items-center text-[11px] font-bold text-amber-300 px-2 select-none shrink-0">
              <Type className="w-3.5 h-3.5 mr-1 text-amber-400 shrink-0" />
              Tamaño de Letra:
            </span>
            <button
              onClick={() => setFontScale('normal')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                fontScale === 'normal'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Tamaño de letra estándar"
            >
              Normal
            </button>
            <button
              onClick={() => setFontScale('large')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                fontScale === 'large'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Tamaño de letra grande para lectura descansada"
            >
              Grande (A+)
            </button>
            <button
              onClick={() => setFontScale('xlarge')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                fontScale === 'xlarge'
                  ? 'bg-amber-400 text-slate-950 font-black shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Tamaño de letra muy grande para lectura sin forzar la vista"
            >
              Muy Grande (A++)
            </button>
          </div>

          {/* Botón de Apoyo Voluntario */}
          <button
            onClick={onOpenSupport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-xs shadow-md shadow-red-950/60 transition-all border border-red-400/50 shrink-0"
            title="Apoyo voluntario por Yape, Plin o Dale al 916839878"
          >
            <Heart className="w-4 h-4 fill-white shrink-0" />
            <span>Apoyar (Yape / Plin)</span>
          </button>
        </div>
      </div>

      {/* 2. BARRA PRINCIPAL: LOGOTIPO & IDENTIDAD */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        
        {/* Logotipo y Título de la Plataforma */}
        <div 
          onClick={() => handleTabClick('expedientes')}
          className="flex items-center gap-3.5 cursor-pointer group select-none shrink-0"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-amber-600 flex items-center justify-center shadow-lg shadow-red-950/60 border-2 border-red-400/50 group-hover:scale-105 transition-transform shrink-0">
            <ShieldAlert className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl sm:text-2xl tracking-tight text-white font-mono group-hover:text-red-400 transition-colors">
                EXPEDIENTE<span className="text-red-500 font-extrabold">.PE</span>
              </span>
              <span className="text-[10px] sm:text-xs font-mono uppercase px-2 py-0.5 rounded-md bg-red-950 text-red-200 border border-red-600 font-extrabold">
                PERÚ OFICIAL
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
              Investigaciones Periodísticas • Casos del Perú & del Mundo
            </p>
          </div>
        </div>

        {/* Lado Derecho: Identidad y Menú Móvil */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Botón de Seudónimo con Bandera Real Nítida */}
          <button
            onClick={onOpenRegister}
            title="Toca para cambiar o ver tu seudónimo y país de origen"
            className="flex items-center gap-3 bg-[#121927] hover:bg-slate-800 border-2 border-slate-600 hover:border-amber-400 px-4 py-2 rounded-xl transition-all shadow-md touch-target shrink-0"
          >
            <CountryFlag country={userProfile?.country || 'Perú'} flag={userProfile?.flag} className="w-6 h-4" />
            <div className="text-left font-sans">
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight font-mono">MI SEUDÓNIMO</p>
              <p className="text-xs sm:text-sm text-amber-300 font-extrabold truncate max-w-[150px]">
                {userProfile?.nickname ? userProfile.nickname : 'Identificarme'}
              </p>
            </div>
          </button>

          {/* Botón Móvil de Menú en Pantallas Pequeñas */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-600 text-white flex items-center gap-2 transition-colors touch-target shadow-md shrink-0"
            aria-label="Abrir menú de secciones"
          >
            {mobileMenuOpen ? <X className="w-6 h-6 text-red-400" /> : <Menu className="w-6 h-6 text-amber-400" />}
            <span className="text-xs font-bold font-mono">MENÚ</span>
          </button>
        </div>

      </div>

      {/* 3. FILA DEDICADA DE PESTAÑAS DE NAVEGACIÓN (NUNCA SE PEGAN NI SE APLASTAN) */}
      <nav className="bg-[#0b101d] border-t border-slate-800/90 shadow-inner">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center gap-2.5 overflow-x-auto scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`shrink-0 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap text-xs sm:text-sm touch-target border-2 select-none ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950 border-red-400 font-black' 
                    : item.highlight
                    ? 'bg-amber-500/15 text-amber-200 hover:bg-amber-500/25 border-amber-500/70 hover:border-amber-400'
                    : 'bg-[#121927] text-slate-200 hover:text-white hover:bg-slate-800 border-slate-700 hover:border-slate-500'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-300'}`} />
                <span className="tracking-wide">{item.label}</span>
                {item.count && (
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    isActive ? 'bg-red-950 text-white border border-red-400' : 'bg-slate-800 text-slate-200 border border-slate-600'
                  }`}>
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className="w-5 h-5 text-xs rounded-full bg-red-600 text-white font-mono flex items-center justify-center animate-bounce shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. MENÚ DESPLEGABLE COMPLETO PARA MÓVILES */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[125px] bottom-0 z-50 bg-[#090d18]/98 backdrop-blur-xl p-5 overflow-y-auto space-y-4 border-t-2 border-red-500/60 animate-in slide-in-from-top-2 duration-200">
          
          {/* Identidad en Menú Móvil */}
          <div 
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRegister();
            }}
            className="bg-[#121927] border-2 border-slate-600 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:border-amber-400 transition-colors shadow-lg"
          >
            <div className="flex items-center gap-3">
              <CountryFlag country={userProfile?.country || 'Perú'} flag={userProfile?.flag} className="w-8 h-5" />
              <div>
                <p className="text-xs font-mono text-slate-400 uppercase font-bold">Tu Seudónimo y País</p>
                <p className="text-base font-extrabold text-amber-300">
                  {userProfile?.nickname ? `${userProfile.nickname} (${userProfile.country})` : 'Toca aquí para ingresar tu seudónimo'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-mono">
              Cambiar
            </span>
          </div>

          {/* Botones de Secciones del Menú */}
          <div className="space-y-2.5">
            <p className="text-xs font-mono uppercase text-amber-400 font-bold px-1">
              Selecciona a dónde deseas ir:
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full p-4 rounded-2xl text-left font-bold flex items-center justify-between transition-all border-2 touch-target ${
                    isActive
                      ? 'bg-red-600 text-white border-red-400 shadow-xl shadow-red-950'
                      : item.highlight
                      ? 'bg-amber-950/40 text-amber-200 border-amber-600/70'
                      : 'bg-[#121927] text-slate-100 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <Icon className="w-6 h-6 text-amber-400 shrink-0" />
                    <span className="text-base sm:text-lg">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                </button>
              );
            })}
          </div>

          {/* Botón de Apoyo Voluntario en Menú Móvil */}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSupport();
              }}
              className="w-full py-4 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-extrabold text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 border-2 border-red-400/50"
            >
              <Heart className="w-5 h-5 fill-white shrink-0" />
              <span>Apoyo Voluntario al Canal (Yape / Plin / Dale)</span>
            </button>
          </div>

        </div>
      )}

    </header>
  );
}
