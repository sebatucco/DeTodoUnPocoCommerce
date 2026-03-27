import Link from 'next/link'
import { siteConfig } from '@/lib/site'

export default function Logo({ href = '/', compact = false }) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <img
        src="/LogoSinFondo.png"
        alt={siteConfig.brandName}
        className={`rounded-2xl object-cover shadow-sm ring-1 ring-white/20 ${compact ? 'h-12 w-12' : 'h-14 w-14'}`}
      />
      <div className="leading-none">
        <span className="block text-2xl font-black uppercase tracking-[0.12em] text-[#f4f1e8] md:text-3xl">
          De Todo
        </span>
        <span className="mt-1 block text-2xl font-black uppercase tracking-[0.12em] text-[#f4f1e8] md:text-3xl">
          Un Poco
        </span>
      </div>
    </Link>
  )
}
