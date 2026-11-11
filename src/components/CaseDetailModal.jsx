import React, { useState } from 'react';
import { 
  X, MapPin, Calendar, Eye, Share2, ThumbsUp, ThumbsDown, MessageSquare, 
  FileText, Play, Pause, AlertTriangle, ShieldCheck, HelpCircle, Send,
  Video, Smartphone, Heart, BookOpen, Clock, FileCheck 
} from 'lucide-react';

export default function CaseDetailModal({ 
  caseItem, 
  onClose, 
  onAddComment, 
  onVoteComment, 
  userProfile,
  onOpenRegister,
  onOpenSupport 
}) {
  const [activeTab, setActiveTab] = useState('historia');
  const [commentFilter, setCommentFilter] = useState('todos');
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentTag, setNewCommentTag] = useState('Teoría');
  const [playingAudioId, setPlayingAudioId] = useState(null);

  if (!caseItem) return null;

  const handleAudioToggle = (index) => {
    if (playingAudioId === index) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(index);
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    if (!userProfile?.nickname) {
      onOpenRegister();
      return;
    }

    onAddComment(caseItem.id, {
      author: userProfile.nickname,
      country: userProfile.country || "Perú",
      flag: userProfile.flag || "🇵🇪",
      role: "Seguidor Activo",
      avatar: newCommentTag === 'Teoría' ? '💡' : newCommentTag === 'Evidencia' ? '🔍' : '💬',
      timestamp: "Hace un momento",
      tag: newCommentTag,
      content: newCommentText.trim(),
      upvotes: 1,
      downvotes: 0
    });

    setNewCommentText('');
    setActiveTab('comentarios');
  };

  const filteredComments = (caseItem.comments || []).filter(c => {
    if (commentFilter === 'todos') return true;
    return c.tag?.toLowerCase() === commentFilter.toLowerCase();
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-150">
      
      {/* Contenedor Principal del Expediente */}
      <div className="relative bg-[#0d1322] border-2 border-slate-600 sm:rounded-3xl w-full max-w-4xl h-full sm:h-auto sm:max-h-[94vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Barra Superior con Botón Grande de Cerrar */}
        <div className="bg-[#12192b] px-4 sm:px-6 py-4 border-b-2 border-slate-700 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <span className="font-mono text-xs sm:text-sm px-3 py-1 rounded-xl bg-red-950 text-red-200 border-2 border-red-500 font-black">
              {caseItem.code}
            </span>
            <span className={`text-xs font-mono font-black uppercase px-3 py-1 rounded-xl border-2 shadow-sm ${
              caseItem.status === 'ABIERTO' 
                ? 'bg-rose-950 text-rose-200 border-rose-600' 
                : caseItem.status === 'EN INVESTIGACIÓN' 
                ? 'bg-amber-950 text-amber-200 border-amber-500' 
                : 'bg-emerald-950 text-emerald-200 border-emerald-500'
            }`}>
              {caseItem.status}
            </span>
          </div>

          {/* Botón Grande Cerrar para Adultos Mayores */}
          <button 
            onClick={onClose}
            className="flex items-center space-x-2 text-white hover:text-white px-4 py-2 rounded-2xl bg-red-600/90 hover:bg-red-500 border-2 border-red-400 transition-all font-extrabold text-sm sm:text-base shadow-lg shadow-red-950/60 touch-target cursor-pointer"
            aria-label="Cerrar expediente y volver a la lista"
          >
            <X className="w-5 h-5 text-white" />
            <span>Cerrar Lectura [X]</span>
          </button>
        </div>

        {/* Cuerpo Desplazable del Expediente */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
          
          {/* Título Principal y Metadatos */}
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300 mb-2.5 font-mono">
              <span className="flex items-center text-amber-300 font-extrabold bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-600/60">
                <MapPin className="w-4 h-4 mr-1 text-amber-400" />
                {caseItem.city}, {caseItem.region}
              </span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center text-slate-200 font-bold">
                <Calendar className="w-4 h-4 mr-1 text-amber-400" />
                Año: {caseItem.year}
              </span>
              <span className="text-slate-400">•</span>
              <span className="flex items-center text-slate-200 font-bold">
                <Eye className="w-4 h-4 mr-1 text-red-400" />
                {caseItem.views} lecturas
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
              {caseItem.title}
            </h1>

            <p className="text-sm sm:text-lg text-amber-100 mt-3 sm:mt-4 italic bg-[#151d30] border-l-4 border-amber-400 p-4 rounded-r-2xl leading-relaxed shadow-inner">
              "{caseItem.synopsis}"
            </p>
          </div>

          {/* Enlaces Rápidos a Canales de Video */}
          <div className="p-4 bg-gradient-to-r from-red-950/70 to-slate-900 rounded-2xl border-2 border-red-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="text-sm text-slate-100">
              <span className="font-extrabold text-white text-base">¿Deseas ver este caso narrado en video?</span>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5">Visita nuestros canales oficiales para ver la reconstrucción visual:</p>
            </div>
            <div className="flex flex-wrap gap-2.5 w-full sm:w-auto">
              <a
                href="https://www.youtube.com/@XimeFer8322"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2 shadow-md shadow-red-950 border border-red-400"
              >
                <Video className="w-4 h-4" />
                <span>YouTube @XimeFer8322</span>
              </a>
              <a
                href="https://www.tiktok.com/@epicclips_83"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border-2 border-slate-600 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center space-x-2"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>TikTok @epicclips_83</span>
              </a>
            </div>
          </div>

          {/* Imagen de Portada */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-700 h-52 sm:h-80 shadow-xl">
            <img 
              src={caseItem.coverImage} 
              alt={caseItem.title} 
              className="w-full h-full object-cover filter brightness-85" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1322] via-transparent to-transparent"></div>
            <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
              <span className="text-xs sm:text-sm font-mono font-black bg-black/90 px-3.5 py-1.5 rounded-xl backdrop-blur border border-slate-600 text-white">
                Categoría Oficial: <span className="text-red-400">{caseItem.category}</span>
              </span>
            </div>
          </div>

          {/* Selector de Pestañas con Letra Grande y Claro */}
          <div className="flex border-b-2 border-slate-700 space-x-2 pb-1 overflow-x-auto text-xs sm:text-sm font-mono scrollbar-none">
            {[
              { id: 'historia', label: '📖 Crónica Completa' },
              { id: 'timeline', label: `⏱️ Línea de Tiempo (${caseItem.timeline?.length || 0})` },
              { id: 'evidencias', label: `🔍 Documentos (${caseItem.evidences?.length || 0})` },
              { id: 'comentarios', label: `💬 Recuerdos & Teorías (${caseItem.comments?.length || 0})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 rounded-t-2xl font-black transition-all whitespace-nowrap border-2 border-b-0 touch-target ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white border-red-500 shadow-md scale-[1.02]'
                    : 'bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Pestaña 1: Crónica Completa con Letra Grande y Cómoda para Adultos Mayores */}
          {activeTab === 'historia' && (
            <div className="space-y-5">
              <div className="text-slate-100 text-base sm:text-xl leading-relaxed whitespace-pre-line bg-[#111728] p-5 sm:p-8 rounded-2xl border-2 border-slate-700 font-sans shadow-lg space-y-4">
                {caseItem.fullStory}
              </div>

              {/* Módulo de Apoyo Voluntario */}
              <div className="p-5 sm:p-6 bg-[#131b2c] border-2 border-amber-500/70 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-xl">
                <div className="space-y-1.5">
                  <h4 className="text-base sm:text-lg font-black text-white flex items-center justify-center sm:justify-start">
                    <Heart className="w-5 h-5 text-red-500 fill-red-500 mr-2 shrink-0" />
                    ¿Te gustó esta investigación de nuestro país?
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-200">
                    Tu apoyo voluntario por <strong>Yape, Plin o Dale al 916839878</strong> nos ayuda a seguir revisando hemerotecas y grabando casos en provincias.
                  </p>
                </div>
                <button
                  onClick={onOpenSupport}
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white px-6 py-3 rounded-xl font-extrabold text-sm sm:text-base shadow-lg shadow-red-950 shrink-0 border border-red-400"
                >
                  Ver Datos de Apoyo (Yape / Plin)
                </button>
              </div>
            </div>
          )}

          {/* Pestaña 2: Línea de Tiempo Cronológica */}
          {activeTab === 'timeline' && (
            <div className="space-y-4 relative pl-5 border-l-4 border-red-500 my-3">
              {(caseItem.timeline || []).map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[27px] top-2 w-4 h-4 rounded-full bg-red-500 border-2 border-slate-900 shadow"></div>
                  <div className="bg-[#121929] p-4 rounded-2xl border-2 border-slate-700 space-y-1.5 shadow-md">
                    <span className="text-xs sm:text-sm font-mono text-amber-300 font-black px-2 py-0.5 rounded bg-amber-950/80 border border-amber-600/70 inline-block">
                      {step.date}
                    </span>
                    <p className="text-sm sm:text-lg text-slate-100 font-sans leading-relaxed">{step.event}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pestaña 3: Evidencias y Documentos */}
          {activeTab === 'evidencias' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(caseItem.evidences || []).map((evi, idx) => (
                <div key={idx} className="bg-[#121929] p-5 rounded-2xl border-2 border-slate-700 flex flex-col justify-between shadow-md">
                  <div>
                    <span className="text-xs font-mono font-black uppercase px-2.5 py-1 rounded-lg bg-slate-800 text-amber-300 border border-slate-600 inline-block">
                      {evi.type === 'audio' ? '🎙️ Grabación de Audio' : evi.type === 'doc' ? '📄 Documento Oficial' : '📷 Fotografía Judicial'}
                    </span>
                    <h4 className="text-base sm:text-lg font-extrabold text-white mt-2.5">{evi.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed">{evi.note}</p>
                  </div>

                  {evi.type === 'audio' && (
                    <div className="mt-4 pt-3 border-t border-slate-700">
                      <button 
                        onClick={() => handleAudioToggle(idx)}
                        className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all ${
                          playingAudioId === idx 
                            ? 'bg-amber-500 text-slate-950 shadow-md' 
                            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-600'
                        }`}
                      >
                        {playingAudioId === idx ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{playingAudioId === idx ? "Pausar Audio" : "Escuchar Narración en Audio"}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Pestaña 4: Comentarios y Recuerdos de la Comunidad */}
          {activeTab === 'comentarios' && (
            <div className="space-y-6">
              
              {/* Formulario de Aporte con Letra Clara */}
              <form onSubmit={handleSubmitComment} className="bg-[#121929] p-5 sm:p-6 rounded-2xl border-2 border-slate-700 space-y-3.5 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-extrabold text-white flex items-center">
                    <MessageSquare className="w-5 h-5 text-amber-400 mr-2" />
                    Comparte tu recuerdo, teoría o dato verificado
                  </h3>
                  <span className="text-xs text-slate-300 font-mono">
                    Comentando como: <strong className="text-amber-400">{userProfile?.nickname || 'Sin registrar'}</strong>
                  </span>
                </div>

                <div className="flex gap-2">
                  {['Teoría', 'Evidencia', 'Recuerdo'].map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setNewCommentTag(tag)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                        newCommentTag === tag
                          ? 'bg-amber-400 text-slate-950 border-amber-300'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {tag === 'Teoría' ? '💡 Teoría' : tag === 'Evidencia' ? '🔍 Evidencia' : '💭 Recuerdo de la época'}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={3}
                  required
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="¿Recuerdas este suceso cuando ocurrió? ¿Conoces a alguien de la zona o leíste noticias antiguas? Cuéntanos con respeto..."
                  className="w-full bg-[#070b14] border-2 border-slate-700 rounded-xl p-3.5 text-base text-white focus:outline-none focus:border-red-500 font-sans resize-none leading-relaxed"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-extrabold rounded-xl text-sm flex items-center justify-center space-x-2 shadow-lg shadow-red-950 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publicar mi Aporte</span>
                  </button>
                </div>
              </form>

              {/* Lista de Comentarios */}
              <div className="space-y-3">
                {(caseItem.comments || []).length === 0 ? (
                  <div className="text-center py-8 bg-[#101626] rounded-2xl border-2 border-dashed border-slate-800 text-slate-300 font-sans p-4">
                    Aún no hay testimonios en este expediente. ¡Sé el primero en compartir un recuerdo o dato sobre este caso!
                  </div>
                ) : (
                  (caseItem.comments || []).map((comment) => (
                    <div key={comment.id} className="bg-[#121929] p-4 sm:p-5 rounded-2xl border-2 border-slate-700 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{comment.flag || '🇵🇪'}</span>
                          <span className="text-sm sm:text-base font-extrabold text-white">{comment.author}</span>
                          <span className="text-xs text-slate-400 font-mono">({comment.country || 'Perú'})</span>
                        </div>
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-slate-800 text-amber-300 border border-slate-700">
                          {comment.tag}
                        </span>
                      </div>

                      <p className="text-sm sm:text-base text-slate-100 pl-4 sm:pl-7 leading-relaxed">
                        {comment.content || comment.text}
                      </p>

                      <div className="flex justify-end space-x-4 text-xs font-mono text-slate-400 pt-2 border-t border-slate-800">
                        <button 
                          onClick={() => onVoteComment(caseItem.id, comment.id, 'up')}
                          className="flex items-center space-x-1.5 hover:text-emerald-400 font-bold p-1"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span>{comment.upvotes || 0}</span>
                        </button>
                        <button 
                          onClick={() => onVoteComment(caseItem.id, comment.id, 'down')}
                          className="flex items-center space-x-1.5 hover:text-rose-400 font-bold p-1"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          <span>{comment.downvotes || 0}</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>

        {/* Barra Inferior del Modal con Botón Grande Cerrar */}
        <div className="bg-[#12192b] p-4 border-t-2 border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 shadow-lg">
          <span className="text-xs sm:text-sm text-slate-300 font-mono text-center sm:text-left">
            Investigación histórica de <strong>Expediente Perú</strong> para YouTube & TikTok
          </span>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-black transition-colors text-sm sm:text-base shadow-lg shadow-red-950 flex items-center justify-center space-x-2"
          >
            <X className="w-5 h-5 text-white" />
            <span>Cerrar Expediente y Volver a la Lista</span>
          </button>
        </div>

      </div>
    </div>
  );
}
