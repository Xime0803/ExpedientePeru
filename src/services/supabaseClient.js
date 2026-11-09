import { createClient } from '@supabase/supabase-js';

// URL y Clave oficial del proyecto en Supabase
const DEFAULT_SUPABASE_URL = 'https://ocswfeouocwzaimhzrjs.supabase.co';
const DEFAULT_SUPABASE_KEY = 'sb_publishable_QGHxTJEbMIFlukcp4nFKHQ_UHR9p8uv';

export function getSupabaseCredentials() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                 import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 
                 import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
                 import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const storageUrl = typeof window !== 'undefined' ? localStorage.getItem('expediente_supabase_url') : null;
  const storageKey = typeof window !== 'undefined' ? localStorage.getItem('expediente_supabase_anon_key') : null;

  const url = (envUrl && envUrl.trim() !== '') ? envUrl.trim() : (storageUrl && storageUrl.trim() !== '') ? storageUrl.trim() : DEFAULT_SUPABASE_URL;
  const anonKey = (envKey && envKey.trim() !== '') ? envKey.trim() : (storageKey && storageKey.trim() !== '') ? storageKey.trim() : DEFAULT_SUPABASE_KEY;

  return { url, anonKey };
}

let { url: activeUrl, anonKey: activeKey } = getSupabaseCredentials();

export function isConfigured() {
  const { anonKey } = getSupabaseCredentials();
  return Boolean(anonKey && anonKey.length > 15);
}

function initClient() {
  const { url, anonKey } = getSupabaseCredentials();
  if (url && anonKey && anonKey.length > 15) {
    try {
      return createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
    } catch (e) {
      console.error("[Supabase] Error inicializando cliente:", e);
      return null;
    }
  }
  return null;
}

export let supabase = initClient();
export let isSupabaseConfigured = isConfigured();

/**
 * Permite guardar o actualizar las credenciales de Supabase en caliente
 * (desde el panel de administración o configuración)
 */
export function setSupabaseConfig(url, anonKey) {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem('expediente_supabase_url', url.trim());
    if (anonKey) localStorage.setItem('expediente_supabase_anon_key', anonKey.trim());
  }
  supabase = initClient();
  isSupabaseConfigured = isConfigured();
  return isSupabaseConfigured;
}

/**
 * Prueba la conexión en vivo con Supabase
 */
export async function testConnection() {
  if (!supabase) return { success: false, message: "Falta la clave Anon Key de Supabase." };
  try {
    const { data, error } = await supabase.from('community_supporters').select('count', { count: 'exact', head: true });
    if (error) {
      if (error.code === '42P01') {
        return { 
          success: false, 
          tableMissing: true, 
          message: "Conexión lograda, pero falta ejecutar el script 'supabase_setup.sql' en el SQL Editor de Supabase." 
        };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: "Conexión exitosa y verificada con la base de datos." };
  } catch (err) {
    return { success: false, message: err.message || "Error al conectar." };
  }
}
