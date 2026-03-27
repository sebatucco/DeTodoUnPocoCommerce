'use client'

import { motion } from 'framer-motion'

const floatTransition = {
  duration: 5.5,
  repeat: Infinity,
  ease: 'easeInOut',
}

export default function HeroBag3D() {
  return (
    <div className="relative mx-auto flex h-[420px] w-full max-w-[520px] items-center justify-center">
      <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.34),_transparent_55%)]" />

      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [-3, 3, -3] }}
        transition={floatTransition}
        className="relative"
        style={{ perspective: '1200px' }}
      >
        <div className="relative h-[320px] w-[250px]" style={{ transform: 'rotateX(12deg) rotateY(-10deg)' }}>
          <motion.div
            className="absolute left-1/2 top-[2px] h-20 w-32 -translate-x-1/2 rounded-t-full border-[6px] border-[#f4f1e8]"
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="absolute inset-x-0 top-11 h-[250px] rounded-[34px] border-[5px] border-[#f4f1e8] bg-[#5585a7] shadow-[0_35px_60px_rgba(20,48,71,0.28)]">
            <div className="grid h-full grid-cols-2 grid-rows-2 overflow-hidden rounded-[28px] p-3">
              <div className="relative flex items-center justify-center rounded-tl-[22px] bg-[#32b9b3]">
                <div className="relative h-16 w-12 rounded-b-[18px] rounded-t-[24px] border-[3px] border-[#f4f1e8]">
                  <div className="absolute left-1/2 top-3 h-8 w-[3px] -translate-x-1/2 rounded-full bg-[#f4f1e8]" />
                  <div className="absolute left-1/2 top-5 h-[3px] w-6 -translate-x-1/2 rotate-45 rounded-full bg-[#f4f1e8]" />
                  <div className="absolute left-1/2 top-5 h-[3px] w-6 -translate-x-1/2 -rotate-45 rounded-full bg-[#f4f1e8]" />
                </div>
              </div>
              <div className="relative flex items-center justify-center rounded-tr-[22px] bg-[#ef7c72]">
                <div className="relative h-14 w-14 rotate-12">
                  <div className="absolute inset-0 rounded-full bg-[#f4f1e8]" style={{ clipPath: 'polygon(50% 0%, 61% 34%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 34%)' }} />
                </div>
              </div>
              <div className="relative flex items-center justify-center rounded-bl-[22px] bg-[#df5f7d]">
                <div className="relative h-12 w-16">
                  <div className="absolute bottom-0 left-1/2 h-10 w-10 -translate-x-1/2 rounded-b-full bg-[#f4f1e8]" />
                  <div className="absolute left-[14px] top-[6px] h-6 w-6 rounded-full bg-[#f4f1e8]" />
                  <div className="absolute right-[14px] top-[6px] h-6 w-6 rounded-full bg-[#f4f1e8]" />
                </div>
              </div>
              <div className="relative flex items-center justify-center rounded-br-[22px] bg-[#efbe3a]">
                <div className="h-14 w-14 rounded-full border-[3px] border-[#f4f1e8]" />
              </div>
            </div>
          </div>

          <div className="absolute inset-y-14 -right-5 w-10 skew-y-[-12deg] rounded-r-[22px] bg-[#3e6b8c] opacity-90" />
          <div className="absolute inset-x-8 bottom-[-26px] h-8 rounded-full bg-[#143047]/20 blur-xl" />
        </div>
      </motion.div>

      <motion.div
        className="absolute left-6 top-14 h-16 w-16 rounded-full bg-[#32b9b3]/20 blur-md"
        animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-16 right-8 h-20 w-20 rounded-full bg-[#ef7c72]/20 blur-md"
        animate={{ y: [0, 10, 0], x: [0, -10, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
