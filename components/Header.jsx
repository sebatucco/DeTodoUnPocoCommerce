'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '@/lib/store'
import Logo from '@/components/Logo'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { itemCount, setIsOpen } = useCart()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { href: '/#inicio', label: 'Inicio' },
    { href: '/#catalogo', label: 'Catálogo' },
    { href: '/#contacto', label: 'Contacto' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/10 bg-[#143047]/88 shadow-[0_10px_30px_rgba(20,48,71,0.22)] backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-24 items-center justify-between">
          <Logo compact />

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold uppercase tracking-[0.18em] text-[#f4f1e8] transition-colors hover:text-[#efbe3a]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={() => setIsOpen(true)}
              className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[#f4f1e8] shadow-sm transition-colors hover:bg-white/15"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ef7d6b] px-1 text-[11px] font-bold text-white"
                >
                  {itemCount}
                </motion.span>
              )}
            </motion.button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-[#f4f1e8] lg:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-[#143047]/96 backdrop-blur-md lg:hidden"
          >
            <nav className="container mx-auto flex flex-col gap-4 px-4 py-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="py-1 text-sm font-semibold uppercase tracking-[0.18em] text-[#f4f1e8] transition-colors hover:text-[#efbe3a]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
