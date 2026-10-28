import React, { useState } from 'react';
import { 
  ShieldAlert, Radio, Search, Users, FileText, MapPin, Newspaper, 
  MessageSquare, Award, Send, Heart, Video, Smartphone, Sparkles, 
  Type, Menu, X, ChevronRight, UserCheck, Globe 
} from 'lucide-react';

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
    { id: 'expedientes', label: 'Expedientes', icon: FileText, count: 8 },
    { id: 'recomendaciones', label: 'Recomendar Historias', icon: Sparkles, highlight: true },
    { id: 'mapa', label: 'Mapa Perú', icon: MapPin },
    { id: 'noticias', label: 'Noticias', icon: Newspaper, count: 4 },
    { id: 'chat', label: 'Sala de Debate', icon: MessageSquare, badge: unreadChatCount > 0 ? unreadChatCount : null },
    { id: 'votacion', label: 'Votar Video', icon: Award },
    { id: 'buzon', label: 'Buzón Confidencial', icon: Send },
  ];

  const cycleFontSize = () => {
    if (fontScale === 'normal') setFontScale('large');
    else if (fontScale === 'large') setFontScale('xlarge');
    else setFontScale('normal');
  };

  const handleTabClick = (tabId) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0a0e18]/95 backdrop-blur-md border-b-2 border-slate-800 transition-all">
      
      {/* Top Bar: Official Channels, Voluntary Support & Font Adjuster */}
      <div className="bg-[#141b2b] border-b border-slate-800 px-3 sm:px-6 py-2 text-xs flex items-center justify-between gap-2 text-slate-200">
        
        {/* Official Channels Buttons */}
        <div className="flex items-center space-x-1.5 sm:space-x-3 overflow-x-auto py-0.5 scrollbar-none">
          <a
            href="https://www.youtube.com/@XimeFer8322"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-all shrink-0 text-[11px] sm:text-xs shadow-sm"
          >
            <Video className="w-3.5 h-3.5" />
            <span>YouTube <span className="hidden sm:inline">@XimeFer8322</span></span>
          </a>

          <a
            href="https://www.tiktok.com/@epicclips_83"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-slate-700 font-bold transition-all shrink-0 text-[11px] sm:text-xs shadow-sm"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span>TikTok <span className="hidden sm:inline">@epicclips_83</span></span>
          </a>
        </div>

        {/* Support & Font Accessibility */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <button
            onClick={onOpenSupport}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-[11px] sm:text-xs shadow-md shadow-red-950/50 transition-all"
            title="Apoyo voluntario por Yape, Plin o Dale al 916839878"
          >
            <Heart className="w-3.5 h-3.5 fill-white shrink-0" />
            <span className="hidden xs:inline">Apoyo</span>
            <span>Yape / Plin / Dale</span>
          </button>

          <button
            onClick={cycleFontSize}
            className="flex items-center space-x-1 px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-[11px] sm:text-xs font-bold transition-all"
            title="Ajustar tamaño de letra para leer mejor"
          >
            <Type className="w-3.5 h-3.5" />
            <span>{fontScale === 'normal' ? 'A' : fontScale === 'large' ? 'A+' : 'A++'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-3">
        
        {/* Brand */}
        <div 
          onClick={() => handleTabClick('expedientes')}
          className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-red-600 to-amber-700 flex items-center justify-center shadow-lg shadow-red-900/40 border border-red-500/40 group-hover:scale-105 transition-transform shrink-0">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-white font-mono group-hover:text-red-400 transition-colors">
                EXPEDIENTE<span className="text-red-500">.PE</span>
              </span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-800 font-bold">
                PERÚ
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium tracking-wide truncate max-w-[200px] sm:max-w-none">
              Historias Virales & Casos Reales
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1.5 overflow-x-auto py-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`relative px-3.5 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-all whitespace-nowrap text-xs sm:text-sm ${
                  isActive 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/80 border border-red-500' 
                    : item.highlight
                    ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border-2 border-amber-500/40'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.count && (
                  <span className={`text-[11px] font-mono px-2 py-0.2 rounded-full ${
                    isActive ? 'bg-red-900 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span className="w-5 h-5 text-[11px] rounded-full bg-red-600 text-white font-mono flex items-center justify-center animate-bounce">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right side: Mobile Menu Button & Seudónimo + País Badge */}
        <div className="flex items-center space-x-2">
          
          {/* Identity Pill (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={onOpenRegister}
              title="Haz clic para cambiar tu seudónimo y país de origen"
              className="flex items-center space-x-2 bg-[#121826] hover:bg-slate-800 border-2 border-slate-700 hover:border-red-500 px-3.5 py-1.5 rounded-xl transition-all"
            >
              <span className="text-xl">{userProfile?.flag || '🇵🇪'}</span>
              <div className="text-left font-mono">
                <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight">SEUDÓNIMO</p>
                <p className="text-xs text-amber-300 font-bold truncate max-w-[130px]">
                  {userProfile?.nickname ? `${userProfile.nickname} (${userProfile.country})` : 'Registrarme'}
                </p>
              </div>
            </button>
          </div>

          {/* Mobile Identity Button */}
          <button 
            onClick={onOpenRegister}
            className="lg:hidden text-xs bg-slate-800 border border-slate-700 px-2.5 py-1.5 rounded-xl flex items-center space-x-1.5 text-slate-200"
          >
            <span>{userProfile?.flag || '🇵🇪'}</span>
            <span className="font-bold truncate max-w-[100px]">
              {userProfile?.nickname || 'Identificarme'}
            </span>
          </button>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border-2 border-slate-700 text-white flex items-center justify-center transition-colors"
            aria-label="Abrir menú de secciones"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-red-400" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Horizontal Quick Tab Bar */}
      <div className="lg:hidden bg-[#0c101c] border-t border-slate-800/80 px-2 py-2 overflow-x-auto flex space-x-2 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shrink-0 transition-all ${
                isActive
                  ? 'bg-red-600 text-white shadow-md shadow-red-950 border border-red-500'
                  : item.highlight
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                  : 'bg-slate-900 text-slate-300 border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="w-4 h-4 text-[10px] rounded-full bg-red-600 text-white flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Fullscreen Drawer / Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[108px] bottom-0 z-50 bg-[#0a0e18]/98 backdrop-blur-lg p-5 overflow-y-auto space-y-4 border-t-2 border-red-500/40 animate-in slide-in-from-top-2 duration-200">
          
          {/* Identity Box in Mobile Menu */}
          <div 
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenRegister();
            }}
            className="bg-[#121826] border-2 border-slate-700 p-4 rounded-2xl flex items-center justify-between cursor-pointer hover:border-red-500 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{userProfile?.flag || '🇵🇪'}</span>
              <div>
                <p className="text-[10px] font-mono text-slate-400 uppercase font-bold">Tu Seudónimo y País</p>
                <p className="text-sm font-bold text-amber-300 font-mono">
                  {userProfile?.nickname ? `${userProfile.nickname} (${userProfile.country})` : 'Toca aquí para registrarte'}
                </p>
              </div>
            </div>
            <button
              className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-red-600 text-white"
            >
              Editar
            </button>
          </div>

          {/* Section Navigation Buttons */}
          <div className="space-y-2">
            <p className="text-xs font-mono uppercase text-slate-400 font-bold px-1">
              Selecciona una Sección
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`w-full p-4 rounded-2xl text-left font-bold flex items-center justify-between transition-all border-2 ${
                    isActive
                      ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-950'
                      : item.highlight
                      ? 'bg-amber-950/40 text-amber-200 border-amber-600/60'
                      : 'bg-[#121826] text-slate-200 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-amber-400" />
                    <span className="text-base">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
              );
            })}
          </div>

          {/* Support in Mobile Drawer */}
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSupport();
              }}
              className="w-full py-4 px-4 bg-gradient-to-r from-red-600 via-amber-600 to-emerald-600 text-white font-extrabold text-base rounded-2xl shadow-xl flex items-center justify-center space-x-2"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Apoyo Voluntario (Yape / Plin / Dale)</span>
            </button>
          </div>

        </div>
      )}

    </header>
  );
}
