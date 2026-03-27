'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X } from 'lucide-react'
import { siteConfig } from '@/lib/site'

const messageOptions = [
  {
    label: 'Consulta general',
    message: 'Hola! Quiero hacer una consulta sobre productos de De Todo Un Poco.',
  },
  {
    label: 'Stock y precios',
    message: 'Hola! Quiero consultar stock y precio de un producto.',
  },
  {
    label: 'Seguimiento de pedido',
    message: 'Hola! Quiero consultar el estado de mi pedido.',
  },
  {
    label: 'Transferencia bancaria',
    message: 'Hola! Quiero coordinar el pago por transferencia.',
  },
]

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = (message) => {
    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank')
    setIsOpen(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.92 }}
            className="absolute bottom-16 right-0 w-72 rounded-3xl border border-[#d8cdb8] bg-[#f8f3ea] p-4 shadow-[0_20px_45px_rgba(20,48,71,0.18)]"
          >
            <h3 className="mb-3 text-sm font-extrabold uppercase tracking-[0.16em] text-[#143047]">
              ¿Cómo te ayudamos?
            </h3>
            <div className="space-y-2">
              {messageOptions.map((option, index) => (
                <motion.button
                  key={option.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.06 }}
                  onClick={() => handleClick(option.message)}
                  className="w-full rounded-2xl border border-[#d8cdb8] bg-white px-4 py-3 text-left text-sm text-[#143047] transition hover:bg-[#eef4f8]"
                >
                  {option.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#22c55e] text-white shadow-[0_15px_30px_rgba(34,197,94,0.35)] transition hover:bg-[#16a34a]"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </motion.div>

        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-[#22c55e]"
            initial={{ scale: 1, opacity: 0.45 }}
            animate={{ scale: 1.45, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  )
}
