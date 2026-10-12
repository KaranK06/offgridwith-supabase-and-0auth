import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

type Auth = {
  user: User | null; // null = visitor is not logged in
  loading: boolean; // true while we check if a saved login exists
  signInWithGoogle: () => Promise<string | null>; // returns an error message, or null on success
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1) On page load: is there a saved login (or are we returning from Google)?
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    // 2) Afterwards: Supabase tells us whenever someone logs in, logs out, or the token refreshes.
    //    (Only set state here; don't call other Supabase methods inside this callback.)
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      return "Sign-in is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env file.";
    }
    // This sends the browser to Google. After the visitor approves, Google sends them to Supabase,
    // and Supabase sends them back to redirectTo (our site) with a one-time code that
    // supabase-js automatically exchanges for a session (see detectSessionInUrl in supabase.ts).
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + window.location.pathname },
    });
    return error ? error.message : null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("Auth context unavailable");
  return c;
}
