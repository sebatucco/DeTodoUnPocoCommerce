'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageCircle, Minus, Plus, ShoppingCart, ShieldCheck, Truck } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/lib/store'
import { formatPrice } from '@/lib/mercadopago'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import WhatsAppButton from '@/components/WhatsAppButton'
import ProductCard from '@/components/ProductCard'
import { siteConfig } from '@/lib/site'

export default function ProductPage() {
  const params = useParams()
  const { addToCart, setIsOpen } = useCart()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
          if (data.variants?.length) setSelectedVariant(data.variants[0])

          const relatedResponse = await fetch(`/api/products?category=${data.category}`)
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json()
            setRelatedProducts((relatedData.products || []).filter((item) => item.id !== data.id).slice(0, 3))
          }
          return
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      }

      setProduct(null)
      setRelatedProducts([])
      setLoading(false)
    }

    fetchProduct().finally(() => setLoading(false))
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return
    addToCart(product, selectedVariant, quantity)
    setIsOpen(true)
  }

  const handleWhatsApp = () => {
    if (!product) return
    const message = `Hola! Me interesa ${product.name}${selectedVariant ? ` (${selectedVariant})` : ''} - ${formatPrice(product.price)}`
    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5efe3]">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="animate-pulse rounded-[34px] border border-[#d8cdb8] bg-white p-8">
            <div className="grid gap-10 lg:grid-cols-2">
              <div className="aspect-square rounded-[28px] bg-[#eef4f8]" />
              <div className="space-y-4">
                <div className="h-5 w-24 rounded bg-[#eef4f8]" />
                <div className="h-12 w-3/4 rounded bg-[#eef4f8]" />
                <div className="h-6 w-32 rounded bg-[#eef4f8]" />
                <div className="h-32 rounded bg-[#eef4f8]" />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-[#f5efe3]">
        <Header />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-2xl font-bold text-[#143047]">Producto no encontrado</h1>
          <Link href="/" className="mt-4 inline-block text-[#5e89a6] hover:text-[#ef7d6b]">
            Volver al inicio
          </Link>
        </div>
      </main>
    )
  }

  const images = product.images?.length ? product.images : [product.image]

  return (
    <main className="min-h-screen bg-[#f5efe3] text-[#143047]">
      <Header />
      <CartDrawer />
      <WhatsAppButton />

      <div className="container mx-auto px-4 pt-32 pb-16">
        <Link href="/#productos" className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#5e89a6] hover:text-[#ef7d6b]">
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.95fr]">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="overflow-hidden rounded-[34px] border border-[#d8cdb8] bg-white p-4 shadow-[0_18px_50px_rgba(20,48,71,0.08)]">
              <div className="aspect-square overflow-hidden rounded-[28px] bg-[#eef4f8]">
                <img src={images[currentImage]} alt={product.name} className="h-full w-full object-cover" />
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setCurrentImage(index)}
                    className={`h-20 w-20 overflow-hidden rounded-2xl border-2 ${
                      currentImage === index ? 'border-[#143047]' : 'border-[#d8cdb8]'
                    }`}
                  >
                    <img src={image} alt="Miniatura" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} className="rounded-[34px] border border-[#d8cdb8] bg-white p-8 shadow-[0_18px_50px_rgba(20,48,71,0.08)]">
            {product.category && (
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#5e89a6]">{product.category}</p>
            )}
            <h1 className="mt-2 text-4xl font-extrabold text-[#143047] md:text-5xl">{product.name}</h1>
            <div className="mt-4 flex items-end gap-3">
              <p className="text-3xl font-extrabold text-[#143047]">{formatPrice(product.price)}</p>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="pb-1 text-lg text-[#8c98a1] line-through">{formatPrice(product.originalPrice)}</p>
              )}
            </div>
            <p className="mt-5 text-base leading-8 text-[#4e6475]">{product.description}</p>

            {product.variants?.length > 0 && (
              <div className="mt-8">
                <p className="text-sm font-semibold text-[#143047]">Variante</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold ${
                        selectedVariant === variant
                          ? 'bg-[#143047] text-white'
                          : 'border border-[#d8cdb8] bg-[#f8f3ea] text-[#143047]'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="rounded-full border border-[#d8cdb8] p-3 text-[#143047] hover:bg-[#f8f3ea]"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-lg font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity((value) => value + 1)}
                className="rounded-full border border-[#d8cdb8] p-3 text-[#143047] hover:bg-[#f8f3ea]"
              >
                <Plus className="h-4 w-4" />
              </button>
              <span className="ml-3 rounded-full bg-[#eef4f8] px-4 py-2 text-sm font-semibold text-[#143047]">
                Stock: {product.stock ?? 0}
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#143047] px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#214a69] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingCart className="h-4 w-4" />
                Agregar al carrito
              </button>
              <button
                onClick={handleWhatsApp}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-[#a7d9cb] bg-[#ecf8f4] px-6 py-4 text-sm font-bold uppercase tracking-[0.16em] text-[#0f6d5f] transition hover:bg-[#dbf3ec]"
              >
                <MessageCircle className="h-4 w-4" />
                Consultar
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#f8f3ea] p-4">
                <Truck className="h-5 w-5 text-[#5e89a6]" />
                <p className="mt-3 font-semibold text-[#143047]">Envíos y retiro</p>
                <p className="mt-1 text-sm leading-6 text-[#4e6475]">Podés coordinar envío o retiro según la compra.</p>
              </div>
              <div className="rounded-3xl bg-[#f8f3ea] p-4">
                <ShieldCheck className="h-5 w-5 text-[#5e89a6]" />
                <p className="mt-3 font-semibold text-[#143047]">Compra segura</p>
                <p className="mt-1 text-sm leading-6 text-[#4e6475]">Pago online o transferencia con confirmación del pedido.</p>
              </div>
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#5e89a6]">relacionados</p>
            <h2 className="mt-2 font-display text-6xl uppercase leading-none text-[#143047]">También te puede gustar</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedProducts.map((item, index) => (
                <ProductCard key={item.id} product={item} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  )
}
