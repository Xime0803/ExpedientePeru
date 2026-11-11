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
import OnlineUsersBox from './components/OnlineUsersBox';
import CountryFlag from './components/CountryFlag';
import { initialCases, initialNews } from './data/casesData';
import { 
  fetchSupporters, 
  syncAllSupportersToCloud, 
  subscribeSupporters, 
  fetchAllCaseComments, 
  addCaseCommentToDb, 
  voteCaseCommentInDb, 
  subscribeCaseComments,
  recordVisitorToDb,
  getDeviceInfo,
  getFormattedPeruDateTime
} from './services/dbService';
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

    // Registrar ingreso del usuario con su nuevo seudónimo
    const { device, browser } = getDeviceInfo();
    const updatedVisit = {
      id: "vis-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      visitorAlias: `@${profile.nickname}`,
      country: profile.country || "Perú",
      flag: profile.flag || "🇵🇪",
      device,
      browser,
      formattedDate: getFormattedPeruDateTime(new Date()),
      createdAt: new Date().toISOString()
    };
    recordVisitorToDb(updatedVisit);
  };

  // REGISTRO DE VISITANTES CON FECHA Y HORA DE INGRESO
  useEffect(() => {
    const sessionKey = 'expediente_visit_session_active';
    const isSessionLogged = sessionStorage.getItem(sessionKey);
    
    if (!isSessionLogged) {
      const { device, browser } = getDeviceInfo();
      const visitData = {
        id: "vis-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
        visitorAlias: userProfile?.nickname ? `@${userProfile.nickname}` : ("Visitante #" + Math.floor(1000 + Math.random() * 9000)),
        country: userProfile?.country || "Perú",
        flag: userProfile?.flag || "🇵🇪",
        device,
        browser,
        formattedDate: getFormattedPeruDateTime(new Date()),
        createdAt: new Date().toISOString()
      };

      recordVisitorToDb(visitData);
      sessionStorage.setItem(sessionKey, visitData.id);
    }
  }, []);

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

  // Sincronización en la Nube con Supabase (Colaboradores y Comentarios de Expedientes)
  useEffect(() => {
    // 1. Cargar colaboradores desde Supabase en la nube
    fetchSupporters().then(cloudSupporters => {
      if (cloudSupporters && cloudSupporters.length > 0) {
        setSupporters(cloudSupporters);
      }
    });

    // Suscribirse a cambios en vivo de colaboradores (reflejo instantáneo en todos los dispositivos)
    const unsubSupporters = subscribeSupporters((updatedList) => {
      if (updatedList && updatedList.length > 0) {
        setSupporters(updatedList);
      }
    });

    // 2. Cargar comentarios de expedientes desde Supabase
    fetchAllCaseComments().then(comments => {
      if (comments && comments.length > 0) {
        setCases(prevCases => {
          return prevCases.map(c => {
            const caseComments = comments.filter(comm => comm.caseId === c.id);
            if (caseComments.length > 0) {
              return { ...c, comments: caseComments };
            }
            return c;
          });
        });
      }
    });

    // Suscribirse a nuevos comentarios en tiempo real
    const unsubComments = subscribeCaseComments((comments) => {
      if (comments && comments.length > 0) {
        setCases(prevCases => {
          return prevCases.map(c => {
            const caseComments = comments.filter(comm => comm.caseId === c.id);
            return { ...c, comments: caseComments };
          });
        });
      }
    });

    return () => {
      if (typeof unsubSupporters === 'function') unsubSupporters();
      if (typeof unsubComments === 'function') unsubComments();
    };
  }, []);

  const handleUpdateSupporters = (newList) => {
    setSupporters(newList);
    localStorage.setItem('expediente_admin_supporters_v1', JSON.stringify(newList));
    // Sincronizar inmediatamente a la nube de Supabase para que todos los dispositivos lo vean
    syncAllSupportersToCloud(newList);
  };

  // Modal active case
  const [selectedCase, setSelectedCase] = useState(null);

  // Search & filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedRegion, setSelectedRegion] = useState('todas');

  // Handle adding comments/theories to a case
  const handleAddCaseComment = (caseId, newComment) => {
    const fullComment = { id: "c-" + Date.now(), ...newComment };
    const updated = cases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          comments: [
            fullComment,
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

    // Guardar en la base de datos de Supabase en la nube
    addCaseCommentToDb(caseId, fullComment);
  };

  // Handle voting on case comment
  const handleVoteCaseComment = (caseId, commentId, direction) => {
    let targetUp = 0;
    let targetDown = 0;

    const updated = cases.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          comments: (c.comments || []).map(comm => {
            if (comm.id === commentId) {
              targetUp = direction === 'up' ? (comm.upvotes || 0) + 1 : (comm.upvotes || 0);
              targetDown = direction === 'down' ? (comm.downvotes || 0) + 1 : (comm.downvotes || 0);
              return {
                ...comm,
                upvotes: targetUp,
                downvotes: targetDown,
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

    // Persistir voto en Supabase en la nube
    voteCaseCommentInDb(commentId, targetUp, targetDown);
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
          <div className="mb-6 bg-[#121927] border-2 border-slate-700 px-5 py-3.5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm sm:text-base shadow-md">
            <div className="flex items-center space-x-3 text-slate-200">
              <CountryFlag country={userProfile.country} flag={userProfile.flag} className="w-7 h-5" />
              <span>
                Conectado como: <strong className="text-white font-extrabold text-base sm:text-lg">@{userProfile.nickname}</strong> <span className="text-slate-400">({userProfile.country})</span>
              </span>
            </div>
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="text-xs sm:text-sm font-bold text-amber-300 hover:text-amber-200 underline decoration-amber-500/60 underline-offset-4 py-1"
            >
              Cambiar mi seudónimo o país ✏️
            </button>
          </div>
        )}

        {/* TAB 1: EXPEDIENTES (CASOS REALES) */}
        {currentTab === 'expedientes' && (
          <div className="space-y-8">
            
            {/* Friendly Senior-Optimized Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-slate-600 bg-gradient-to-br from-red-950/70 via-[#131b2c] to-[#0c121e] p-6 sm:p-8 lg:p-10 shadow-2xl">
              <div className="max-w-4xl space-y-4">
                
                {/* Official Community Badge */}
                <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-950 text-red-200 border-2 border-red-700 text-xs sm:text-sm font-bold">
                  <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>COMUNIDAD OFICIAL • YOUTUBE @XimeFer8322 & TIKTOK @epicclips_83</span>
                </div>

                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Archivos & Crónicas Reales del <span className="text-red-500">Perú</span>
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-slate-200 leading-relaxed max-w-3xl font-medium">
                  Bienvenido a este espacio de lectura, memoria y análisis respetuoso de sucesos históricos del Perú. Aquí podrás leer cada investigación con letra clara y grande, compartir tus recuerdos de aquellos años y proponer qué historia grabaremos en video.
                </p>

                {/* 3-Step Reading Guide for Seniors */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 pb-2">
                  <div className="bg-[#0b101c]/90 border border-slate-700 rounded-xl p-3.5 flex items-start space-x-3">
                    <span className="text-2xl shrink-0">📖</span>
                    <div>
                      <p className="text-sm font-extrabold text-white">1. Elige una Historia</p>
                      <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                        Toca el botón <strong>«Leer Expediente»</strong> en cualquier recuadro.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#0b101c]/90 border border-slate-700 rounded-xl p-3.5 flex items-start space-x-3">
                    <span className="text-2xl shrink-0">💬</span>
                    <div>
                      <p className="text-sm font-extrabold text-white">2. Comparte tus Recuerdos</p>
                      <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                        Escribe tus testimonios o teorías con tu seudónimo seguro.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#0b101c]/90 border border-slate-700 rounded-xl p-3.5 flex items-start space-x-3">
                    <span className="text-2xl shrink-0">🗳️</span>
                    <div>
                      <p className="text-sm font-extrabold text-white">3. Ayúdanos a Grabar</p>
                      <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                        Vota las historias para que salgan en YouTube y TikTok.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-wrap gap-4 text-sm sm:text-base font-extrabold">
                  <button 
                    onClick={() => setCurrentTab('recomendaciones')}
                    className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center space-x-2.5 shadow-xl shadow-amber-950/50 transition-all border-2 border-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-400/50"
                  >
                    <Sparkles className="w-5 h-5 text-slate-950 shrink-0" />
                    <span>Recomendar Caso para YouTube / TikTok</span>
                  </button>

                  <button 
                    onClick={() => setIsSupportOpen(true)}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white flex items-center space-x-2.5 shadow-xl shadow-red-950 transition-all border-2 border-red-400 focus:outline-none focus:ring-4 focus:ring-red-500/50"
                  >
                    <Heart className="w-5 h-5 fill-white shrink-0" />
                    <span>Apoyo Voluntario (Yape / Plin / Dale)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Continuously Rolling Gratitude Roulette (Cuadro de Honor) */}
            <GratitudeRoulette 
              supporters={supporters}
              onOpenAdmin={() => setIsAdminGratitudeOpen(true)}
            />

            {/* Filters & Search - Senior Friendly */}
            <div className="bg-[#121927] border-2 border-slate-600 rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Search Input */}
                <div className="flex-1 relative">
                  <label htmlFor="search-cases" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    🔍 Buscador de Historias & Regiones:
                  </label>
                  <div className="relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="search-cases"
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Escribe el nombre de un caso, ciudad (ej. Arequipa, Lima, Cusco)..."
                      className="w-full bg-[#0a0f1a] border-2 border-slate-600 focus:border-red-500 rounded-xl pl-12 pr-12 py-3 text-white placeholder-slate-400 focus:outline-none text-base sm:text-lg font-medium transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-600 font-bold"
                        title="Borrar búsqueda"
                      >
                        ✕ Borrar
                      </button>
                    )}
                  </div>
                </div>

                {/* Counter */}
                <div className="shrink-0 text-sm font-bold text-slate-300 bg-[#0b101c] px-4 py-3 rounded-xl border border-slate-700 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  <span>{filteredCases.length} {filteredCases.length === 1 ? 'historia disponible' : 'historias disponibles'}</span>
                </div>
              </div>

              {/* Category Filter Buttons */}
              <div className="pt-2 border-t border-slate-700/80">
                <p className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  Filtrar por Tema o Categoría:
                </p>
                <div className="flex flex-wrap items-center gap-2.5">
                  {[
                    { id: 'todas', label: 'Todos los Temas' },
                    { id: 'injusticia provincial', label: '⚖️ Injusticia en Provincia' },
                    { id: 'crónica policial', label: '🚔 Crónica Policial' },
                    { id: 'misterio urbano', label: '🏛️ Misterio Histórico' },
                    { id: 'viral reciente', label: '📱 Viral en Redes' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all border-2 ${
                        selectedCategory === cat.id
                          ? 'bg-red-600 border-red-400 text-white shadow-md'
                          : 'bg-[#0a0f1a] text-slate-300 hover:text-white border-slate-700 hover:border-slate-500'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Cases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredCases.map(item => (
                <CaseCard 
                  key={item.id} 
                  caseItem={item} 
                  onOpenDetail={setSelectedCase} 
                  onOpenSupport={() => setIsSupportOpen(true)}
                />
              ))}
            </div>

            {filteredCases.length === 0 && (
              <div className="text-center py-16 bg-[#121927] border-2 border-slate-700 rounded-2xl p-6 space-y-4">
                <span className="text-4xl">🔍</span>
                <p className="text-lg text-white font-extrabold">
                  No encontramos ninguna historia con «{searchQuery}»
                </p>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Prueba buscando otra palabra clave, ciudad o haz clic en el botón de abajo para ver todas las investigaciones.
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory('todas'); }}
                  className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-base font-black shadow-lg"
                >
                  Ver todas las historias disponibles
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

      {/* Floating Dark Box: Online Community Users with Green Dots */}
      <OnlineUsersBox 
        userProfile={userProfile} 
        onOpenRegister={() => setIsRegisterOpen(true)}
        isFloating={true}
      />

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
