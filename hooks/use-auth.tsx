// hooks/use-auth.tsx
"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: "customer" | "admin" | "super_admin";
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    let unsubscribe: (() => void) | null = null;

    const init = async () => {
      try {
        // initial session
        const {
          data: { session },
        } = await supabaseBrowser.auth.getSession();

        if (!mounted) return;
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        }

        // subscribe to auth changes
        const { data } = supabaseBrowser.auth.onAuthStateChange(async (_event, session) => {
          if (!mounted) return;

          setUser(session?.user ?? null);

          if (session?.user) {
            await fetchProfile(session.user.id);
          } else {
            setProfile(null);
          }

          setLoading(false);
        });

        // data.subscription is the subscription object in @supabase/ssr helper
        unsubscribe = () => {
          try {
            data?.subscription?.unsubscribe?.();
          } catch (e) {
            // ignore
          }
        };
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabaseBrowser.from("profiles").select("*").eq("id", userId).single();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setProfile(null);
    }
  };

  const signOut = async () => {
    try {
      await supabaseBrowser.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      // Clear local state immediately
      setUser(null);
      setProfile(null);

      // Force a full reload of the page so server components pick up the new cookie-free session
      // `location.assign` guarantees a navigation (router.refresh may not be enough in all cases).
      try {
        location.assign("/");
      } catch {
        // ignore if environment doesn't support it
      }
    }
  };

  return <AuthContext.Provider value={{ user, profile, loading, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
