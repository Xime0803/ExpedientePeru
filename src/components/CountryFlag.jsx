import React from 'react';

export default function CountryFlag({ country = 'Perú', flag = '🇵🇪', className = 'w-5 h-4' }) {
  const c = (country || '').toLowerCase();
  const f = flag || '';

  // Perú 🇵🇪
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

  // México 🇲🇽
  if (c.includes('méxico') || c.includes('mexico') || f.includes('🇲🇽') || f === 'MX') {
    return (
      <span 
        className={`inline-flex rounded-[3px] overflow-hidden border border-slate-600 shrink-0 shadow-sm align-middle ${className}`} 
        title="México"
        aria-label="Bandera de México"
      >
        <span className="w-1/3 h-full bg-[#006847]"></span>
        <span className="w-1/3 h-full bg-white flex items-center justify-center">
          <span className="w-1 h-1 rounded-full bg-[#8B5A2B]"></span>
        </span>
        <span className="w-1/3 h-full bg-[#CE1126]"></span>
      </span>
    );
  }

  // Colombia 🇨🇴
  if (c.includes('colombia') || f.includes('🇨🇴') || f === 'CO') {
    return (
      <span 
        className={`inline-flex flex-col rounded-[3px] overflow-hidden border border-slate-600 shrink-0 shadow-sm align-middle ${className}`} 
        title="Colombia"
        aria-label="Bandera de Colombia"
      >
        <span className="w-full h-1/2 bg-[#FCD116]"></span>
        <span className="w-full h-1/4 bg-[#003893]"></span>
        <span className="w-full h-1/4 bg-[#CE1126]"></span>
      </span>
    );
  }

  // Ecuador 🇪🇨
  if (c.includes('ecuador') || f.includes('🇪🇨') || f === 'EC') {
    return (
      <span 
        className={`inline-flex flex-col rounded-[3px] overflow-hidden border border-slate-600 shrink-0 shadow-sm align-middle ${className}`} 
        title="Ecuador"
        aria-label="Bandera de Ecuador"
      >
        <span className="w-full h-1/2 bg-[#FFD100]"></span>
        <span className="w-full h-1/4 bg-[#0072CE]"></span>
        <span className="w-full h-1/4 bg-[#ED1C24]"></span>
      </span>
    );
  }

  // Venezuela 🇻🇪
  if (c.includes('venezuela') || f.includes('🇻🇪') || f === 'VE') {
    return (
      <span 
        className={`inline-flex flex-col rounded-[3px] overflow-hidden border border-slate-600 shrink-0 shadow-sm align-middle ${className}`} 
        title="Venezuela"
        aria-label="Bandera de Venezuela"
      >
        <span className="w-full h-1/3 bg-[#FCE300]"></span>
        <span className="w-full h-1/3 bg-[#00247D]"></span>
        <span className="w-full h-1/3 bg-[#CF142B]"></span>
      </span>
    );
  }

  // Bolivia 🇧🇴
  if (c.includes('bolivia') || f.includes('🇧🇴') || f === 'BO') {
    return (
      <span 
        className={`inline-flex flex-col rounded-[3px] overflow-hidden border border-slate-600 shrink-0 shadow-sm align-middle ${className}`} 
        title="Bolivia"
        aria-label="Bandera de Bolivia"
      >
        <span className="w-full h-1/3 bg-[#D52B1E]"></span>
        <span className="w-full h-1/3 bg-[#F9E300]"></span>
        <span className="w-full h-1/3 bg-[#007934]"></span>
      </span>
    );
  }

  // Chile 🇨🇱
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

  // Argentina 🇦🇷
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

  // Estados Unidos 🇺🇸
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

  // España 🇪🇸
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

  // Brasil 🇧🇷
  if (c.includes('brasil') || c.includes('brazil') || f.includes('🇧🇷') || f === 'BR') {
    return (
      <span 
        className={`inline-flex items-center justify-center rounded-[3px] overflow-hidden border border-slate-600 shrink-0 shadow-sm bg-[#009c3b] relative align-middle ${className}`} 
        title="Brasil"
        aria-label="Bandera de Brasil"
      >
        <span className="w-2.5 h-1.5 bg-[#ffdf00] rotate-45 transform"></span>
        <span className="w-1 h-1 bg-[#002776] rounded-full absolute"></span>
      </span>
    );
  }

  // Fallback a emoji o mundo
  return <span className="inline-block text-base shrink-0 leading-none" role="img" aria-label={country}>{flag || '🌎'}</span>;
}
