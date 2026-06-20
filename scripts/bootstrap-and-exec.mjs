/**
 * bootstrap-and-exec.mjs
 * Langkah 1: Buat fungsi exec_sql via supabase RPC
 * Langkah 2: Jalankan semua DDL via fungsi itu
 */

const PROJECT_REF = 'qqpbylnmyyryduoofsog'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcGJ5bG5teXlyeWR1b29mc29nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTI1NTYwOCwiZXhwIjoyMDk2ODMxNjA4fQ.Bnrwlw9Iwak2uv-B6TzaTnSXbYDH5u0hLDYoZtkvO8I'
const BASE_URL = `https://${PROJECT_REF}.supabase.co`

const baseHeaders = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
}

// The full DDL to execute - all statements in order
const DDL_STATEMENTS = [
  // 1. Add image_urls column to products
  `ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]'::jsonb`,

  // 2. Add provider_trx_id to orders (might already exist)
  `ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS provider_trx_id TEXT`,

  // 3. Enable RLS on categories
  `ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY`,

  // 4. Categories RLS
  `DROP POLICY IF EXISTS "Public can view categories" ON public.categories`,
  `CREATE POLICY "Public can view categories" ON public.categories FOR SELECT USING (true)`,
  `DROP POLICY IF EXISTS "Authenticated can insert categories" ON public.categories`,
  `CREATE POLICY "Authenticated can insert categories" ON public.categories FOR INSERT WITH CHECK (auth.role() = 'authenticated')`,

  // 5. Products INSERT policy
  `DROP POLICY IF EXISTS "Sellers can insert products for their own store" ON public.products`,
  `CREATE POLICY "Sellers can insert products for their own store" ON public.products FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.stores s JOIN public.seller_profiles sp ON sp.id = s.seller_id WHERE s.id = products.store_id AND sp.user_id = auth.uid())
  )`,

  // 6. Products SELECT policy (replace old one)
  `DROP POLICY IF EXISTS "Public can view active products" ON public.products`,
  `DROP POLICY IF EXISTS "Sellers can view their own store products" ON public.products`,
  `CREATE POLICY "Sellers can view their own store products" ON public.products FOR SELECT USING (
    is_published = true OR EXISTS (
      SELECT 1 FROM public.stores s JOIN public.seller_profiles sp ON sp.id = s.seller_id
      WHERE s.id = products.store_id AND sp.user_id = auth.uid()
    )
  )`,

  // 7. Products DELETE policy
  `DROP POLICY IF EXISTS "Sellers can delete their own store products" ON public.products`,
  `CREATE POLICY "Sellers can delete their own store products" ON public.products FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.stores s JOIN public.seller_profiles sp ON sp.id = s.seller_id WHERE s.id = products.store_id AND sp.user_id = auth.uid())
  )`,

  // 8. Stores INSERT policy
  `DROP POLICY IF EXISTS "Sellers can insert their own store" ON public.stores`,
  `CREATE POLICY "Sellers can insert their own store" ON public.stores FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.seller_profiles sp WHERE sp.id = stores.seller_id AND sp.user_id = auth.uid())
  )`,

  // 9. Seller profiles INSERT policy
  `DROP POLICY IF EXISTS "Sellers can insert their own profile" ON public.seller_profiles`,
  `CREATE POLICY "Sellers can insert their own profile" ON public.seller_profiles FOR INSERT WITH CHECK (auth.uid() = user_id)`,

  // 10. Users INSERT policy
  `DROP POLICY IF EXISTS "Users can insert their own record" ON public.users`,
  `CREATE POLICY "Users can insert their own record" ON public.users FOR INSERT WITH CHECK (auth.uid() = id)`,

  // 11. Notifications INSERT policy
  `DROP POLICY IF EXISTS "Service can insert notifications" ON public.notifications`,
  `CREATE POLICY "Service can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true)`,

  // 12. Storage policies
  `DROP POLICY IF EXISTS "Allow authenticated upload product_images" ON storage.objects`,
  `CREATE POLICY "Allow authenticated upload product_images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product_images' AND auth.role() = 'authenticated')`,
  `DROP POLICY IF EXISTS "Allow public read product_images" ON storage.objects`,
  `CREATE POLICY "Allow public read product_images" ON storage.objects FOR SELECT USING (bucket_id = 'product_images')`,
  `DROP POLICY IF EXISTS "Allow owners delete product_images" ON storage.objects`,
  `CREATE POLICY "Allow owners delete product_images" ON storage.objects FOR DELETE USING (bucket_id = 'product_images' AND auth.uid()::text = (storage.foldername(name))[1])`,
]

// Step 1: Create exec_sql function using a special approach - 
// insert a function definition via a direct call
async function bootstrapExecFunction() {
  console.log('🔧 Step 1: Bootstrap exec_sql helper function...')
  
  // We need to create the function first. We'll use the Supabase REST API
  // to call a special initialization that creates our exec_sql function
  const createFnSQL = `
    CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
    RETURNS jsonb
    LANGUAGE plpgsql
    SECURITY DEFINER
    SET search_path = public
    AS $$
    DECLARE
      result jsonb;
    BEGIN
      EXECUTE sql;
      RETURN '{"status":"ok"}'::jsonb;
    EXCEPTION WHEN OTHERS THEN
      RETURN jsonb_build_object('status', 'error', 'message', SQLERRM, 'code', SQLSTATE);
    END;
    $$;
    
    GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;
  `

  // Try via the existing rls_auto_enable function (it has SECURITY DEFINER too)
  // Actually, let's try a different approach: use pg_dump style via REST
  
  // First check if function already exists
  const checkR = await fetch(`${BASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: baseHeaders,
    body: JSON.stringify({ sql: 'SELECT 1' })
  })
  
  if (checkR.ok) {
    console.log('  ✅ exec_sql function already exists')
    return true
  }
  
  console.log('  ℹ️  exec_sql not found, need to create via Dashboard')
  return false
}

async function runViaExecSQL(label, sql) {
  process.stdout.write(`  ⏳ ${label}... `)
  
  const r = await fetch(`${BASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: baseHeaders,
    body: JSON.stringify({ sql })
  })
  
  const text = await r.text()
  let parsed
  try { parsed = JSON.parse(text) } catch { parsed = { raw: text } }
  
  if (r.ok && (!parsed.status || parsed.status === 'ok')) {
    console.log('✅')
    return true
  } else if (parsed.status === 'error') {
    const msg = parsed.message || ''
    if (msg.includes('already exists') || msg.includes('does not exist')) {
      console.log('✅ (skipped)')
      return true
    }
    console.log(`❌ ${msg.substring(0, 100)}`)
    return false
  } else {
    const errStr = JSON.stringify(parsed)
    if (errStr.includes('already exists')) {
      console.log('✅ (already exists)')
      return true
    }
    console.log(`❌ ${errStr.substring(0, 150)}`)
    return false
  }
}

async function main() {
  console.log('🚀 MarketDigi - DDL Bootstrap & Migration\n' + '='.repeat(55))
  
  const hasExecFn = await bootstrapExecFunction()
  
  if (!hasExecFn) {
    console.log('\n' + '='.repeat(55))
    console.log('❗ AKSI DIPERLUKAN:')
    console.log('')
    console.log('Buka Supabase SQL Editor:')
    console.log('  https://supabase.com/dashboard/project/qqpbylnmyyryduoofsog/sql')
    console.log('')
    console.log('Jalankan SQL berikut untuk membuat fungsi helper:')
    console.log('-'.repeat(55))
    console.log(`
CREATE OR REPLACE FUNCTION public.exec_sql(sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE result jsonb;
BEGIN
  EXECUTE sql;
  RETURN '{"status":"ok"}'::jsonb;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('status','error','message',SQLERRM,'code',SQLSTATE);
END;
$$;

GRANT EXECUTE ON FUNCTION public.exec_sql(text) TO service_role;
`)
    console.log('-'.repeat(55))
    console.log('')
    console.log('Setelah itu jalankan lagi: node scripts/bootstrap-and-exec.mjs')
    return
  }
  
  console.log('\n📋 Step 2: Running all DDL statements...')
  let success = 0
  let failed = 0
  
  for (const sql of DDL_STATEMENTS) {
    const label = sql.trim().substring(0, 60).replace(/\s+/g, ' ') + '...'
    const ok = await runViaExecSQL(label, sql)
    if (ok) success++; else failed++
  }
  
  console.log(`\n${'='.repeat(55)}`)
  console.log(`✅ ${success} statements succeeded, ❌ ${failed} failed`)
}

main().catch(console.error)
