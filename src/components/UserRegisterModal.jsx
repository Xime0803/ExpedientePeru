import React, { useState } from 'react';
import { UserCheck, Globe, Shield, Sparkles, Check } from 'lucide-react';

export const COUNTRIES = [
  { code: "PE", name: "Perú", flag: "🇵🇪" },
  { code: "MX", name: "México", flag: "🇲🇽" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "ES", name: "España", flag: "🇪🇸" },
  { code: "US", name: "Estados Unidos", flag: "🇺🇸" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "OTRO", name: "Otro País", flag: "🌐" }
];

export default function UserRegisterModal({ isOpen, onClose, onSave, currentProfile }) {
  const [nickname, setNickname] = useState(currentProfile?.nickname || '');
  const [selectedCountry, setSelectedCountry] = useState(currentProfile?.country || 'Perú');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Por favor escribe tu seudónimo o nombre.');
      return;
    }

    const countryObj = COUNTRIES.find(c => c.name === selectedCountry) || COUNTRIES[0];

    onSave({
      nickname: nickname.trim(),
      country: countryObj.name,
      flag: countryObj.flag,
      registeredAt: new Date().toLocaleDateString()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-[#111726] border-2 border-red-500 rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl text-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-red-600/20 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto text-red-400 shadow-lg shadow-red-950">
            <UserCheck className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Identificación de la Comunidad
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
            Para participar en los comentarios, el chat y recomendar historias, regístrate con tu <strong>seudónimo</strong> y <strong>país</strong>.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          
          {/* Seudónimo Input */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-white mb-1.5">
              Tu Seudónimo o Nombre *
            </label>
            <input
              type="text"
              required
              maxLength={25}
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError('');
              }}
              placeholder="Ej. Don_Carlos, Investigador_Lima, Rosa_M..."
              className="w-full bg-[#0a0d14] border-2 border-slate-700 rounded-xl p-3 text-base text-white focus:outline-none focus:border-red-500 font-sans"
              autoFocus
            />
            {error && <p className="text-xs text-rose-400 mt-1 font-bold">{error}</p>}
          </div>

          {/* País Selector */}
          <div>
            <label className="block text-xs sm:text-sm font-bold text-white mb-1.5 flex items-center">
              <Globe className="w-4 h-4 mr-1 text-amber-400" />
              ¿De qué país nos visitas? *
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-[#0a0d14] border-2 border-slate-700 rounded-xl p-3 text-base text-white focus:outline-none focus:border-red-500 font-sans"
            >
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.name}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p>
              Tus datos se guardan en tu dispositivo para que tus comentarios y recomendaciones aparezcan con tu bandera y seudónimo en los canales oficiales.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-extrabold text-base flex items-center justify-center space-x-2 shadow-lg shadow-red-950 transition-all"
          >
            <Check className="w-5 h-5" />
            <span>Ingresar a la Comunidad</span>
          </button>
        </form>

      </div>
    </div>
  );
}
