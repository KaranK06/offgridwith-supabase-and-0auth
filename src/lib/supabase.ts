import { createClient } from "@supabase/supabase-js";

// Vite only exposes variables that start with VITE_ to browser code.
// The "publishable" key is designed to be public: it can only do what the
// Row Level Security (RLS) rules in the database allow. Never put the
// "secret"/"service_role" key in front-end code.
const url = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined;

export const isSupabaseConfigured = Boolean(url && key);

// One shared client for the whole app. If the env vars are missing we still
// create a client (with dummy values) so the storefront keeps working with its
// built-in sample catalog instead of crashing; sign-in will show a clear error.
export const supabase = createClient(url ?? "http://localhost:54321", key ?? "missing-key", {
  auth: {
    flowType: "pkce", // the secure OAuth flow for browser apps
    persistSession: typeof window !== "undefined", // keep the login after refresh (browser only, not on the server)
    autoRefreshToken: typeof window !== "undefined",
    detectSessionInUrl: typeof window !== "undefined", // finishes the Google login when you come back to the site
  },
});
