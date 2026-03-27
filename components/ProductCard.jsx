'use client'

import { motion } from 'framer-motion'
import { ShoppingCart, MessageCircle } from 'lucide-react'
import { useCart } from '@/lib/store'
import { formatPrice } from '@/lib/mercadopago'
import Link from 'next/link'
import { siteConfig } from '@/lib/site'

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, setIsOpen } = useCart()

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    setIsOpen(true)
  }

  const handleWhatsApp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const message = `Hola! Me interesa este producto: ${product.name} - ${formatPrice(product.price)}`
    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link href={`/producto/${product.id}`}>
        <div className="group overflow-hidden rounded-[28px] border border-[#d8cdb8] bg-white shadow-[0_14px_35px_rgba(20,48,71,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(20,48,71,0.14)]">
          <div className="relative aspect-square overflow-hidden bg-[#eef4f8]">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#e8eef1]">
                <div className="h-24 w-24 rounded-full bg-[#d9e6ef]" />
              </div>
            )}

            <div className="absolute left-4 top-4 flex flex-wrap gap-2">
              {product.featured && (
                <span className="rounded-full bg-[#143047] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                  Destacado
                </span>
              )}
              {product.stock > 0 && product.stock <= 3 && (
                <span className="rounded-full bg-[#ef7d6b] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                  Últimos
                </span>
              )}
              {product.stock === 0 && (
                <span className="rounded-full bg-[#d9d4cb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#143047]">
                  Agotado
                </span>
              )}
            </div>
          </div>

          <div className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                {product.category && (
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5e89a6]">
                    {product.category}
                  </p>
                )}
                <h3 className="mt-1 text-lg font-extrabold text-[#143047] line-clamp-1">{product.name}</h3>
              </div>

              <div className="text-right">
                <p className="text-lg font-extrabold text-[#143047]">{formatPrice(product.price)}</p>
                {(product.originalPrice || product.compare_at_price) && (product.originalPrice || product.compare_at_price) > product.price && (
                  <p className="text-sm text-[#8c98a1] line-through">{formatPrice(product.originalPrice || product.compare_at_price)}</p>
                )}
              </div>
            </div>

            {product.description && (
              <p className="text-sm leading-6 text-[#4e6475] line-clamp-2">{product.description}</p>
            )}

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#143047] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#214a69] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingCart className="h-4 w-4" />
                Agregar
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center rounded-full border border-[#a7d9cb] bg-[#ecf8f4] px-4 py-3 text-[#0f6d5f] transition hover:bg-[#dbf3ec]"
              >
                <MessageCircle className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
