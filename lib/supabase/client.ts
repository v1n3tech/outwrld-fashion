// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

/**
 * Export a singleton browser client so we don't create multiple clients & duplicate auth listeners.
 * Use this in client components only.
 */
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars");
}

// create once and reuse
export const supabaseBrowser = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
