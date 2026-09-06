import { useRef, useState } from 'react'
import { MoveHorizontal } from 'lucide-react'
import { cx } from '../lib/format'

/**
 * BeforeAfter — premium drag-to-compare slider for real photos.
 * Reused across Gallery, Job Details, and the customer tracking page.
 */
export default function BeforeAfter({
  before,
  after,
  height = 'h-64',
  rounded = 'rounded-3xl',
}: {
  before: string
  after: string
  height?: string
  rounded?: string
}) {
  const [pos, setPos] = useState(50)
  const ref = useRef<HTMLDivElement>(null)

  function move(clientX: number) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const p = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(2, Math.min(98, p)))
  }

  const w = ref.current?.offsetWidth ?? 400

  return (
    <div
      ref={ref}
      className={cx('relative w-full cursor-ew-resize select-none touch-none overflow-hidden', height, rounded)}
      onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); move(e.clientX) }}
      onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && move(e.clientX)}
    >
      {/* After (full) */}
      <img src={after} alt="after" className="absolute inset-0 h-full w-full object-cover" />
      <span className="absolute right-3 top-3 z-10 rounded-lg bg-black/55 px-2 py-1 text-[10px] font-bold tracking-wide text-lime backdrop-blur">
        AFTER
      </span>

      {/* Before (clipped to left of slider) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <div className="relative h-full" style={{ width: w }}>
          <img src={before} alt="before" className="absolute inset-0 h-full w-full object-cover" style={{ width: w }} />
          <span className="absolute left-3 top-3 rounded-lg bg-black/55 px-2 py-1 text-[10px] font-bold tracking-wide text-white/80 backdrop-blur">
            BEFORE
          </span>
        </div>
      </div>

      {/* Slider handle */}
      <div className="absolute inset-y-0 z-20" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
        <div className="h-full w-[2px] bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
        <div className="absolute top-1/2 left-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ink-950 shadow-float">
          <MoveHorizontal size={17} />
        </div>
      </div>
    </div>
  )
}
