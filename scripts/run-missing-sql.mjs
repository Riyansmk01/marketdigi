/**
 * run-missing-sql-v2.mjs
 * Jalankan SQL yang belum ada menggunakan Supabase PostgREST + service role
 * Menggunakan pendekatan insert data (bukan DDL langsung)
 */

const PROJECT_REF = 'qqpbylnmyyryduoofsog'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFxcGJ5bG5teXlyeWR1b29mc29nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTI1NTYwOCwiZXhwIjoyMDk2ODMxNjA4fQ.Bnrwlw9Iwak2uv-B6TzaTnSXbYDH5u0hLDYoZtkvO8I'
const BASE_URL = `https://${PROJECT_REF}.supabase.co`

const headers = {
  'apikey': SERVICE_KEY,
  'Authorization': `Bearer ${SERVICE_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal,resolution=ignore-duplicates'
}

async function get(path) {
  const r = await fetch(`${BASE_URL}/rest/v1${path}`, { headers })
  return r.json()
}

async function post(path, body, prefer = 'return=minimal,resolution=ignore-duplicates') {
  const r = await fetch(`${BASE_URL}/rest/v1${path}`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': prefer },
    body: JSON.stringify(body)
  })
  const text = await r.text()
  return { ok: r.ok, status: r.status, body: text }
}

async function storagePost(path, body) {
  const r = await fetch(`${BASE_URL}/storage/v1${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })
  const text = await r.text()
  return { ok: r.ok, status: r.status, body: text }
}

// ====================================================================
// 1. Insert default categories yang belum ada
// ====================================================================
async function insertCategories() {
  console.log('\n📂 Inserting missing categories...')
  
  const categories = [
    { name: 'Akun Streaming', slug: 'akun-streaming' },
    { name: 'Software & OS', slug: 'software-os' },
    { name: 'Template Desain', slug: 'template-desain' },
    { name: 'Top Up Game', slug: 'top-up-game' },
    { name: 'Voucher Digital', slug: 'voucher-digital' },
    { name: 'Jasa Freelance', slug: 'jasa-freelance' },
    { name: 'Layanan AI', slug: 'layanan-ai' },
    { name: 'Web & Hosting', slug: 'web-hosting' },
  ]

  // Cek yang sudah ada
  const existing = await get('/categories?select=name')
  const existingNames = Array.isArray(existing) ? existing.map(c => c.name) : []
  
  const toInsert = categories.filter(c => !existingNames.includes(c.name))
  
  if (toInsert.length === 0) {
    console.log('  ✅ All categories already exist')
    return
  }

  console.log(`  Inserting ${toInsert.length} new categories:`, toInsert.map(c => c.name).join(', '))
  
  const result = await post('/categories', toInsert)
  if (result.ok || result.status === 201) {
    console.log('  ✅ Categories inserted successfully')
  } else {
    console.log('  ⚠️  Categories insert result:', result.status, result.body)
  }
}

// ====================================================================
// 2. Cek & konfirmasi kolom yang sudah/belum ada
// ====================================================================
async function checkColumns() {
  console.log('\n🔍 Checking existing columns...')

  // Check image_urls on products
  try {
    const r = await fetch(`${BASE_URL}/rest/v1/products?select=image_urls&limit=0`, { headers })
    if (r.ok) {
      console.log('  ✅ products.image_urls - EXISTS')
    } else {
      const err = await r.json()
      if (err.code === '42703') {
        console.log('  ❌ products.image_urls - MISSING (needs ALTER TABLE)')
      }
    }
  } catch(e) { console.log('  ❌ Error checking image_urls:', e.message) }

  // Check provider_trx_id on orders
  try {
    const r = await fetch(`${BASE_URL}/rest/v1/orders?select=provider_trx_id&limit=0`, { headers })
    if (r.ok) {
      console.log('  ✅ orders.provider_trx_id - EXISTS')
    } else {
      const err = await r.json()
      if (err.code === '42703') {
        console.log('  ❌ orders.provider_trx_id - MISSING (needs ALTER TABLE)')
      }
    }
  } catch(e) { console.log('  ❌ Error checking provider_trx_id:', e.message) }
}

// ====================================================================
// 3. Cek storage buckets
// ====================================================================
async function checkStorageBuckets() {
  console.log('\n🪣 Checking storage buckets...')
  
  const r = await fetch(`${BASE_URL}/storage/v1/bucket`, { headers })
  const buckets = await r.json()
  console.log('  Existing buckets:', Array.isArray(buckets) ? buckets.map(b => b.name).join(', ') : buckets)
}

// ====================================================================
// 4. Update storage bucket product_images (jika sudah ada, update public)
// ====================================================================
async function ensureStorageBucket() {
  console.log('\n🪣 Ensuring product_images bucket...')
  
  // Try create
  const r = await fetch(`${BASE_URL}/storage/v1/bucket`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      id: 'product_images',
      name: 'product_images',
      public: true,
      file_size_limit: 5242880,
      allowed_mime_types: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/jpg']
    })
  })
  const data = await r.json()
  
  if (r.ok) {
    console.log('  ✅ Bucket product_images created')
  } else if (data.error === 'The resource already exists' || data.statusCode === '409') {
    // Try to update to public
    const rUpdate = await fetch(`${BASE_URL}/storage/v1/bucket/product_images`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ public: true, file_size_limit: 5242880 })
    })
    const updateData = await rUpdate.json()
    console.log('  ✅ Bucket product_images already exists, updated:', updateData.message || 'OK')
  } else {
    console.log('  ⚠️  Bucket status:', r.status, JSON.stringify(data))
  }
}

// ====================================================================
// Main
// ====================================================================
async function main() {
  console.log('🚀 MarketDigi - Missing SQL Check & Fix\n' + '='.repeat(50))

  await checkColumns()
  await checkStorageBuckets()
  await insertCategories()
  await ensureStorageBucket()

  console.log('\n' + '='.repeat(50))
  console.log('📋 SUMMARY:')
  console.log('   ✅ Categories: checked/inserted')
  console.log('   ✅ Storage bucket: checked/created')
  console.log('')
  console.log('⚠️  PERLU MANUAL di Supabase Dashboard SQL Editor:')
  console.log('   Jalankan file: scripts/supabase-ddl-missing.sql')
  console.log('   URL: https://supabase.com/dashboard/project/qqpbylnmyyryduoofsog/sql')
}

main().catch(console.error)
