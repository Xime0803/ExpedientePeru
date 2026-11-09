-- =========================================================================
-- EXPEDIENTE PERÚ - Script Oficial de Base de Datos para Supabase
-- Copia y pega TODO este script en el "SQL Editor" de tu proyecto en Supabase
-- (https://supabase.com/dashboard/project/ocswfeouocwzaimhzrjs/sql)
-- y pulsa el botón verde "RUN".
-- =========================================================================

-- 1. Tabla de Cuadro de Honor / Agradecimientos de Colaboradores (Ruleta de Admin)
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

-- 2. Tabla de Comentarios en Expedientes Reales
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

-- 3. Tabla de Mensajes en el Chat de Detectives en Vivo
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id TEXT PRIMARY KEY,
    channel TEXT DEFAULT 'teorias-generales',
    author TEXT NOT NULL,
    country TEXT DEFAULT 'Perú',
    flag TEXT DEFAULT '🇵🇪',
    badge TEXT DEFAULT 'Seguidor',
    avatar TEXT DEFAULT '🕵️',
    text TEXT NOT NULL,
    time TEXT,
    is_bot BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabla de Casos Recomendados por la Comunidad (YouTube / TikTok)
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
    comments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabla de Buzón Confidencial (Historias enviadas por la comunidad)
CREATE TABLE IF NOT EXISTS public.whistleblower_stories (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT DEFAULT 'Lima',
    category TEXT DEFAULT 'Crónica Policial',
    story_text TEXT NOT NULL,
    author TEXT DEFAULT 'Anónimo',
    country TEXT DEFAULT 'Perú',
    flag TEXT DEFAULT '🇵🇪',
    is_anonymous BOOLEAN DEFAULT false,
    votes INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Tabla de Votos de Encuestas de la Comunidad
CREATE TABLE IF NOT EXISTS public.community_poll_votes (
    id TEXT PRIMARY KEY,
    poll_id TEXT NOT NULL DEFAULT 'poll-real-v1',
    option_id TEXT NOT NULL,
    voter_alias TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- HABILITAR POLÍTICAS DE ACCESO PÚBLICO (ROW LEVEL SECURITY)
-- =========================================================================
ALTER TABLE public.community_supporters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whistleblower_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_poll_votes ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura pública para todos los dispositivos
DROP POLICY IF EXISTS "Public select supporters" ON public.community_supporters;
CREATE POLICY "Public select supporters" ON public.community_supporters FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public all supporters" ON public.community_supporters;
CREATE POLICY "Public all supporters" ON public.community_supporters FOR ALL USING (true);

DROP POLICY IF EXISTS "Public select comments" ON public.case_comments;
CREATE POLICY "Public select comments" ON public.case_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert comments" ON public.case_comments;
CREATE POLICY "Public insert comments" ON public.case_comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update comments" ON public.case_comments;
CREATE POLICY "Public update comments" ON public.case_comments FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public select chat" ON public.chat_messages;
CREATE POLICY "Public select chat" ON public.chat_messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert chat" ON public.chat_messages;
CREATE POLICY "Public insert chat" ON public.chat_messages FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public select recs" ON public.story_recommendations;
CREATE POLICY "Public select recs" ON public.story_recommendations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert recs" ON public.story_recommendations;
CREATE POLICY "Public insert recs" ON public.story_recommendations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update recs" ON public.story_recommendations;
CREATE POLICY "Public update recs" ON public.story_recommendations FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public select stories" ON public.whistleblower_stories;
CREATE POLICY "Public select stories" ON public.whistleblower_stories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert stories" ON public.whistleblower_stories;
CREATE POLICY "Public insert stories" ON public.whistleblower_stories FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public update stories" ON public.whistleblower_stories;
CREATE POLICY "Public update stories" ON public.whistleblower_stories FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public select votes" ON public.community_poll_votes;
CREATE POLICY "Public select votes" ON public.community_poll_votes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert votes" ON public.community_poll_votes;
CREATE POLICY "Public insert votes" ON public.community_poll_votes FOR INSERT WITH CHECK (true);

-- =========================================================================
-- HABILITAR REALTIME (Sincronización en vivo entre múltiples dispositivos)
-- =========================================================================
DO $$
BEGIN
  -- Agregar tablas a la publicación de realtime solo si no están
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'community_supporters') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_supporters;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'case_comments') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.case_comments;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'chat_messages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'story_recommendations') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.story_recommendations;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'whistleblower_stories') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.whistleblower_stories;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'community_poll_votes') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.community_poll_votes;
  END IF;
END $$;
