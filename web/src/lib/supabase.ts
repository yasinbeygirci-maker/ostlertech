import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Lazy Supabase istemcisi — modül yükleme anında env OKUMAZ.
 *
 * Neden: build ortamında (örn. Vercel) env tanımlı değilse eski kod modül
 * yükleme sırasında patlıyor ve TÜM deploy'u öldürüyordu. Artık istemci ilk
 * gerçek kullanımda oluşturulur; env eksikse hata yalnızca o rota çalıştığında
 * net mesajla fırlar, build etkilenmez.
 */
let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (!client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!url || !key) {
      throw new Error(
        'Supabase yapılandırması eksik — NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_ANON_KEY tanımlı olmalı.',
      )
    }
    client = createClient(url, key)
  }
  return client
}