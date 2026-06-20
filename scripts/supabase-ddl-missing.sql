-- ============================================================
-- MarketDigi - MISSING SQL DDL
-- Jalankan di: https://supabase.com/dashboard/project/qqpbylnmyyryduoofsog/sql
-- ============================================================

-- ============================================================
-- BAGIAN 1: ALTER TABLE (Kolom yang Belum Ada)
-- ============================================================

-- 1a. Tambah image_urls ke products (KRITIS - upload foto produk tidak bisa jalan tanpa ini)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_urls JSONB DEFAULT '[]'::jsonb;

-- 1b. Tambah provider_trx_id ke orders (untuk VIP Reseller webhook tracking)
--     Sudah ada, tapi pastikan tidak error
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS provider_trx_id TEXT;

-- ============================================================
-- BAGIAN 2: ENABLE RLS pada categories (jika belum)
-- ============================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- BAGIAN 3: RLS POLICIES yang Belum Ada
-- ============================================================

-- 3a. Categories: Public bisa baca
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories" ON public.categories
  FOR SELECT USING (true);

-- 3b. Categories: Authenticated bisa insert kategori baru
DROP POLICY IF EXISTS "Authenticated can insert categories" ON public.categories;
CREATE POLICY "Authenticated can insert categories" ON public.categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3c. Products: Seller bisa INSERT produk ke toko mereka
DROP POLICY IF EXISTS "Sellers can insert products for their own store" ON public.products;
CREATE POLICY "Sellers can insert products for their own store" ON public.products
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stores s
      JOIN public.seller_profiles sp ON sp.id = s.seller_id
      WHERE s.id = products.store_id AND sp.user_id = auth.uid()
    )
  );

-- 3d. Products: Seller bisa lihat produknya sendiri (termasuk yang unpublished)
DROP POLICY IF EXISTS "Public can view active products" ON public.products;
DROP POLICY IF EXISTS "Sellers can view their own store products" ON public.products;
CREATE POLICY "Sellers can view their own store products" ON public.products
  FOR SELECT USING (
    is_published = true
    OR EXISTS (
      SELECT 1 FROM public.stores s
      JOIN public.seller_profiles sp ON sp.id = s.seller_id
      WHERE s.id = products.store_id AND sp.user_id = auth.uid()
    )
  );

-- 3e. Products: Seller bisa DELETE produk mereka sendiri
DROP POLICY IF EXISTS "Sellers can delete their own store products" ON public.products;
CREATE POLICY "Sellers can delete their own store products" ON public.products
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.stores s
      JOIN public.seller_profiles sp ON sp.id = s.seller_id
      WHERE s.id = products.store_id AND sp.user_id = auth.uid()
    )
  );

-- 3f. Stores: Seller bisa INSERT toko mereka
DROP POLICY IF EXISTS "Sellers can insert their own store" ON public.stores;
CREATE POLICY "Sellers can insert their own store" ON public.stores
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.seller_profiles sp
      WHERE sp.id = stores.seller_id AND sp.user_id = auth.uid()
    )
  );

-- 3g. Seller Profiles: Seller bisa INSERT profile mereka
DROP POLICY IF EXISTS "Sellers can insert their own profile" ON public.seller_profiles;
CREATE POLICY "Sellers can insert their own profile" ON public.seller_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3h. Users: Bisa INSERT record sendiri (trigger handle_new_user butuh ini)
DROP POLICY IF EXISTS "Users can insert their own record" ON public.users;
CREATE POLICY "Users can insert their own record" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 3i. Notifications: System bisa insert (untuk notifikasi dari backend)
DROP POLICY IF EXISTS "Service can insert notifications" ON public.notifications;
CREATE POLICY "Service can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- BAGIAN 4: STORAGE RLS POLICIES
-- ============================================================

-- 4a. Upload ke product_images bucket (authenticated users)
DROP POLICY IF EXISTS "Allow authenticated upload product_images" ON storage.objects;
CREATE POLICY "Allow authenticated upload product_images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'product_images' AND auth.role() = 'authenticated');

-- 4b. Public bisa baca semua gambar produk
DROP POLICY IF EXISTS "Allow public read product_images" ON storage.objects;
CREATE POLICY "Allow public read product_images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product_images');

-- 4c. Pemilik bisa hapus gambar mereka
DROP POLICY IF EXISTS "Allow owners delete product_images" ON storage.objects;
CREATE POLICY "Allow owners delete product_images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'product_images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- BAGIAN 5: INSERT Categories Default (yang belum ada)
-- ============================================================

INSERT INTO public.categories (name, slug) VALUES
  ('Akun Streaming', 'akun-streaming'),
  ('Software & OS', 'software-os'),
  ('Template Desain', 'template-desain'),
  ('Top Up Game', 'top-up-game'),
  ('Voucher Digital', 'voucher-digital'),
  ('Jasa Freelance', 'jasa-freelance'),
  ('Layanan AI', 'layanan-ai'),
  ('Web & Hosting', 'web-hosting')
ON CONFLICT (name) DO NOTHING;

-- ============================================================
-- VERIFIKASI (jalankan setelah semua di atas selesai)
-- ============================================================

-- Cek kolom products:
SELECT column_name, data_type FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'products'
ORDER BY ordinal_position;

-- Cek semua categories:
SELECT name, slug FROM public.categories ORDER BY name;

-- Cek policies yang aktif:
SELECT tablename, policyname, cmd FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
