import { createClient } from '@supabase/supabase-js';

let client = null;

export function getSupabase() {
  const url = import.meta.env?.VITE_SUPABASE_URL || '';
  const key = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null;
  if (client) return client;
  client = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  return client;
}


