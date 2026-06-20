/**
 * exec-ddl.mjs
 * Eksekusi DDL SQL via Supabase pg endpoint menggunakan service_role
 */

const PROJECT_REF = 'qqpbylnmyyryduoofsog'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcGJ5bG5teXlyeWR1b29mc29nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTI1NTYwOCwiZXhwIjoyMDk2ODMxNjA4fQ.Bnrwlw9Iwak2uv-B6TzaTnSXbYDH5u0hLDYoZtkvO8I'
const BASE_URL = `https://${PROJECT_REF}.supabase.co`

// Coba eksekusi via pg endpoint
async function execSQL(label, sql) {
  process.stdout.write(`⏳ ${label}... `)
  
  // Method 1: via /pg/query (supabase internal)
  let r = await fetch(`${BASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql })
  })

  if (!r.ok) {
    // Method 2: via rpc
    r = await fetch(`${BASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql })
    })
  }

  const text = await r.text()
  let parsed
  try { parsed = JSON.parse(text) } catch { parsed = text }
  
  if (r.ok) {
    console.log('✅')
  } else {
    // Check if error is "column already exists" (safe to ignore)
    const errStr = typeof parsed === 'string' ? parsed : JSON.stringify(parsed)
    if (errStr.includes('already exists') || errStr.includes('42701') || errStr.includes('42P07')) {
      console.log('✅ (already exists)')
    } else {
      console.log(`❌ ${r.status}:`, errStr.substring(0, 200))
    }
  }
  return r.ok
}

async function main() {
  console.log('🔧 MarketDigi DDL Migration via pg endpoint\n' + '='.repeat(50))

  const steps = [
    ['Add image_urls to products',
     `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]'::jsonb`],

    ['Add provider_trx_id to orders',
     `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS provider_trx_id TEXT`],

    ['Enable RLS on categories',
     `ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY`],

    ['RLS: Public view categories',
     `DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
      CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true)`],

    ['RLS: Authenticated insert categories',
     `DROP POLICY IF EXISTS "Authenticated can insert categories" ON public.categories;
      CREATE POLICY "Authenticated can insert categories" ON public.categories
      FOR INSERT WITH CHECK (auth.role() = 'authenticated')`],

    ['RLS: Sellers insert products',
     `DROP POLICY IF EXISTS "Sellers can insert products for their own store" ON public.products;
      CREATE POLICY "Sellers can insert products for their own store" ON public.products
      FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.stores s JOIN public.seller_profiles sp ON sp.id = s.seller_id
        WHERE s.id = products.store_id AND sp.user_id = auth.uid())
      )`],

    ['RLS: Sellers view own products',
     `DROP POLICY IF EXISTS "Public can view active products" ON public.products;
      DROP POLICY IF EXISTS "Sellers can view their own store products" ON public.products;
      CREATE POLICY "Sellers can view their own store products" ON public.products
      FOR SELECT USING (
        is_published = true OR EXISTS (
          SELECT 1 FROM public.stores s JOIN public.seller_profiles sp ON sp.id = s.seller_id
          WHERE s.id = products.store_id AND sp.user_id = auth.uid()
        )
      )`],

    ['RLS: Sellers delete own products',
     `DROP POLICY IF EXISTS "Sellers can delete their own store products" ON public.products;
      CREATE POLICY "Sellers can delete their own store products" ON public.products
      FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.stores s JOIN public.seller_profiles sp ON sp.id = s.seller_id
        WHERE s.id = products.store_id AND sp.user_id = auth.uid())
      )`],

    ['RLS: Sellers insert store',
     `DROP POLICY IF EXISTS "Sellers can insert their own store" ON public.stores;
      CREATE POLICY "Sellers can insert their own store" ON public.stores
      FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.seller_profiles sp WHERE sp.id = stores.seller_id AND sp.user_id = auth.uid())
      )`],

    ['RLS: Sellers insert seller_profile',
     `DROP POLICY IF EXISTS "Sellers can insert their own profile" ON public.seller_profiles;
      CREATE POLICY "Sellers can insert their own profile" ON public.seller_profiles
      FOR INSERT WITH CHECK (auth.uid() = user_id)`],

    ['RLS: Users insert own record',
     `DROP POLICY IF EXISTS "Users can insert their own record" ON public.users;
      CREATE POLICY "Users can insert their own record" ON public.users
      FOR INSERT WITH CHECK (auth.uid() = id)`],

    ['RLS: Service insert notifications',
     `DROP POLICY IF EXISTS "Service can insert notifications" ON public.notifications;
      CREATE POLICY "Service can insert notifications" ON public.notifications
      FOR INSERT WITH CHECK (true)`],

    ['Storage RLS: upload product_images',
     `DROP POLICY IF EXISTS "Allow authenticated upload product_images" ON storage.objects;
      CREATE POLICY "Allow authenticated upload product_images" ON storage.objects
      FOR INSERT WITH CHECK (bucket_id = 'product_images' AND auth.role() = 'authenticated')`],

    ['Storage RLS: public read product_images',
     `DROP POLICY IF EXISTS "Allow public read product_images" ON storage.objects;
      CREATE POLICY "Allow public read product_images" ON storage.objects
      FOR SELECT USING (bucket_id = 'product_images')`],

    ['Storage RLS: owners delete product_images',
     `DROP POLICY IF EXISTS "Allow owners delete product_images" ON storage.objects;
      CREATE POLICY "Allow owners delete product_images" ON storage.objects
      FOR DELETE USING (bucket_id = 'product_images' AND auth.uid()::text = (storage.foldername(name))[1])`],
  ]

  for (const [label, sql] of steps) {
    await execSQL(label, sql)
  }

  console.log('\n' + '='.repeat(50))
  console.log('✅ Done!')
}

main().catch(console.error)
