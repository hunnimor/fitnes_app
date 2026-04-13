import React, { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import type { Session, User, SupabaseClient } from "@supabase/supabase-js";
import { getSupabase } from "./supabase";

const MOCK_USER_ID = "mock-user-dev";
const MOCK_SESSION_KEY = "fitii_mock_session";

// Lazy AsyncStorage — only imported at runtime to avoid web SSR crash
let _storage: any = null;
async function getStorage() {
  if (!_storage) {
    _storage = (await import("@react-native-async-storage/async-storage")).default;
  }
  return _storage;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, username?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function createMockUser(email: string, username?: string): User {
  return {
    id: MOCK_USER_ID,
    email: email || "dev@fitii.app",
    email_confirmed_at: new Date().toISOString(),
    phone: "",
    confirmed_at: new Date().toISOString(),
    last_sign_in_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_metadata: { username: username || "Дев-пользователь" },
    app_metadata: {},
    aud: "authenticated",
    identities: [],
    factors: [],
  } as unknown as User;
}

function createMockSession(user: User): Session {
  return {
    user,
    access_token: "mock-access-token",
    refresh_token: "mock-refresh-token",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Date.now() + 3600 * 1000,
  } as unknown as Session;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const clientRef = useRef<SupabaseClient | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const client = await getSupabase();
      if (cancelled) return;
      clientRef.current = client;

      if (!client) {
        // Mock mode — use AsyncStorage dynamically
        const storage = await getStorage();
        const stored = await storage.getItem(MOCK_SESSION_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          const u = createMockUser(data.email, data.username);
          const s = createMockSession(u);
          if (!cancelled) {
            setUser(u);
            setSession(s);
          }
        }
        if (!cancelled) setLoading(false);
        return;
      }

      // Real Supabase auth
      const { data: { session } } = await client.auth.getSession();
      if (cancelled) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
        if (!cancelled) {
          setSession(session);
          setUser(session?.user ?? null);
        }
      });

      return () => subscription.unsubscribe();
    }

    const cleanupPromise = init();
    return () => {
      cancelled = true;
      cleanupPromise.then((cleanup) => {
        if (typeof cleanup === "function") cleanup();
      });
    };
  }, []);

  const signUp = async (email: string, password: string, username?: string) => {
    const client = clientRef.current;
    if (!client) {
      const u = createMockUser(email, username);
      const s = createMockSession(u);
      setUser(u);
      setSession(s);
      const storage = await getStorage();
      await storage.setItem(MOCK_SESSION_KEY, JSON.stringify({ email, username }));
      return { error: null };
    }

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (!error && data.user) {
      try {
        await client.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
          username: username || null,
        });
      } catch (e) {
        console.warn("Profile creation skipped:", e);
      }
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const client = clientRef.current;
    if (!client) {
      if (!email || !password) {
        return { error: new Error("Заполни все поля") };
      }
      const u = createMockUser(email);
      const s = createMockSession(u);
      setUser(u);
      setSession(s);
      const storage = await getStorage();
      await storage.setItem(MOCK_SESSION_KEY, JSON.stringify({ email }));
      return { error: null };
    }

    const { error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signOut = async () => {
    const client = clientRef.current;
    if (!client) {
      setUser(null);
      setSession(null);
      const storage = await getStorage();
      await storage.removeItem(MOCK_SESSION_KEY);
      return;
    }
    await client.auth.signOut();
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
