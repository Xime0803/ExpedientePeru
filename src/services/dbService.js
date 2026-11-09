/**
 * Expediente Perú - Servicio Central de Base de Datos y Sincronización en Tiempo Real
 * Conecta los expedientes, comentarios, chat, mecenas y recomendaciones con Supabase.
 * Mantiene sincronización automática entre dispositivos móviles y de escritorio.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';

// ============================================================================
// 1. GESTIÓN DE COLABORADORES Y CUADRO DE HONOR (RULETA DE ADMINISTRACIÓN)
// ============================================================================

export async function fetchSupporters(defaultSupporters = []) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('community_supporters')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Mapear de formato SQL a formato JavaScript camelCase
        const mapped = data.map(row => ({
          id: row.id,
          name: row.name,
          location: row.location,
          countryFlag: row.country_flag || '🇵🇪',
          method: row.method,
          amountOrTier: row.amount_or_tier || 'Colaborador Destacado',
          message: row.message,
          date: row.date || '2026',
          createdAt: row.created_at
        }));
        if (typeof window !== 'undefined') {
          localStorage.setItem('expediente_admin_supporters_v1', JSON.stringify(mapped));
        }
        return mapped;
      }
    } catch (e) {
      console.warn("[dbService] Error al obtener colaboradores de Supabase:", e);
    }
  }

  // Fallback: localStorage o lista inicial
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('expediente_admin_supporters_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { /* ignore */ }
    }
  }
  return defaultSupporters;
}

export async function saveSupporter(supporter) {
  if (isSupabaseConfigured && supabase) {
    try {
      const dbRecord = {
        id: supporter.id,
        name: supporter.name,
        location: supporter.location,
        country_flag: supporter.countryFlag || '🇵🇪',
        method: supporter.method,
        amount_or_tier: supporter.amountOrTier || 'Colaborador Destacado',
        message: supporter.message,
        date: supporter.date || '2026'
      };

      const { error } = await supabase
        .from('community_supporters')
        .upsert(dbRecord, { onConflict: 'id' });

      if (error) console.error("[dbService] Error guardando colaborador en Supabase:", error);
    } catch (e) {
      console.error("[dbService] Excepción al guardar colaborador:", e);
    }
  }
}

export async function deleteSupporterFromDb(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('community_supporters')
        .delete()
        .eq('id', id);

      if (error) console.error("[dbService] Error al eliminar colaborador de Supabase:", error);
    } catch (e) {
      console.error("[dbService] Excepción al eliminar colaborador:", e);
    }
  }
}

export async function syncAllSupportersToCloud(supportersList) {
  if (!isSupabaseConfigured || !supabase || !supportersList?.length) return false;
  try {
    const records = supportersList.map(s => ({
      id: s.id,
      name: s.name,
      location: s.location,
      country_flag: s.countryFlag || '🇵🇪',
      method: s.method,
      amount_or_tier: s.amountOrTier || 'Colaborador Destacado',
      message: s.message,
      date: s.date || '2026'
    }));

    const { error } = await supabase
      .from('community_supporters')
      .upsert(records, { onConflict: 'id' });

    if (error) {
      console.error("[dbService] Error al sincronizar colaboradores a Supabase:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[dbService] Excepción sincronizando colaboradores:", err);
    return false;
  }
}

export function subscribeSupporters(onUpdate) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel('realtime:community_supporters')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'community_supporters' }, () => {
      fetchSupporters().then(data => onUpdate(data));
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ============================================================================
// 2. COMENTARIOS EN EXPEDIENTES REALES
// ============================================================================

export async function fetchAllCaseComments() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('case_comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map(r => ({
          id: r.id,
          caseId: r.case_id,
          author: r.author,
          country: r.country || 'Perú',
          flag: r.flag || '🇵🇪',
          text: r.text,
          timestamp: r.timestamp || 'Reciente',
          upvotes: r.upvotes || 0,
          downvotes: r.downvotes || 0
        }));
      }
    } catch (e) {
      console.warn("[dbService] Error cargando comentarios:", e);
    }
  }
  return [];
}

export async function addCaseCommentToDb(caseId, comment) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('case_comments').insert({
        id: comment.id,
        case_id: caseId,
        author: comment.author,
        country: comment.country || 'Perú',
        flag: comment.flag || '🇵🇪',
        text: comment.text,
        timestamp: comment.timestamp || 'Ahora',
        upvotes: comment.upvotes || 0,
        downvotes: comment.downvotes || 0
      });
    } catch (e) {
      console.error("[dbService] Error guardando comentario:", e);
    }
  }
}

export async function voteCaseCommentInDb(commentId, upvotes, downvotes) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('case_comments')
        .update({ upvotes, downvotes })
        .eq('id', commentId);
    } catch (e) {
      console.error("[dbService] Error votando comentario:", e);
    }
  }
}

export function subscribeCaseComments(onUpdate) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel('realtime:case_comments')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'case_comments' }, () => {
      fetchAllCaseComments().then(comments => onUpdate(comments));
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ============================================================================
// 3. CHAT EN VIVO DE DETECTIVES
// ============================================================================

export async function fetchChatMessages(channel = 'teorias-generales') {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('channel', channel)
        .order('created_at', { ascending: true })
        .limit(80);

      if (!error && data && data.length > 0) {
        return data.map(r => ({
          id: r.id,
          channel: r.channel,
          author: r.author,
          country: r.country || 'Perú',
          flag: r.flag || '🇵🇪',
          badge: r.badge || 'Seguidor',
          avatar: r.avatar || '🕵️',
          text: r.text,
          time: r.time || 'En vivo',
          isBot: r.is_bot || false
        }));
      }
    } catch (e) {
      console.warn("[dbService] Error obteniendo mensajes de chat:", e);
    }
  }
  return null;
}

export async function sendChatMessageToDb(msg) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('chat_messages').insert({
        id: msg.id,
        channel: msg.channel || 'teorias-generales',
        author: msg.author,
        country: msg.country || 'Perú',
        flag: msg.flag || '🇵🇪',
        badge: msg.badge || 'Seguidor',
        avatar: msg.avatar || '🕵️',
        text: msg.text,
        time: msg.time || 'En vivo',
        is_bot: msg.isBot || false
      });
    } catch (e) {
      console.error("[dbService] Error enviando mensaje a Supabase:", e);
    }
  }
}

export function subscribeChatMessages(onNewMessage) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel('realtime:chat_messages')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
      const r = payload.new;
      if (r) {
        onNewMessage({
          id: r.id,
          channel: r.channel,
          author: r.author,
          country: r.country || 'Perú',
          flag: r.flag || '🇵🇪',
          badge: r.badge || 'Seguidor',
          avatar: r.avatar || '🕵️',
          text: r.text,
          time: r.time || 'En vivo',
          isBot: r.is_bot || false
        });
      }
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ============================================================================
// 4. RECOMENDACIONES DE HISTORIAS PARA YOUTUBE / TIKTOK
// ============================================================================

export async function fetchRecommendationsFromDb() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('story_recommendations')
        .select('*')
        .order('votes', { ascending: false });

      if (!error && data) {
        return data.map(r => ({
          id: r.id,
          title: r.title,
          place: r.place,
          platform: r.platform || 'ambas',
          author: r.author,
          country: r.country || 'Perú',
          flag: r.flag || '🇵🇪',
          storyDetails: r.story_details,
          votes: r.votes || 1,
          comments: r.comments || [],
          timestamp: 'En debate'
        }));
      }
    } catch (e) {
      console.warn("[dbService] Error obteniendo recomendaciones:", e);
    }
  }
  return null;
}

export async function addRecommendationToDb(rec) {
  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        id: rec.id,
        title: rec.title,
        place: rec.place,
        platform: rec.platform || 'ambas',
        author: rec.author,
        country: rec.country || 'Perú',
        flag: rec.flag || '🇵🇪',
        story_details: rec.storyDetails,
        votes: rec.votes || 1
      };

      // 1. Intentar insertar con columna 'comments'
      let res = await supabase.from('story_recommendations').insert({
        ...payload,
        comments: rec.comments || []
      });

      // 2. Si la tabla no tiene la columna 'comments', reintentar sin ella para que NUNCA falle
      if (res.error) {
        console.warn("[dbService] Reintentando inserción sin 'comments':", res.error.message);
        res = await supabase.from('story_recommendations').insert(payload);
      }

      if (res.error) {
        console.error("[dbService] Error guardando recomendación en Supabase:", res.error);
        return { success: false, error: res.error };
      } else {
        console.log("[dbService] Recomendación guardada exitosamente en la nube:", rec.id);
        return { success: true };
      }
    } catch (e) {
      console.error("[dbService] Excepción al guardar recomendación:", e);
      return { success: false, error: e };
    }
  }
  return { success: false, error: "Supabase no conectado" };
}

export async function syncAllRecommendationsToCloud(list) {
  if (!isSupabaseConfigured || !supabase || !Array.isArray(list)) return;
  for (const item of list) {
    await addRecommendationToDb(item);
  }
}

export async function voteRecommendationInDb(id, newVotes) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('story_recommendations')
        .update({ votes: newVotes })
        .eq('id', id);
    } catch (e) {
      console.error("[dbService] Error votando recomendación:", e);
    }
  }
}

export async function addCommentToRecommendationInDb(id, updatedComments) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('story_recommendations')
        .update({ comments: updatedComments })
        .eq('id', id);
    } catch (e) {
      console.error("[dbService] Error comentando recomendación:", e);
    }
  }
}

export async function deleteRecommendationFromDb(id) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('story_recommendations')
        .delete()
        .eq('id', id);
    } catch (e) {
      console.error("[dbService] Error eliminando recomendación de Supabase:", e);
    }
  }
}

export async function updateRecommendationInDb(id, updatedFields) {
  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {};
      if (updatedFields.title !== undefined) payload.title = updatedFields.title;
      if (updatedFields.place !== undefined) payload.place = updatedFields.place;
      if (updatedFields.platform !== undefined) payload.platform = updatedFields.platform;
      if (updatedFields.storyDetails !== undefined) payload.story_details = updatedFields.storyDetails;
      if (updatedFields.votes !== undefined) payload.votes = updatedFields.votes;

      await supabase
        .from('story_recommendations')
        .update(payload)
        .eq('id', id);
    } catch (e) {
      console.error("[dbService] Error actualizando recomendación en Supabase:", e);
    }
  }
}

export function subscribeRecommendations(onUpdate) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel('realtime:story_recommendations')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'story_recommendations' }, () => {
      fetchRecommendationsFromDb().then(data => {
        if (data) onUpdate(data);
      });
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// ============================================================================
// 5. BUZÓN CONFIDENCIAL
// ============================================================================

export async function fetchWhistleblowerStoriesFromDb() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('whistleblower_stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map(r => ({
          id: r.id,
          title: r.title,
          department: r.department,
          category: r.category,
          text: r.story_text,
          author: r.author,
          country: r.country,
          flag: r.flag,
          isAnonymous: r.is_anonymous,
          votes: r.votes || 1,
          timestamp: 'Registrado'
        }));
      }
    } catch (e) {
      console.warn("[dbService] Error al obtener buzón:", e);
    }
  }
  return null;
}

export async function submitWhistleblowerStoryToDb(story) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('whistleblower_stories').insert({
        id: story.id,
        title: story.title,
        department: story.department,
        category: story.category,
        story_text: story.text,
        author: story.author,
        country: story.country,
        flag: story.flag,
        is_anonymous: story.isAnonymous,
        votes: story.votes || 1
      });
    } catch (e) {
      console.error("[dbService] Error al enviar historia al buzón:", e);
    }
  }
}

export async function voteWhistleblowerStoryInDb(id, newVotes) {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('whistleblower_stories')
        .update({ votes: newVotes })
        .eq('id', id);
    } catch (e) {
      console.error("[dbService] Error al votar historia de buzón:", e);
    }
  }
}

// ============================================================================
// 6. ENCUESTAS EDITORIALES DE LA COMUNIDAD
// ============================================================================

export async function fetchPollVotes(pollId = 'poll-real-v1') {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('community_poll_votes')
        .select('option_id')
        .eq('poll_id', pollId);

      if (!error && data) {
        const counts = {};
        for (const row of data) {
          counts[row.option_id] = (counts[row.option_id] || 0) + 1;
        }
        return { counts, total: data.length };
      }
    } catch (e) {
      console.warn("[dbService] Error al obtener votos de encuesta:", e);
    }
  }
  return null;
}

export async function submitPollVote(pollId = 'poll-real-v1', optionId, voterAlias = 'Seguidor') {
  if (isSupabaseConfigured && supabase) {
    try {
      const voteId = "v-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
      await supabase.from('community_poll_votes').insert({
        id: voteId,
        poll_id: pollId,
        option_id: optionId,
        voter_alias: voterAlias
      });
      return true;
    } catch (e) {
      console.error("[dbService] Error al emitir voto de encuesta:", e);
      return false;
    }
  }
  return false;
}

export function subscribePollVotes(pollId = 'poll-real-v1', onUpdate) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const channel = supabase
    .channel('realtime:community_poll_votes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'community_poll_votes' }, () => {
      fetchPollVotes(pollId).then(res => {
        if (res) onUpdate(res);
      });
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
