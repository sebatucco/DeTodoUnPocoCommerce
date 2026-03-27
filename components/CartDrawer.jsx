'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/store'
import { formatPrice } from '@/lib/mercadopago'
import Link from 'next/link'

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, total, isOpen, setIsOpen } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-[#143047]/35 backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 24, stiffness: 180 }}
            className="fixed right-0 top-0 bottom-0 z-50 flex w-full max-w-md flex-col border-l border-[#d8cdb8] bg-[#f8f3ea]"
          >
            <div className="flex items-center justify-between border-b border-[#d8cdb8] p-6">
              <h2 className="flex items-center gap-2 text-xl font-extrabold text-[#143047]">
                <ShoppingBag className="h-5 w-5" />
                Tu carrito
              </h2>
              <button onClick={() => setIsOpen(false)} className="rounded-full p-2 text-[#4e6475] transition hover:bg-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
                <ShoppingBag className="mb-4 h-16 w-16 text-[#9bb6c8]" />
                <p className="text-[#4e6475]">Todavía no agregaste productos.</p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="mt-5 rounded-full bg-[#143047] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#214a69]"
                >
                  Seguir viendo productos
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto p-6">
                  {cart.map((item, index) => (
                    <motion.div
                      key={`${item.id}-${item.variant}`}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="flex gap-4 rounded-3xl border border-[#d8cdb8] bg-white p-4 shadow-sm"
                    >
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-[#eef4f8]">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ShoppingBag className="h-8 w-8 text-[#9bb6c8]" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold text-[#143047]">{item.name}</h3>
                        {item.variant && <p className="mt-1 text-sm text-[#4e6475]">{item.variant}</p>}
                        <p className="mt-1 font-extrabold text-[#143047]">{formatPrice(item.price)}</p>

                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.variant, item.quantity - 1)}
                            className="rounded-full border border-[#d8cdb8] p-1.5 text-[#143047] transition hover:bg-[#eef4f8]"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center font-semibold text-[#143047]">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.variant, item.quantity + 1)}
                            className="rounded-full border border-[#d8cdb8] p-1.5 text-[#143047] transition hover:bg-[#eef4f8]"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => removeFromCart(item.id, item.variant)}
                            className="ml-auto rounded-full p-1.5 text-[#c85b53] transition hover:bg-[#fff1ef]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-[#d8cdb8] p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[#4e6475]">Total</span>
                    <span className="text-xl font-extrabold text-[#143047]">{formatPrice(total)}</span>
                  </div>

                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="block w-full rounded-full bg-[#143047] py-4 text-center font-semibold text-white transition hover:bg-[#214a69]"
                  >
                    Ir al checkout
                  </Link>

                  <button onClick={() => setIsOpen(false)} className="block w-full text-center text-sm font-medium text-[#4e6475] transition hover:text-[#ef7d6b]">
                    Seguir comprando
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
