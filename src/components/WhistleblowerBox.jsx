import React, { useState, useEffect } from 'react';
import { Send, Shield, Lock, CheckCircle2, ThumbsUp, AlertTriangle, FileText, MapPin, Globe } from 'lucide-react';

export default function WhistleblowerBox({ userProfile, onOpenRegister }) {
  const [activeTab, setActiveTab] = useState('enviar'); // 'enviar' | 'enviadas'
  const [stories, setStories] = useState(() => {
    const saved = localStorage.getItem('expediente_community_stories_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Lima');
  const [category, setCategory] = useState('Misterio Urbano');
  const [storyText, setStoryText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem('expediente_community_stories_v3', JSON.stringify(stories));
  }, [stories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !storyText.trim()) return;

    if (!isAnonymous && !userProfile?.nickname) {
      onOpenRegister();
      return;
    }

    const newStory = {
      id: "cs-" + Date.now(),
      title: title.trim(),
      department,
      category,
      author: isAnonymous ? "Anónimo" : (userProfile?.nickname || "Investigador_Registrado"),
      country: isAnonymous ? "Confidencial" : (userProfile?.country || "Perú"),
      flag: isAnonymous ? "🔒" : (userProfile?.flag || "🇵🇪"),
      isAnonymous,
      text: storyText.trim(),
      votes: 1,
      timestamp: "Hace un momento"
    };

    setStories([newStory, ...stories]);
    setIsSubmitted(true);
    setTitle('');
    setStoryText('');

    setTimeout(() => {
      setIsSubmitted(false);
      setActiveTab('enviadas');
    }, 2000);
  };

  const handleVoteStory = (id) => {
    setStories(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, votes: s.votes + 1 };
      }
      return s;
    }));
  };

  const departments = [
    "Lima", "Arequipa", "Cusco", "La Libertad", "Piura", "Loreto", 
    "Lambayeque", "Junín", "Puno", "Ancash", "Ica", "San Martín", "Ucayali", "Ayacucho", "Cajamarca", "Tacna"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#121826] border-2 border-slate-700 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-mono">
                Buzón Confidencial del Informante
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Envía tus testimonios, casos familiares o historias virales de tu barrio o provincia en el Perú.
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-900 p-1.5 rounded-xl border border-slate-700 text-xs sm:text-sm font-mono w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('enviar')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold transition-colors ${
                activeTab === 'enviar' ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Enviar Testimonio
            </button>
            <button
              onClick={() => setActiveTab('enviadas')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg font-bold transition-colors ${
                activeTab === 'enviadas' ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'
              }`}
            >
              Aportes ({stories.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Formulario */}
      {activeTab === 'enviar' && (
        <div className="bg-[#0e1320] border-2 border-slate-700 rounded-2xl p-5 sm:p-7 shadow-xl">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h3 className="text-lg font-bold text-white">¡Testimonio Recibido con Éxito!</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Tu relato ha sido archivado y agregado a los aportes de la comunidad para que el equipo lo investigue.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
                    Título o Nombre del Suceso *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ej. El sótano tapiado en el Jirón Junín..."
                    className="w-full bg-[#0a0d14] border-2 border-slate-700 rounded-xl p-3 text-base text-white focus:outline-none focus:border-red-500 font-sans"
                  />
                </div>

                {/* Region */}
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
                    Región / Departamento del Perú *
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-[#0a0d14] border-2 border-slate-700 rounded-xl p-3 text-base text-white focus:outline-none focus:border-red-500 font-sans"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Category & Privacy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
                    Tipo de Caso *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#0a0d14] border-2 border-slate-700 rounded-xl p-3 text-base text-white focus:outline-none focus:border-red-500 font-sans"
                  >
                    <option value="Misterio Urbano">Misterio Urbano / Leyenda Real</option>
                    <option value="Crónica Policial">Crónica Policial / Suceso Real</option>
                    <option value="Viral / Redes">Caso Viral de Redes Sociales</option>
                    <option value="Enigma Histórico">Enigma Histórico / Arqueológico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
                    Privacidad y Créditos
                  </label>
                  <div className="pt-2">
                    <label className="flex items-center space-x-2 text-xs sm:text-sm text-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 text-red-600 focus:ring-0 bg-slate-900"
                      />
                      <span>Mantener mi relato 100% Anónimo</span>
                    </label>
                    {!isAnonymous && (
                      <p className="text-[11px] text-amber-300 mt-1 font-mono">
                        Se registrará como: {userProfile?.flag} {userProfile?.nickname || 'Sin registrar'} ({userProfile?.country || 'Perú'})
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Story */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
                  Tu Relato o Pistas Detalladas *
                </label>
                <textarea
                  required
                  rows={4}
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  placeholder="Describe qué ocurrió, cuándo sucedió, quiénes estuvieron presentes y qué testigos o pruebas existen..."
                  className="w-full bg-[#0a0d14] border-2 border-slate-700 rounded-xl p-3.5 text-base text-white focus:outline-none focus:border-red-500 font-sans resize-none"
                />
              </div>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row items-center justify-between pt-2 gap-3">
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Protegido bajo políticas de respeto a las fuentes.</span>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white px-7 py-3 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-red-950 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar a Mesa de Investigación</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 2: Aportes de la Comunidad (Starting from 0) */}
      {activeTab === 'enviadas' && (
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-300 font-mono">
            Vota por los testimonios enviados por otros seguidores para que el equipo los investigue a fondo en video:
          </p>

          {stories.length === 0 ? (
            <div className="text-center py-12 px-4 bg-[#0e1320] border-2 border-dashed border-slate-800 rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center mx-auto text-amber-400">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                Aún no hay testimonios registrados en el buzón
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                Los relatos enviados mediante la pestaña "Enviar Testimonio" se registrarán y contarán desde cero aquí.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stories.map(story => (
                <div 
                  key={story.id} 
                  className="bg-[#0e1320] border-2 border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                      <span className="text-amber-400 flex items-center bg-amber-950/60 px-2 py-0.5 rounded">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {story.department}
                      </span>
                      <span>•</span>
                      <span className="text-slate-300">{story.category}</span>
                      <span>•</span>
                      <span className="text-slate-200 font-bold flex items-center">
                        <span className="mr-1">{story.flag || '🇵🇪'}</span> Por: {story.author} ({story.country || 'Perú'})
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">
                      {story.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
                      {story.text}
                    </p>
                  </div>

                  <button
                    onClick={() => handleVoteStory(story.id)}
                    className="bg-slate-900 hover:bg-red-950/80 border-2 border-slate-700 hover:border-red-700 text-slate-200 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 shrink-0 transition-colors"
                  >
                    <ThumbsUp className="w-4 h-4 text-amber-400" />
                    <span>{story.votes} Votos</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}
