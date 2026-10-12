import { supabase } from "@/lib/supabase";

export type Profile = { name: string; email: string; mobile: string; address: string };
export const emptyProfile: Profile = { name: "", email: "", mobile: "", address: "" };

// Reads the logged-in user's row from the "profiles" table.
// Row Level Security guarantees the database only ever returns *your own* row.
export async function fetchProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("name, email, mobile, address")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return {
    name: data?.name ?? "",
    email: data?.email ?? "",
    mobile: data?.mobile ?? "",
    address: data?.address ?? "",
  };
}

// Only name, mobile and address are editable. Email belongs to the Google account, so we never overwrite it.
export async function saveProfile(userId: string, profile: Profile) {
  const { error } = await supabase
    .from("profiles")
    .update({ name: profile.name, mobile: profile.mobile, address: profile.address })
    .eq("id", userId);
  if (error) throw error;
}
