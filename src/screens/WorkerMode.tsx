import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  Camera,
  CheckCircle2,
  X,
  Images,
  Sparkles,
  ChevronLeft,
  Clock,
  Package,
  Plus,
  Minus,
} from 'lucide-react'
import { Avatar } from '../components/ui'
import { useWorker, useJob, startJob, addBeforePhotos, addAfterPhotos, finishJob, plannedMaterials } from '../lib/store'
import { filesToImages } from '../lib/image'
import { serviceMeta } from '../lib/service'
import { cx } from '../lib/format'

type Phase = 'ready' | 'before' | 'working' | 'paused' | 'after' | 'materials' | 'done'

function fmt(s: number) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  const h = Math.floor(m / 60)
  const mm = m % 60
  return `${h > 0 ? `${h}:` : ''}${String(mm).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

export default function WorkerMode() {
  const { id, jobId } = useParams()
  const nav = useNavigate()
  const worker = useWorker(id)
  const storeJob = useJob(jobId)
  const [phase, setPhase] = useState<Phase>('ready')
  const [seconds, setSeconds] = useState(0)
  const [beforeDone, setBeforeDone] = useState(false)
  const [afterDone, setAfterDone] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [mats, setMats] = useState<{ id: string; name: string; qty: number; unit: string }[]>([])
  const timer = useRef<ReturnType<typeof setInterval>>()
  const beforeInput = useRef<HTMLInputElement>(null)
  const afterInput = useRef<HTMLInputElement>(null)

  const job = storeJob
  const meta = job ? serviceMeta[job.service] : serviceMeta.Ceramic
  const Icon = meta.icon

  // Where "back" and "finish" return to: the worker's own dashboard
  const homePath = worker ? `/worker/${worker.id}` : '/workers'

  async function handleBefore(e: React.ChangeEvent<HTMLInputElement>) {
    if (!job || !e.target.files?.length) return
    setUploading(true)
    const imgs = await filesToImages(e.target.files)
    if (imgs.length) { addBeforePhotos(job.id, imgs); setBeforeDone(true) }
    setUploading(false)
    e.target.value = ''
  }
  async function handleAfter(e: React.ChangeEvent<HTMLInputElement>) {
    if (!job || !e.target.files?.length) return
    setUploading(true)
    const imgs = await filesToImages(e.target.files)
    if (imgs.length) { addAfterPhotos(job.id, imgs); setAfterDone(true) }
    setUploading(false)
    e.target.value = ''
  }

  // Open the "Materials Used" confirm step, pre-filled with the service estimate
  function openMaterials() {
    if (!job) return
    setMats(plannedMaterials(job.service))
    setPhase('materials')
  }
  function bump(id: string, delta: number) {
    setMats((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m
        const step = m.unit === 'm' || m.unit === 'L' || m.unit === 'kg' ? 0.5 : 1
        return { ...m, qty: Math.max(0, Math.round((m.qty + delta * step) * 100) / 100) }
      }),
    )
  }
  function confirmFinish() {
    if (!job) return
    finishJob(job.id, mats)
    setPhase('done')
  }

  useEffect(() => {
    if (phase === 'working') {
      timer.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    } else if (timer.current) {
      clearInterval(timer.current)
    }
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [phase])

  if (!worker) return <Navigate to="/workers" replace />
  if (!job) return <Navigate to={homePath} replace />

  const running = phase === 'working'
  const paused = phase === 'paused'

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      {/* Ambient state glow */}
      <div
        className="pointer-events-none fixed inset-0 transition-colors duration-700"
        style={{
          background:
            phase === 'done'
              ? 'radial-gradient(90% 60% at 50% 0%, rgba(163,230,53,0.16), transparent 70%)'
              : paused
              ? 'radial-gradient(90% 60% at 50% 0%, rgba(245,181,68,0.14), transparent 70%)'
              : running
              ? 'radial-gradient(90% 60% at 50% 0%, rgba(46,107,255,0.16), transparent 70%)'
              : 'radial-gradient(90% 60% at 50% 0%, rgba(255,255,255,0.05), transparent 70%)',
        }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-8 pt-5">
        {/* Hidden camera/file inputs for glove-friendly photo capture */}
        <input ref={beforeInput} type="file" accept="image/*" capture="environment" multiple hidden onChange={handleBefore} />
        <input ref={afterInput} type="file" accept="image/*" capture="environment" multiple hidden onChange={handleAfter} />
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => nav(homePath)}
            className="grid h-11 w-11 place-items-center rounded-2xl glass"
            aria-label="Back"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex items-center gap-2 rounded-full glass px-3 py-1.5">
            <Sparkles size={14} className="text-champagne" />
            <span className="text-xs font-semibold">Worker Mode</span>
          </div>
          <Avatar name={worker.name} color={worker.avatarColor} size={44} />
        </div>

        {/* Today's job card */}
        <div className="mt-5 rounded-3xl glass p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">Today's Job</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: `${meta.color}1f`, color: meta.color }}>
              <Icon size={28} strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xl font-bold">{job.car} {job.model}</p>
              <p className="text-sm text-white/50">{job.service} · {job.reg}</p>
            </div>
          </div>

          {/* Photo thumbnails captured so far */}
          {(job.beforeImages?.length || job.afterImages?.length) ? (
            <div className="mt-3 flex gap-3 border-t border-white/6 pt-3">
              {job.beforeImages?.length ? (
                <PhotoStrip label="Before" imgs={job.beforeImages} />
              ) : null}
              {job.afterImages?.length ? (
                <PhotoStrip label="After" imgs={job.afterImages} tone="lime" />
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Big timer / status */}
        <div className="mt-6 flex flex-1 flex-col items-center justify-center">
          <div
            className={cx(
              'grid aspect-square w-64 place-items-center rounded-full border-2 transition-colors duration-500',
              phase === 'done'
                ? 'border-lime/50'
                : paused
                ? 'border-amber/50'
                : running
                ? 'border-blue/50'
                : 'border-white/12',
            )}
            style={{
              boxShadow: running
                ? '0 0 60px -10px rgba(46,107,255,0.5)'
                : phase === 'done'
                ? '0 0 60px -10px rgba(163,230,53,0.5)'
                : paused
                ? '0 0 50px -12px rgba(245,181,68,0.45)'
                : 'none',
            }}
          >
            <div className="text-center">
              {phase === 'done' ? (
                <>
                  <CheckCircle2 size={56} className="mx-auto text-lime" />
                  <p className="mt-2 text-lg font-bold text-lime">Job Finished</p>
                  <p className="font-num text-sm text-white/50">Total {fmt(seconds)}</p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-center gap-1.5 text-white/40">
                    <Clock size={14} />
                    <span className="text-[11px] uppercase tracking-widest">
                      {phase === 'ready' ? 'Not started' : paused ? 'Paused' : 'Elapsed'}
                    </span>
                  </div>
                  <p className={cx('font-num text-6xl font-extrabold tabular-nums', paused ? 'text-amber' : running ? 'text-white' : 'text-white/40')}>
                    {fmt(seconds)}
                  </p>
                  <div className="mt-2 flex items-center justify-center gap-3 text-[11px]">
                    <StateDot ok={beforeDone} label="Before" />
                    <StateDot ok={afterDone} label="After" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action zone — huge glove-friendly buttons */}
        <div className="mt-6 space-y-3">
          <AnimatePresence mode="wait">
            {phase === 'ready' && (
              <BigAction key="start" onClick={() => { startJob(job.id); setPhase('before') }} tone="blue" icon={<Play size={30} />}>
                Start Work
              </BigAction>
            )}

            {phase === 'before' && (
              <motion.div key="before" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                <BigAction
                  onClick={() => beforeInput.current?.click()}
                  tone={beforeDone ? 'lime' : 'gold'}
                  icon={beforeDone ? <CheckCircle2 size={30} /> : <Camera size={30} />}
                >
                  {uploading ? 'Uploading…' : beforeDone ? `Before Photos Added (${job.beforeImages?.length ?? 0})` : 'Upload Before Photos'}
                </BigAction>
                <BigAction
                  onClick={() => beforeDone && (setPhase('working'), setSeconds(0))}
                  tone="blue"
                  icon={<Play size={30} />}
                  disabled={!beforeDone}
                >
                  Begin Timer
                </BigAction>
              </motion.div>
            )}

            {phase === 'working' && (
              <motion.div key="working" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-3">
                <BigAction onClick={() => setPhase('paused')} tone="amber" icon={<Pause size={28} />} small>
                  Pause
                </BigAction>
                <BigAction onClick={() => setPhase('after')} tone="lime" icon={<Camera size={28} />} small>
                  After Photos
                </BigAction>
              </motion.div>
            )}

            {phase === 'paused' && (
              <motion.div key="paused" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-3">
                <BigAction onClick={() => setPhase('working')} tone="blue" icon={<Play size={28} />} small>
                  Resume
                </BigAction>
                <BigAction onClick={() => setPhase('after')} tone="lime" icon={<Camera size={28} />} small>
                  After Photos
                </BigAction>
              </motion.div>
            )}

            {phase === 'after' && (
              <motion.div key="after" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                <BigAction
                  onClick={() => afterInput.current?.click()}
                  tone={afterDone ? 'lime' : 'gold'}
                  icon={afterDone ? <CheckCircle2 size={30} /> : <Images size={30} />}
                >
                  {uploading ? 'Uploading…' : afterDone ? `After Photos Added (${job.afterImages?.length ?? 0})` : 'Upload After Photos'}
                </BigAction>
                <BigAction
                  onClick={() => { if (afterDone) openMaterials() }}
                  tone="lime"
                  icon={<Package size={30} />}
                  disabled={!afterDone}
                >
                  Log Materials & Finish
                </BigAction>
              </motion.div>
            )}

            {phase === 'materials' && (
              <motion.div key="materials" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
                <div className="rounded-3xl glass p-4">
                  <div className="mb-1 flex items-center gap-2">
                    <Package size={18} className="text-champagne" />
                    <p className="font-semibold">Materials Used on this car</p>
                  </div>
                  <p className="mb-3 text-[12px] text-white/45">
                    Pre-filled estimate for {job.service}. Adjust if this car took more or less.
                  </p>
                  <div className="space-y-2.5">
                    {mats.map((m) => (
                      <div key={m.id} className="flex items-center gap-3 rounded-2xl bg-white/[0.03] p-2.5">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{m.name}</p>
                          <p className="text-[11px] text-white/40">{m.unit}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => bump(m.id, -1)} className="grid h-10 w-10 place-items-center rounded-xl bg-white/6 text-white active:scale-90">
                            <Minus size={18} />
                          </button>
                          <span className="w-14 text-center font-num text-lg font-bold tabular-nums">{m.qty}</span>
                          <button onClick={() => bump(m.id, 1)} className="grid h-10 w-10 place-items-center rounded-xl bg-blue/20 text-blue-300 active:scale-90">
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {mats.length === 0 && (
                      <p className="py-4 text-center text-sm text-white/40">No materials configured for this service.</p>
                    )}
                  </div>
                </div>
                <BigAction onClick={confirmFinish} tone="lime" icon={<CheckCircle2 size={30} />}>
                  Confirm & Finish Job
                </BigAction>
                <button onClick={() => setPhase('after')} className="w-full py-2 text-sm font-semibold text-white/50">
                  Back
                </button>
              </motion.div>
            )}

            {phase === 'done' && (
              <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <BigAction onClick={() => nav(homePath)} tone="lime" icon={<CheckCircle2 size={30} />}>
                  Back to My Jobs
                </BigAction>
              </motion.div>
            )}
          </AnimatePresence>

          {(phase === 'before' || phase === 'working' || phase === 'paused' || phase === 'after' || phase === 'materials') && (
            <button
              onClick={() => { setPhase('ready'); setSeconds(0); setBeforeDone(false); setAfterDone(false) }}
              className="flex w-full items-center justify-center gap-2 py-2 text-sm font-semibold text-rose/80"
            >
              <X size={16} /> Cancel Job
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function PhotoStrip({ label, imgs, tone = 'blue' }: { label: string; imgs: string[]; tone?: 'blue' | 'lime' }) {
  return (
    <div className="flex-1">
      <p className={cx('mb-1 text-[10px] font-semibold uppercase tracking-wide', tone === 'lime' ? 'text-lime-soft' : 'text-white/50')}>
        {label} · {imgs.length}
      </p>
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {imgs.map((src, i) => (
          <img key={i} src={src} alt={`${label} ${i + 1}`} className="h-14 w-14 shrink-0 rounded-lg object-cover ring-1 ring-white/10" />
        ))}
      </div>
    </div>
  )
}

function StateDot({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={cx('flex items-center gap-1.5', ok ? 'text-lime-soft' : 'text-white/30')}>
      <span className={cx('h-2 w-2 rounded-full', ok ? 'bg-lime' : 'bg-white/25')} />
      {label}
    </span>
  )
}

function BigAction({
  children,
  onClick,
  tone,
  icon,
  disabled,
  small,
}: {
  children: React.ReactNode
  onClick?: () => void
  tone: 'blue' | 'lime' | 'amber' | 'gold'
  icon: React.ReactNode
  disabled?: boolean
  small?: boolean
}) {
  const tones: Record<string, string> = {
    blue: 'bg-blue text-white shadow-glow-blue',
    lime: 'bg-lime text-ink-950 shadow-glow-lime',
    amber: 'bg-amber text-ink-950',
    gold: 'bg-gradient-to-br from-champagne-soft to-champagne-deep text-ink-950',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'flex w-full flex-col items-center justify-center gap-2 rounded-3xl font-bold transition-all active:scale-[0.97]',
        small ? 'h-24 text-base' : 'h-28 text-xl',
        tones[tone],
        disabled && 'pointer-events-none opacity-30 grayscale',
      )}
    >
      {icon}
      {children}
    </button>
  )
}
