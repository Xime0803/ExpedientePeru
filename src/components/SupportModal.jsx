import React, { useState, useEffect } from 'react';
import { Heart, Copy, Check, X, ShieldCheck, Sparkles, Smartphone, Lock } from 'lucide-react';
import { getVerifiedPaymentPhone, secureCopyToClipboard } from '../security/securityVault';

export default function SupportModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState("916839878");
  const [isIntegrityOk, setIsIntegrityOk] = useState(true);

  useEffect(() => {
    if (isOpen) {
      getVerifiedPaymentPhone().then(phone => {
        setVerifiedPhone(phone);
        setIsIntegrityOk(phone === "916839878");
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    const success = await secureCopyToClipboard();
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-[#111726] border-2 border-red-500/50 rounded-2xl w-full max-w-lg p-5 sm:p-8 max-h-[92vh] overflow-y-auto shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors"
          aria-label="Cerrar ventana"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-red-600/20 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto text-red-400 shadow-lg shadow-red-950">
            <Heart className="w-7 h-7 fill-red-500 text-red-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Apoyo Voluntario al Canal
          </h2>
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-md mx-auto">
            ¡Muchas gracias por acompañarnos! Tu colaboración voluntaria nos permite seguir investigando historias reales, revisando archivos y produciendo videos para YouTube y TikTok.
          </p>
        </div>

        {/* Payment Methods Badges */}
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          <span className="px-3.5 py-1.5 rounded-xl bg-purple-900/60 border border-purple-500/80 text-purple-200 font-bold text-sm flex items-center space-x-1.5 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <span>Yape</span>
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-cyan-900/60 border border-cyan-500/80 text-cyan-200 font-bold text-sm flex items-center space-x-1.5 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
            <span>Plin</span>
          </span>
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-900/60 border border-emerald-500/80 text-emerald-200 font-bold text-sm flex items-center space-x-1.5 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Dale</span>
          </span>
        </div>

        {/* Number Display Box (Large & High Contrast for Seniors, with Cryptographic Seal) */}
        <div className="mt-6 bg-[#0a0e18] border-2 border-slate-700 rounded-2xl p-5 text-center space-y-3 relative overflow-hidden">
          
          <div className="flex items-center justify-center space-x-1.5 text-xs font-mono text-emerald-400 font-bold">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>NÚMERO OFICIAL SELLADO E INMUTABLE</span>
          </div>

          <div className="text-3xl sm:text-4xl font-extrabold tracking-widest text-amber-300 font-mono select-all">
            {verifiedPhone}
          </div>

          <button
            onClick={handleCopy}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-base flex items-center justify-center space-x-2 transition-all shadow-lg ${
              copied 
                ? 'bg-emerald-600 text-white' 
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/60'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-white" />
                <span>¡Número Verificado Copiado al Portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copiar Número ({verifiedPhone})</span>
              </>
            )}
          </button>

          <p className="text-[10px] font-mono text-slate-500">
            Protección de Integridad: Firma SHA-256 anti-manipulación activa
          </p>
        </div>

        {/* Friendly Instructions for older adults */}
        <div className="mt-5 space-y-2 text-xs sm:text-sm text-slate-300 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <p className="font-bold text-white flex items-center">
            <Smartphone className="w-4 h-4 mr-1.5 text-amber-400 shrink-0" />
            ¿Cómo realizar tu aporte?
          </p>
          <ol className="list-decimal pl-5 space-y-1 text-slate-300">
            <li>Abre tu aplicación de <strong>Yape</strong>, <strong>Plin</strong> o <strong>Dale</strong> en tu teléfono.</li>
            <li>Ingresa el número oficial <strong>916 839 878</strong>.</li>
            <li>Coloca el monto que desees (¡desde S/ 1 sol es de gran ayuda para las crónicas!).</li>
            <li>En el mensaje puedes escribir tu nombre o el caso que más te gusta.</li>
          </ol>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-center text-xs text-slate-400 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-400 mr-1.5 shrink-0" />
          <span>Canales Oficiales: YouTube @XimeFer8322 y TikTok @epicclips_83</span>
        </div>

      </div>
    </div>
  );
}
