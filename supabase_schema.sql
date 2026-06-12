-- ==================================================================================
-- CLONE MARKETKU - DATABASE SCHEMA & SECURITY POLICIES FOR SUPABASE
-- PERLINDUNGAN ANTI-PENIPUAN, ESCROW TRADE GUARD & INTEGRASI PAYMENT GATEWAY
-- ==================================================================================

-- 1. EXTENSIONS & UUID CONFIGURATION
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS FOR STATUS Lifecycle
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');
CREATE TYPE stock_status AS ENUM ('Ready', 'Pre Order', 'Habis', 'Tidak tersedia');
CREATE TYPE fulfillment_type AS ENUM ('Akun Digital', 'Link Akses', 'OTP Service', 'Pre-Order', 'Layanan Jasa');
CREATE TYPE order_status AS ENUM ('Proses', 'Berhasil', 'Tidak Berhasil', 'Garansi Aktif', 'Dikomplain');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'expired');

-- 3. TABLES DEFINITIONS

-- Users Profile (Linked to Supabase Auth)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    role user_role DEFAULT 'seller'::user_role NOT NULL,
    balance NUMERIC(12, 2) DEFAULT 0.00 NOT NULL CHECK (balance >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seller Profile & WhatsApp Verification status (Anti-Fraud Onboarding)
CREATE TABLE public.seller_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    whatsapp_number TEXT UNIQUE NOT NULL,
    whatsapp_verified BOOLEAN DEFAULT false NOT NULL,
    whatsapp_verified_at TIMESTAMP WITH TIME ZONE,
    bank_name TEXT,
    bank_account_no TEXT,
    bank_account_name TEXT,
    bank_verified BOOLEAN DEFAULT false NOT NULL,
    tier INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Stores / Subdomain Tenants
CREATE TABLE public.stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID REFERENCES public.seller_profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subdomain TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Categories
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL
);

-- Products & Fulfillment settings
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE RESTRICT NOT NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    stock_qty INTEGER DEFAULT 99 NOT NULL CHECK (stock_qty >= 0),
    stock_status stock_status DEFAULT 'Ready'::stock_status NOT NULL,
    fulfillment_type fulfillment_type DEFAULT 'Akun Digital'::fulfillment_type NOT NULL,
    is_published BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Product Variants
CREATE TABLE public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0)
);

-- Escrow Orders (Anti-Fraud State Machine)
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID REFERENCES public.users(id) ON DELETE RESTRICT NOT NULL,
    store_id UUID REFERENCES public.stores(id) ON DELETE RESTRICT NOT NULL,
    invoice_no TEXT UNIQUE NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    service_fee NUMERIC(12, 2) DEFAULT 2500.00 NOT NULL CHECK (service_fee >= 0),
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    status order_status DEFAULT 'Proses'::order_status NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order Items Snapshots
CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE RESTRICT NOT NULL,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    qty INTEGER DEFAULT 1 NOT NULL CHECK (qty > 0),
    price NUMERIC(12, 2) NOT NULL CHECK (price >= 0),
    custom_payload JSONB
);

-- Payment Transactions & Signatures (klikqris.com logs)
CREATE TABLE public.payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE RESTRICT NOT NULL,
    payment_method TEXT NOT NULL,
    status payment_status DEFAULT 'pending'::payment_status NOT NULL,
    amount_request NUMERIC(12, 2) NOT NULL,
    amount_paid NUMERIC(12, 2) CHECK (amount_paid >= 0),
    signature TEXT UNIQUE NOT NULL, -- Double-security validation signature
    expired_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trade Guard Active Guarantees
CREATE TABLE public.guarantees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE RESTRICT UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL
);

-- Disputes & Mediation (Mediasi Anti-Penipuan)
CREATE TABLE public.disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.orders(id) ON DELETE RESTRICT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'pending_mediation' NOT NULL, -- pending_mediation, resolved, refunded
    opened_by UUID REFERENCES public.users(id) NOT NULL,
    opened_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==================================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES (Ketat & Anti-Penipuan)
-- Enforce database-level check: no user can read/write other people's money.
-- ==================================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guarantees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- USERS Table policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- SELLER PROFILES Table policies
CREATE POLICY "Sellers can view their own profile" ON public.seller_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Sellers can update their own profile" ON public.seller_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- STORES Table policies (Public read, Seller write)
CREATE POLICY "Public can view all stores" ON public.stores
    FOR SELECT USING (true);

CREATE POLICY "Sellers can update their own store" ON public.stores
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.seller_profiles sp
            WHERE sp.id = stores.seller_id AND sp.user_id = auth.uid()
        )
    );

-- PRODUCTS Table policies (Public read, Seller write)
CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (is_published = true);

CREATE POLICY "Sellers can modify products for their own store" ON public.products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.stores s
            JOIN public.seller_profiles sp ON sp.id = s.seller_id
            WHERE s.id = products.store_id AND sp.user_id = auth.uid()
        )
    );

-- ORDERS Table policies (Buyer and Seller read access only)
CREATE POLICY "Buyers can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = buyer_id);

CREATE POLICY "Buyers can insert their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Sellers can view orders made to their store" ON public.orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.stores s
            JOIN public.seller_profiles sp ON sp.id = s.seller_id
            WHERE s.id = orders.store_id AND sp.user_id = auth.uid()
        )
    );

-- ORDER ITEMS Table policies (Buyer and Seller read & Buyer write)
CREATE POLICY "Buyers can view their own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id AND (o.buyer_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.stores s
                JOIN public.seller_profiles sp ON sp.id = s.seller_id
                WHERE s.id = o.store_id AND sp.user_id = auth.uid()
            ))
        )
    );

CREATE POLICY "Buyers can insert order items for their own orders" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_items.order_id AND o.buyer_id = auth.uid()
        )
    );

-- PAYMENT TRANSACTIONS Table policies (Super strict: read only for related buyer/seller, write denied)
CREATE POLICY "Users can view their own transaction details" ON public.payment_transactions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = payment_transactions.order_id AND (o.buyer_id = auth.uid() OR EXISTS (
                SELECT 1 FROM public.stores s
                JOIN public.seller_profiles sp ON sp.id = s.seller_id
                WHERE s.id = o.store_id AND sp.user_id = auth.uid()
            ))
        )
    );

-- DISPUTES Table policies
CREATE POLICY "Buyers can open disputes for their orders" ON public.disputes
    FOR INSERT WITH CHECK (auth.uid() = opened_by);

CREATE POLICY "Parties involved can view disputes" ON public.disputes
    FOR SELECT USING (
        auth.uid() = opened_by OR EXISTS (
            SELECT 1 FROM public.orders o
            JOIN public.stores s ON s.id = o.store_id
            JOIN public.seller_profiles sp ON sp.id = s.seller_id
            WHERE o.id = disputes.order_id AND sp.user_id = auth.uid()
        )
    );

-- ==================================================================================
-- 5. ANTI-FRAUD TRIGGERS & PROCEDURES (Pencegahan Pengiriman Ganda & Kebocoran Saldo)
-- ==================================================================================

-- Trigger to verify that order cannot be completed without valid PAID transaction signature
CREATE OR REPLACE FUNCTION public.check_payment_before_fulfill()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if status is transitioning to Success / Berhasil
    IF NEW.status = 'Berhasil'::order_status AND OLD.status != 'Berhasil'::order_status THEN
        -- Check if there is a verified PAID transaction matching this order
        IF NOT EXISTS (
            SELECT 1 FROM public.payment_transactions
            WHERE order_id = NEW.id AND status = 'paid'::payment_status
        ) THEN
            RAISE EXCEPTION 'FRAUD DETECTED: Order cannot be marked succeeded without a verified PAID transaction!';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER verify_order_fulfillment
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.check_payment_before_fulfill();

-- Trigger to prevent double-spending / duplicate delivery on webhook callback
CREATE OR REPLACE FUNCTION public.prevent_duplicate_webhook_fulfillment()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent changing status once transaction has already been paid
    IF OLD.status = 'paid'::payment_status AND NEW.status != 'paid'::payment_status THEN
        RAISE EXCEPTION 'SECURITY LOCK: Paid transactions status cannot be altered!';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER lock_paid_transactions
    BEFORE UPDATE ON public.payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_duplicate_webhook_fulfillment();

-- Trigger to automatically create a profile in public.users when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role public.user_role;
  v_whatsapp TEXT;
  v_store_name TEXT;
  v_store_slug TEXT;
  v_seller_profile_id UUID;
BEGIN
  -- Force admin role for the specific email, else check metadata, else seller by default
  IF NEW.email = 'perdhanariyan@gmail.com' THEN
    v_role := 'admin'::public.user_role;
  ELSIF NEW.raw_user_meta_data->>'role' = 'buyer' THEN
    v_role := 'buyer'::public.user_role;
  ELSE
    v_role := 'seller'::public.user_role;
  END IF;
  
  INSERT INTO public.users (id, email, role, balance)
  VALUES (NEW.id, NEW.email, v_role, 0.00)
  ON CONFLICT (id) DO NOTHING;

  -- Only create seller profiles and stores for sellers and admins
  IF v_role != 'buyer'::public.user_role THEN
    v_whatsapp := COALESCE(NEW.raw_user_meta_data->>'phone', '0812' || floor(random() * 90000000 + 10000000)::text);
    v_store_name := COALESCE(NEW.raw_user_meta_data->>'storeName', 'Toko ' || SPLIT_PART(NEW.email, '@', 1));
    v_store_slug := COALESCE(NEW.raw_user_meta_data->>'storeSlug', 'toko-' || LOWER(SPLIT_PART(NEW.email, '@', 1)) || '-' || floor(random() * 900 + 100)::text);

    -- Insert into seller_profiles and get the ID
    INSERT INTO public.seller_profiles (user_id, whatsapp_number, whatsapp_verified, tier)
    VALUES (NEW.id, v_whatsapp, true, 0)
    ON CONFLICT (user_id) DO NOTHING
    RETURNING id INTO v_seller_profile_id;

    IF v_seller_profile_id IS NULL THEN
      SELECT id INTO v_seller_profile_id FROM public.seller_profiles WHERE user_id = NEW.id;
    END IF;

    -- Insert into stores
    IF v_seller_profile_id IS NOT NULL THEN
      INSERT INTO public.stores (seller_id, name, slug)
      VALUES (v_seller_profile_id, v_store_name, v_store_slug)
      ON CONFLICT (slug) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. PRODUCT REVIEWS TABLE & RLS POLICIES (Takedown system)
CREATE TABLE public.product_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    media_url TEXT,
    is_flagged BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view reviews" ON public.product_reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert reviews" ON public.product_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins and Sellers can moderate reviews" ON public.product_reviews
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.users u
            WHERE u.id = auth.uid() AND u.role = 'admin'::public.user_role
        ) OR EXISTS (
            SELECT 1 FROM public.products p
            JOIN public.stores s ON s.id = p.store_id
            JOIN public.seller_profiles sp ON sp.id = s.seller_id
            WHERE p.id = product_reviews.product_id AND sp.user_id = auth.uid()
        )
    );

-- 7. CHATS TABLE & RLS POLICIES
CREATE TABLE public.chats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chats" ON public.chats
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send chats" ON public.chats
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 8. NOTIFICATIONS TABLE & RLS POLICIES
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

