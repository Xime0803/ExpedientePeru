import React from 'react';
import { MapPin, Calendar, Eye, MessageSquare, ArrowRight, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

export default function CaseCard({ caseItem, onOpenDetail }) {
  const commentCount = caseItem.comments ? caseItem.comments.length : 0;

  return (
    <div 
      onClick={() => onOpenDetail(caseItem)}
      className="group relative bg-[#121927] hover:bg-[#162135] border-2 border-slate-600 hover:border-red-500 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/60 hover:-translate-y-1.5 focus:outline-none focus:ring-4 focus:ring-amber-500"
      tabIndex={0}
      role="button"
      aria-label={`Leer expediente sobre ${caseItem.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetail(caseItem);
        }
      }}
    >
      {/* Imagen Superior con Etiquetas Claras */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-900">
        <img 
          src={caseItem.coverImage} 
          alt={caseItem.title} 
          className="w-full h-full object-cover filter brightness-90 group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121927] via-transparent to-black/30"></div>

        {/* Insignias Superiores */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="font-mono text-xs uppercase font-black tracking-wider px-3 py-1 rounded-xl bg-black/90 backdrop-blur border-2 border-red-500 text-red-300 shadow-md">
            {caseItem.code}
          </span>
          <span className={`text-xs font-mono font-black uppercase px-3 py-1 rounded-xl backdrop-blur border-2 shadow-md ${
            caseItem.status === 'ABIERTO' 
              ? 'bg-rose-950 text-rose-200 border-rose-500' 
              : caseItem.status === 'EN INVESTIGACIÓN' 
              ? 'bg-amber-950 text-amber-200 border-amber-500' 
              : 'bg-emerald-950 text-emerald-200 border-emerald-500'
          }`}>
            {caseItem.status}
          </span>
        </div>

        {/* Chip de Lugar / Región en Perú */}
        <div className="absolute bottom-3 left-3 flex items-center space-x-1.5 text-xs font-extrabold text-amber-300 bg-black/85 backdrop-blur px-3 py-1.5 rounded-xl border border-slate-600 shadow-md">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{caseItem.region}</span>
        </div>
      </div>

      {/* Contenido Textual con Alto Contraste y Letra Cómoda */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Metadatos Rápidos */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-slate-300 mb-2.5">
            <span className="text-red-400 font-extrabold px-2 py-0.5 rounded bg-red-950/80 border border-red-800">
              {caseItem.category}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-300 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              Año: {caseItem.year}
            </span>
          </div>

          {/* Título Grande y Legible */}
          <h3 className="text-lg sm:text-xl font-extrabold text-white group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
            {caseItem.title}
          </h3>

          {/* Resumen con Letra Clara */}
          <p className="text-sm sm:text-base text-slate-100 mt-3 line-clamp-3 leading-relaxed">
            {caseItem.synopsis}
          </p>
        </div>

        {/* Botón Grande Amigable de Lectura (Fácil de pulsar para adultos mayores) */}
        <div className="pt-4 border-t-2 border-slate-700/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-300">
            <span className="flex items-center text-slate-300">
              <Eye className="w-4 h-4 mr-1 text-slate-400" />
              {caseItem.views} lecturas
            </span>
            <span className="flex items-center text-amber-300 font-bold">
              <MessageSquare className="w-4 h-4 mr-1" />
              {commentCount} aportes / teorías
            </span>
          </div>

          <button 
            type="button"
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 group-hover:from-red-500 group-hover:to-amber-500 text-white font-extrabold text-sm sm:text-base flex items-center justify-center space-x-2 shadow-lg shadow-red-950/60 transition-all border border-red-400/40"
          >
            <BookOpen className="w-5 h-5 shrink-0" />
            <span>Leer Expediente Completo</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
