import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fallbackProducts } from '@/lib/site'

export const dynamic = 'force-dynamic'

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) return null
  return createClient(url, key)
}

function findFallbackProduct(id) {
  const value = String(id || '').trim()

  return fallbackProducts.find(
    (p) => String(p.id) === value || String(p.slug || '') === value
  )
}

export async function GET(_req, { params }) {
  const id = params.id
  const supabase = getSupabaseClient()

  if (!supabase) {
    const fallback = findFallbackProduct(id)
    if (!fallback) {
      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }
    return NextResponse.json(fallback)
  }

  try {
    let { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    if (!data) {
      const res = await supabase
        .from('products')
        .select('*')
        .eq('slug', id)
        .maybeSingle()

      data = res.data
      error = res.error
    }

    if (error || !data) {
      const fallback = findFallbackProduct(id)
      if (fallback) return NextResponse.json(fallback)

      return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}