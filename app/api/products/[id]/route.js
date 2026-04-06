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

function normalizeCategoryRecord(category) {
  if (!category?.name && !category?.slug) return null
  const name = category?.name || category?.slug || ''
  const slug = category?.slug || slugifyCategory(name)
  if (!slug) return null
  return {
    id: category?.id || slug,
    name,
    slug,
    description: category?.description || null,
    sort_order: category?.sort_order ?? null,
    active: category?.active ?? true,
  }
}

function normalizeFallbackProduct(product) {
  const categorySlug = slugifyCategory(product.category)
  return {
    id: product.id,
    name: product.name,
    slug: product.slug || String(product.id),
    short_description: product.short_description || product.description || '',
    shortDescription: product.short_description || product.description || '',
    description: product.description || product.short_description || '',
    price: Number(product.price || 0),
    compare_at_price:
      product.originalPrice == null ? null : Number(product.originalPrice),
    originalPrice:
      product.originalPrice == null ? null : Number(product.originalPrice),
    sku: product.sku || null,
    stock: Number(product.stock ?? 0),
    featured: Boolean(product.featured),
    active: true,
    category_id: null,
    categoryId: null,
    category: product.category || 'General',
    category_slug: categorySlug,
    categorySlug,
    category_data: product.category
      ? {
          id: null,
          name: product.category,
          slug: categorySlug,
        }
      : null,
    image: product.image || '',
    images: product.image ? [product.image] : [],
    created_at: null,
    createdAt: null,
  }
}

function findFallbackProduct(id) {
  const value = String(id || '').trim()

  return fallbackProducts.find((product) => {
    return String(product.id) === value || String(product.slug || '') === value
  })
}

function firstImage(product) {
  if (Array.isArray(product?.product_images) && product.product_images.length) {
    const sorted = [...product.product_images].sort(
      (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
    )
    return sorted[0]?.image_url || ''
  }

  if (Array.isArray(product?.images) && product.images.length) {
    const first = product.images[0]
    return typeof first === 'string' ? first : first?.image_url || ''
  }

  return product?.image || product?.image_url || ''
}

function mapProduct(product) {
  if (!product) return null

  const categoryRow = Array.isArray(product.categories)
    ? normalizeCategoryRecord(product.categories[0])
    : normalizeCategoryRecord(product.categories)

  const imageObjects = Array.isArray(product.product_images)
    ? [...product.product_images]
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((item) => ({
          id: item.id ?? null,
          image_url: item.image_url,
          alt_text: item.alt_text || product.name || 'Producto',
          sort_order: item.sort_order ?? 0,
        }))
        .filter((item) => item.image_url)
    : Array.isArray(product.images)
      ? product.images
          .map((item, index) =>
            typeof item === 'string'
              ? { id: index, image_url: item, alt_text: product.name || 'Producto', sort_order: index }
              : item
          )
          .filter((item) => item?.image_url)
      : []

  const flatImages = imageObjects.map((item) => item.image_url)

  return {
    id: product.id,
    name: product.name,
    slug: product.slug || String(product.id),
    short_description: product.short_description || null,
    shortDescription: product.short_description || null,
    description: product.description || product.short_description || '',
    price: Number(product.price || 0),
    compare_at_price:
      product.compare_at_price == null ? null : Number(product.compare_at_price),
    originalPrice:
      product.compare_at_price == null ? null : Number(product.compare_at_price),
    sku: product.sku || null,
    stock: Number(product.stock ?? 0),
    featured: Boolean(product.featured),
    active: Boolean(product.active ?? true),
    category_id: product.category_id || categoryRow?.id || null,
    categoryId: product.category_id || categoryRow?.id || null,
    category: categoryRow?.name || product.category || 'General',
    category_slug: categoryRow?.slug || slugifyCategory(categoryRow?.name || product.category || 'General'),
    categorySlug: categoryRow?.slug || slugifyCategory(categoryRow?.name || product.category || 'General'),
    category_data: categoryRow
      ? {
          id: categoryRow.id,
          name: categoryRow.name,
          slug: categoryRow.slug,
        }
      : null,
    image: firstImage({ ...product, images: imageObjects }),
    images: flatImages.length ? flatImages : [firstImage(product)].filter(Boolean),
    created_at: product.created_at || null,
    createdAt: product.created_at || null,
  }
}

export async function GET(_request, { params }) {
  const id = params?.id
  const supabase = getSupabaseClient()

  if (!supabase) {
    const fallbackProduct = findFallbackProduct(id)

    if (!fallbackProduct) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404, headers: { 'Cache-Control': 'no-store, max-age=0' } }
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
      categories ( id, name, slug, description, sort_order, active ),
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
        { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
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
        { status: 404, headers: { 'Cache-Control': 'no-store, max-age=0' } }
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
      { status: 500, headers: { 'Cache-Control': 'no-store, max-age=0' } }
    )
  }
}
