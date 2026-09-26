import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "@/lib/config";
import type { Database } from "@/lib/database.types";

/** A cookie-free client for the constrained public tablet RPC only. */
export function createPublicClient() {
  const { url, key } = getSupabaseConfig();
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
