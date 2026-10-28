import React from 'react';
import { MapPin, Calendar, Eye, MessageSquare, ArrowRight, ShieldAlert, Sparkles, Video } from 'lucide-react';

export default function CaseCard({ caseItem, onOpenDetail }) {
  const commentCount = caseItem.comments ? caseItem.comments.length : 0;

  return (
    <div 
      onClick={() => onOpenDetail(caseItem)}
      className="group relative bg-[#121826] hover:bg-[#162033] border-2 border-slate-700/80 hover:border-red-500/80 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-xl shadow-black/50 hover:-translate-y-1"
    >
      {/* Top Image with Badges */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-900">
        <img 
          src={caseItem.coverImage} 
          alt={caseItem.title} 
          className="w-full h-full object-cover filter brightness-85 group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121826] via-transparent to-transparent"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="font-mono text-xs uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur border border-red-500/60 text-red-400">
            {caseItem.code}
          </span>
          <span className={`text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-lg backdrop-blur border ${
            caseItem.status === 'ABIERTO' 
              ? 'bg-rose-950/90 text-rose-200 border-rose-700' 
              : caseItem.status === 'EN INVESTIGACIÓN' 
              ? 'bg-amber-950/90 text-amber-200 border-amber-700' 
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-700'
          }`}>
            {caseItem.status}
          </span>
        </div>

        {/* Region Chip */}
        <div className="absolute bottom-2.5 left-3 flex items-center space-x-1.5 text-xs font-bold text-amber-300 bg-black/80 backdrop-blur px-3 py-1 rounded-lg border border-slate-700">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>{caseItem.region}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-slate-300 mb-2">
            <span className="text-red-400">{caseItem.category}</span>
            <span>•</span>
            <span>Año: {caseItem.year}</span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
            {caseItem.title}
          </h3>

          <p className="text-sm text-slate-200 mt-2.5 line-clamp-2 leading-relaxed">
            {caseItem.synopsis}
          </p>
        </div>

        {/* Bottom Metadata */}
        <div className="mt-5 pt-3.5 border-t border-slate-700/80 flex items-center justify-between text-xs sm:text-sm font-mono text-slate-300">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-slate-300">
              <Eye className="w-4 h-4 mr-1 text-slate-400" />
              {caseItem.views}
            </span>
            <span className="flex items-center text-amber-300 font-bold">
              <MessageSquare className="w-4 h-4 mr-1" />
              {commentCount} teorías
            </span>
          </div>

          <span className="text-red-400 font-bold group-hover:translate-x-1 transition-transform flex items-center">
            Leer Expediente <ArrowRight className="w-4 h-4 ml-1" />
          </span>
        </div>
      </div>
    </div>
  );
}
