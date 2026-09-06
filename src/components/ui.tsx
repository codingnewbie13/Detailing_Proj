import { motion, useInView, useMotionValue, animate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cx } from '../lib/format'

/* ---------------------------------- Card ---------------------------------- */
export function Card({
  className,
  children,
  hairline,
  onClick,
}: {
  className?: string
  children: React.ReactNode
  hairline?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={cx(
        'relative overflow-hidden rounded-3xl glass shadow-card',
        hairline && 'hair-gold',
        onClick && 'cursor-pointer active:scale-[0.99] transition-transform',
        className,
      )}
    >
      {children}
    </div>
  )
}

/* ------------------------------- CountUp num ------------------------------ */
export function CountUp({
  value,
  prefix = '',
  suffix = '',
  format,
  className,
}: {
  value: number
  prefix?: string
  suffix?: string
  format?: (n: number) => string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const mv = useMotionValue(0)
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    if (!inView) return
    const controls = animate(mv, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        setDisplay(format ? format(v) : Math.round(v).toLocaleString('en-IN'))
      },
    })
    return controls.stop
  }, [inView, value])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  )
}

/* ------------------------------ Status badge ----------------------------- */
type Tone = 'blue' | 'lime' | 'amber' | 'rose' | 'neutral' | 'gold'
const toneMap: Record<Tone, string> = {
  blue: 'text-blue-300 bg-blue-500/12 border-blue-500/25',
  lime: 'text-lime-soft bg-lime/12 border-lime/25',
  amber: 'text-amber bg-amber/12 border-amber/25',
  rose: 'text-rose bg-rose/12 border-rose/25',
  gold: 'text-champagne bg-champagne/10 border-champagne/25',
  neutral: 'text-white/70 bg-white/6 border-white/12',
}

export function Badge({
  tone = 'neutral',
  children,
  dot,
  className,
}: {
  tone?: Tone
  children: React.ReactNode
  dot?: boolean
  className?: string
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide',
        toneMap[tone],
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulseSoft" />}
      {children}
    </span>
  )
}

/* --------------------------------- Button -------------------------------- */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  icon,
  full,
  type = 'button',
}: {
  children?: React.ReactNode
  variant?: 'primary' | 'ghost' | 'glass' | 'success' | 'danger' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
  icon?: React.ReactNode
  full?: boolean
  type?: 'button' | 'submit'
}) {
  const variants: Record<string, string> = {
    primary: 'bg-blue text-white shadow-glow-blue hover:bg-blue-400',
    success: 'bg-lime text-ink-950 shadow-glow-lime hover:bg-lime-soft',
    danger: 'bg-rose text-white hover:brightness-110',
    gold: 'bg-gradient-to-br from-champagne-soft to-champagne-deep text-ink-950 hover:brightness-105',
    glass: 'glass-strong text-white hover:bg-white/10',
    ghost: 'text-white/80 hover:bg-white/6',
  }
  const sizes: Record<string, string> = {
    sm: 'h-9 px-3.5 text-[13px] rounded-xl',
    md: 'h-11 px-4 text-sm rounded-2xl',
    lg: 'h-14 px-5 text-base rounded-2xl',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      className={cx(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all active:scale-[0.97] select-none',
        variants[variant],
        sizes[size],
        full && 'w-full',
        className,
      )}
    >
      {icon}
      {children}
    </button>
  )
}

/* ------------------------------ Icon button ------------------------------ */
export function IconButton({
  children,
  onClick,
  className,
  label,
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  label?: string
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={cx(
        'grid place-items-center h-11 w-11 rounded-2xl glass text-white/80 transition-all active:scale-95 hover:text-white hover:bg-white/8',
        className,
      )}
    >
      {children}
    </button>
  )
}

/* ----------------------------- Section header ---------------------------- */
export function SectionHeader({
  title,
  action,
  className,
}: {
  title: string
  action?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cx('flex items-center justify-between px-1', className)}>
      <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">
        {title}
      </h3>
      {action}
    </div>
  )
}

/* ------------------------------- Stat tile ------------------------------- */
export function StatTile({
  label,
  value,
  tone = 'neutral',
  icon,
  delay = 0,
}: {
  label: string
  value: React.ReactNode
  tone?: Tone
  icon?: React.ReactNode
  delay?: number
}) {
  const accent: Record<Tone, string> = {
    blue: 'text-blue-300',
    lime: 'text-lime-soft',
    amber: 'text-amber',
    rose: 'text-rose',
    gold: 'text-champagne',
    neutral: 'text-white',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl glass p-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-white/50">{label}</span>
        {icon && <span className={cx('opacity-80', accent[tone])}>{icon}</span>}
      </div>
      <div className={cx('mt-2 font-num text-2xl font-bold', accent[tone])}>{value}</div>
    </motion.div>
  )
}

/* ------------------------------ Progress bar ----------------------------- */
export function Progress({
  value,
  tone = 'blue',
  className,
}: {
  value: number
  tone?: 'blue' | 'lime' | 'amber' | 'rose'
  className?: string
}) {
  const bar: Record<string, string> = {
    blue: 'bg-blue',
    lime: 'bg-lime',
    amber: 'bg-amber',
    rose: 'bg-rose',
  }
  return (
    <div className={cx('h-2 w-full overflow-hidden rounded-full bg-white/8', className)}>
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className={cx('h-full rounded-full', bar[tone])}
      />
    </div>
  )
}

/* -------------------------------- Avatar --------------------------------- */
export function Avatar({ name, color, size = 40 }: { name: string; color: string; size?: number }) {
  const init = name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
  return (
    <div
      className="grid place-items-center rounded-2xl font-num font-bold text-ink-950"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}, ${color}bb)`,
        fontSize: size * 0.34,
      }}
    >
      {init}
    </div>
  )
}
