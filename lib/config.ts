import { z } from "zod";

const schema = z.object({
  url: z.url(),
  key: z
    .string()
    .min(20)
    .refine(
      (value) => !value.startsWith("replace-"),
      "Replace the placeholder key",
    ),
});

const adminSchema = z.object({
  url: z.url(),
  serviceRoleKey: z
    .string()
    .min(20)
    .refine(
      (value) => !value.startsWith("replace-"),
      "Replace the placeholder key",
    ),
});

// Explicit reads let Next.js safely inline only these public values in client bundles.
export function getSupabaseConfig() {
  const result = schema.safeParse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
  if (!result.success)
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local. See README.md.",
    );
  return result.data;
}

export function isConfigured() {
  try {
    getSupabaseConfig();
    return true;
  } catch {
    return false;
  }
}

/** Private configuration for writes that the public tablet client may never make. */
export function getSupabaseAdminConfig() {
  const result = adminSchema.safeParse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
  if (!result.success)
    throw new Error(
      "Set SUPABASE_SERVICE_ROLE_KEY for server-only review suggestions.",
    );
  return result.data;
}

export function isAdminConfigured() {
  try {
    getSupabaseAdminConfig();
    return true;
  } catch {
    return false;
  }
}
