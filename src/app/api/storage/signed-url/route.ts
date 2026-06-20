import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

/**
 * POST /api/storage/signed-url
 * Body: { bucket?: string, path: string, expires?: number }
 * Returns a signed URL for private objects. Expects server-side usage only.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bucket = 'product_images', path, expires = 60 } = body as {
      bucket?: string
      path?: string
      expires?: number
    }

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ error: 'Missing required `path` in body' }, { status: 400 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Server misconfiguration: supabaseAdmin unavailable' }, { status: 500 })
    }

    const { data, error } = await supabaseAdmin.storage.from(bucket).createSignedUrl(path, Number(expires))

    if (error) {
      console.error('[signed-url] Error creating signed URL:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ signedUrl: data.signedUrl, expiresAt: data.signedUrlExpiresAt })
  } catch (err: any) {
    console.error('[signed-url] Unexpected error:', err)
    return NextResponse.json({ error: err.message || 'Unexpected error' }, { status: 500 })
  }
}
