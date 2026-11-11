import React from 'react';

export default function CountryFlag({ country = 'Perú', flag = '🇵🇪', className = 'w-5 h-4' }) {
  const c = (country || '').toLowerCase();
  const f = flag || '';

  if (c.includes('perú') || c.includes('peru') || f.includes('🇵🇪') || f === 'PE') {
    return (
      <span 
        className={`inline-flex rounded-[3px] overflow-hidden border border-slate-600 shrink-0 shadow-sm align-middle ${className}`} 
        title="Perú"
        aria-label="Bandera de Perú"
      >
        <span className="w-1/3 h-full bg-[#D91023]"></span>
        <span className="w-1/3 h-full bg-white"></span>
        <span className="w-1/3 h-full bg-[#D91023]"></span>
      </span>
    );
  }

  if (c.includes('chile') || f.includes('🇨🇱') || f === 'CL') {
    return (
      <span 
        className={`inline-flex flex-col rounded-[3px] overflow-hidden border border-slate-600 shrink-0 shadow-sm align-middle ${className}`} 
        title="Chile"
        aria-label="Bandera de Chile"
      >
        <span className="w-full h-1/2 flex">
          <span className="w-1/2 h-full bg-[#0039A6]"></span>
          <span className="w-1/2 h-full bg-white"></span>
        </span>
        <span className="w-full h-1/2 bg-[#D52B1E]"></span>
      </span>
    );
  }

  if (c.includes('argentina') || f.includes('🇦🇷') || f === 'AR') {
    return (
      <span 
        className={`inline-flex flex-col rounded-[3px] overflow-hidden border border-slate-600 shrink-0 shadow-sm align-middle ${className}`} 
        title="Argentina"
        aria-label="Bandera de Argentina"
      >
        <span className="w-full h-1/3 bg-[#74ACDF]"></span>
        <span className="w-full h-1/3 bg-white flex items-center justify-center">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F6B40E]"></span>
        </span>
        <span className="w-full h-1/3 bg-[#74ACDF]"></span>
      </span>
    );
  }

  if (c.includes('ee.uu') || c.includes('estados unidos') || c.includes('usa') || f.includes('🇺🇸') || f === 'US') {
    return (
      <span 
        className={`inline-flex items-center justify-center rounded-[3px] overflow-hidden border border-slate-600 shrink-0 shadow-sm bg-[#002868] text-white font-mono font-bold text-[9px] px-1 align-middle ${className}`} 
        title="Estados Unidos"
        aria-label="Bandera de Estados Unidos"
      >
        USA
      </span>
    );
  }

  if (c.includes('españa') || c.includes('espana') || f.includes('🇪🇸') || f === 'ES') {
    return (
      <span 
        className={`inline-flex flex-col rounded-[3px] overflow-hidden border border-slate-600 shrink-0 shadow-sm align-middle ${className}`} 
        title="España"
        aria-label="Bandera de España"
      >
        <span className="w-full h-1/4 bg-[#AA151B]"></span>
        <span className="w-full h-2/4 bg-[#F1BF00]"></span>
        <span className="w-full h-1/4 bg-[#AA151B]"></span>
      </span>
    );
  }

  // Fallback a emoji o mundo
  return <span className="inline-block text-base shrink-0 leading-none" role="img" aria-label={country}>{flag || '🌎'}</span>;
}
