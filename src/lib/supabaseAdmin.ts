import { createClient } from '@supabase/supabase-js'

/**
 * Admin client — uses SERVICE ROLE KEY.
 * ⚠️  NEVER expose this client to the browser / client components.
 *     Use ONLY inside Next.js Route Handlers (src/app/api/...).
 *     This client bypasses Row Level Security (RLS) so webhooks and
 *     server-side logic can write to protected tables.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!serviceRoleKey) {
  console.error('[supabaseAdmin] Missing SUPABASE_SERVICE_ROLE_KEY – webhook/server writes will fail.')
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    // Do not persist any session; this is a pure server-side client
    persistSession: false,
    autoRefreshToken: false,
  },
})
