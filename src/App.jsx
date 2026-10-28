import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CaseCard from './components/CaseCard';
import CaseDetailModal from './components/CaseDetailModal';
import LiveDetectiveChat from './components/LiveDetectiveChat';
import PeruMapInteractive from './components/PeruMapInteractive';
import NewsSection from './components/NewsSection';
import WhistleblowerBox from './components/WhistleblowerBox';
import CommunityVote from './components/CommunityVote';
import StoryRecommendations from './components/StoryRecommendations';
import SupportModal from './components/SupportModal';
import UserRegisterModal from './components/UserRegisterModal';
import GratitudeRoulette from './components/GratitudeRoulette';
import AdminGratitudeModal from './components/AdminGratitudeModal';
import { initialCases, initialNews } from './data/casesData';
import { 
  Search, Filter, ShieldAlert, Sparkles, MapPin, Flame, MessageSquare, 
  HelpCircle, ExternalLink, Radio, CheckCircle2, Heart, Video, Smartphone,
  UserCheck 
} from 'lucide-react';

export default function App() {
  // Current active tab: 'expedientes' | 'recomendaciones' | 'mapa' | 'noticias' | 'chat' | 'votacion' | 'buzon'
  const [currentTab, setCurrentTab] = useState('expedientes');

  // Font scale accessibility for older adults: 'normal' | 'large' | 'xlarge'
  const [fontScale, setFontScale] = useState(() => {
    return localStorage.getItem('expediente_font_scale') || 'large';
  });

  useEffect(() => {
    localStorage.setItem('expediente_font_scale', fontScale);
    document.documentElement.classList.remove('font-normal', 'font-large', 'font-xlarge');
    document.documentElement.classList.add(`font-${fontScale}`);
  }, [fontScale]);

  // Support Modal State
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // User Profile (Seudónimo y País)
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('expediente_user_profile_v3');
    return saved ? JSON.parse(saved) : null;
  });

  const [isRegisterOpen, setIsRegisterOpen] = useState(() => {
    // If not registered yet, show modal on first visit
    return !localStorage.getItem('expediente_user_profile_v3');
  });

  const handleSaveProfile = (profile) => {
    setUserProfile(profile);
    localStorage.setItem('expediente_user_profile_v3', JSON.stringify(profile));
  };

  // Cases state: strictly real documented investigations with 0 starting comments
  const [cases, setCases] = useState(() => {
    const saved = localStorage.getItem('expediente_cases_real_v5');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Exclude any obsolete non-verified cases (like matusita or momias)
        const filtered = parsed.filter(c => c.id !== "caso-006-old");
        const existingIds = new Set(filtered.map(c => c.id));
        const merged = [...filtered];
        for (const item of initialCases) {
          if (!existingIds.has(item.id)) {
            merged.push(item);
          }
        }
        return merged;
      } catch (e) {
        return initialCases;
      }
    }
    return initialCases;
  });

  useEffect(() => {
    localStorage.setItem('expediente_cases_real_v5', JSON.stringify(cases));
  }, [cases]);

  // News state: strictly real documented investigations with 0 starting comments
  const [news, setNews] = useState(() => {
    const saved = localStorage.getItem('expediente_news_real_v5');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialNews;
      }
    }
    return initialNews;
  });

  useEffect(() => {
    localStorage.setItem('expediente_news_real_v5', JSON.stringify(news));
  }, [news]);

  // Admin-managed Gratitude Roulette (Cuadro de Honor de Colaboradores)
  const [isAdminGratitudeOpen, setIsAdminGratitudeOpen] = useState(false);
  const [supporters, setSupporters] = useState(() => {
    const saved = localStorage.getItem('expediente_admin_supporters_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
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
  });

  const handleUpdateSupporters = (newList) => {
    setSupporters(newList);
    localStorage.setItem('expediente_admin_supporters_v1', JSON.stringify(newList));
  };

  // Modal active case
  const [selectedCase, setSelectedCase] = useState(null);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedRegion, setSelectedRegion] = useState('todas');

  // Handle adding comments/theories to a case
  const handleAddCaseComment = (caseId, newComment) => {
    const updated = cases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          comments: [
            { id: "c-" + Date.now(), ...newComment },
            ...(c.comments || [])
          ]
        };
      }
      return c;
    });

    setCases(updated);

    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase(updated.find(c => c.id === caseId));
    }
  };

  // Handle voting on case comment
  const handleVoteCaseComment = (caseId, commentId, direction) => {
    const updated = cases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          comments: (c.comments || []).map(comm => {
            if (comm.id === commentId) {
              return {
                ...comm,
                upvotes: direction === 'up' ? comm.upvotes + 1 : comm.upvotes,
                downvotes: direction === 'down' ? comm.downvotes + 1 : comm.downvotes,
              };
            }
            return comm;
          })
        };
      }
      return c;
    });

    setCases(updated);
    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase(updated.find(c => c.id === caseId));
    }
  };

  // Handle adding comment to news item
  const handleAddNewsComment = (newsId, newComment) => {
    const updated = news.map(n => {
      if (n.id === newsId) {
        return {
          ...n,
          comments: [newComment, ...(n.comments || [])]
        };
      }
      return n;
    });
    setNews(updated);
  };

  // Open case modal by ID (used by map)
  const handleSelectCaseById = (id) => {
    const found = cases.find(c => c.id === id);
    if (found) {
      setSelectedCase(found);
    }
  };

  // Filtered cases
  const filteredCases = cases.filter(c => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.synopsis.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = selectedCategory === 'todas' || c.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesRegion = selectedRegion === 'todas' || c.region.toLowerCase().includes(selectedRegion.toLowerCase());

    return matchesSearch && matchesCat && matchesRegion;
  });

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-red-900 selection:text-white">
      
      {/* Header */}
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        userProfile={userProfile}
        onOpenRegister={() => setIsRegisterOpen(true)}
        unreadChatCount={0}
        onOpenSupport={() => setIsSupportOpen(true)}
        fontScale={fontScale}
        setFontScale={setFontScale}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* User Identity Welcome Banner (if registered) */}
        {userProfile && (
          <div className="mb-5 bg-[#101624] border border-slate-800 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="text-xl">{userProfile.flag}</span>
              <span>Conectado como: <strong className="text-white">{userProfile.nickname}</strong> ({userProfile.country})</span>
            </div>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="text-xs font-mono text-amber-400 hover:underline"
            >
              Cambiar seudónimo/país
            </button>
          </div>
        )}

        {/* TAB 1: EXPEDIENTES (CASOS REALES) */}
        {currentTab === 'expedientes' && (
          <div className="space-y-6">
            
            {/* Friendly Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-gradient-to-r from-red-950/60 via-[#111724] to-[#0d121c] p-6 sm:p-8 shadow-2xl">
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950 text-red-300 border border-red-700 text-xs font-mono font-bold">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>COMUNIDAD OFICIAL • YOUTUBE @XimeFer8322 & TIKTOK @epicclips_83</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Archivos & Casos Virales del <span className="text-red-500">Perú Real</span>
                </h1>

                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  Bienvenido a la comunidad oficial. Revisa los expedientes reales con documentos de hemeroteca, comparte tus teorías con tu seudónimo y país, y sugiere nuevas historias para los canales de YouTube y TikTok.
                </p>

                {/* Primary Action Buttons */}
                <div className="pt-3 flex flex-wrap gap-3 text-xs sm:text-sm font-bold">
                  <button 
                    onClick={() => setCurrentTab('recomendaciones')}
                    className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold flex items-center space-x-2 shadow-lg shadow-amber-950/40 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Recomendar Caso para YouTube / TikTok</span>
                  </button>

                  <button 
                    onClick={() => setIsSupportOpen(true)}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white flex items-center space-x-2 shadow-lg shadow-red-950 transition-colors"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Apoyo Voluntario (Yape / Plin / Dale)</span>
                  </button>
                </div>
              </div>

              {/* Decorative Seal */}
              <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 opacity-25 pointer-events-none rotate-12">
                <div className="w-44 h-44 rounded-full border-4 border-dashed border-red-500 flex flex-col items-center justify-center p-4 text-center font-mono text-xs text-red-300 font-bold uppercase">
                  <span>CASOS REALES</span>
                  <span className="text-2xl font-black">PERÚ</span>
                  <span>HISTORIAS</span>
                </div>
              </div>
            </div>

            {/* Continuously Rolling Gratitude Roulette (Cuadro de Honor) */}
            <GratitudeRoulette 
              supporters={supporters}
              onOpenAdmin={() => setIsAdminGratitudeOpen(true)}
            />

            {/* Filters & Search */}
            <div className="bg-[#101522] border-2 border-slate-700 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm font-mono">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar caso, región o palabra clave..."
                  className="w-full bg-[#0a0d14] border-2 border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-white placeholder-slate-400 focus:outline-none focus:border-red-500 text-sm font-sans"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
                <span className="text-slate-300 font-bold hidden lg:inline">Categoría:</span>
                {[
                  { id: 'todas', label: 'Todos' },
                  { id: 'injusticia provincial', label: '⚖️ Injusticia en Provincia' },
                  { id: 'crónica policial', label: 'Crónica Policial' },
                  { id: 'misterio urbano', label: 'Misterio Urbano' },
                  { id: 'viral reciente', label: 'Viral Redes' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Cases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCases.map(item => (
                <CaseCard 
                  key={item.id} 
                  caseItem={item} 
                  onOpenDetail={setSelectedCase} 
                />
              ))}
            </div>

            {filteredCases.length === 0 && (
              <div className="text-center py-12 bg-[#0e1320] border-2 border-slate-800 rounded-2xl">
                <p className="text-base text-slate-300 font-sans">
                  No se encontraron casos bajo ese criterio de búsqueda.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('todas'); }}
                  className="mt-3 text-sm text-amber-400 hover:underline font-bold"
                >
                  Ver todos los casos
                </button>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: RECOMENDACIONES DE HISTORIAS (CONTANDO DESDE CERO) */}
        {currentTab === 'recomendaciones' && (
          <StoryRecommendations 
            userProfile={userProfile}
            onOpenRegister={() => setIsRegisterOpen(true)}
            onNavigateTab={setCurrentTab}
          />
        )}

        {/* TAB 3: MAPA INTERACTIVO */}
        {currentTab === 'mapa' && (
          <PeruMapInteractive onSelectCaseById={handleSelectCaseById} />
        )}

        {/* TAB 4: NOTICIAS & PRIMICIAS */}
        {currentTab === 'noticias' && (
          <NewsSection 
            newsList={news} 
            onAddNewsComment={handleAddNewsComment}
            userProfile={userProfile}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}

        {/* TAB 5: CHAT EN VIVO DE DETECTIVES */}
        {currentTab === 'chat' && (
          <LiveDetectiveChat 
            userProfile={userProfile}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}

        {/* TAB 6: VOTACIÓN DE CASOS */}
        {currentTab === 'votacion' && (
          <CommunityVote userAlias={userProfile?.nickname || 'Seguidor'} />
        )}

        {/* TAB 7: BUZÓN CONFIDENCIAL */}
        {currentTab === 'buzon' && (
          <WhistleblowerBox 
            userProfile={userProfile}
            onOpenRegister={() => setIsRegisterOpen(true)}
          />
        )}

      </main>

      {/* Case Detail Modal */}
      {selectedCase && (
        <CaseDetailModal
          caseItem={selectedCase}
          onClose={() => setSelectedCase(null)}
          onAddComment={handleAddCaseComment}
          onVoteComment={handleVoteCaseComment}
          userProfile={userProfile}
          onOpenRegister={() => setIsRegisterOpen(true)}
          onOpenSupport={() => setIsSupportOpen(true)}
        />
      )}

      {/* User Register Modal (Seudónimo y País) */}
      <UserRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSave={handleSaveProfile}
        currentProfile={userProfile}
      />

      {/* Voluntary Support Modal (Yape / Plin / Dale) */}
      <SupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />

      {/* Admin Gratitude Management Modal (Exclusivo Administrador) */}
      <AdminGratitudeModal
        isOpen={isAdminGratitudeOpen}
        onClose={() => setIsAdminGratitudeOpen(false)}
        supporters={supporters}
        onUpdateSupporters={handleUpdateSupporters}
      />

      {/* Clean Official Footer */}
      <footer className="bg-[#070a10] border-t-2 border-slate-800 py-10 px-4 text-xs sm:text-sm text-slate-300 mt-14">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800 text-center md:text-left">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <span className="font-extrabold text-base text-white tracking-wider">EXPEDIENTE PERÚ</span>
              </div>
              <p className="text-xs text-slate-400">
                Canal dedicado a la difusión y análisis respetuoso de historias virales, testimonios y misterios reales del Perú.
              </p>
            </div>

            {/* Official Channel Links */}
            <div className="flex flex-wrap justify-center items-center gap-3">
              <a
                href="https://www.youtube.com/@XimeFer8322"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold flex items-center space-x-2 shadow-md shadow-red-950 transition-colors"
              >
                <Video className="w-4 h-4" />
                <span>YouTube: @XimeFer8322</span>
              </a>

              <a
                href="https://www.tiktok.com/@epicclips_83"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border-2 border-slate-700 text-cyan-300 rounded-xl font-bold flex items-center space-x-2 transition-colors"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>TikTok: @epicclips_83</span>
              </a>

              <button
                onClick={() => setIsSupportOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-800 to-emerald-800 hover:opacity-90 text-white rounded-xl font-bold flex items-center space-x-1.5 transition-all shadow-md"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Apoyo Voluntario (Yape / Plin / Dale)</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center">
            <p>
              © 2026 Expediente Perú • Conducido por @XimeFer8322 y @epicclips_83. Todos los derechos reservados.
            </p>
            <p className="text-slate-400 font-mono">
              Diseñado con accesibilidad visual y tipografía optimizada para lectura amigable.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
