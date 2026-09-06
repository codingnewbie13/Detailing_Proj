import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { studio } from '../data/mock'

export default function Splash() {
  const nav = useNavigate()

  useEffect(() => {
    const t = setTimeout(() => nav('/', { replace: true }), 2600)
    return () => clearTimeout(t)
  }, [nav])

  return (
    <div
      className="relative grid min-h-screen place-items-center overflow-hidden bg-ink-950"
      onClick={() => nav('/', { replace: true })}
    >
      {/* Cinematic backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-mesh-lux" />
      <motion.div
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 0.9, scale: 1 }}
        transition={{ duration: 2 }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(46,107,255,0.16), transparent 60%)' }}
      />

      <div className="relative flex flex-col items-center">
        {/* Logo mark with sheen sweep */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-champagne-soft to-champagne-deep shadow-[0_18px_50px_-12px_rgba(216,192,138,0.7)]"
        >
          <Sparkles size={38} className="text-ink-950" />
          <motion.span
            initial={{ x: '-120%' }}
            animate={{ x: '120%' }}
            transition={{ delay: 0.9, duration: 0.9, ease: 'easeInOut' }}
            className="absolute inset-y-0 w-1/2 -skew-x-12 bg-white/40 blur-md"
          />
        </motion.div>

        {/* Wordmark */}
        <motion.h1
          initial={{ opacity: 0, y: 12, letterSpacing: '0.3em' }}
          animate={{ opacity: 1, y: 0, letterSpacing: '-0.02em' }}
          transition={{ delay: 0.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-display text-5xl font-extrabold text-white"
        >
          Lustre
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mt-2 text-[13px] uppercase tracking-[0.32em] text-white/40"
        >
          Detailing Studio OS
        </motion.p>

        {/* Studio line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-10 flex items-center gap-2 rounded-full glass px-4 py-2"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-lime animate-pulseSoft" />
          <span className="text-xs text-white/60">{studio.name}</span>
        </motion.div>
      </div>

      {/* Loading bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2.4, ease: 'easeInOut' }}
        className="absolute bottom-16 h-[3px] w-40 origin-left rounded-full bg-gradient-to-r from-champagne to-blue"
      />
      <p className="absolute bottom-8 text-[11px] text-white/25">Tap to enter</p>
    </div>
  )
}
