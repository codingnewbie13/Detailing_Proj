import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, X } from 'lucide-react'
import { cx } from '../lib/format'

/* --------------------------------- Field --------------------------------- */
export function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  icon,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  icon?: React.ReactNode
  hint?: string
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block px-1 text-[12px] font-medium text-white/50">{label}</span>
      <div className="flex items-center gap-2.5 rounded-2xl glass px-3.5 focus-within:ring-1 focus-within:ring-blue/40">
        {icon && <span className="text-white/35">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-12 w-full bg-transparent text-[15px] text-white placeholder:text-white/25 focus:outline-none"
        />
      </div>
      {hint && <span className="mt-1 block px-1 text-[11px] text-white/35">{hint}</span>}
    </label>
  )
}

/* -------------------------------- Select --------------------------------- */
export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
  renderOption,
}: {
  label: string
  value: T
  options: { value: T; label: string; icon?: React.ReactNode; color?: string }[]
  onChange: (v: T) => void
  renderOption?: (o: { value: T; label: string }) => React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = options.find((o) => o.value === value)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div className="block" ref={ref}>
      <span className="mb-1.5 block px-1 text-[12px] font-medium text-white/50">{label}</span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-full items-center justify-between gap-2 rounded-2xl glass px-3.5 text-left transition-all active:scale-[0.99]"
      >
        <span className="flex items-center gap-2.5">
          {current?.color && (
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: current.color }} />
          )}
          {current?.icon}
          <span className="text-[15px] text-white">{current?.label ?? 'Select'}</span>
        </span>
        <ChevronDown size={18} className={cx('text-white/40 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
            className="relative z-20"
          >
            <div className="mt-2 overflow-hidden rounded-2xl glass-strong p-1.5 shadow-float">
              {options.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    onChange(o.value)
                    setOpen(false)
                  }}
                  className={cx(
                    'flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-[15px] transition-colors',
                    o.value === value ? 'bg-white/8 text-white' : 'text-white/70 hover:bg-white/5',
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    {o.color && <span className="h-2.5 w-2.5 rounded-full" style={{ background: o.color }} />}
                    {o.icon}
                    {renderOption ? renderOption(o) : o.label}
                  </span>
                  {o.value === value && <Check size={16} className="text-blue-300" />}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------ Segmented -------------------------------- */
export function SegToggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label?: string
  value: T
  options: { value: T; label: string; tone?: 'blue' | 'lime' | 'amber' }[]
  onChange: (v: T) => void
}) {
  return (
    <div>
      {label && <span className="mb-1.5 block px-1 text-[12px] font-medium text-white/50">{label}</span>}
      <div className="flex gap-1.5 rounded-2xl glass p-1.5">
        {options.map((o) => {
          const active = o.value === value
          const toneBg =
            o.tone === 'lime' ? 'bg-lime text-ink-950' : o.tone === 'amber' ? 'bg-amber text-ink-950' : 'bg-blue text-white'
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              className={cx(
                'relative h-11 flex-1 rounded-xl text-sm font-semibold transition-all active:scale-[0.98]',
                active ? toneBg : 'text-white/55',
              )}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* -------------------------------- Toggle --------------------------------- */
export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={cx(
        'relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200',
        on ? 'bg-lime' : 'bg-white/12',
      )}
    >
      <span
        className={cx(
          'absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ease-out',
          on ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  )
}

/* -------------------------------- Sheet ---------------------------------- */
export function Sheet({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md rounded-t-4xl glass-strong p-5 pb-8 shadow-float"
          >
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-white/15" />
            <div className="mb-3 flex items-center justify-between">
              {title && <h3 className="font-display text-lg font-bold">{title}</h3>}
              <button onClick={onClose} className="ml-auto grid h-8 w-8 place-items-center rounded-xl bg-white/6 text-white/60">
                <X size={16} />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
