import React, { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  ArrowRight, 
  Layers, 
  Radio, 
  Eye, 
  Sparkles, 
  CheckCircle2, 
  Info,
  Navigation,
  Globe2
} from 'lucide-react';

const regionsData = [
  {
    id: "lima",
    name: "Lima Metropolitana y Costa Central",
    shortName: "Lima",
    code: "LMA",
    naturalRegion: "Costa Central",
    casesCount: 6,
    svgX: 195,
    svgY: 345,
    coords: "12°02'S 77°01'W",
    highlightCaseId: "caso-002",
    highlightTitle: "El Monstruo de Armendáriz y los Crímenes de Poder en Lima",
    summary: "Epicentro de los casos judiciales y crónicas hemerográficas más debatidas: el fusilamiento de Villanueva Torres, el caso Calígula, la tragedia de Utopía, el caso Marita Alpaca en el Hotel Sheraton y el crimen de Luis Banchero Rossi en Chaclacayo.",
    keyPoints: ["Quebrada de Armendáriz", "Hotel Sheraton", "Jockey Plaza / Utopía", "Chaclacayo", "Cieneguilla", "Jirón Lampa"]
  },
  {
    id: "arequipa",
    name: "Arequipa y Cañón del Colca",
    shortName: "Arequipa",
    code: "AQP",
    naturalRegion: "Sierra Sur",
    casesCount: 1,
    svgX: 355,
    svgY: 535,
    coords: "16°23'S 71°32'W",
    highlightCaseId: "caso-001",
    highlightTitle: "El Caso Ciro Castillo en el Cañón del Colca (2011)",
    summary: "Las agrestes quebradas del nevado Bomboya a más de 4,000 metros de altitud: 202 días de intensa búsqueda, brigadas de rescatistas internacionales 'Topos de México' y la posterior resolución fiscal definitiva.",
    keyPoints: ["Nevado Bomboya", "Quebrada de Casca", "Chivay y Madrigal", "Valle del Colca"]
  },
  {
    id: "ica",
    name: "Ica, Pisco y Desierto Sur",
    shortName: "Ica",
    code: "ICA",
    naturalRegion: "Costa Sur",
    casesCount: 1,
    svgX: 250,
    svgY: 430,
    coords: "14°04'S 75°43'W",
    highlightCaseId: "caso-008",
    highlightTitle: "El Terremoto de Pisco y el Desfalco del FORSUR (2007)",
    summary: "El devastador sismo de 7.9 que cobró 595 vidas y el posterior megaproceso penal por la malversación y desvío de los fondos de reconstrucción internacional que dejó a miles de familias viviendo en campamentos.",
    keyPoints: ["Plaza de Armas de Pisco", "Iglesia San Clemente", "FORSUR", "Chincha e Ica"]
  },
  {
    id: "ancash",
    name: "Áncash y Callejón de Huaylas",
    shortName: "Áncash",
    code: "ANC",
    naturalRegion: "Sierra Central",
    casesCount: 1,
    svgX: 175,
    svgY: 260,
    coords: "09°31'S 77°31'W",
    highlightCaseId: null,
    highlightTitle: "El Enigma de la Cordillera Blanca tras el Aluvión de Yungay (1970)",
    summary: "El violento sismo y alud que sepultó una ciudad entera en cuestión de segundos. Archivos de rescate civil, expediciones a los pies del nevado Huascarán y crónicas de supervivientes.",
    keyPoints: ["Nevado Huascarán", "Campo Santo de Yungay", "Callejón de Huaylas", "Huaraz"]
  },
  {
    id: "cusco",
    name: "Cusco y Valle Sagrado",
    shortName: "Cusco",
    code: "CUZ",
    naturalRegion: "Sierra Sur",
    casesCount: 1,
    svgX: 385,
    svgY: 460,
    coords: "13°31'S 71°58'W",
    highlightCaseId: null,
    highlightTitle: "El Robo de la Custodia de Oro de la Catedral del Cusco (1983)",
    summary: "El millonario expolio de arte sacro colonial más grande de los Andes peruanos sustraído en la madrugada cusqueña. Piezas virreinales con más de 300 esmeraldas que jamás fueron recuperadas.",
    keyPoints: ["Catedral del Cusco", "Plaza de Armas", "Sacsayhuamán", "Valle Sagrado"]
  },
  {
    id: "la-libertad",
    name: "La Libertad y Costa Norte",
    shortName: "La Libertad",
    code: "LIB",
    naturalRegion: "Costa Norte",
    casesCount: 1,
    svgX: 140,
    svgY: 195,
    coords: "08°06'S 79°01'W",
    highlightCaseId: null,
    highlightTitle: "Misterios Coloniales y Saqueo de Huacas en Trujillo",
    summary: "Crónicas de tesoros coloniales ocultos en las casonas virreinales, excavaciones clandestinas en los valles norteños y enigmas arqueológicos de la ciudadela de Chan Chan.",
    keyPoints: ["Huacas del Sol y de la Luna", "Chan Chan", "Casonas Virreinales de Trujillo", "Moche"]
  },
  {
    id: "puno",
    name: "Puno y Lago Titicaca",
    shortName: "Puno",
    code: "PUN",
    naturalRegion: "Altiplano Sur",
    casesCount: 1,
    svgX: 435,
    svgY: 520,
    coords: "15°50'S 70°01'W",
    highlightCaseId: null,
    highlightTitle: "Misterios del Altiplano y la Ciudad Sumergida del Titicaca",
    summary: "Expediciones submarinas científicas y leyendas de templos sumergidos a más de 3,812 metros de altitud en las aguas del lago navegable más alto del mundo.",
    keyPoints: ["Lago Titicaca", "Islas de los Uros", "Península de Chucuito", "Taquile"]
  },
  {
    id: "loreto",
    name: "Loreto y Selva Amazónica",
    shortName: "Loreto",
    code: "LOR",
    naturalRegion: "Selva Norte",
    casesCount: 1,
    svgX: 340,
    svgY: 130,
    coords: "03°44'S 73°14'W",
    highlightCaseId: null,
    highlightTitle: "El Auge de la Fiebre del Caucho y Leyendas de la Selva Virgen",
    summary: "Crónicas hemerográficas sobre el periodo del caucho en Iquitos, palacetes de azulejos europeos en medio de la selva y expediciones en las cuencas de los ríos Marañón y Ucayali.",
    keyPoints: ["Río Amazonas", "Iquitos Histórico", "Río Ucayali y Marañón", "Nauta"]
  },
  {
    id: "ayacucho",
    name: "Ayacucho y Valles Altoandinos",
    shortName: "Ayacucho",
    code: "AYA",
    naturalRegion: "Sierra Sur",
    casesCount: 2,
    svgX: 315,
    svgY: 435,
    coords: "13°09'S 74°13'W",
    highlightCaseId: "caso-009",
    highlightTitle: "La Masacre de Uchuraccay y los 35 Años de Cayara",
    summary: "Epicentro de los expedientes judiciales más dolorosos y emblemáticos del Perú andino: la tragedia de los 8 periodistas en las alturas de Huanta y la sistemática eliminación de testigos judiciales en Cayara.",
    keyPoints: ["Uchuraccay", "Cayara", "Huanta", "Víctor Fajardo"]
  },
  {
    id: "amazonas",
    name: "Amazonas y Selva Alta",
    shortName: "Amazonas",
    code: "AMA",
    naturalRegion: "Selva Norte",
    casesCount: 1,
    svgX: 230,
    svgY: 140,
    coords: "06°13'S 77°52'W",
    highlightCaseId: "caso-011",
    highlightTitle: "El Baguazo y la Curva del Diablo (2009)",
    summary: "El juicio penal más masivo de la Amazonía peruana: 52 dirigentes indígenas awajún y wampís procesados durante 7 años hasta su histórica absolución unánime por falta de pruebas individuales.",
    keyPoints: ["Curva del Diablo", "Bagua Chica", "Río Marañón", "Imacita"]
  },
  {
    id: "cajamarca",
    name: "Cajamarca y Andes del Norte",
    shortName: "Cajamarca",
    code: "CAJ",
    naturalRegion: "Sierra Norte",
    casesCount: 1,
    svgX: 180,
    svgY: 160,
    coords: "07°09'S 78°30'W",
    highlightCaseId: "caso-012",
    highlightTitle: "Máxima Acuña vs. Yanacocha en Celendín (2011 - 2017)",
    summary: "La batalla jurídica por el predio Tragadero Grande y las lagunas de Celendín: de la condena provincial a prisión hasta la absolución definitiva en la Corte Suprema de Justicia.",
    keyPoints: ["Tragadero Grande", "Celendín", "Laguna Azul", "Sorochuco"]
  }
];

export default function PeruMapInteractive({ onSelectCaseById }) {
  const [activeRegion, setActiveRegion] = useState(regionsData[0]);
  const [mapTheme, setMapTheme] = useState('iluminado'); // 'iluminado' | 'tactico'

  return (
    <div className="bg-[#0b111e] border-2 border-slate-700/80 rounded-3xl p-4 sm:p-7 shadow-2xl max-w-6xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-extrabold">
              RADAR CARTOGRÁFICO DE INVESTIGACIÓN
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Mapa de Casos y Crónicas del Perú
          </h2>
          <p className="text-sm sm:text-base text-slate-300 mt-1 leading-relaxed">
            Explora el territorio nacional interactivo con alta legibilidad. Pulsa un departamento o los puntos del radar para abrir sus expedientes documentados.
          </p>
        </div>

        {/* Theme & Mode Toggles */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700">
          <button
            onClick={() => setMapTheme('iluminado')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              mapTheme === 'iluminado'
                ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Vista cartográfica con colores naturales y alta iluminación"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Mapa Claro</span>
          </button>

          <button
            onClick={() => setMapTheme('tactico')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
              mapTheme === 'tactico'
                ? 'bg-red-600 text-white shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Vista radar nocturno de alta precisión"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Radar Nocturno</span>
          </button>
        </div>
      </div>

      {/* Senior-Friendly Department Quick Buttons (No truncated names) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-amber-300 font-bold flex items-center space-x-1.5">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Selecciona un departamento:</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            {regionsData.length} zonas en investigación
          </span>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-2.5">
          {regionsData.map(reg => {
            const isSelected = activeRegion?.id === reg.id;
            return (
              <button
                key={reg.id}
                onClick={() => setActiveRegion(reg)}
                className={`px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all border-2 ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-400 shadow-lg shadow-red-950 scale-105'
                    : 'bg-[#131b2e] text-slate-200 border-slate-700/80 hover:border-amber-400 hover:bg-[#1a253e]'
                }`}
              >
                <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-amber-400'}`} />
                <span className="whitespace-nowrap">{reg.shortName}</span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  isSelected 
                    ? 'bg-black/40 text-amber-300' 
                    : 'bg-slate-900 text-slate-300'
                }`}>
                  {reg.casesCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Interactive Map + Dossier Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* INTERACTIVE VECTOR MAP CONTAINER */}
        <div className={`lg:col-span-7 rounded-2xl relative p-3 sm:p-5 h-[420px] sm:h-[520px] flex items-center justify-center overflow-hidden border-2 transition-colors ${
          mapTheme === 'iluminado'
            ? 'bg-gradient-to-br from-[#0c1f38] via-[#0f2849] to-[#091629] border-cyan-700/60 shadow-2xl'
            : 'bg-gradient-to-br from-[#080d17] via-[#0e1626] to-[#070b13] border-slate-700 shadow-2xl'
        }`}>
          
          {/* Subtle Grid / Nautical Coordinates */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#38bdf812_1px,transparent_1px),linear-gradient(to_bottom,#38bdf812_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

          {/* Pacific Ocean Bathymetric Depth Waves */}
          <div className="absolute left-3 bottom-6 text-[11px] font-mono text-cyan-300/60 uppercase tracking-widest font-black pointer-events-none select-none flex flex-col items-start space-y-1">
            <span className="text-cyan-400/90 text-xs sm:text-sm tracking-wider flex items-center space-x-1">
              <Globe2 className="w-3.5 h-3.5 inline text-cyan-400" />
              <span>OCÉANO PACÍFICO</span>
            </span>
            <span className="text-[10px] text-cyan-500/50">Cuenca Sudamericana • Fosa de Perú</span>
          </div>

          {/* Compass Rose (Rosa de los Vientos) */}
          <div className="absolute top-4 left-4 pointer-events-none select-none flex items-center space-x-2 bg-slate-900/80 px-2.5 py-1.5 rounded-xl border border-slate-700/80 backdrop-blur-sm">
            <div className="relative w-6 h-6 flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border border-amber-400/60 flex items-center justify-center">
                <Navigation className="w-3.5 h-3.5 text-red-500 -rotate-45" />
              </div>
            </div>
            <div className="text-[10px] font-mono leading-tight">
              <p className="text-amber-300 font-bold">NORTE</p>
              <p className="text-slate-400">COORD: PERÚ</p>
            </div>
          </div>

          {/* HIGH DEFINITION SVG CARTOGRAPHY OF PERU */}
          <svg 
            viewBox="0 0 600 700" 
            className="w-full h-full max-h-[490px] select-none filter drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
          >
            <defs>
              {/* Costa / Litoral Gradient */}
              <linearGradient id="costaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#d97706" stopOpacity="0.25" />
              </linearGradient>

              {/* Sierra / Andes Gradient */}
              <linearGradient id="sierraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#854d0e" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#451a03" stopOpacity="0.4" />
              </linearGradient>

              {/* Selva / Amazonia Gradient */}
              <linearGradient id="selvaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#065f46" stopOpacity="0.35" />
              </linearGradient>

              {/* Glowing Outer Contour of Peru */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={mapTheme === 'iluminado' ? '#38bdf8' : '#e11d48'} floodOpacity="0.6"/>
              </filter>
            </defs>

            {/* NEIGHBORING COUNTRIES SILHOUETTES FOR GEOGRAPHIC CONTEXT */}
            {/* Ecuador & Colombia */}
            <path 
              d="M 60 70 L 100 75 L 140 65 L 170 70 L 210 50 L 270 30 L 320 45 L 380 30 L 390 10 L 100 10 Z" 
              fill="#08101e" 
              stroke="#1e293b" 
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text x="210" y="38" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">ECUADOR</text>
            <text x="350" y="25" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">COLOMBIA</text>

            {/* Brasil */}
            <path 
              d="M 530 110 L 580 150 L 590 320 L 505 330 L 520 270 L 490 220 L 515 160 Z" 
              fill="#08101e" 
              stroke="#1e293b" 
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text x="525" y="210" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">BRASIL</text>

            {/* Bolivia */}
            <path 
              d="M 505 330 L 590 350 L 580 540 L 455 555 L 485 520 L 470 480 L 500 450 L 535 390 Z" 
              fill="#08101e" 
              stroke="#1e293b" 
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text x="515" y="470" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">BOLIVIA</text>

            {/* Chile */}
            <path 
              d="M 395 650 L 420 620 L 460 680 L 400 680 Z" 
              fill="#08101e" 
              stroke="#1e293b" 
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            <text x="420" y="660" fill="#475569" fontSize="11" fontFamily="monospace" fontWeight="bold">CHILE</text>

            {/* PERU NATURAL REGIONS (COSTA, SIERRA, SELVA) */}
            
            {/* 1. SELVA (Amazon Basin - East) */}
            <path
              d="M 270 30 L 320 45 L 380 80 L 450 50 L 495 75 L 530 110 L 515 160 L 490 220 L 520 270 L 505 330 L 535 390 L 470 380 L 400 320 L 350 250 L 290 170 L 250 90 L 270 30 Z"
              fill="url(#selvaGradient)"
              stroke="#10b981"
              strokeWidth="1.2"
              className="transition-all hover:opacity-90"
            />

            {/* Amazonian Rivers (Amazonas, Marañón, Ucayali) */}
            <path
              d="M 280 120 Q 340 110 390 125 T 460 115 T 525 110"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity="0.8"
            />
            <text x="400" y="105" fill="#38bdf8" fontSize="10" fontFamily="sans-serif" fontWeight="bold">Río Amazonas</text>

            <path
              d="M 300 230 Q 360 210 390 170 T 390 125"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.65"
            />
            <text x="350" y="210" fill="#7dd3fc" fontSize="9" fontFamily="sans-serif">Río Ucayali</text>

            {/* 2. SIERRA (Andean Mountain Chain - Center Spine) */}
            <path
              d="M 205 82 L 250 90 L 290 170 L 350 250 L 400 320 L 470 380 L 500 450 L 470 480 L 485 520 L 455 555 L 420 620 L 395 650 L 370 610 L 320 540 L 270 440 L 220 350 L 180 270 L 155 210 L 140 160 L 205 82 Z"
              fill="url(#sierraGradient)"
              stroke="#f59e0b"
              strokeWidth="1.2"
              className="transition-all hover:opacity-90"
            />

            {/* Mountain Crest Peak Markers */}
            <g opacity="0.6" stroke="#fbbf24" strokeWidth="1.5" fill="none">
              <path d="M 165 240 L 175 225 L 185 240" />
              <path d="M 180 240 L 190 220 L 200 240" />
              <path d="M 360 480 L 370 465 L 380 480" />
              <path d="M 335 555 L 345 540 L 355 555" />
            </g>

            {/* 3. COSTA (Pacific Coastal Strip) */}
            <path
              d="M 95 85 L 125 78 L 160 95 L 205 82 L 140 160 L 155 210 L 180 270 L 220 350 L 270 440 L 320 540 L 370 610 L 395 650 L 370 610 L 320 560 L 280 500 L 245 440 L 220 380 L 190 320 L 175 270 L 155 220 L 135 175 L 115 140 L 90 115 L 70 95 L 95 85 Z"
              fill="url(#costaGradient)"
              stroke="#fbbf24"
              strokeWidth="1.2"
              className="transition-all hover:opacity-90"
            />

            {/* Lake Titicaca */}
            <ellipse 
              cx="455" 
              cy="525" 
              rx="20" 
              ry="14" 
              fill="#0284c7" 
              stroke="#38bdf8" 
              strokeWidth="2"
              className="animate-pulse"
            />
            <text x="440" y="550" fill="#7dd3fc" fontSize="9" fontFamily="sans-serif" fontWeight="bold">L. Titicaca</text>

            {/* PERU COMPLETE HIGHWAY / COASTAL BORDER WITH LUMINOUS GLOW */}
            <path
              d="M 95 85 L 125 78 L 160 95 L 205 82 L 250 90 L 285 65 L 340 45 L 395 30 L 450 50 L 495 75 L 530 110 L 515 160 L 490 220 L 520 270 L 505 330 L 535 390 L 500 450 L 470 480 L 485 520 L 455 555 L 420 620 L 395 650 L 370 610 L 320 560 L 280 500 L 245 440 L 220 380 L 190 320 L 175 270 L 155 220 L 135 175 L 115 140 L 90 115 L 70 95 L 95 85 Z"
              fill="none"
              stroke={mapTheme === 'iluminado' ? '#38bdf8' : '#e11d48'}
              strokeWidth="2.8"
              filter="url(#glow)"
            />

            {/* LATITUDE & LONGITUDE GRID LINES (High Visibility) */}
            <g stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.4">
              <line x1="40" y1="150" x2="560" y2="150" />
              <text x="45" y="145" fill="#38bdf8" fontSize="8" fontFamily="monospace">05°S</text>
              <line x1="40" y1="330" x2="560" y2="330" />
              <text x="45" y="325" fill="#38bdf8" fontSize="8" fontFamily="monospace">12°S (LIMA)</text>
              <line x1="40" y1="520" x2="560" y2="520" />
              <text x="45" y="515" fill="#38bdf8" fontSize="8" fontFamily="monospace">16°S (AREQUIPA)</text>
            </g>

            {/* INTERACTIVE DEPARTMENT TARGET NODES & PINS */}
            {regionsData.map(reg => {
              const isSelected = activeRegion?.id === reg.id;
              return (
                <g 
                  key={reg.id}
                  className="cursor-pointer group"
                  onClick={() => setActiveRegion(reg)}
                >
                  {/* Active Sonar Ring Pulse */}
                  {isSelected && (
                    <>
                      <circle 
                        cx={reg.svgX} 
                        cy={reg.svgY} 
                        r="22" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="2" 
                        className="animate-ping"
                      />
                      <circle 
                        cx={reg.svgX} 
                        cy={reg.svgY} 
                        r="32" 
                        fill="#ef4444" 
                        fillOpacity="0.15" 
                      />
                      {/* Crosshairs */}
                      <line x1={reg.svgX - 16} y1={reg.svgY} x2={reg.svgX + 16} y2={reg.svgY} stroke="#f59e0b" strokeWidth="1.5" />
                      <line x1={reg.svgX} y1={reg.svgY - 16} x2={reg.svgX} y2={reg.svgY + 16} stroke="#f59e0b" strokeWidth="1.5" />
                    </>
                  )}

                  {/* Marker Pin Base Circle */}
                  <circle 
                    cx={reg.svgX} 
                    cy={reg.svgY} 
                    r={isSelected ? "11" : "7.5"} 
                    fill={isSelected ? "#dc2626" : "#0f172a"}
                    stroke={isSelected ? "#ffffff" : "#f59e0b"} 
                    strokeWidth={isSelected ? "2.5" : "1.8"}
                    className="transition-all duration-200 group-hover:scale-125"
                  />

                  {/* Inner Dot */}
                  <circle 
                    cx={reg.svgX} 
                    cy={reg.svgY} 
                    r={isSelected ? "4" : "2.5"} 
                    fill={isSelected ? "#ffffff" : "#ef4444"} 
                  />

                  {/* Text Badge for the Pin */}
                  <g transform={`translate(${reg.svgX + (reg.svgX > 320 ? -12 : 12)}, ${reg.svgY + 4})`}>
                    <rect 
                      x={reg.svgX > 320 ? -75 : 0} 
                      y="-12" 
                      width="75" 
                      height="18" 
                      rx="5" 
                      fill={isSelected ? "#991b1b" : "#0b1220"} 
                      stroke={isSelected ? "#fca5a5" : "#334155"} 
                      strokeWidth="1.2"
                      opacity={isSelected ? "1" : "0.9"}
                    />
                    <text 
                      x={reg.svgX > 320 ? -38 : 38} 
                      y="1" 
                      textAnchor="middle" 
                      fill={isSelected ? "#ffffff" : "#e2e8f0"} 
                      fontSize="9.5" 
                      fontFamily="sans-serif" 
                      fontWeight="bold"
                    >
                      {reg.shortName} ({reg.casesCount})
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Map Legend Overlay at Bottom */}
          <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-700/80 rounded-xl p-2.5 backdrop-blur-md shadow-xl text-[10px] sm:text-xs font-mono space-y-1 hidden sm:block">
            <p className="text-slate-400 font-bold uppercase tracking-wider mb-1">Leyenda Geográfica:</p>
            <div className="flex items-center space-x-2 text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span>Costa Litoral</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-700"></span>
              <span>Sierra / Andes</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-200">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Selva Amazónica</span>
            </div>
          </div>

          {/* Current Selection Status Toast */}
          <div className="absolute top-4 right-4 bg-red-950/90 border border-red-600/80 text-white text-xs font-mono px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="font-bold">{activeRegion.shortName}</span>
            <span className="text-red-300">({activeRegion.coords})</span>
          </div>

        </div>

        {/* RIGHT COLUMN: REGION DOSSIER & ACTIONS */}
        <div className="lg:col-span-5 bg-[#101728] border-2 border-slate-700 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-5 shadow-xl">
          <div className="space-y-4">
            
            {/* Top Dossier Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="px-3 py-1 rounded-lg bg-red-950 text-red-300 border border-red-700 font-bold flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
                <span>CÓDIGO: {activeRegion.code}-PERÚ</span>
              </span>

              <span className="px-3 py-1 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-700 font-bold">
                {activeRegion.naturalRegion}
              </span>
            </div>

            {/* Department Title */}
            <div>
              <h3 className="text-2xl font-black text-white leading-tight">
                {activeRegion.name}
              </h3>
              <p className="text-xs font-mono text-cyan-300 mt-0.5">
                {activeRegion.casesCount} expediente(s) documentado(s)
              </p>
            </div>

            {/* Summary */}
            <div className="bg-[#0b101c] p-4 rounded-xl border border-slate-700 space-y-2">
              <p className="text-xs font-mono uppercase text-slate-400 font-bold flex items-center space-x-1">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Reseña Histórica & Cobertura:</span>
              </p>
              <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-sans">
                {activeRegion.summary}
              </p>
            </div>

            {/* Key Geographic Landmarks */}
            <div className="space-y-1.5">
              <p className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                Puntos Clave del Expediente:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {activeRegion.keyPoints.map((point, idx) => (
                  <span 
                    key={idx} 
                    className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-xs font-mono"
                  >
                    • {point}
                  </span>
                ))}
              </div>
            </div>

            {/* Highlighted Case Box */}
            <div className="p-4 bg-gradient-to-r from-red-950/50 to-slate-900 border-2 border-red-900/60 rounded-xl space-y-1.5">
              <span className="text-[11px] font-mono text-amber-300 font-bold uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Expediente Destacado en esta Región:</span>
              </span>
              <h4 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                {activeRegion.highlightTitle}
              </h4>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-2">
            {activeRegion.highlightCaseId ? (
              <button
                onClick={() => onSelectCaseById(activeRegion.highlightCaseId)}
                className="w-full bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white py-4 px-5 rounded-2xl text-base font-extrabold flex items-center justify-center space-x-2 shadow-xl shadow-red-950 transition-all hover:scale-[1.02]"
              >
                <span>Abrir Expediente & Comentarios</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  disabled
                  className="w-full bg-slate-800 text-slate-300 py-3.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center space-x-2 cursor-not-allowed border border-slate-700"
                >
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Crónica en Archivo / Producción Próxima</span>
                </button>
                <p className="text-[11px] font-mono text-slate-400 text-center">
                  ¿Tienes datos sobre esta región? Puedes enviarlos al Buzón Confidencial o recomendarlos para los canales.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
