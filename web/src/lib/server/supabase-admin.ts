import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lisans tablolarına (sp_*) yalnızca sunucu erişir; RLS açık ve tarayıcı için politika yok.
// Service role anahtarı tarayıcıya asla gitmez: NEXT_PUBLIC_ ile başlamaz ve bu dosya "server-only".
let admin: SupabaseClient | null = null;

export function supabaseAdmin(): SupabaseClient {
  if (!admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY tanımlı olmalı");
    admin = createClient(url, key, { auth: { persistSession: false } });
  }
  return admin;
}
