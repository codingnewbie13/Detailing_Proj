import { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import BottomNav from './BottomNav'

/**
 * AppShell — mobile-first responsive frame.
 * Centered column (max-w-md) on phones, given breathing room on larger screens
 * with an ambient luxury mesh backdrop. Content scrolls; nav stays docked.
 * First visit routes through the cinematic splash once per session.
 */
export default function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!sessionStorage.getItem('lustre_splash')) {
      sessionStorage.setItem('lustre_splash', '1')
      navigate('/splash', { replace: true })
    }
  }, [])

  return (
    <div className="relative min-h-full bg-ink-950 text-white">
      {/* Ambient cinematic backdrop */}
      <div className="pointer-events-none fixed inset-0 bg-mesh-lux" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative mx-auto min-h-screen w-full max-w-md px-4 pb-28 pt-4 sm:max-w-lg">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.div>
      </div>

      <BottomNav />
    </div>
  )
}
