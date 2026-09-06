import { useParams, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Clock, Sparkles, Camera, ShieldCheck } from 'lucide-react'
import { useJob, useCustomer } from '../lib/store'
import BeforeAfter from '../components/BeforeAfter'
import { serviceMeta } from '../lib/service'
import { studio, type JobStage } from '../data/mock'
import { inr, cx } from '../lib/format'

const STAGES: JobStage[] = ['Booked', 'Started', 'Washing', 'Coating', 'Inspection', 'Ready', 'Delivered']

/**
 * Public customer tracking page — what the customer sees when they tap the
 * WhatsApp link. No app, no login, just a live status of their car.
 */
export default function TrackJob() {
  const { jobId } = useParams()
  const job = useJob(jobId)
  const customer = useCustomer(job?.customerId)
  if (!job) return <Navigate to="/" replace />

  const meta = serviceMeta[job.service]
  const Icon = meta.icon
  const currentIdx = STAGES.indexOf(job.stage)
  const name = job.customerName ?? customer?.name ?? 'there'
  const balance = job.amount - (job.paidAmount ?? 0)

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-mesh-lux" />
      <div className="relative mx-auto min-h-screen w-full max-w-md px-4 pb-10 pt-6">
        {/* Studio header */}
        <div className="flex items-center justify-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-champagne-soft to-champagne-deep">
            <Sparkles size={19} className="text-ink-950" />
          </div>
          <div className="text-center">
            <p className="font-display text-base font-bold leading-tight">{studio.name}</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Live Job Status</p>
          </div>
        </div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <div className="relative overflow-hidden rounded-3xl glass hair-gold p-5">
            <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full blur-3xl" style={{ background: `${meta.color}22` }} />
            <p className="text-xs text-white/50">Hello {name.split(' ')[0]}, here's your car</p>
            <div className="mt-2 flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: `${meta.color}1f`, color: meta.color }}>
                <Icon size={28} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xl font-bold">{job.car} {job.model}</p>
                <p className="text-sm text-white/50">{meta.label} · {job.reg}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className={cx('flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
                job.status === 'Ready' ? 'bg-lime/15 text-lime' : job.status === 'Delivered' ? 'bg-champagne/15 text-champagne' : 'bg-blue/15 text-blue-300')}>
                <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulseSoft" />
                {job.status === 'Ready' ? 'Ready for pickup' : job.status === 'Delivered' ? 'Delivered' : `In progress — ${job.stage}`}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <div className="mt-6 rounded-3xl glass p-4">
          <p className="mb-3 px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Progress</p>
          {STAGES.slice(0, 6).map((stage, i) => {
            const done = i < currentIdx
            const active = i === currentIdx
            const last = i === 5
            return (
              <div key={stage} className="relative flex gap-3.5 pb-5 last:pb-0">
                {!last && <span className={cx('absolute left-[13px] top-7 h-full w-[2px] rounded', done ? 'bg-lime/60' : 'bg-white/8')} />}
                <div className={cx('relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2',
                  done && 'border-lime bg-lime text-ink-950',
                  active && 'border-blue bg-blue/20 text-blue-300',
                  !done && !active && 'border-white/15 bg-ink-800 text-white/30')}>
                  {done ? <Check size={14} /> : active ? <span className="h-2 w-2 rounded-full bg-blue animate-pulseSoft" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                </div>
                <div className="pt-0.5">
                  <p className={cx('text-sm font-semibold', active ? 'text-white' : done ? 'text-white/70' : 'text-white/35')}>{stage}</p>
                  {active && <p className="text-[11px] text-blue-300">Happening now</p>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Photos captured */}
        {(job.beforeImages?.length && job.afterImages?.length) ? (
          <div className="mt-5">
            <div className="mb-2 flex items-center gap-2 px-1">
              <Sparkles size={14} className="text-lime" />
              <p className="text-[11px] font-semibold uppercase tracking-wide text-white/45">The Transformation · drag to compare</p>
            </div>
            <CustomerCompare before={job.beforeImages} after={job.afterImages} />
          </div>
        ) : (job.beforeImages?.length || job.afterImages?.length) ? (
          <div className="mt-4 space-y-3">
            {job.beforeImages?.length ? (
              <div>
                <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-white/45">Before</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {job.beforeImages.map((src, i) => (
                    <img key={i} src={src} alt={`before ${i + 1}`} className="h-28 w-28 shrink-0 rounded-2xl object-cover ring-1 ring-white/10" />
                  ))}
                </div>
              </div>
            ) : null}
            {job.afterImages?.length ? (
              <div>
                <p className="mb-1.5 px-1 text-[11px] font-semibold uppercase tracking-wide text-lime-soft">After ✨</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {job.afterImages.map((src, i) => (
                    <img key={i} src={src} alt={`after ${i + 1}`} className="h-28 w-28 shrink-0 rounded-2xl object-cover ring-1 ring-lime/25" />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (job.beforePhotos || job.afterPhotos) ? (
          <div className="mt-4 flex gap-3">
            <div className="flex-1 rounded-2xl glass p-3 text-center">
              <Camera size={18} className="mx-auto text-white/50" />
              <p className="mt-1 font-num text-lg font-bold">{job.beforePhotos ?? 0}</p>
              <p className="text-[10px] text-white/40">Before photos</p>
            </div>
            <div className="flex-1 rounded-2xl glass p-3 text-center">
              <Sparkles size={18} className="mx-auto text-lime" />
              <p className="mt-1 font-num text-lg font-bold">{job.afterPhotos ?? 0}</p>
              <p className="text-[10px] text-white/40">After photos</p>
            </div>
          </div>
        ) : null}

        {/* Payment */}
        <div className="mt-4 rounded-3xl glass p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/55">Job Value</span>
            <span className="font-num text-lg font-bold">{inr(job.amount)}</span>
          </div>
          {(job.paidAmount ?? 0) > 0 && balance > 0 && (
            <div className="mt-2 flex items-center justify-between text-sm text-white/45">
              <span>Paid</span>
              <span className="font-num text-lime-soft">{inr(job.paidAmount ?? 0)}</span>
            </div>
          )}
          <div className="mt-2 flex items-center justify-between border-t border-white/6 pt-2">
            <span className="text-sm text-white/55">{balance <= 0 ? 'Paid in full' : 'Balance due'}</span>
            <span className={cx('font-num text-lg font-bold', balance <= 0 ? 'text-lime-soft' : 'text-amber')}>
              {balance <= 0 ? inr(job.amount) : inr(balance)}
            </span>
          </div>
        </div>

        {/* ETA + contact */}
        <div className="mt-4 flex items-center gap-2 rounded-2xl glass px-4 py-3 text-sm text-white/60">
          <Clock size={15} className="text-white/40" /> {job.eta}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-white/30">
          <ShieldCheck size={13} className="text-lime" /> Secure live link · updates automatically
        </div>
      </div>
    </div>
  )
}

/** Customer-facing before/after with a premium slider + thumbnail selection. */
function CustomerCompare({ before, after }: { before: string[]; after: string[] }) {
  const [bi, setBi] = useState(0)
  const [ai, setAi] = useState(0)
  return (
    <div className="space-y-2.5">
      <BeforeAfter before={before[bi] ?? before[0]} after={after[ai] ?? after[0]} height="h-72" />
      {(before.length > 1 || after.length > 1) && (
        <div className="space-y-2">
          {before.length > 1 && (
            <Rail label="Before" imgs={before} sel={bi} onSel={setBi} ring="ring-white/70" tone="text-white/45" />
          )}
          {after.length > 1 && (
            <Rail label="After" imgs={after} sel={ai} onSel={setAi} ring="ring-lime" tone="text-lime-soft" />
          )}
        </div>
      )}
    </div>
  )
}

function Rail({
  label, imgs, sel, onSel, ring, tone,
}: {
  label: string; imgs: string[]; sel: number; onSel: (i: number) => void; ring: string; tone: string
}) {
  return (
    <div>
      <p className={cx('mb-1 px-1 text-[10px] font-semibold uppercase tracking-wide', tone)}>{label} · {imgs.length}</p>
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {imgs.map((src, i) => (
          <button
            key={i}
            onClick={() => onSel(i)}
            className={cx('h-12 w-12 shrink-0 overflow-hidden rounded-lg transition-all active:scale-95', sel === i ? `ring-2 ${ring}` : 'ring-1 ring-white/10 opacity-70')}
          >
            <img src={src} alt={label + ' ' + (i + 1)} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
