import React, { useState } from 'react';
import { Newspaper, MessageSquare, ThumbsUp, Send, Share2, Clock, Sparkles } from 'lucide-react';

export default function NewsSection({ newsList, onAddNewsComment, userProfile, onOpenRegister }) {
  const [activeCommentNewsId, setActiveCommentNewsId] = useState(null);
  const [commentInput, setCommentInput] = useState('');

  const handleToggleComments = (id) => {
    if (activeCommentNewsId === id) {
      setActiveCommentNewsId(null);
    } else {
      setActiveCommentNewsId(id);
      setCommentInput('');
    }
  };

  const handleSubmitComment = (newsId, e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    if (!userProfile?.nickname) {
      onOpenRegister();
      return;
    }

    onAddNewsComment(newsId, {
      id: "nc-" + Date.now(),
      user: userProfile.nickname,
      country: userProfile.country || "Perú",
      flag: userProfile.flag || "🇵🇪",
      text: commentInput.trim(),
      time: "Hace un momento"
    });

    setCommentInput('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
        <div>
          <div className="flex items-center space-x-2">
            <Newspaper className="w-4 h-4 text-red-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Noticias & Primicias del Canal
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Novedades de última hora, hallazgos hemerográficos y actualizaciones de casos en seguimiento. Puedes comentar y debatir directamente en cada nota.
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-full self-start">
          ● Actualizado Hoy
        </span>
      </div>

      {/* News Cards */}
      <div className="space-y-6">
        {newsList.map((item) => {
          const isCommentsOpen = activeCommentNewsId === item.id;
          const comments = item.comments || [];

          return (
            <div 
              key={item.id}
              className="bg-[#101624] border-2 border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700 transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* News Image */}
                <div className="md:col-span-4 h-48 md:h-full relative overflow-hidden bg-slate-900">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover filter brightness-90 hover:scale-105 transition-transform duration-500" 
                  />
                  <div className="absolute top-2.5 left-2.5 font-mono text-[11px] px-2.5 py-1 rounded-lg bg-black/85 text-amber-300 border border-amber-500/40 font-bold">
                    {item.category}
                  </div>
                </div>

                {/* News Body */}
                <div className="md:col-span-8 p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center space-x-3 text-xs font-mono text-slate-300 mb-2">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {item.date}
                      </span>
                      <span>•</span>
                      <span>{item.views} lecturas</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white hover:text-red-400 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-200 mt-2.5 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  {/* Actions / Comment Toggle */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <button
                      onClick={() => handleToggleComments(item.id)}
                      className="flex items-center space-x-2 text-red-400 hover:text-red-300 font-bold transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>
                        {isCommentsOpen ? 'Ocultar Opiniones' : `Opinar sobre esta Noticia (${comments.length})`}
                      </span>
                    </button>

                    <span className="text-[11px] text-slate-400">
                      Canal Oficial Perú
                    </span>
                  </div>
                </div>
              </div>

              {/* Inline Comments Section */}
              {isCommentsOpen && (
                <div className="bg-[#0b0e17] border-t-2 border-slate-800 p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                    <span className="font-bold text-white">
                      Opiniones de la Comunidad ({comments.length})
                    </span>
                    <span>
                      {userProfile?.nickname ? `${userProfile.flag} ${userProfile.nickname}` : 'Regístrate para comentar'}
                    </span>
                  </div>

                  {/* Input */}
                  <form onSubmit={(e) => handleSubmitComment(item.id, e)} className="flex gap-2">
                    <input
                      type="text"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder={
                        userProfile?.nickname 
                          ? `Comenta sobre esta noticia como ${userProfile.nickname}...`
                          : "Toca aquí para registrar tu seudónimo y país..."
                      }
                      className="flex-1 bg-slate-900 border-2 border-slate-700 text-base text-slate-100 px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-red-500 font-sans"
                    />
                    <button
                      type="submit"
                      disabled={!commentInput.trim()}
                      className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-1 shadow-md shadow-red-950"
                    >
                      <Send className="w-4 h-4" />
                      <span>Opinar</span>
                    </button>
                  </form>

                  {/* List of comments */}
                  <div className="space-y-2.5 max-h-60 overflow-y-auto pt-1">
                    {comments.length === 0 ? (
                      <p className="text-xs text-slate-400 font-mono py-2 text-center bg-slate-900/50 rounded-lg p-3">
                        Aún no hay opiniones para esta noticia. ¡Sé el primero en comentar con tu seudónimo y país!
                      </p>
                    ) : (
                      comments.map(c => (
                        <div key={c.id} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs sm:text-sm space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-red-400 font-mono flex items-center">
                              <span className="mr-1">{c.flag || '🇵🇪'}</span> @{c.user} ({c.country || 'Perú'})
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">{c.time}</span>
                          </div>
                          <p className="text-slate-100 font-sans pl-5">{c.text}</p>
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
    </div>
  );
}
