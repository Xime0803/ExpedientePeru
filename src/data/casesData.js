export const initialCases = [
  {
    id: "caso-001",
    code: "EXP-AQP-2011",
    title: "El Caso Ciro Castillo en el Cañón del Colca: El Gran Enigma Andino",
    region: "Arequipa",
    city: "Valle del Colca (Madrigal / Bomboya)",
    category: "Crónica Policial",
    status: "DESCLASIFICADO",
    badgeColor: "emerald",
    year: "2011 - 2013",
    views: "348.5K",
    coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80",
    synopsis: "La desaparición del universitario Ciro Castillo Rojo en las quebradas del Colca paralizó al Perú durante 202 días. Una búsqueda sin precedentes, brigadas internacionales y un expediente judicial archivado.",
    fullStory: `En abril del 2011, la noticia de la desaparición de dos jóvenes universitarios en el agreste Cañón del Colca conmocionó a la opinión pública peruana. Mientras su acompañante, Rosario Ponce, fue hallada con vida tras diez días de intensa búsqueda, el paradero de Ciro Castillo Rojo se convirtió en un misterio nacional.

Durante más de seis meses, chamanes andinos, policías de alta montaña, guías locales y los reconocidos rescatistas 'Topos de México' peinaron los abismos del nevado Bomboya bajo temperaturas bajo cero. 

El 16 de octubre de 2011, su cuerpo fue finalmente divisado en una pendiente casi inaccesible de la quebrada de Casca, a más de 4,000 metros de altitud. La posterior necropsia del Instituto de Medicina Legal concluyó politraumatismo severo por caída vertical, llevando a la Segunda Fiscalía Corporativa de Arequipa a archivar el caso en 2013 al descartarse la intervención de terceras personas, aunque las teorías de la opinión pública aún persisten.`,
    timeline: [
      { date: "04 Abril 2011", event: "Última llamada y pérdida de contacto de los jóvenes en la ruta del Cañón del Colca." },
      { date: "13 Abril 2011", event: "Patrullas de la Policía rescatan a Rosario Ponce en el sector de Chivay con deshidratación." },
      { date: "Mayo a Agosto 2011", event: "Llegan los Topos de Tlatelolco; el padre del estudiante lidera las brigadas civiles en el nevado." },
      { date: "16 Octubre 2011", event: "Hallazgo del cuerpo en un acantilado de 900 metros en la quebrada de Casca." },
      { date: "Julio 2013", event: "La Fiscalía Provincial de Arequipa emite resolución de archivo definitivo del proceso penal." }
    ],
    evidences: [
      { type: "doc", title: "Dictamen Pericial Forense N° 045-2011", note: "Informe de Medicina Legal de Arequipa sobre trayectoria de caída en pendiente rocosa" },
      { type: "photo", title: "Registros de la cámara fotográfica recuperada", note: "Últimas capturas del paisaje andino antes de la desorientación en la niebla" }
    ],
    comments: []
  },
  {
    id: "caso-002",
    code: "EXP-LMA-1957",
    title: "El Monstruo de Armendáriz: ¿Justicia o el Mayor Error Judicial del Perú?",
    region: "Lima Metropolitana",
    city: "Barranco / Quebrada de Armendáriz",
    category: "Crónica Policial",
    status: "DESCLASIFICADO",
    badgeColor: "emerald",
    year: "1954 - 1957",
    views: "298.2K",
    coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80",
    synopsis: "El fusilamiento de Jorge Villanueva Torres en 1957 por la muerte de un niño en Barranco. Un juicio exprés marcado por el prejuicio social que culminó con la pena capital y el posterior arrepentimiento del propio juez instructor.",
    fullStory: `En setiembre de 1954, el hallazgo del cuerpo sin vida de un menor de tres años en la quebrada de Armendáriz, entre Miraflores y Barranco, desató una histeria colectiva en la sociedad limeña de la época. La prensa sensacionalista bautizó al desconocido culpable como 'El Monstruo de Armendáriz'.

Pocos días después, la policía detuvo a Jorge Villanueva Torres, un hombre afroperuano sin recursos económicos, acusado por un vendedor de turrones que afirmó haberlo visto comprar dulces para el menor. Pese a que Villanueva juró su inocencia de rodillas en cada audiencia y a que las pericias forenses de la época eran precarias y contradictorias, la presión mediática fue implacable.

Villanueva fue condenado a muerte y ejecutado por un pelotón de fusilamiento en la Penitenciaría Central de Lima (El Panóptico) la mañana del 12 de diciembre de 1957. Años después, el propio juez de la causa, Víctor Maúrtua, confesó públicamente sus dudas de haber enviado a un inocente al paredón, convirtiendo este proceso en el caso paradigmático de la abolición de la pena de muerte en el Perú.`,
    timeline: [
      { date: "09 Setiembre 1954", event: "Hallazgo del menor en los matorrales de la bajada de Armendáriz." },
      { date: "14 Setiembre 1954", event: "Captura de Jorge Villanueva Torres tras señalamiento de un comerciante ambulante." },
      { date: "Octubre 1956", event: "El Tribunal Correccional de Lima dicta sentencia de pena de muerte por mayoría." },
      { date: "12 Diciembre 1957", event: "Fusilamiento de Villanueva en la Penitenciaría Central; sus últimas palabras fueron '¡Soy inocente!'." },
      { date: "Década de 1970", event: "Revisión histórica de juristas peruanos que califica el proceso como error judicial irreparable." }
    ],
    evidences: [
      { type: "doc", title: "Sentencia Judicial del Tribunal Correccional de Lima (1956)", note: "Fojas del proceso penal donde se desestimaron testimonios de coartada" },
      { type: "photo", title: "Fotografía de archivo periodístico del diario La Prensa (1957)", note: "Último retrato de Villanueva Torres antes de ser conducido a capilla" }
    ],
    comments: []
  },
  {
    id: "caso-003",
    code: "EXP-LMA-1992",
    title: "La Noche de Calígula: Narcisismo, Cintas VHS y Crímenes del Poder",
    region: "Lima Metropolitana",
    city: "Cieneguilla / San Isidro",
    category: "Crónica Policial",
    status: "ABIERTO",
    badgeColor: "rose",
    year: "1992 - 2024",
    views: "410.9K",
    coverImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=900&q=80",
    synopsis: "El asesinato de Fernando de Romaña en un descampado de Cieneguilla destapó una red clandestina de videos íntimos, chantajes y fiestas secretas en la Lima de los años 90.",
    fullStory: `La madrugada del 13 de febrero de 1992, en el kilómetro 17 de la carretera a Cieneguilla, yacían los cuerpos sin vida de Fernando de Romaña Azalgado (conocido como 'Calígula') y de Julio Domínguez Aguilar ('Pipo'). Ambos recibieron impactos certeros de bala calibre 9mm en la cabeza.

La investigación policial reveló una historia que rozaba las más altas esferas sociales y políticas del país: 'Calígula', un joven de apariencia aristocrática, presuntamente filmaba a mujeres de clase acomodada y celebridades en situaciones comprometedoras para luego extorsionarlas con sumas exorbitantes.

Tras los crímenes, las libretas de contactos y cintas de video VHS incautadas en su departamento de San Isidro sufrieron robos y alteraciones dentro de las propias dependencias policiales. Treinta años después, ningún tribunal ha emitido sentencia condenatoria contra los autores intelectuales, manteniéndose como uno de los expedientes más oscuros de la crónica roja moderna del Perú.`,
    timeline: [
      { date: "13 Febrero 1992", event: "Hallazgo de los cuerpos y del automóvil Nissan Sentra baleado en Cieneguilla." },
      { date: "Marzo 1992", event: "Allanamiento del departamento de San Isidro; incautan libretas de apuntes y cámaras de video." },
      { date: "1993", event: "Denuncian la misteriosa desaparición de varias cintas de video custodiadas en la delegación policial." },
      { date: "1994", event: "La jueza instructora declara prescripción parcial al no identificarse a los tiradores profesionales." }
    ],
    evidences: [
      { type: "doc", title: "Informe Balístico de Criminalística PNP N° 112-92", note: "Análisis de trayectorias de casquillos Luger 9mm en el vehículo" },
      { type: "photo", title: "Croquis de la escena del crimen en Cieneguilla", note: "Planimetría original elaborada por los peritos de homicidios" }
    ],
    comments: []
  },
  {
    id: "caso-004",
    code: "EXP-LMA-1969",
    title: "El Caso Marita Alpaca: La Caída Fatal desde el Piso 19 del Hotel Sheraton",
    region: "Lima Metropolitana",
    city: "Paseo de la República / Centro de Lima",
    category: "Crónica Policial",
    status: "DESCLASIFICADO",
    badgeColor: "emerald",
    year: "1969 - 1978",
    views: "275.0K",
    coverImage: "https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=900&q=80",
    synopsis: "La madrugada del 19 de agosto de 1969, la joven María Elena Alpaca cayó desde el piso 19 del recién inaugurado Hotel Sheraton. Un juicio mediático que enfrentó a la diplomacia y el misterio forense.",
    fullStory: `En agosto de 1969, el flamante Hotel Sheraton de Lima fue escenario de uno de los sucesos más debatidos de la historia judicial peruana. El cuerpo de María Elena 'Marita' Alpaca, de 19 años, se precipitó desde la habitación 1904 hacia la azotea del tercer piso.

En la habitación se encontraba Luis Morales Bermúdez, un acaudalado diplomático peruano. Mientras la defensa del diplomático sostuvo firmemente que se trató de un suicidio intempestivo, los familiares y el médico forense sostuvieron que la joven estaba embarazada y fue empujada tras una violenta discusión.

El proceso judicial duró casi una década, lleno de reconstrucciones nocturnas, experimentos con maniquíes arrojados desde el piso 19 y apasionados debates en los diarios de la época. Finalmente, en 1978, la Corte Suprema sentenció a Morales Bermúdez a prisión por homicidio, cerrando un expediente imborrable para la memoria limeña.`,
    timeline: [
      { date: "19 Agosto 1969", event: "Caída de la joven desde la suite 1904 del Hotel Sheraton de Lima a las 3:45 a.m." },
      { date: "1970 - 1972", event: "Peritajes de física forense analizan la distancia del impacto con respecto a la baranda." },
      { date: "1975", event: "El tribunal penal anula el primer fallo que absolvió por duda al diplomático." },
      { date: "1978", event: "Corte Suprema confirma condena por homicidio simple contra Luis Morales Bermúdez." }
    ],
    evidences: [
      { type: "doc", title: "Peritaje de Física Forense sobre Parábola de Caída", note: "Cálculos matemáticos para determinar si hubo impulso manual exterior" },
      { type: "photo", title: "Fotografía de archivo de la habitación 1904", note: "Registro de los agentes de homicidios de la PIP en 1969" }
    ],
    comments: []
  },
  {
    id: "caso-005",
    code: "EXP-LMA-2002",
    title: "La Tragedia de Utopía: La Noche del Jockey Plaza y la Lucha de los Deudos",
    region: "Lima Metropolitana",
    city: "Surco / C.C. Jockey Plaza",
    category: "Crónica Policial",
    status: "DESCLASIFICADO",
    badgeColor: "emerald",
    year: "2002 - 2021",
    views: "389.1K",
    coverImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80",
    synopsis: "La madrugada del 20 de julio de 2002, un espectáculo con fuego desató un incendio en la discoteca subterránea Utopía, cobrando 29 vidas. Dos décadas de lucha judicial contra la impunidad y extradiciones internacionales.",
    fullStory: `Durante la fiesta temática 'Zoo' en la exclusiva discoteca Utopía, ubicada en el sótano del Centro Comercial Jockey Plaza, barman contratados realizaron maniobras con fuego y botellas de licor frente a una cabina construida con materiales altamente inflamables.

El fuego se propagó en segundos, llenando el local subterráneo de gases tóxicos y asfixiantes. Los asistentes encontraron las puertas de emergencia cerradas con candados, no existían detectores de humo ni rociadores de agua, y el local ni siquiera contaba con licencia municipal definitiva de funcionamiento. 29 jóvenes perdieron la vida.

Lo que siguió fue una histórica y desgarradora cruzada de los padres de las víctimas liderados por Roberto Nolte y Luis Delgado Aparicio, quienes persiguieron judicialmente a los directivos del local comercial a través de México y Estados Unidos durante más de 18 años hasta lograr sus respectivas capturas y condenas.`,
    timeline: [
      { date: "20 Julio 2002", event: "Incendio en Utopía durante la madrugada; 29 jóvenes fallecen por asfixia." },
      { date: "2004", event: "Condena a prisión efectiva contra los administradores Percy North y Roberto Ferreyros." },
      { date: "2007 - 2018", event: "Fuga del país de los accionistas Alan Azizollahoff y Édgar Paz Ravines; se activan alertas rojas de Interpol." },
      { date: "Diciembre 2020", event: "Extradición desde México de Édgar Paz Ravines tras 18 años de evasión judicial." }
    ],
    evidences: [
      { type: "doc", title: "Informe Técnico del Cuerpo General de Bomberos Voluntarios del Perú", note: "Inspección de las salidas de escape selladas y carencia de extintores vigentes" },
      { type: "photo", title: "Fotografía de archivo judicial de las puertas de escape", note: "Evidencia fotográfica utilizada en los alegatos finales de los deudos" }
    ],
    comments: []
  },
  {
    id: "caso-006",
    code: "EXP-LMA-1972",
    title: "El Crimen de Luis Banchero Rossi en Chaclacayo: El Magnate Pesquero y las Dudas Forenses",
    region: "Lima Provincias",
    city: "Chaclacayo / Carretera Central",
    category: "Crónica Policial",
    status: "DESCLASIFICADO",
    badgeColor: "emerald",
    year: "1972 - 1978",
    views: "480.5K",
    coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80",
    synopsis: "El 1 de enero de 1972, el empresario más rico del Perú fue asesinado a puñaladas en su casa de campo en Chaclacayo. El juicio express al hijo del jardinero, el enigmático rol de su secretaria y los cables de inteligencia internacional forjaron el mayor enigma criminal de la República.",
    fullStory: `La mañana del 1 de enero de 1972, Luis Banchero Rossi, el magnate de la industria pesquera más poderoso del mundo y dueño de los diarios Ojo y Correo, fue brutalmente asesinado en su residencia campestre de Chaclacayo.

La versión oficial de la Policía de Investigaciones del Perú (PIP) señaló como único autor a Juan Vilca Carranza, un joven de 20 años, hijo del jardinero del predio, quien presuntamente actuó motivado por el robo y la intimidación. Junto a él fue procesada Eugenia Sessarego, una joven secretaria que se encontraba en el inmueble y cuya conducta durante y después del crimen fue calificada por los jueces como sospechosa de encubrimiento.

Sin embargo, las contradicciones forenses conmocionaron a la opinión pública: Banchero era un hombre corpulento de 1.80 metros con conocimientos de defensa personal, mientras que Vilca era un joven de contextura pequeña que difícilmente pudo someterlo en solitario sin heridas defensivas en las manos. 

Décadas después, investigaciones hemerográficas, testimonios de exagentes de inteligencia y desclasificaciones de archivos diplomáticos apuntaron a posibles conexiones con intereses geopolíticos, contrabando de harina de pescado e incluso la presencia encubierta en Lima del criminal nazi Klaus Barbie (alias 'Klaus Altmann'), a quien Banchero habría investigado poco antes de su deceso. Vilca cumplió condena y Sessarego fue indultada en 1977, pero el móvil real de los autores intelectuales jamás fue esclarecido judicialmente.`,
    timeline: [
      { date: "01 Enero 1972", event: "Asesinato de Luis Banchero Rossi en su chalet de Los Cóndores, Chaclacayo." },
      { date: "02 Enero 1972", event: "Captura de Juan Vilca Carranza y detención preventiva de Eugenia Sessarego." },
      { date: "1973", event: "El Tribunal Penal de Lima condena a Vilca a la pena máxima y a Sessarego a prisión por complicidad." },
      { date: "Diciembre 1977", event: "El gobierno militar concede el indulto humanitario a Eugenia Sessarego." }
    ],
    evidences: [
      { type: "doc", title: "Atestado Policial N° 001-72 de la Dirección de Homicidios PIP", note: "Planimetría de la escena del crimen y peritaje del cuchillo de cocina utilizado" },
      { type: "photo", title: "Fotografía de archivo de la diligencia de reconstrucción en Chaclacayo", note: "Archivo histórico del diario La Prensa y de la Biblioteca Nacional" }
    ],
    comments: []
  },
  {
    id: "caso-007",
    code: "EXP-LMA-2000",
    title: "El Asalto e Incendio del Banco de la Nación en Jirón Lampa (2000)",
    region: "Lima Metropolitana",
    city: "Jirón Lampa / Centro de Lima",
    category: "Crónica Policial",
    status: "DESCLASIFICADO",
    badgeColor: "emerald",
    year: "2000 - 2009",
    views: "230.4K",
    coverImage: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=900&q=80",
    synopsis: "La trágica muerte de seis vigilantes durante la Marcha de los Cuatro Suyos en julio del 2000. El robo de millones en caudales y la posterior condena a la cúpula del SIN por infiltración provocadora.",
    fullStory: `El 28 de julio del año 2000, mientras se realizaba la multitudinaria marcha política de los 'Cuatro Suyos' en el centro de Lima, la sede principal del Banco de la Nación, ubicada en la esquina de los jirones Lampa y Huancavelica, ardió en llamas.

Seis valientes vigilantes particulares quedaron atrapados en los pisos superiores del edificio y fallecieron asfixiados mientras intentaban proteger los caudales de la institución. 

Años después, sendas investigaciones del Congreso de la República y del Poder Judicial demostraron que agentes del Servicio de Inteligencia Nacional (SIN), bajo el mando de Vladimiro Montesinos, contrataron y dirigieron a grupos de infiltrados con combustible para incendiar el edificio y justificar la represión política, además de sustraer valiosos fondos en la confusión. La Sala Penal Especial sentenció a los responsables directos en el 2009.`,
    timeline: [
      { date: "28 Julio 2000", event: "Ataque e incendio provocado de la sede del Banco de la Nación en Jr. Lampa; mueren 6 custodios." },
      { date: "2001", event: "Comisión investigadora del Congreso halla pruebas de infiltración del SIN." },
      { date: "Agosto 2009", event: "La Corte Suprema condena a prisión a los exjefes policiales y operativos por homicidio y peculado." }
    ],
    evidences: [
      { type: "doc", title: "Sentencia de la Sala Penal Especial de la Corte Suprema (2009)", note: "Determinación de responsabilidad del SIN en la quema del Banco de la Nación" },
      { type: "photo", title: "Captura pericial de los focos de inicio del fuego en el primer piso", note: "Peritaje de ingeniería forense de la Dirección de Criminalística" }
    ],
    comments: []
  },
  {
    id: "caso-008",
    code: "EXP-ICA-2007",
    title: "El Terremoto de Pisco y el Megaproceso por Desfalco de los Fondos de Reconstrucción (FORSUR)",
    region: "Ica",
    city: "Pisco / Chincha / Ica",
    category: "Injusticia Provincial",
    status: "DESCLASIFICADO",
    badgeColor: "rose",
    year: "2007 - 2018",
    views: "430.7K",
    coverImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80",
    synopsis: "El 15 de agosto de 2007, un terremoto de 7.9 destruyó Pisco dejando 595 fallecidos. La posterior creación del fondo estatal FORSUR generó donaciones mundiales millonarias, pero miles de damnificados vivieron en carpas por años mientras la Contraloría denunció el desvío ilícito de recursos.",
    fullStory: `A las 6:40 p.m. del 15 de agosto de 2007, un potente terremoto de magnitud 7.9 con epicentro frente a las costas de Pisco e Ica sacudió el centro-sur del Perú durante más de tres minutos. 

La tragedia fue colosal: 595 personas perdieron la vida, entre ellas casi un centenar que rezaba dentro de la histórica Iglesia de San Clemente en la Plaza de Armas de Pisco, cuya cúpula colapsó instantáneamente. Más de 76,000 viviendas quedaron reducidas a escombros en Pisco, Chincha, Cañete e Ica.

Ante la magnitud del desastre, la comunidad internacional y empresas privadas enviaron cientos de millones de dólares en ayuda humanitaria. El gobierno peruano creó el Fondo para la Reconstrucción del Sur (FORSUR). Sin embargo, lo que debió ser una rápida reconstrucción se transformó en un símbolo nacional de indignación e injusticia social: auditorías de la Contraloría General de la República y comisiones del Congreso descubrieron compras sobrevaloradas, canastas de alimentos descompuestas en almacenes y obras fantasma de saneamiento, mientras las familias damnificadas soportaban el frío en campamentos de esteras durante más de un lustro.

Decenas de funcionarios públicos, directores de obras e intermediarios fueron procesados por delitos de colusión desleal, peculado doloso y malversación de fondos en los juzgados penales de Ica y Lima, convirtiendo el caso en uno de los expedientes de corrupción ante catástrofes más investigados en la historia del país.`,
    timeline: [
      { date: "15 Agosto 2007", event: "Terremoto de 7.9 destruye Pisco; colapsa la Iglesia de San Clemente y mueren 595 ciudadanos." },
      { date: "Agosto 2007", event: "Se crea el FORSUR para administrar los fondos y donaciones para el sur chico." },
      { date: "2009 - 2011", event: "Informes de la Contraloría detectan millones de soles sin sustento contable y obras inconclusas." },
      { date: "2013 - 2018", event: "Ministerio Público formula acusaciones penales contra exdirectivos por peculado y colusión." }
    ],
    evidences: [
      { type: "doc", title: "Informe de Auditoría Integral de la Contraloría General de la República", note: "Peritaje financiero sobre irregularidades en licitaciones de módulos y tuberías" },
      { type: "photo", title: "Registro fotográfico oficial de Defensa Civil (INDECI)", note: "Evaluación de daños estructurales en el casco urbano de Pisco y Chincha" }
    ],
    comments: []
  },
  {
    id: "caso-009",
    code: "EXP-AYA-1983",
    title: "La Masacre de Uchuraccay: La Muerte de los 8 Periodistas y el Enigma Andino",
    region: "Ayacucho",
    city: "Uchuraccay / Huanta",
    category: "Injusticia Provincial",
    status: "DESCLASIFICADO",
    badgeColor: "emerald",
    year: "1983 - 1987",
    views: "462.8K",
    coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=900&q=80",
    synopsis: "Ocho periodistas peruanos viajaron a las alturas de Huanta para investigar denuncias de abusos y fueron linchados en Uchuraccay. Una comisión investigadora presidida por Mario Vargas Llosa y juicios contradictorios destaparon el drama del fuego cruzado y las órdenes militares.",
    fullStory: `El 26 de enero de 1983, ocho periodistas peruanos de diversos medios de comunicación (Eduardo de la Piniella, Pedro Sánchez, Félix Gavilán de El Observador; Jorge Sedano de La República; Willy Retto y Jorge Mendívil de El Comercio; Amador García de Oiga; y Octavio Infante de Noticias de Ayacucho), acompañados por su guía Juan Argumedo, ascendieron a las alturas de Huanta en busca de testimonios directos de la violencia en el campo.

Al llegar a la comunidad campesina de Uchuraccay, a casi 4,000 metros de altitud, fueron rodeados y ultimados a golpes de hacha, machete y piedras por los comuneros locales.

La posterior Comisión Investigadora, encabezada por el escritor Mario Vargas Llosa, concluyó que los comuneros confundieron a los reporteros con columnas subversivas debido a la desinformación y a las instrucciones que las patrullas militares les habían impartido: 'atacar a cualquiera que llegue a pie por los cerros'. 

Sin embargo, el posterior proceso judicial en el fuero penal de Lima y Huamanga estuvo plagado de irregularidades: desaparición del guía comunero, contradicciones en los mandos de los 'Sinchis' de la Policía y el misterio sobre las últimas fotografías rescatadas de la cámara de Willy Retto, que captaron los momentos previos al ataque. Varios comuneros procesados murieron antes de emitirse sentencia definitiva, convirtiendo a Uchuraccay en el símbolo del dolor y la incomprensión de las provincias altoandinas.`,
    timeline: [
      { date: "26 Enero 1983", event: "Los 8 periodistas y su guía son interceptados y victimados en la plaza de Uchuraccay." },
      { date: "Febrero 1983", event: "El gobierno designa la Comisión Investigadora presidida por Mario Vargas Llosa." },
      { date: "Marzo 1983", event: "Aparecen reveladas las fotografías de Willy Retto tomadas minutos antes de su muerte." },
      { date: "1987", event: "El Tribunal Especial de Lima condena a tres comuneros y archiva responsabilidades militares." }
    ],
    evidences: [
      { type: "doc", title: "Informe de la Comisión Investigadora de Uchuraccay (1983)", note: "Dictamen histórico con testimonios en quechua de las autoridades comunales" },
      { type: "photo", title: "Secuencia fotográfica recuperada de Willy Retto", note: "Rollos fotográficos desenterrados que documentaron el diálogo inicial en el cerro" }
    ],
    comments: []
  },
  {
    id: "caso-010",
    code: "EXP-AYA-1988",
    title: "La Masacre de Cayara: 35 Años de Juicio y Testigos Silenciados",
    region: "Ayacucho",
    city: "Cayara / Víctor Fajardo",
    category: "Injusticia Provincial",
    status: "SENTENCIA HISTÓRICA",
    badgeColor: "purple",
    year: "1988 - 2023",
    views: "385.4K",
    coverImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=80",
    synopsis: "La ejecución extrajudicial de decenas de comuneros en Cayara en 1988 y la sistemática eliminación de los testigos judiciales que iban a declarar en el juicio. Tras 35 años de dilación judicial en provincias, en mayo de 2023 se emitió una condena histórica.",
    fullStory: `En mayo de 1988, tras una emboscada senderista contra un convoy militar en Erusco, tropas del Ejército peruano ingresaron al distrito de Cayara, en la provincia de Víctor Fajardo (Ayacucho), en el denominado 'Operativo Persecución'.

Durante varios días, más de 30 comuneros, entre agricultores y autoridades locales que participaban de festividades patronales, fueron retenidos en la iglesia del pueblo y ejecutados extrajudicialmente sin juicio alguno.

Cuando el valiente fiscal provincial de Cangallo, Carlos Escobar Pineda, intentó realizar las exhumaciones y peritajes legales, se encontró con una red de encubrimiento: los cuerpos fueron retirados clandestinamente y trasladados a fosas secretas para no dejar rastro biológico. Peor aún, en los meses y años siguientes, los testigos clave del caso, entre ellos el testigo Guzmán Bautista y la pobladora Jovita García, fueron asesinados uno por uno en extrañas circunstancias para silenciar el expediente judicial.

Tuvieron que transcurrir 35 años de marchas, audiencias postergadas y audiencias en la Corte Interamericana de Derechos Humanos para que, en mayo de 2023, la Cuarta Sala Penal Superior Nacional de Lima dictara finalmente condenas de entre 8 y 15 años de prisión contra los mandos militares responsables, marcando un hito agridulce contra la impunidad en las provincias.`,
    timeline: [
      { date: "14 Mayo 1988", event: "Incursión militar en Cayara; comuneros son retenidos en la iglesia matriz del pueblo." },
      { date: "Junio 1988", event: "El fiscal especial Carlos Escobar denuncia desaparición de restos y amenazas de muerte." },
      { date: "1988 - 1989", event: "Asesinato selectivo de 9 testigos clave que habían rendido declaraciones notariales." },
      { date: "Mayo 2023", event: "Tras 35 años de juicio, la Sala Penal Nacional dicta sentencia condenatoria contra los oficiales." }
    ],
    evidences: [
      { type: "doc", title: "Informe del Fiscal Especial Carlos Escobar Pineda (1988)", note: "Actas de inspección ocular y testimonios manuscritos de los deudos de Fajardo" },
      { type: "doc", title: "Sentencia de la Cuarta Sala Penal Superior Nacional (Mayo 2023)", note: "Fallo judicial que condenó a los generales y oficiales del operativo militar" }
    ],
    comments: []
  },
  {
    id: "caso-011",
    code: "EXP-AMA-2009",
    title: "El Baguazo y la Curva del Diablo: El Mayor Juicio Indígena del Perú",
    region: "Amazonas",
    city: "Bagua / Curva del Diablo",
    category: "Injusticia Provincial",
    status: "ABSUELTOS",
    badgeColor: "cyan",
    year: "2009 - 2016",
    views: "512.7K",
    coverImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=900&q=80",
    synopsis: "El violento desalojo en la carretera Fernando Belaúnde Terry cobró 33 vidas y dio paso al megajuicio más controversial de la Amazonía contra 52 dirigentes awajún y wampís. En 2016, la Sala Penal de Bagua los absolvió a todos al comprobarse que no existían pruebas.",
    fullStory: `El 5 de junio de 2009, tras casi dos meses de paralización pacífica en la carretera de penetración a la selva en rechazo a un paquete de decretos legislativos vinculados a tierras comunales, la Policía Nacional ejecutó una orden de desalojo en el tramo conocido como la 'Curva del Diablo', en Bagua, departamento de Amazonas.

El operativo derivó en un sangriento enfrentamiento armado y caos generalizado que se trasladó hasta la estación N° 6 de Petroperú en Imita. El saldo fatal fue desgarrador: 23 policías caídos, 10 civiles e indígenas fallecidos y más de 200 personas heridas con impactos de bala.

Inmediatamente, el aparato judicial del Estado formuló acusación penal por homicidio calificado, lesiones graves y rebelión contra 52 ciudadanos indígenas awajún y wampís, entre ellos Alberto Pizango y Santiago Manuin, solicitando penas de cadena perpetua.

El juicio duró siete años en la Sala Penal Transitoria de Bagua, evidenciando barreras idiomáticas, prejuicios discriminatorios y peritajes balísticos defectuosos que no lograron vincular a ningún procesado con disparos específicos. En setiembre de 2016, la Sala emitió un histórico fallo unánime absolviendo a los 52 dirigentes indígenas de todos los delitos imputados, dejando en evidencia que la acusación fiscal fue desproporcionada y que los ministros y directores políticos que ordenaron el operativo militar nunca fueron sentados en el banquillo de los acusados.`,
    timeline: [
      { date: "05 Junio 2009", event: "Operativo de desalojo en la Curva del Diablo culmina en tragedia con 33 fallecidos." },
      { date: "Agosto 2009", event: "Ministerio Público formula acusación penal y pide cadena perpetua para 52 comuneros." },
      { date: "2014 - 2016", event: "Megaproceso judicial con traductores bilingües y peritajes antropológicos en Bagua." },
      { date: "22 Setiembre 2016", event: "La Sala Penal de Bagua declara la absolución total de los 52 procesados por falta de pruebas." }
    ],
    evidences: [
      { type: "doc", title: "Sentencia Unánime del Exp. N° 00194-2009 de la Sala Penal de Bagua", note: "Fallo de más de 400 páginas que desvirtuó los cargos de homicidio calificado" },
      { type: "photo", title: "Peritaje de Absorción Atómica de Criminalística PNP", note: "Pruebas químicas que dieron negativo para restos de pólvora en las manos de los comuneros" }
    ],
    comments: []
  },
  {
    id: "caso-012",
    code: "EXP-CAJ-2011",
    title: "Máxima Acuña vs. Yanacocha: La Batalla Judicial en las Lagunas de Celendín",
    region: "Cajamarca",
    city: "Sorochuco / Celendín",
    category: "Injusticia Provincial",
    status: "ABSUELTA",
    badgeColor: "amber",
    year: "2011 - 2017",
    views: "390.2K",
    coverImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80",
    synopsis: "La campesina que defendió su terreno en Tragadero Grande frente al consorcio minero más poderoso del país. Condenada a cárcel en 2014 por un juzgado provincial de Celendín, la Corte Suprema en Lima anuló el fallo en 2017 evidenciando la vulnerabilidad del campesinado andino.",
    fullStory: `En mayo de 2011, Máxima Acuña Atalaya y su familia denunciaron hostigamientos y destrucción de su humilde choza en el predio 'Tragadero Grande', ubicado a orillas de la laguna Azul en el distrito de Sorochuco, provincia de Celendín, departamento de Cajamarca, zona donde la empresa minera Yanacocha proyectaba la expansión del millonario proyecto minero Conga.

Pese a que la familia exhibió un certificado de posesión de compraventa comunal emitido en 1994, la empresa interpuso una denuncia penal en su contra acusándola del delito de usurpación agravada.

En un proceso judicial duramente cuestionado por organizaciones campesinas y veedores internacionales, en octubre de 2014 el Juzgado Unipersonal de Celendín sentenció a Máxima Acuña, a su esposo y a sus dos hijos a dos años y ocho meses de prisión suspendida, además de ordenar el desalojo inmediato de sus tierras y el pago de una cuantiosa reparación civil.

La familia apeló valientemente la sentencia. El caso escaló hasta la Sala Penal Transitoria de la Corte Suprema de Justicia de la República, la cual, en mayo de 2017, emitió una emblemática resolución de casación declarando fundado el recurso, anulando la condena penal y absolviendo a la familia Chaupe-Acuña. La sentencia suprema concluyó que la posesión familiar fue pacífica y preexistente, convirtiendo a Máxima Acuña en símbolo internacional de la resistencia campesina y ganadora del prestigioso Premio Ambiental Goldman.`,
    timeline: [
      { date: "Mayo 2011", event: "Primer intento de desalojo forzoso en el predio Tragadero Grande de Celendín." },
      { date: "Octubre 2014", event: "Juzgado Mixto de Celendín emite sentencia condenatoria de prisión contra la familia campesina." },
      { date: "Diciembre 2014", event: "La Sala de Apelaciones de Cajamarca revoca la orden de desalojo tras masivas protestas." },
      { date: "03 Mayo 2017", event: "La Corte Suprema absuelve definitivamente a Máxima Acuña del delito de usurpación agravada." }
    ],
    evidences: [
      { type: "doc", title: "Certificado de Compraventa Comunal de Posesión (1994)", note: "Documento extendido por la comunidad campesina de Sorochuco sobre Tragadero Grande" },
      { type: "doc", title: "Sentencia de Casación N° 458-2015 de la Corte Suprema de Justicia", note: "Resolución histórica que declaró la atipicidad penal de la posesión campesina" }
    ],
    comments: []
  }
];

export const initialNews = [
  {
    id: "noticia-01",
    title: "Fiscalía y Archivo General de la Nación digitalizan expedientes criminales históricos de los años 40 y 50",
    date: "Hoy, 15:45",
    category: "Investigación Histórica",
    views: "28.4K",
    summary: "Se hicieron públicas más de 12,000 fojas de juicios emblemáticos republicanos, incluyendo las actas del Monstruo de Armendáriz, el célebre ladrón 'Tatán' y crímenes en casonas del Rímac.",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
    comments: []
  },
  {
    id: "noticia-02",
    title: "Inspeccionan túneles y bóvedas coloniales descubiertas durante obras en Barrios Altos y jirón Junín",
    date: "Ayer, 18:20",
    category: "Hallazgo Arqueológico",
    views: "44.1K",
    summary: "Obreros que renovaban pistas y tuberías encontraron una cripta subterránea sellada con arcos de cal y canto de más de 200 años de antigüedad. Prohíben el paso por riesgo de derrumbe.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    comments: []
  },
  {
    id: "noticia-03",
    title: "Corte Superior de Lima desclasifica informe balístico del asesinato del magnate pesquero Luis Banchero Rossi (1972)",
    date: "Hace 2 días",
    category: "Caso Frío / True Crime",
    views: "52.8K",
    summary: "A más de 50 años del crimen en su casa de Chaclacayo, nuevos peritajes analizan las incongruencias del testimonio del jardinero Juan Vilca Carranza y la hipótesis de espionaje industrial internacional.",
    image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
    comments: []
  },
  {
    id: "noticia-04",
    title: "La Tragedia de Pasamayo: Peritajes de Velocidad y Juicio por el Bus Caído al Abismo de la Curva del Diablo",
    date: "Hace 3 días",
    category: "Investigación Vial & Penal",
    views: "61.3K",
    summary: "Se revisan los registros del tacógrafo GPS y las responsabilidades de la concesionaria vial tras la caída del bus interprovincial San Martín que enlutó a 52 familias peruanas en el kilómetro 75 de la Panamericana Norte.",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80",
    comments: []
  }
];

export const initialPoll = {
  question: "¿Cuál de estos casos controversiales reales del Perú debemos investigar a fondo en el próximo video largo de YouTube?",
  endsIn: "3 días restantes",
  totalVotes: 0,
  options: [
    {
      id: "opt-1",
      title: "El Asesinato de la Cantante Folklórica Alicia Delgado y el Juicio a Abencia Meza (2009)",
      description: "El sonado crimen en Surco: las confesiones del asesino confeso Pedro Mamanchura, las joyas perdidas y la histórica sentencia por instigación de la Cuarta Sala Penal.",
      votes: 0,
      percentage: 0
    },
    {
      id: "opt-2",
      title: "El Asesinato del Estilista Marco Antonio en San Isidro (2009)",
      description: "El sonado crimen que sacudió la farándula nacional: el collar de la víctima, la captura de 'Los babys de Chorrillos' y el juicio penal.",
      votes: 0,
      percentage: 0
    },
    {
      id: "opt-3",
      title: "La Tragedia del Vuelo 251 de Faucett en las Lomas de Arequipa (1996)",
      description: "El peor desastre de la aviación comercial en el Perú: 123 pasajeros fallecidos, fallas en el altímetro barométrico y los litigios internacionales contra la aerolínea.",
      votes: 0,
      percentage: 0
    }
  ]
};
