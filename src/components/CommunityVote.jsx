import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, Clock, Users, Flame, Send } from 'lucide-react';
import { initialPoll } from '../data/casesData';

export default function CommunityVote({ userAlias }) {
  const [poll, setPoll] = useState(() => {
    const saved = localStorage.getItem('expediente_poll_real_v3');
    return saved ? JSON.parse(saved) : initialPoll;
  });

  const [hasVoted, setHasVoted] = useState(() => {
    return localStorage.getItem('expediente_has_voted_v3') === 'true';
  });

  const [selectedOption, setSelectedOption] = useState(null);
  const [userSuggestion, setUserSuggestion] = useState('');
  const [suggestionSubmitted, setSuggestionSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem('expediente_poll_real_v3', JSON.stringify(poll));
  }, [poll]);

  const handleVote = (optionId) => {
    if (hasVoted) return;

    const newOptions = poll.options.map(opt => {
      if (opt.id === optionId) {
        return { ...opt, votes: opt.votes + 1 };
      }
      return opt;
    });

    const newTotal = poll.totalVotes + 1;
    const recalculated = newOptions.map(opt => ({
      ...opt,
      percentage: Math.round((opt.votes / newTotal) * 100)
    }));

    setPoll({
      ...poll,
      totalVotes: newTotal,
      options: recalculated
    });

    setHasVoted(true);
    setSelectedOption(optionId);
    localStorage.setItem('expediente_has_voted', 'true');
  };

  const handleSuggestionSubmit = (e) => {
    e.preventDefault();
    if (!userSuggestion.trim()) return;

    setSuggestionSubmitted(true);
    setUserSuggestion('');
    setTimeout(() => setSuggestionSubmitted(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="bg-[#121826] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                  DECISIÓN EDITORIAL
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> {poll.endsIn}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                {poll.question}
              </h2>
            </div>
          </div>

          <div className="text-right font-mono text-xs text-slate-400 shrink-0">
            <span className="text-emerald-400 font-bold text-sm">{poll.totalVotes.toLocaleString()}</span> votos emitidos
          </div>
        </div>
      </div>

      {/* Poll Options */}
      <div className="space-y-4">
        {poll.options.map((option) => {
          const isSelected = selectedOption === option.id;

          return (
            <div
              key={option.id}
              onClick={() => !hasVoted && handleVote(option.id)}
              className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                hasVoted 
                  ? 'bg-[#0f1422] border-slate-800' 
                  : 'bg-[#0f1422] hover:bg-[#141b2c] border-slate-800 hover:border-red-600/70 cursor-pointer'
              }`}
            >
              {/* Background Progress Fill */}
              {hasVoted && (
                <div 
                  style={{ width: `${option.percentage}%` }}
                  className={`absolute inset-y-0 left-0 transition-all duration-1000 ${
                    isSelected ? 'bg-red-600/20' : 'bg-slate-800/40'
                  }`}
                />
              )}

              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">
                      {option.title}
                    </h3>
                    {isSelected && (
                      <span className="text-[10px] font-mono bg-red-600 text-white px-2 py-0.5 rounded-full flex items-center">
                        <CheckCircle className="w-3 h-3 mr-1" /> Tu voto
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {option.description}
                  </p>
                </div>

                {/* Percentage & Vote button */}
                <div className="flex items-center space-x-4 shrink-0 justify-between sm:justify-end">
                  {hasVoted ? (
                    <div className="text-right font-mono">
                      <span className="text-xl font-extrabold text-white">
                        {option.percentage}%
                      </span>
                      <p className="text-[10px] text-slate-500">{option.votes.toLocaleString()} votos</p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-mono font-bold shadow-md shadow-red-950 transition-colors"
                    >
                      Votar por este caso
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggest another topic */}
      <div className="bg-[#0e1320] border border-slate-800 rounded-2xl p-5 space-y-3">
        <h4 className="text-sm font-bold text-white font-mono flex items-center">
          <Flame className="w-4 h-4 text-amber-400 mr-2" />
          ¿Tienes otro caso peruano que no está en la lista?
        </h4>
        <p className="text-xs text-slate-400">
          Escribe tu sugerencia rápida y nuestro equipo la incluirá en la próxima votación del canal.
        </p>

        {suggestionSubmitted ? (
          <p className="text-xs text-emerald-400 font-mono py-2 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1.5" /> ¡Sugerencia enviada! El equipo la evaluará para el siguiente ciclo.
          </p>
        ) : (
          <form onSubmit={handleSuggestionSubmit} className="flex gap-2">
            <input
              type="text"
              value={userSuggestion}
              onChange={(e) => setUserSuggestion(e.target.value)}
              placeholder="Ej. El misterio del tren fantasma de Ticlio o el caso de la calle Capón..."
              className="flex-1 bg-[#0a0d14] border border-slate-700 text-xs text-white px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-red-500 font-sans"
            />
            <button
              type="submit"
              disabled={!userSuggestion.trim()}
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-xs font-mono font-medium flex items-center space-x-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Sugerir</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
