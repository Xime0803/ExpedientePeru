import React, { useState } from 'react';
import { 
  X, MapPin, Calendar, Eye, Share2, ThumbsUp, ThumbsDown, MessageSquare, 
  FileText, Play, Pause, AlertTriangle, ShieldCheck, HelpCircle, Send,
  Video, Smartphone, Heart 
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4">
      {/* Fullscreen sheet on mobile, rounded card on tablet/desktop */}
      <div className="relative bg-[#0f1422] border-0 sm:border-2 border-slate-700 sm:rounded-2xl w-full max-w-4xl h-full sm:h-auto sm:max-h-[94vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="bg-[#141b2c] px-4 sm:px-6 py-3.5 border-b-2 border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <span className="font-mono text-xs sm:text-sm px-2.5 py-1 rounded-md bg-red-950 text-red-300 border border-red-700 font-bold">
              {caseItem.code}
            </span>
            <span className={`text-[11px] sm:text-xs font-mono uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border font-bold ${
              caseItem.status === 'ABIERTO' 
                ? 'bg-rose-950 text-rose-200 border-rose-700' 
                : caseItem.status === 'EN INVESTIGACIÓN' 
                ? 'bg-amber-950 text-amber-200 border-amber-700' 
                : 'bg-emerald-950 text-emerald-200 border-emerald-700'
            }`}>
              {caseItem.status}
            </span>
          </div>

          {/* Big Close Button for Mobile Thumbs */}
          <button 
            onClick={onClose}
            className="flex items-center space-x-1 text-slate-200 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors font-bold text-xs sm:text-sm"
            aria-label="Cerrar expediente"
          >
            <X className="w-5 h-5 text-red-400" />
            <span>Cerrar</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-5 sm:space-y-6">
          
          {/* Main Case Title & Meta */}
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-slate-300 mb-2 font-mono">
              <span className="flex items-center text-amber-300 font-bold">
                <MapPin className="w-4 h-4 mr-1 text-amber-400" />
                {caseItem.city}, {caseItem.region}
              </span>
              <span>•</span>
              <span className="flex items-center text-slate-300">
                <Calendar className="w-4 h-4 mr-1" />
                {caseItem.year}
              </span>
              <span>•</span>
              <span className="flex items-center text-slate-300">
                <Eye className="w-4 h-4 mr-1 text-red-400" />
                {caseItem.views}
              </span>
            </div>
            
            <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
              {caseItem.title}
            </h1>
            <p className="text-xs sm:text-base text-slate-200 mt-2 sm:mt-3 italic bg-slate-900/90 border-l-4 border-red-500 p-3 sm:p-3.5 rounded-r-xl leading-relaxed">
              "{caseItem.synopsis}"
            </p>
          </div>

          {/* Social Video Callout */}
          <div className="p-3.5 sm:p-4 bg-gradient-to-r from-red-950/60 to-slate-900 rounded-2xl border border-red-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-slate-200">
              <span className="font-bold text-white">¿Quieres ver este caso en video?</span>
              <p className="text-slate-400 text-xs mt-0.5">Visita nuestros canales oficiales para ver la reconstrucción:</p>
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <a
                href="https://www.youtube.com/@XimeFer8322"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5 shadow-md shadow-red-950"
              >
                <Video className="w-4 h-4" />
                <span>YouTube</span>
              </a>
              <a
                href="https://www.tiktok.com/@epicclips_83"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-1.5"
              >
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>TikTok</span>
              </a>
            </div>
          </div>

          {/* Cover Image */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-slate-800 h-44 sm:h-72">
            <img 
              src={caseItem.coverImage} 
              alt={caseItem.title} 
              className="w-full h-full object-cover filter brightness-80" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f1422] via-transparent to-transparent"></div>
            <div className="absolute bottom-2.5 left-3 right-3 flex justify-between items-end">
              <span className="text-xs sm:text-sm font-mono font-bold bg-black/85 px-3 py-1 rounded-lg backdrop-blur border border-slate-700 text-white">
                Categoría: <span className="text-red-400">{caseItem.category}</span>
              </span>
            </div>
          </div>

          {/* Navigation Tabs (Mobile swipeable) */}
          <div className="flex border-b-2 border-slate-800 space-x-1.5 pb-1 overflow-x-auto text-xs sm:text-sm font-mono scrollbar-none">
            {[
              { id: 'historia', label: 'Crónica' },
              { id: 'timeline', label: `Línea de Tiempo (${caseItem.timeline?.length || 0})` },
              { id: 'evidencias', label: `Evidencias (${caseItem.evidences?.length || 0})` },
              { id: 'comentarios', label: `Comentarios (${caseItem.comments?.length || 0})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-4 py-2.5 rounded-t-xl font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-white border-b-4 border-red-500 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Historia Completa */}
          {activeTab === 'historia' && (
            <div className="space-y-4">
              <div className="text-slate-100 text-sm sm:text-lg leading-relaxed whitespace-pre-line bg-slate-900/60 p-4 sm:p-6 rounded-2xl border-2 border-slate-800 font-sans">
                {caseItem.fullStory}
              </div>

              {/* Support Callout */}
              <div className="p-4 sm:p-5 bg-[#121826] border-2 border-amber-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-white flex items-center justify-center sm:justify-start">
                    <Heart className="w-4 h-4 text-red-500 fill-red-500 mr-2" />
                    ¿Te gustó esta investigación?
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300">
                    Colabora voluntariamente por <strong>Yape, Plin o Dale al 916839878</strong> para financiar más crónicas.
                  </p>
                </div>
                <button
                  onClick={onOpenSupport}
                  className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-amber-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md"
                >
                  Ver Datos (Yape / Plin / Dale)
                </button>
              </div>
            </div>
          )}

          {/* Tab 2: Línea de Tiempo */}
          {activeTab === 'timeline' && (
            <div className="space-y-3 relative pl-4 border-l-4 border-red-600/80 my-2">
              {(caseItem.timeline || []).map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[22px] top-1.5 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-slate-900"></div>
                  <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-xs sm:text-sm font-mono text-amber-300 font-bold">{step.date}</span>
                    <p className="text-xs sm:text-base text-slate-100 font-sans leading-relaxed">{step.event}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Evidencias */}
          {activeTab === 'evidencias' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(caseItem.evidences || []).map((evi, idx) => (
                <div key={idx} className="bg-slate-900 p-4 rounded-xl border-2 border-slate-800 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                      {evi.type === 'audio' ? '🎙️ Audio' : evi.type === 'doc' ? '📄 Documento' : '📷 Foto'}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white mt-2">{evi.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1">{evi.note}</p>
                  </div>

                  {evi.type === 'audio' && (
                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <button 
                        onClick={() => handleAudioToggle(idx)}
                        className="w-full flex items-center justify-center space-x-2 text-xs sm:text-sm bg-red-950 hover:bg-red-900 text-red-200 border border-red-700 py-2 rounded-xl font-bold transition-colors"
                      >
                        {playingAudioId === idx ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        <span>{playingAudioId === idx ? 'Detener' : 'Escuchar Audio'}</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Comentarios */}
          {activeTab === 'comentarios' && (
            <div className="space-y-4">
              <form onSubmit={handleSubmitComment} className="bg-slate-900 p-4 rounded-2xl border-2 border-slate-700 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div 
                    onClick={onOpenRegister}
                    className="flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer hover:underline"
                  >
                    <span>{userProfile?.flag || '🇵🇪'}</span>
                    <span>Como: <strong className="text-amber-400">{userProfile?.nickname || 'Toca para registrarte'}</strong> ({userProfile?.country || 'Perú'})</span>
                  </div>
                  
                  <div className="flex space-x-1 text-xs">
                    {['Teoría', 'Evidencia', 'Pregunta'].map(tag => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => setNewCommentTag(tag)}
                        className={`px-2.5 py-1 rounded-lg font-bold font-mono text-[11px] ${
                          newCommentTag === tag ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="Escribe tu hipótesis o recuerdo sobre este caso..."
                  rows={3}
                  className="w-full bg-[#0a0d14] border-2 border-slate-700 rounded-xl p-3 text-base text-slate-100 placeholder-slate-400 focus:outline-none focus:border-red-500 resize-none font-sans"
                />

                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-red-950"
                >
                  <Send className="w-4 h-4" />
                  <span>Publicar Comentario</span>
                </button>
              </form>

              {/* Comment List */}
              <div className="space-y-3">
                {filteredComments.length === 0 ? (
                  <div className="text-center py-8 text-xs sm:text-sm text-slate-400 font-mono bg-slate-900/40 rounded-xl border border-slate-800 p-4">
                    Aún no hay comentarios ni teorías para este expediente. ¡Sé el primero en aportar con tu seudónimo y país!
                  </div>
                ) : (
                  filteredComments.map(comment => (
                    <div key={comment.id} className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{comment.flag || '🇵🇪'}</span>
                          <span className="text-xs sm:text-sm font-bold text-white">{comment.author}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({comment.country || 'Perú'})</span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-300">
                          {comment.tag}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 pl-6 leading-relaxed">
                        {comment.content}
                      </p>

                      <div className="flex justify-end space-x-3 text-xs font-mono text-slate-400 pt-1">
                        <button 
                          onClick={() => onVoteComment(caseItem.id, comment.id, 'up')}
                          className="flex items-center space-x-1 hover:text-emerald-400 font-bold"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{comment.upvotes || 0}</span>
                        </button>
                        <button 
                          onClick={() => onVoteComment(caseItem.id, comment.id, 'down')}
                          className="flex items-center space-x-1 hover:text-rose-400 font-bold"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
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

        {/* Footer */}
        <div className="bg-[#141b2c] p-3.5 sm:p-4 border-t-2 border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Canales: YouTube @XimeFer8322 • TikTok @epicclips_83
          </span>
          <button 
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors text-sm"
          >
            Cerrar Expediente
          </button>
        </div>

      </div>
    </div>
  );
}
