'use client'

import { useEffect, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import WhatsAppButton from '@/components/WhatsAppButton'
import CatalogClient from '@/components/CatalogClient'
import HeroBag3D from '@/components/HeroBag3D'
import { siteConfig } from '@/lib/site'

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    let mounted = true

    async function loadStoreData() {
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          fetch('/api/products', { cache: 'no-store' }),
          fetch('/api/categories', { cache: 'no-store' }),
        ])

        const productsData = await productsResponse.json()
        const categoriesData = await categoriesResponse.json()

        if (!mounted) return

        const items = Array.isArray(productsData?.products) ? productsData.products : []
        const categoryItems = Array.isArray(categoriesData)
          ? categoriesData
          : Array.isArray(categoriesData?.categories)
            ? categoriesData.categories
            : Array.isArray(productsData?.categories)
              ? productsData.categories
              : []

        const categoryMap = new Map()

        for (const category of categoryItems) {
          if (!category?.name) continue
          const slug = category.slug || String(category.name).toLowerCase()
          categoryMap.set(slug, { ...category, slug })
        }

        for (const product of items) {
          const embedded = product?.category_data
          const slug = embedded?.slug || product?.category_slug
          const name = embedded?.name || product?.category
          if (!slug || !name) continue
          if (!categoryMap.has(slug)) {
            categoryMap.set(slug, { id: embedded?.id || product?.category_id || slug, name, slug })
          }
        }

        setProducts(items)
        setCategories(Array.from(categoryMap.values()))
        setIsFallback(Boolean(productsData?.fallback))
        setError(productsData?.error || categoriesData?.error || '')
      } catch (err) {
        if (!mounted) return
        setError(err?.message || 'No se pudo cargar el catálogo.')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadStoreData()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <main className="min-h-screen bg-[#5585a7] text-[#143047]">
      <Header />
      <CartDrawer />
      <WhatsAppButton />

      <section id="inicio" className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_35%)]" />
        <div className="container relative mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
            <div>
              <div className="inline-flex items-center gap-4 rounded-full border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm">
                <img src="/logo-detodounpoco.jpg" alt={siteConfig.brandName} className="h-14 w-14 rounded-2xl object-cover" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#f4f1e8]">{siteConfig.brandName}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.22em] text-white/80">{siteConfig.tagline}</p>
                </div>
              </div>

              <h1 className="mt-8 max-w-3xl text-5xl font-black uppercase leading-[0.95] text-[#f4f1e8] md:text-7xl">
                Variedad para cada momento con una vidriera online clara y moderna.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#eef6fb] md:text-xl">
                La portada ahora usa el logo real del sitio, una imagen principal animada estilo 3D y un acceso directo al
                catálogo filtrable por categorías conectado con Supabase.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#catalogo"
                  className="inline-flex items-center justify-center rounded-full bg-[#f4f1e8] px-7 py-4 text-sm font-bold uppercase tracking-[0.16em] text-[#143047] transition hover:-translate-y-0.5"
                >
                  Ver catálogo
                </a>
                <a
                  href="#contacto"
                  className="inline-flex items-center justify-center rounded-full border border-white/30 bg-transparent px-7 py-4 text-sm font-bold uppercase tracking-[0.16em] text-[#f4f1e8] transition hover:bg-white/10"
                >
                  Contacto
                </a>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Catálogo dinámico', value: loading ? 'Cargando...' : `${products.length} productos` },
                  { label: 'Categorías', value: loading ? '...' : `${categories.length || 0} disponibles` },
                  { label: 'Atención', value: 'WhatsApp directo' },
                ].map((item) => (
                  <div key={item.label} className="rounded-[28px] border border-white/18 bg-white/10 p-5 backdrop-blur-sm">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">{item.label}</p>
                    <p className="mt-2 text-lg font-extrabold text-[#f4f1e8]">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <HeroBag3D />
          </div>
        </div>
      </section>

      <section id="catalogo" className="rounded-t-[38px] bg-[#f4f1e8] pb-20 pt-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#5e89a6]">catálogo</p>
              <h2 className="mt-2 text-5xl font-black uppercase leading-none text-[#143047] md:text-6xl">Productos</h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#4e6475]">
                Botones por categoría para ver todos los productos o filtrar por Hogar, Regalería, Librería y Accesorios.
              </p>
            </div>
            <div className="rounded-full border border-[#d8cdb8] bg-white px-5 py-3 text-sm font-semibold text-[#4e6475] shadow-sm">
              {loading ? 'Cargando catálogo...' : `${products.length} producto${products.length === 1 ? '' : 's'} disponibles`}
            </div>
          </div>

          {error && (
            <div className="mb-6 rounded-3xl border border-[#f0c9c2] bg-[#fff4f1] px-5 py-4 text-sm text-[#8b4b42]">
              {isFallback ? 'Se está mostrando un catálogo alternativo porque la conexión con Supabase falló.' : error}
            </div>
          )}

          <CatalogClient products={products} categories={categories} />
        </div>
      </section>

      <section id="contacto" className="bg-[#f4f1e8] pb-20">
        <div className="container mx-auto px-4">
          <div className="rounded-[34px] border border-[#d8cdb8] bg-[#143047] p-8 text-white shadow-[0_18px_50px_rgba(20,48,71,0.18)] md:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#9fc1d8]">contacto</p>
            <h2 className="mt-2 text-4xl font-black uppercase leading-none md:text-5xl">Atención directa</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#dbe8f0]">
              La tienda quedó enfocada en mostrar el catálogo y en facilitar consultas directas por WhatsApp o correo.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold uppercase tracking-[0.14em]">
              <a href={`https://wa.me/${siteConfig.whatsappNumber}`} className="rounded-full bg-white px-6 py-4 text-[#143047]">
                WhatsApp
              </a>
              <a href={`mailto:${siteConfig.email}`} className="rounded-full border border-white/30 px-6 py-4 text-white">
                Email
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
