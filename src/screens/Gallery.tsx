import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Images, Star, MoveHorizontal, Sparkles, Quote, Camera } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Card, Badge, Avatar } from '../components/ui'
import { serviceMeta } from '../lib/service'
import type { ServiceType } from '../data/mock'
import { useJobs } from '../lib/store'

type Item = {
  id: string
  car: string
  service: ServiceType
  customer: string
  rating: number
  review: string
  // visual tint for the "after" glossy state
  hue: string
  // real captured images (optional) — when present, the slider uses them
  beforeSrc?: string
  afterSrc?: string
  beforeAll?: string[]
  afterAll?: string[]
}

const gallery: Item[] = [
  { id: 'g1', car: 'BMW X5', service: 'PPF', customer: 'Aditya Kapoor', rating: 5, review: 'Flawless paint protection. Looks better than showroom.', hue: '#2E6BFF' },
  { id: 'g2', car: 'Nissan GT-R', service: 'Ceramic', customer: 'Karan Malhotra', rating: 5, review: 'The gloss is unreal. Water just slides off now.', hue: '#A3E635' },
  { id: 'g3', car: 'Audi RS5', service: 'Wrap', customer: 'Neha Sharma', rating: 5, review: 'Satin wrap turned heads everywhere. Incredible work.', hue: '#d8c08a' },
]

/* A CSS-crafted car surface — dull on "before", deep glossy reflective on "after" */
function Surface({ after, hue }: { after: boolean; hue: string }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: after
          ? `linear-gradient(125deg, #05060a 0%, ${hue}22 35%, #0b0d12 55%, ${hue}44 75%, #04050a 100%)`
          : 'linear-gradient(125deg, #2a2b2e 0%, #3a3b3e 40%, #303133 60%, #26272a 100%)',
        filter: after ? 'saturate(1.1) contrast(1.05)' : 'saturate(0.5) brightness(0.8)',
      }}
    >
      {/* reflective streaks only on after */}
      {after && (
        <>
          <div className="absolute inset-0 opacity-70" style={{ background: 'linear-gradient(100deg, transparent 30%, rgba(255,255,255,0.18) 46%, transparent 60%)' }} />
          <div className="absolute inset-0 opacity-40" style={{ background: 'linear-gradient(80deg, transparent 60%, rgba(255,255,255,0.12) 72%, transparent 82%)' }} />
        </>
      )}
      {/* swirl marks / dullness on before */}
      {!after && (
        <div className="absolute inset-0 opacity-30 [background-image:repeating-radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.05)_0,rgba(255,255,255,0.05)_1px,transparent_2px,transparent_5px)]" />
      )}
      {/* car silhouette hint */}
      <div className="absolute inset-x-6 bottom-5 h-12 rounded-[50%] bg-black/40 blur-md" />
    </div>
  )
}

function ThumbRail({
  label,
  imgs,
  selected,
  onSelect,
  ringClass,
  tone = 'text-white/45',
}: {
  label: string
  imgs: string[]
  selected: number
  onSelect: (i: number) => void
  ringClass: string
  tone?: string
}) {
  return (
    <div>
      <p className={`mb-1 text-[10px] font-semibold uppercase tracking-wide ${tone}`}>{label} · {imgs.length} photos</p>
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {imgs.map((src, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`h-11 w-11 shrink-0 overflow-hidden rounded-lg transition-all active:scale-95 ${
              selected === i ? `ring-2 ${ringClass}` : 'ring-1 ring-white/10 opacity-70'
            }`}
          >
            <img src={src} alt={`${label} ${i + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

function CompareCard({ item, index }: { item: Item; index: number }) {
  const [pos, setPos] = useState(50)
  const [beforeIdx, setBeforeIdx] = useState(0)
  const [afterIdx, setAfterIdx] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const meta = serviceMeta[item.service]

  const beforeAll = item.beforeAll ?? (item.beforeSrc ? [item.beforeSrc] : [])
  const afterAll = item.afterAll ?? (item.afterSrc ? [item.afterSrc] : [])
  const beforeSrc = beforeAll[beforeIdx] ?? item.beforeSrc
  const afterSrc = afterAll[afterIdx] ?? item.afterSrc
  const hasReal = beforeAll.length > 0 && afterAll.length > 0

  function move(clientX: number) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const p = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.max(2, Math.min(98, p)))
  }

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
      <Card hairline className="overflow-hidden">
        {/* Comparison viewport */}
        <div
          ref={ref}
          className="relative h-56 w-full cursor-ew-resize select-none touch-none"
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); move(e.clientX) }}
          onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && move(e.clientX)}
        >
          {/* After (full) */}
          {afterSrc ? (
            <img src={afterSrc} alt="after" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <Surface after hue={item.hue} />
          )}
          <span className="absolute right-3 top-3 z-10 rounded-lg bg-black/50 px-2 py-1 text-[10px] font-bold tracking-wide text-lime backdrop-blur">AFTER</span>

          {/* Before (clipped to left of slider) */}
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
            <div className="relative h-full" style={{ width: ref.current?.offsetWidth ?? 400 }}>
              {beforeSrc ? (
                <img src={beforeSrc} alt="before" className="absolute inset-0 h-full w-full object-cover" style={{ width: ref.current?.offsetWidth ?? 400 }} />
              ) : (
                <Surface after={false} hue={item.hue} />
              )}
              <span className="absolute left-3 top-3 rounded-lg bg-black/50 px-2 py-1 text-[10px] font-bold tracking-wide text-white/70 backdrop-blur">BEFORE</span>
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

        {/* Thumbnail rails — pick which before/after to compare */}
        {hasReal && (beforeAll.length > 1 || afterAll.length > 1) && (
          <div className="space-y-2 px-3 pt-3">
            {beforeAll.length > 1 && (
              <ThumbRail label="Before" imgs={beforeAll} selected={beforeIdx} onSelect={setBeforeIdx} ringClass="ring-white/60" />
            )}
            {afterAll.length > 1 && (
              <ThumbRail label="After" imgs={afterAll} selected={afterIdx} onSelect={setAfterIdx} ringClass="ring-lime" tone="text-lime-soft" />
            )}
          </div>
        )}

        {/* Meta */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ background: `${meta.color}1f`, color: meta.color }}>
                <meta.icon size={18} />
              </div>
              <div>
                <p className="font-semibold leading-tight">{item.car}</p>
                <p className="text-[11px] text-white/40">{item.service} · {meta.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5 text-champagne">
              {[...Array(item.rating)].map((_, i) => <Star key={i} size={13} fill="currentColor" />)}
            </div>
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-2xl bg-white/[0.03] p-3">
            <Quote size={14} className="mt-0.5 shrink-0 text-white/30" />
            <p className="text-[13px] leading-snug text-white/70">{item.review}</p>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Avatar name={item.customer} color={item.hue} size={22} />
            <span className="text-[11px] text-white/45">{item.customer}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export default function Gallery() {
  const jobs = useJobs()

  // Real captured jobs that have at least one before AND one after photo
  const realItems: Item[] = jobs
    .filter((j) => (j.beforeImages?.length ?? 0) > 0 && (j.afterImages?.length ?? 0) > 0)
    .map((j) => ({
      id: j.id,
      car: `${j.car} ${j.model}`.trim(),
      service: j.service,
      customer: j.customerName ?? 'Customer',
      rating: 5,
      review: 'Captured live in Worker Mode and shared with the customer on WhatsApp.',
      hue: j.color,
      beforeAll: j.beforeImages ?? [],
      afterAll: j.afterImages ?? [],
      beforeSrc: j.beforeImages?.[0],
      afterSrc: j.afterImages?.[0],
    }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Before & After"
        subtitle="Auto-saved from every job"
        right={
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-champagne/15 text-champagne">
            <Images size={19} />
          </div>
        }
      />

      <Card className="flex items-center gap-3 p-4">
        <Sparkles size={18} className="shrink-0 text-champagne" />
        <p className="text-xs text-white/55">
          Drag the slider to reveal the transformation. Every before/after is captured automatically in Worker Mode and shared to the customer on WhatsApp.
        </p>
      </Card>

      {/* Real captures from workers */}
      {realItems.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <Camera size={15} className="text-lime" />
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Your Studio Captures</h3>
          </div>
          <div className="space-y-4">
            {realItems.map((item, i) => (
              <CompareCard key={item.id} item={item} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Showcase examples */}
      <section className="space-y-3">
        {realItems.length > 0 && (
          <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Showcase</h3>
        )}
        <div className="space-y-4">
          {gallery.map((item, i) => (
            <CompareCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </section>

      <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-white/30">
        <Badge tone="lime" dot>Auto-stored</Badge>
        Studio portfolio grows with every car
      </div>
    </div>
  )
}
