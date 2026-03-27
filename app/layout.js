import './globals.css'
import { CartProvider } from '@/lib/store'
import { siteConfig } from '@/lib/site'

export const metadata = {
  title: `${siteConfig.brandName} | ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: 'ecommerce, tienda online, mercado pago, supabase, whatsapp, argentina',
  openGraph: {
    title: `${siteConfig.brandName} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: 'website',
    locale: 'es_AR',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);',
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#f5efe3] text-[#143047] antialiased">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
