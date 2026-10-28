-- =========================================================================
-- EXPEDIENTE PERÚ - Script de Configuración de Base de Datos para Supabase
-- Copia y pega todo este script en el "SQL Editor" de tu proyecto en Supabase
-- y pulsa el botón verde "RUN".
-- =========================================================================

-- 1. Tabla de Comentarios en Expedientes
CREATE TABLE IF NOT EXISTS public.case_comments (
    id TEXT PRIMARY KEY,
    case_id TEXT NOT NULL,
    author TEXT NOT NULL,
    country TEXT DEFAULT 'Perú',
    flag TEXT DEFAULT '🇵🇪',
    text TEXT NOT NULL,
    timestamp TEXT,
    upvotes INT DEFAULT 0,
    downvotes INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabla de Mensajes en el Chat de Detectives en Vivo
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY,
    author TEXT NOT NULL,
    country TEXT DEFAULT 'Perú',
    flag TEXT DEFAULT '🇵🇪',
    text TEXT NOT NULL,
    timestamp TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabla de Casos Recomendados por la Comunidad (YouTube / TikTok)
CREATE TABLE IF NOT EXISTS public.story_recommendations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    place TEXT NOT NULL,
    platform TEXT DEFAULT 'ambas',
    author TEXT NOT NULL,
    country TEXT DEFAULT 'Perú',
    flag TEXT DEFAULT '🇵🇪',
    story_details TEXT NOT NULL,
    votes INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Cuadro de Honor / Agradecimientos de Colaboradores
CREATE TABLE IF NOT EXISTS public.community_supporters (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    country_flag TEXT DEFAULT '🇵🇪',
    method TEXT NOT NULL,
    amount_or_tier TEXT DEFAULT 'Colaborador Destacado',
    message TEXT NOT NULL,
    date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- HABILITAR POLÍTICAS DE SEGURIDAD (Permitir lectura y escritura pública)
ALTER TABLE public.case_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_supporters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lectura pública de comentarios" ON public.case_comments FOR SELECT USING (true);
CREATE POLICY "Inserción pública de comentarios" ON public.case_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "Votación de comentarios" ON public.case_comments FOR UPDATE USING (true);

CREATE POLICY "Lectura pública de chat" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Inserción pública de chat" ON public.chat_messages FOR INSERT WITH CHECK (true);

CREATE POLICY "Lectura pública de recomendaciones" ON public.story_recommendations FOR SELECT USING (true);
CREATE POLICY "Inserción pública de recomendaciones" ON public.story_recommendations FOR INSERT WITH CHECK (true);
CREATE POLICY "Votación de recomendaciones" ON public.story_recommendations FOR UPDATE USING (true);

CREATE POLICY "Lectura pública de mecenas" ON public.community_supporters FOR SELECT USING (true);
CREATE POLICY "Gestión de mecenas" ON public.community_supporters FOR ALL USING (true);

-- HABILITAR TIEMPO REAL (Realtime) para que los mensajes aparezcan en vivo a todos
ALTER PUBLICATION supabase_realtime ADD TABLE public.case_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.story_recommendations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_supporters;
