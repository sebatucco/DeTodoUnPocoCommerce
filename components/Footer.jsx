'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, Facebook, Mail, MapPin, Phone } from 'lucide-react'
import Logo from '@/components/Logo'
import { siteConfig } from '@/lib/site'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = [
    {
      title: 'Tienda',
      links: [
        { label: 'Inicio', href: '/#inicio' },
        { label: 'Catálogo', href: '/#productos' },
        { label: 'Cómo comprar', href: '/#como-comprar' },
        { label: 'Contacto', href: '/#contacto' },
      ],
    },
    {
      title: 'Soporte',
      links: [
        { label: 'Preguntas frecuentes', href: '/#faq' },
        { label: 'Checkout', href: '/checkout' },
        { label: 'Panel admin', href: '/admin' },
      ],
    },
  ]

  return (
    <footer className="border-t border-[#d8cdb8] bg-[#f8f3ea]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Logo />
            <p className="mt-5 text-sm leading-7 text-[#4e6475]">
              Una tienda versátil, cálida y cercana para vender productos de distintas categorías con una experiencia de compra simple.
            </p>
            <div className="mt-6 flex gap-3">
              {[Instagram, Facebook].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c7d8e4] bg-white text-[#143047] shadow-sm transition-colors hover:bg-[#eef4f8]"
                >
                  <Icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-display text-3xl uppercase tracking-[0.06em] text-[#143047]">
                {section.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[#4e6475] transition-colors hover:text-[#ef7d6b]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-display text-3xl uppercase tracking-[0.06em] text-[#143047]">
              Contacto
            </h3>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3 text-sm text-[#4e6475]">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#5e89a6]" />
                <span>{siteConfig.location}</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#4e6475]">
                <Phone className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#5e89a6]" />
                <a
                  href={`https://wa.me/${siteConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-[#ef7d6b]"
                >
                  {siteConfig.whatsappNumber}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-[#4e6475]">
                <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#5e89a6]" />
                <a href={`mailto:${siteConfig.email}`} className="transition-colors hover:text-[#ef7d6b]">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-[#d8cdb8] pt-6 md:flex-row md:items-center">
          <p className="text-sm text-[#4e6475]">
            © {currentYear} {siteConfig.brandName}. Todos los derechos reservados.
          </p>
          <p className="text-sm text-[#4e6475]">
            Tienda online con Next.js, Supabase y Mercado Pago.
          </p>
        </div>
      </div>
    </footer>
  )
}
