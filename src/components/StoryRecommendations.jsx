import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Send, ThumbsUp, MessageSquare, Video, Smartphone, 
  MapPin, CheckCircle2, Filter, AlertCircle, ExternalLink, Globe, 
  UserCheck, Trophy, Flame, Clock, ArrowRight, ShieldAlert 
} from 'lucide-react';

export default function StoryRecommendations({ userProfile, onOpenRegister, onNavigateTab }) {
  const [recommendations, setRecommendations] = useState(() => {
    const saved = localStorage.getItem('expediente_recommendations_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [platformFilter, setPlatformFilter] = useState('todas');
  const [sortBy, setSortBy] = useState('top'); // 'top' | 'recientes'
  const [title, setTitle] = useState('');
  const [place, setPlace] = useState('');
  const [platform, setPlatform] = useState('ambas');
  const [storyDetails, setStoryDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    localStorage.setItem('expediente_recommendations_v3', JSON.stringify(recommendations));
  }, [recommendations]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !storyDetails.trim()) return;

    if (!userProfile?.nickname) {
      onOpenRegister();
      return;
    }

    const newRec = {
      id: "rec-" + Date.now(),
      title: title.trim(),
      place: place.trim() || "Perú",
      platform,
      author: userProfile.nickname,
      country: userProfile.country || "Perú",
      flag: userProfile.flag || "🇵🇪",
      storyDetails: storyDetails.trim(),
      votes: 1,
      createdAt: Date.now(),
      timestamp: "Hace un momento",
      comments: []
    };

    setRecommendations([newRec, ...recommendations]);
    setTitle('');
    setPlace('');
    setStoryDetails('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3500);
  };

  const handleVote = (id) => {
    setRecommendations(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, votes: item.votes + 1 };
      }
      return item;
    }));
  };

  const handleAddComment = (recId, e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!userProfile?.nickname) {
      onOpenRegister();
      return;
    }

    setRecommendations(prev => prev.map(item => {
      if (item.id === recId) {
        return {
          ...item,
          comments: [
            ...(item.comments || []),
            {
              id: "c-" + Date.now(),
              user: userProfile.nickname,
              country: userProfile.country || "Perú",
              flag: userProfile.flag || "🇵🇪",
              text: commentText.trim(),
              time: "Hace un momento"
            }
          ]
        };
      }
      return item;
    }));

    setCommentText('');
  };

  // Filter recommendations
  const filtered = recommendations.filter(r => {
    if (platformFilter === 'todas') return true;
    return r.platform === platformFilter || r.platform === 'ambas';
  });

  // Sort recommendations: Top voted or Most recent
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'top') {
      return b.votes - a.votes;
    }
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  // Top 3 Ranking
  const topRanked = [...recommendations]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 3)
    .filter(item => item.votes > 0);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Intro Header */}
      <div className="bg-[#121826] border-2 border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/80 text-red-300 border border-red-700/60 text-xs font-mono font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>PROPUESTAS DE LA COMUNIDAD</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Recomendar Nuevas Historias para el Canal
            </h2>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl">
              ¿Conoces un caso real, suceso extraño o leyenda de tu pueblo o provincia en el Perú? 
              Indícanos si te gustaría verlo como un <strong>video largo en YouTube</strong> o en un <strong>clip rápido en TikTok</strong>. Las historias con más votos serán grabadas primero.
            </p>
          </div>

          {/* Channel links */}
          <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full md:w-auto">
            <a 
              href="https://www.youtube.com/@XimeFer8322" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-red-950"
            >
              <Video className="w-4 h-4" />
              <span>YouTube @XimeFer8322</span>
            </a>
            <a 
              href="https://www.tiktok.com/@epicclips_83" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 border border-slate-700"
            >
              <Smartphone className="w-4 h-4 text-cyan-400" />
              <span>TikTok @epicclips_83</span>
            </a>
          </div>
        </div>
      </div>

      {/* TOP VOTED RANKING PODIUM (If there are stories with votes) */}
      {topRanked.length > 0 && (
        <div className="bg-gradient-to-r from-[#171e2e] via-[#121927] to-[#171e2e] border-2 border-amber-500/50 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-amber-500/30 gap-2">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center">
                  <span>TOP DE HISTORIAS MÁS VOTADAS</span>
                  <span className="ml-2 text-xs font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-700">
                    En Carrera para Grabación
                  </span>
                </h3>
                <p className="text-xs text-slate-300">
                  Casos liderando las preferencias de los seguidores para los próximos videos.
                </p>
              </div>
            </div>

            <span className="text-xs font-mono text-amber-400 font-bold self-start sm:self-auto">
              {topRanked.length} en el Podio
            </span>
          </div>

          {/* Top 3 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {topRanked.map((item, index) => {
              const medal = index === 0 ? "🥇 1º PUESTO" : index === 1 ? "🥈 2º PUESTO" : "🥉 3º PUESTO";
              const medalColor = index === 0 
                ? "border-amber-500 bg-amber-950/40 text-amber-300" 
                : index === 1 
                ? "border-slate-400 bg-slate-900/60 text-slate-200" 
                : "border-amber-700 bg-amber-950/20 text-amber-400";

              return (
                <div 
                  key={item.id}
                  className="bg-[#0b0e17] border-2 border-slate-700/80 rounded-xl p-4 flex flex-col justify-between space-y-2 hover:border-amber-500/80 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                      <span className={`px-2 py-0.5 rounded font-bold border ${medalColor}`}>
                        {medal}
                      </span>
                      <span className="text-amber-400 font-bold font-mono">
                        {item.votes} votos
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {item.storyDetails}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400 flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-amber-400" />
                      {item.place}
                    </span>
                    <button
                      onClick={() => handleVote(item.id)}
                      className="text-amber-300 hover:text-white font-bold flex items-center space-x-1"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Votar +1</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Suggestion Form */}
      <div className="bg-[#0f1422] border-2 border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center">
            <Sparkles className="w-5 h-5 text-amber-400 mr-2" />
            Envía tu recomendación de historia
          </h3>

          {/* User registration status indicator */}
          <button 
            type="button"
            onClick={onOpenRegister}
            className="text-xs font-mono font-bold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <span>{userProfile?.flag || '🇵🇪'}</span>
            <span>{userProfile?.nickname ? `${userProfile.nickname} (${userProfile.country})` : 'Registrar mi Seudónimo'}</span>
          </button>
        </div>

        <p className="text-xs sm:text-sm text-slate-300">
          Completa este formulario simple. Nuestro equipo revisará los datos para investigarlos y mencionarte en el video.
        </p>

        {submitted ? (
          <div className="p-5 bg-emerald-950/60 border-2 border-emerald-500/80 rounded-xl text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-base font-bold text-white">¡Muchas gracias por tu recomendación!</h4>
            <p className="text-xs sm:text-sm text-slate-200">
              Tu historia ha sido registrada con éxito. Aparecerá en la lista de abajo para que los demás seguidores voten por ella.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Title */}
              <div className="md:col-span-2">
                <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
                  Nombre o Título de la Historia *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej. El misterio del faro de Salaverry o La monja de Chachapoyas"
                  className="w-full bg-[#0a0d14] border-2 border-slate-700 rounded-xl p-3 text-base text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>

              {/* Place */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
                  Lugar o Ciudad en Perú *
                </label>
                <input
                  type="text"
                  required
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  placeholder="Ej. Arequipa, Huancayo, Chiclayo..."
                  className="w-full bg-[#0a0d14] border-2 border-slate-700 rounded-xl p-3 text-base text-white focus:outline-none focus:border-red-500 font-sans"
                />
              </div>
            </div>

            {/* Target Platform Selection */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-white mb-2">
                ¿En qué canal te gustaría ver esta historia? *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPlatform('youtube')}
                  className={`p-3 rounded-xl border-2 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                    platform === 'youtube'
                      ? 'bg-red-950 border-red-500 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <Video className="w-4 h-4 text-red-500" />
                  <span>Para YouTube (Caso Largo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform('tiktok')}
                  className={`p-3 rounded-xl border-2 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                    platform === 'tiktok'
                      ? 'bg-slate-800 border-cyan-400 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>Para TikTok (Clip Rápido)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlatform('ambas')}
                  className={`p-3 rounded-xl border-2 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                    platform === 'ambas'
                      ? 'bg-amber-950 border-amber-500 text-white'
                      : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Para Ambos Canales</span>
                </button>
              </div>
            </div>

            {/* Story Details */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
                Cuéntanos de qué trata y por qué debería ser grabada *
              </label>
              <textarea
                required
                rows={3}
                value={storyDetails}
                onChange={(e) => setStoryDetails(e.target.value)}
                placeholder="Explica qué pasó, si hay testigos, noticias antiguas o anécdotas de tu familia sobre este suceso..."
                className="w-full bg-[#0a0d14] border-2 border-slate-700 rounded-xl p-3.5 text-base text-white focus:outline-none focus:border-red-500 font-sans resize-none leading-relaxed"
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span className="text-xs text-slate-300">
                Se registrará como: <strong className="text-amber-400">{userProfile?.flag} {userProfile?.nickname || 'Sin Registrar'}</strong> ({userProfile?.country || 'Perú'})
              </span>
              <button
                type="submit"
                className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white px-7 py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-red-950 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Publicar mi Recomendación</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* List of Community Recommendations with TOP Filter & Comments */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-xl font-bold text-white">
              Historias Recomendadas por los Seguidores ({sorted.length})
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Vota por las historias enviadas por los seguidores para que sean grabadas primero.
            </p>
          </div>

          {/* Sort Controls (Top Más Votadas vs Más Recientes) */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 font-bold hidden sm:inline">Ordenar:</span>
            <button
              onClick={() => setSortBy('top')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1 transition-colors ${
                sortBy === 'top'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-950'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Top Más Votadas</span>
            </button>
            <button
              onClick={() => setSortBy('recientes')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1 transition-colors ${
                sortBy === 'recientes'
                  ? 'bg-red-600 text-white'
                  : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Más Recientes</span>
            </button>
          </div>
        </div>

        {/* Empty State when count is 0 */}
        {sorted.length === 0 ? (
          <div className="text-center py-12 px-4 bg-[#0e1320] border-2 border-dashed border-slate-800 rounded-2xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto text-amber-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white">
              Aún no hay historias recomendadas registradas
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Sé el primer detective en proponer un caso o misterio peruano usando el formulario de arriba para que lidere el Top de Votación para YouTube o TikTok.
            </p>
          </div>
        ) : (
          /* Cards */
          <div className="space-y-5">
            {sorted.map((item, index) => {
              const isCommentsOpen = activeCommentId === item.id;
              const comments = item.comments || [];
              const rank = index + 1;

              return (
                <div 
                  key={item.id} 
                  className={`bg-[#101624] border-2 rounded-2xl p-5 sm:p-6 transition-all space-y-3.5 ${
                    sortBy === 'top' && rank === 1
                      ? 'border-amber-500/80 shadow-xl shadow-amber-950/20'
                      : sortBy === 'top' && rank === 2
                      ? 'border-slate-500/80'
                      : sortBy === 'top' && rank === 3
                      ? 'border-amber-700/80'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Meta Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 text-xs font-mono">
                      {/* Ranking badge when sorted by top */}
                      {sortBy === 'top' && (
                        <span className={`px-2.5 py-0.5 rounded-md font-extrabold flex items-center space-x-1 border ${
                          rank === 1
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : rank === 2
                            ? 'bg-slate-300 text-slate-950 border-slate-200'
                            : rank === 3
                            ? 'bg-amber-800 text-amber-100 border-amber-600'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          <span>#{rank}</span>
                          <span className="hidden sm:inline">en Votos</span>
                        </span>
                      )}

                      <span className="flex items-center text-amber-400 bg-amber-950/50 border border-amber-800/80 px-2.5 py-0.5 rounded-md font-bold">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {item.place}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-200 font-bold flex items-center">
                        <span className="mr-1">{item.flag || '🇵🇪'}</span> {item.author} ({item.country || 'Perú'})
                      </span>
                      <span className="text-slate-500">• {item.timestamp}</span>
                    </div>

                    {/* Platform Badge */}
                    <span className={`text-xs font-mono px-2.5 py-1 rounded-md font-bold flex items-center space-x-1.5 border ${
                      item.platform === 'youtube'
                        ? 'bg-red-950 text-red-300 border-red-800'
                        : item.platform === 'tiktok'
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                        : 'bg-purple-950 text-purple-300 border-purple-800'
                    }`}>
                      {item.platform === 'youtube' && <Video className="w-3.5 h-3.5" />}
                      {item.platform === 'tiktok' && <Smartphone className="w-3.5 h-3.5" />}
                      {item.platform === 'ambas' && <Sparkles className="w-3.5 h-3.5" />}
                      <span>
                        {item.platform === 'youtube' ? 'Para YouTube' : item.platform === 'tiktok' ? 'Para TikTok' : 'Para YouTube y TikTok'}
                      </span>
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {item.title}
                  </h4>

                  {/* Details */}
                  <p className="text-sm sm:text-base text-slate-200 leading-relaxed bg-[#0a0d14] p-4 rounded-xl border border-slate-800/80">
                    {item.storyDetails}
                  </p>

                  {/* Actions: Vote & Comment Toggle */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm font-mono">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleVote(item.id)}
                        className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border-2 border-amber-500/60 px-4 py-2 rounded-xl flex items-center space-x-2 transition-all font-bold shadow-md"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{item.votes} Votos de Seguidores</span>
                      </button>

                      <button
                        onClick={() => setActiveCommentId(activeCommentId === item.id ? null : item.id)}
                        className={`px-4 py-2 rounded-xl font-bold flex items-center space-x-1.5 transition-colors border ${
                          isCommentsOpen
                            ? 'bg-slate-800 text-white border-slate-600'
                            : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                        <span>Comentarios ({comments.length})</span>
                      </button>
                    </div>

                    <span className="text-xs text-slate-400">
                      Canal Oficial @XimeFer8322 & @epicclips_83
                    </span>
                  </div>

                  {/* INLINE COMMENTS SECTION WITH TOPIC WARNING & REDIRECT */}
                  {isCommentsOpen && (
                    <div className="mt-4 pt-4 border-t-2 border-slate-800 space-y-4 bg-[#0a0d14] p-4 sm:p-5 rounded-2xl">
                      
                      {/* MANDATORY TOPIC NOTICE & INVITATION TO LIVE CHAT */}
                      <div className="bg-amber-950/40 border-2 border-amber-500/60 p-4 rounded-xl space-y-2.5">
                        <div className="flex items-start space-x-2.5">
                          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-amber-200">
                              Norma de la Comunidad: Comentarios exclusivos sobre esta historia
                            </p>
                            <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
                              Los comentarios en esta propuesta deben aportar únicamente recuerdos, fuentes de periódicos, pistas o testimonios <strong>relacionados directamente a este caso</strong>.
                            </p>
                          </div>
                        </div>

                        {/* Redirection button if user wants to discuss other topics */}
                        <div className="pt-2.5 border-t border-amber-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
                          <span className="text-slate-300">
                            ¿Quieres debatir sobre otros temas, noticias o misterios generales?
                          </span>
                          <button
                            type="button"
                            onClick={() => onNavigateTab && onNavigateTab('chat')}
                            className="bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-white border-2 border-amber-500/60 px-3.5 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-colors self-start sm:self-auto"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                            <span>Ir a la Sala de Debate General</span>
                            <ArrowRight className="w-3 h-3 ml-0.5" />
                          </button>
                        </div>
                      </div>

                      {/* Comment Input Form */}
                      <form onSubmit={(e) => handleAddComment(item.id, e)} className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder={
                            userProfile?.nickname 
                              ? `Aporta un dato o testimonio sobre esta historia como ${userProfile.nickname}...`
                              : "Registra tu seudónimo y país para comentar..."
                          }
                          className="flex-1 bg-slate-900 border-2 border-slate-700 text-base text-slate-100 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-red-500 font-sans"
                        />
                        <button
                          type="submit"
                          disabled={!commentText.trim()}
                          className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-red-950 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          <span>Comentar</span>
                        </button>
                      </form>

                      {/* List of comments on this story */}
                      <div className="space-y-2.5 pt-1">
                        {comments.length === 0 ? (
                          <div className="text-center py-6 text-xs sm:text-sm text-slate-400 font-mono bg-slate-900/50 rounded-xl border border-slate-800 p-4">
                            Aún no hay comentarios sobre esta propuesta. ¡Sé el primero en aportar un dato verificado sobre este caso!
                          </div>
                        ) : (
                          comments.map(c => (
                            <div key={c.id} className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 text-xs sm:text-sm space-y-1">
                              <div className="flex justify-between text-slate-400 font-mono">
                                <span className="font-bold text-red-400 flex items-center">
                                  <span className="mr-1">{c.flag || '🇵🇪'}</span> @{c.user} ({c.country || 'Perú'})
                                </span>
                                <span className="text-[10px] text-slate-500">{c.time}</span>
                              </div>
                              <p className="text-slate-200 font-sans pl-5 text-sm leading-relaxed">{c.text}</p>
                            </div>
                          ))
                        )}
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
