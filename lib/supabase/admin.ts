import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseAdminConfig } from "@/lib/config";
import type { Database } from "@/lib/database.types";

/**
 * This client is only used after a server-side model response has passed local
 * validation. It must never be imported by a Client Component or public RPC.
 */
export function createAdminClient() {
  const { url, serviceRoleKey } = getSupabaseAdminConfig();
  return createClient<Database>(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
