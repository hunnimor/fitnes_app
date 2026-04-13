import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let _client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== "your-project-url");
}

/**
 * Get or create the Supabase client.
 * Lazily initialized to avoid SSR crashes on web (AsyncStorage needs window).
 * Call this inside useEffect or event handlers, NOT at module level.
 */
export async function getSupabase(): Promise<SupabaseClient | null> {
  if (_client) return _client;
  if (!isSupabaseConfigured()) return null;

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const { default: AsyncStorage } = await import("@react-native-async-storage/async-storage");

    _client = createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
    return _client;
  } catch (e) {
    console.error("Failed to create Supabase client:", e);
    return null;
  }
}
