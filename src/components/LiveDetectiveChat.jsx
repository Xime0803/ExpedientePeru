import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Users, Radio, Shield, Smile, Hash, AlertCircle, Bot, Sparkles, Volume2, VolumeX, Globe 
} from 'lucide-react';

const initialMessages = [
  {
    id: "welcome-1",
    channel: "teorias-generales",
    author: "Canal Oficial",
    country: "Perú",
    flag: "🇵🇪",
    badge: "MODERADOR",
    avatar: "🎙️",
    time: "En vivo",
    text: "¡Bienvenidos a la Sala de Debate oficial de @XimeFer8322 y @epicclips_83! Comparte tus hipótesis, datos de hemeroteca o preguntas con tu seudónimo y país.",
    isBot: true
  }
];

export default function LiveDetectiveChat({ userProfile, onOpenRegister }) {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('expediente_chat_msgs_v3');
    return saved ? JSON.parse(saved) : initialMessages;
  });

  const [currentChannel, setCurrentChannel] = useState('teorias-generales');
  const [inputText, setInputText] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('expediente_chat_msgs_v3', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentChannel]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!userProfile?.nickname) {
      onOpenRegister();
      return;
    }

    const userMsg = {
      id: "msg-" + Date.now(),
      channel: currentChannel,
      author: userProfile.nickname,
      country: userProfile.country || "Perú",
      flag: userProfile.flag || "🇵🇪",
      badge: "Seguidor",
      avatar: "🕵️",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: inputText.trim()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
  };

  const handleSendQuickTag = (tag) => {
    setInputText(prev => prev ? `${prev} [${tag}]` : `[${tag}] `);
  };

  const filteredMessages = messages.filter(m => m.channel === currentChannel);

  const channels = [
    { id: 'teorias-generales', name: 'teorías-generales', desc: 'Debate de hipótesis y casos peruanos' },
    { id: 'pistas-urgentes', name: 'pistas-urgentes', desc: 'Datos y avistamientos recientes' },
    { id: 'pedidos-al-canal', name: 'pedidos-al-canal', desc: 'Qué casos quieres ver en YouTube o TikTok' }
  ];

  return (
    <div className="bg-[#0c101a] border-2 border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[78vh] sm:h-[80vh] max-w-6xl mx-auto">
      
      {/* Sidebar on Desktop / Horizontal bar on Mobile */}
      <div className="w-full md:w-64 bg-[#090d15] border-b md:border-b-0 md:border-r-2 border-slate-800 p-3 sm:p-4 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center justify-between text-slate-300 mb-3 pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-red-500 animate-pulse" />
              <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                Radio Detectives
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">● En vivo</span>
          </div>

          {/* Channels Pills */}
          <div className="flex md:flex-col gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none font-mono text-xs sm:text-sm">
            {channels.map(chan => (
              <button
                key={chan.id}
                onClick={() => setCurrentChannel(chan.id)}
                className={`px-3 py-2.5 rounded-xl font-bold flex items-center space-x-2 transition-colors shrink-0 text-left ${
                  currentChannel === chan.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-950'
                    : 'bg-[#121826] md:bg-transparent text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 md:border-0'
                }`}
              >
                <Hash className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{chan.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User Profile Card */}
        <div className="mt-3 pt-3 border-t border-slate-800/80 bg-slate-900/60 p-2.5 sm:p-3 rounded-xl flex items-center justify-between">
          <div 
            onClick={onOpenRegister}
            className="flex items-center space-x-2 overflow-hidden cursor-pointer group"
          >
            <span className="text-xl">{userProfile?.flag || '🇵🇪'}</span>
            <div className="truncate font-mono">
              <p className="text-[10px] text-slate-400 font-bold uppercase">IDENTIDAD</p>
              <p className="text-xs text-amber-300 font-bold truncate group-hover:underline">
                {userProfile?.nickname ? `${userProfile.nickname} (${userProfile.country})` : 'Registrar Seudónimo'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col justify-between bg-[#0e1320] overflow-hidden">
        
        {/* Channel Header */}
        <div className="bg-[#121826] px-4 py-2.5 sm:py-3 border-b-2 border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 font-mono">
            <Hash className="w-4 h-4 text-red-500" />
            <span className="text-sm sm:text-base font-bold text-white">
              {channels.find(c => c.id === currentChannel)?.name}
            </span>
          </div>

          <span className="text-xs text-slate-300 font-mono">
            Canales: @XimeFer8322 & @epicclips_83
          </span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {filteredMessages.map((msg) => (
            <div 
              key={msg.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                msg.isBot 
                  ? 'bg-red-950/40 border-red-800/80 text-red-100'
                  : msg.author === userProfile?.nickname
                  ? 'bg-slate-800/90 border-slate-700 ml-4 sm:ml-12'
                  : 'bg-slate-900/80 border-slate-800 mr-4 sm:mr-12'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="text-base">{msg.flag || '🇵🇪'}</span>
                  <span className="text-xs sm:text-sm font-bold text-white font-mono">
                    {msg.author}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    ({msg.country || 'Perú'})
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {msg.badge}
                  </span>
                </div>
                <span className="text-[10px] sm:text-xs font-mono text-slate-400">{msg.time}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans pl-6">
                {msg.text}
              </p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reaction Pills */}
        <div className="px-3 py-1.5 bg-[#101624] border-t border-slate-800 flex items-center space-x-1.5 overflow-x-auto text-xs font-mono scrollbar-none">
          <span className="shrink-0 text-slate-400 hidden sm:inline">Insertar:</span>
          {['🚨 PISTA', '👁️ SOSPECHOSO', '🔥 CONFIRMADO', '💡 MI TEORÍA'].map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => handleSendQuickTag(tag)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 shrink-0 font-bold"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <form onSubmit={handleSendMessage} className="p-3 bg-[#121826] border-t-2 border-slate-800 flex items-center space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              userProfile?.nickname 
                ? `Escribe tu mensaje como ${userProfile.nickname} (${userProfile.country})...` 
                : "Registra tu seudónimo y país para chatear..."
            }
            className="flex-1 bg-[#0a0d14] border-2 border-slate-700 text-white text-base px-3.5 py-3 rounded-xl focus:outline-none focus:border-red-500 font-sans placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white px-5 py-3 rounded-xl font-bold text-sm flex items-center space-x-1.5 shadow-lg shadow-red-950 transition-colors shrink-0"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </form>

      </div>
    </div>
  );
}
