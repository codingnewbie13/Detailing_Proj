import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { cx } from '../lib/format'

export default function PageHeader({
  title,
  subtitle,
  right,
  className,
}: {
  title: string
  subtitle?: string
  right?: React.ReactNode
  className?: string
}) {
  const nav = useNavigate()
  return (
    <header className={cx('flex items-center gap-3 pt-1', className)}>
      <button
        onClick={() => nav(-1)}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl glass text-white/80 transition-all active:scale-95"
        aria-label="Back"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-lg font-bold leading-tight tracking-tight">{title}</h1>
        {subtitle && <p className="truncate text-xs text-white/45">{subtitle}</p>}
      </div>
      {right}
    </header>
  )
}
