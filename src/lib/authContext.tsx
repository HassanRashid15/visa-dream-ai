import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Session, User as SbUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "user";

interface AppUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  role: AppRole | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

function toAppUser(u: SbUser | null | undefined): AppUser | null {
  if (!u) return null;
  const meta = (u.user_metadata ?? {}) as { name?: string };
  return {
    id: u.id,
    email: u.email ?? "",
    name: meta.name || (u.email ? u.email.split("@")[0] : "User"),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  // Load role from a separate, non-blocking call to avoid deadlocks in onAuthStateChange
  const loadRole = (uid: string) => {
    setTimeout(async () => {
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", uid);
      const roles = (data ?? []).map((r) => r.role as AppRole);
      setRole(roles.includes("admin") ? "admin" : roles.includes("user") ? "user" : "user");
    }, 0);
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess);
      const u = toAppUser(sess?.user);
      setUser(u);
      if (u) loadRole(u.id);
      else setRole(null);
    });

    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      setSession(sess);
      const u = toAppUser(sess?.user);
      setUser(u);
      if (u) loadRole(u.id);
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        role,
        isAdmin: role === "admin",
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
