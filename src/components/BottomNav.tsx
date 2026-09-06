import { NavLink } from 'react-router-dom'
import { LayoutGrid, CalendarPlus, HardHat, Boxes, User } from 'lucide-react'
import { cx } from '../lib/format'

const items = [
  { to: '/', label: 'Home', icon: LayoutGrid, end: true },
  { to: '/bookings', label: 'Bookings', icon: CalendarPlus },
  { to: '/workers', label: 'Workers', icon: HardHat },
  { to: '/inventory', label: 'Inventory', icon: Boxes },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function BottomNav() {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),12px)]">
      <div className="pointer-events-auto flex w-full max-w-md items-center justify-between gap-1 rounded-3xl glass-strong px-2 py-2 shadow-float">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="relative flex-1"
          >
            {({ isActive }) => (
              <div
                className={cx(
                  'flex flex-col items-center gap-1 rounded-2xl py-2 transition-colors',
                  isActive ? 'text-white' : 'text-white/40',
                )}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-2xl bg-blue/15 ring-1 ring-blue/30" />
                )}
                <Icon size={20} className="relative" strokeWidth={2.2} />
                <span className="relative text-[10px] font-semibold tracking-wide">{label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
