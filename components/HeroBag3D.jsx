'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'

const floatTransition = {
  duration: 5.5,
  repeat: Infinity,
  ease: 'easeInOut',
}

export default function HeroBag3D() {
  useEffect(() => {
    import('@google/model-viewer')
  }, [])

  return (
    <div className="relative mx-auto flex h-[420px] w-full max-w-[520px] items-center justify-center">
      <div className="absolute inset-0 rounded-[40px] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.34),_transparent_55%)]" />

      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={floatTransition}
        className="relative z-10 w-full"
      >
        <div className="mx-auto h-[420px] w-full max-w-[520px]">
          <model-viewer
            src="/models/logo.glb"
            alt="Modelo 3D principal"
            auto-rotate
            camera-controls
            disable-zoom
            shadow-intensity="1"
            exposure="1.1"
            interaction-prompt="none"
            style={{ width: '100%', height: '100%', background: 'transparent' }}
          />
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