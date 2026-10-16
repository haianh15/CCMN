import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

export const verifyPassword = async (email: string, password: string) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Chưa cấu hình kết nối Supabase.');
  }
  const verificationClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
  const { error } = await verificationClient.auth.signInWithPassword({ email, password });
  if (error?.message.toLowerCase().includes('invalid login credentials')) return false;
  if (error) throw error;
  return true;
};
