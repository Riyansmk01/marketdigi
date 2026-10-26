-- ===================================================
-- Skema Database Supabase untuk Web Undangan Pernikahan
-- ===================================================

-- 1. Tabel RSVP (Konfirmasi Kehadiran)
CREATE TABLE IF NOT EXISTS public.rsvps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    attendance TEXT NOT NULL CHECK (attendance IN ('hadir', 'tidak_hadir', 'ragu')),
    guests_count INTEGER NOT NULL DEFAULT 1 CHECK (guests_count >= 1 AND guests_count <= 5),
    message TEXT
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Izinkan publik untuk mengirimkan RSVP (INSERT)
CREATE POLICY "Allow public insert on rsvps" 
ON public.rsvps 
FOR INSERT 
WITH CHECK (true);

-- Izinkan publik untuk membaca ucapan (SELECT)
CREATE POLICY "Allow public select on rsvps" 
ON public.rsvps 
FOR SELECT 
USING (true);

-- Index untuk performa query ucapan terbaru
CREATE INDEX IF NOT EXISTS rsvps_created_at_idx ON public.rsvps (created_at DESC);
