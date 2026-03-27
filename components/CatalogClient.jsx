'use client'

import { useMemo, useState } from 'react'
import ProductCard from '@/components/ProductCard'

function slugifyCategory(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeCategory(product) {
  const slug = product?.category_data?.slug || product?.category_slug || slugifyCategory(product?.category)
  const name = product?.category_data?.name || product?.category

  if (!slug || !name) return null

  return {
    id: product?.category_data?.id || product?.category_id || slug,
    slug,
    name,
  }
}

export default function CatalogClient({ products = [], categories = [] }) {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const safeProducts = Array.isArray(products) ? products : []
  const safeCategories = Array.isArray(categories) ? categories : []

  const availableCategories = useMemo(() => {
    const productCounts = new Map()

    for (const product of safeProducts) {
      const category = normalizeCategory(product)
      if (!category?.slug) continue
      productCounts.set(category.slug, (productCounts.get(category.slug) || 0) + 1)
    }

    const normalizedDbCategories = safeCategories
      .map((category) => {
        const name = category?.name
        if (!name) return null
        const slug = category?.slug || slugifyCategory(name)
        if (!slug) return null
        return {
          id: category?.id || slug,
          slug,
          name,
          count: productCounts.get(slug) || 0,
          sort_order: category?.sort_order ?? Number.MAX_SAFE_INTEGER,
        }
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order
        return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
      })

    if (normalizedDbCategories.length > 0) {
      return normalizedDbCategories
    }

    const fallbackMap = new Map()
    for (const product of safeProducts) {
      const category = normalizeCategory(product)
      if (!category?.slug) continue
      if (!fallbackMap.has(category.slug)) {
        fallbackMap.set(category.slug, {
          ...category,
          count: productCounts.get(category.slug) || 0,
          sort_order: Number.MAX_SAFE_INTEGER,
        })
      }
    }

    return Array.from(fallbackMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name, 'es', { sensitivity: 'base' })
    )
  }, [safeCategories, safeProducts])

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return safeProducts
    return safeProducts.filter((product) => normalizeCategory(product)?.slug === selectedCategory)
  }, [safeProducts, selectedCategory])

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`rounded-full border px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] transition ${selectedCategory === 'all'
              ? 'border-[#143047] bg-[#143047] text-white shadow-[0_10px_20px_rgba(20,48,71,0.14)]'
              : 'border-[#d8cdb8] bg-white text-[#143047] hover:border-[#5e89a6]'
            }`}
        >
          Todas <span className="ml-2 opacity-70">({safeProducts.length})</span>
        </button>

        {availableCategories.map((category) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => setSelectedCategory(category.slug)}
            className={`rounded-full border px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] transition ${selectedCategory === category.slug
                ? 'border-[#ef7d6b] bg-[#ef7d6b] text-white shadow-[0_10px_20px_rgba(239,125,107,0.22)]'
                : 'border-[#d8cdb8] bg-white text-[#143047] hover:border-[#5e89a6]'
              }`}
          >
            {category.name} <span className="ml-2 opacity-70"> - {category.count}</span>
          </button>
        ))}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="rounded-3xl border border-[#d8cdb8] bg-white p-8 text-[#4e6475]">
          <p>No hay productos para mostrar en esta categoría.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  )
}
