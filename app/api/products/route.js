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

function slugifyCategory(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeFallbackProduct(product) {
  return {
    id: product.id,
    categoryId: null,
    name: product.name,
    slug: product.slug || String(product.id),
    shortDescription: product.short_description || product.description || '',
    description: product.description || product.short_description || '',
    price: Number(product.price || 0),
    originalPrice:
      product.originalPrice == null ? null : Number(product.originalPrice),
    sku: product.sku || null,
    stock: Number(product.stock ?? 0),
    featured: Boolean(product.featured),
    active: true,
    category: product.category || 'General',
    categorySlug: slugifyCategory(product.category),
    image: product.image || '',
    images: product.image ? [product.image] : [],
    createdAt: null,
  }
}

function findFallbackProduct(id) {
  const value = String(id || '').trim()

  return fallbackProducts.find((product) => {
    return (
      String(product.id) === value ||
      String(product.slug || '') === value
    )
  })
}

function firstImage(product) {
  if (Array.isArray(product?.product_images) && product.product_images.length) {
    const sorted = [...product.product_images].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    )
    return sorted[0]?.image_url || ''
  }

  return product?.image || product?.image_url || ''
}

function mapProduct(product) {
  if (!product) return null

  const images = Array.isArray(product.product_images)
    ? [...product.product_images]
      .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((item) => item.image_url)
      .filter(Boolean)
    : Array.isArray(product.images)
      ? product.images.filter(Boolean)
      : []

  return {
    id: product.id,
    categoryId: product.category_id || product.categories?.id || null,
    name: product.name,
    slug: product.slug || String(product.id),
    shortDescription: product.short_description || null,
    description: product.description || product.short_description || '',
    price: Number(product.price || 0),
    originalPrice:
      product.compare_at_price == null
        ? null
        : Number(product.compare_at_price),
    sku: product.sku || null,
    stock: Number(product.stock ?? 0),
    featured: Boolean(product.featured),
    active: Boolean(product.active ?? true),
    category: product.categories?.name || product.category || 'General',
    categorySlug:
      product.categories?.slug ||
      slugifyCategory(product.categories?.name || product.category || 'General'),
    image: firstImage(product),
    images: images.length ? images : [firstImage(product)].filter(Boolean),
    createdAt: product.created_at || null,
  }
}

export async function GET(_request, { params }) {
  const id = params.id
  const supabase = getSupabaseClient()

  if (!supabase) {
    const fallbackProduct = findFallbackProduct(id)

    if (!fallbackProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(normalizeFallbackProduct(fallbackProduct), {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  }

  try {
    const selectFields = `
      id,
      category_id,
      name,
      slug,
      short_description,
      description,
      price,
      compare_at_price,
      sku,
      stock,
      featured,
      active,
      created_at,
      image_url,
      categories ( id, name, slug ),
      product_images ( id, image_url, alt_text, sort_order )
    `

    let response = await supabase
      .from('products')
      .select(selectFields)
      .eq('id', id)
      .eq('active', true)
      .maybeSingle()

    if (!response.data && typeof id === 'string') {
      response = await supabase
        .from('products')
        .select(selectFields)
        .eq('slug', id)
        .eq('active', true)
        .maybeSingle()
    }

    if (response.error) {
      const fallbackProduct = findFallbackProduct(id)

      if (fallbackProduct) {
        return NextResponse.json(normalizeFallbackProduct(fallbackProduct), {
          headers: { 'Cache-Control': 'no-store, max-age=0' },
        })
      }

      return NextResponse.json(
        { error: response.error.message },
        { status: 500 }
      )
    }

    if (!response.data) {
      const fallbackProduct = findFallbackProduct(id)

      if (fallbackProduct) {
        return NextResponse.json(normalizeFallbackProduct(fallbackProduct), {
          headers: { 'Cache-Control': 'no-store, max-age=0' },
        })
      }

      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(mapProduct(response.data), {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    })
  } catch (error) {
    const fallbackProduct = findFallbackProduct(id)

    if (fallbackProduct) {
      return NextResponse.json(normalizeFallbackProduct(fallbackProduct), {
        headers: { 'Cache-Control': 'no-store, max-age=0' },
      })
    }

    return NextResponse.json(
      { error: error?.message || 'No se pudo obtener el producto' },
      { status: 500 }
    )
  }
}