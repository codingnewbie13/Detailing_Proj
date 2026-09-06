import { useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Phone,
  Send,
  FileText,
  Check,
  Camera,
  MessageCircle,
  IndianRupee,
  Clock,
  MapPin,
  ExternalLink,
  Boxes,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Card, Badge, Button, Avatar } from '../components/ui'
import BeforeAfter from '../components/BeforeAfter'
import { type JobStage } from '../data/mock'
import { useJob, useCustomer, useWorker } from '../lib/store'
import { serviceMeta, statusTone, payTone } from '../lib/service'
import { inr, cx } from '../lib/format'
import { openWhatsApp, openCall } from '../lib/contact'

const STAGES: JobStage[] = ['Booked', 'Started', 'Washing', 'Coating', 'Inspection', 'Ready']

const commsFeed = [
  { icon: MessageCircle, label: 'Booking confirmation sent', time: '9:12 AM', tone: 'lime' as const },
  { icon: Camera, label: 'Before photos uploaded', time: '9:40 AM', tone: 'blue' as const },
  { icon: Check, label: 'Work started by worker', time: '9:45 AM', tone: 'blue' as const },
  { icon: MessageCircle, label: '"Your car is being coated" sent', time: '11:20 AM', tone: 'lime' as const },
  { icon: IndianRupee, label: 'Payment link shared', time: '11:22 AM', tone: 'amber' as const },
]

export default function JobDetails() {
  const { id } = useParams()
  const job = useJob(id)
  const customer = useCustomer(job?.customerId)
  const worker = useWorker(job?.workerId)
  if (!job) return <Navigate to="/" replace />

  const meta = serviceMeta[job.service]
  const Icon = meta.icon
  const currentIdx = STAGES.indexOf(job.stage)
  const custName = job.customerName ?? customer?.name ?? 'Customer'
  const custPhone = job.customerPhone ?? customer?.phone ?? ''
  const trackLink = `${window.location.origin}/track/${job.id}`

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${job.car} ${job.model}`}
        subtitle={job.reg}
        right={<Badge tone={statusTone[job.status]} dot={job.status === 'In Progress' || job.status === 'Delayed'}>{job.status}</Badge>}
      />

      {/* Car hero */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card hairline className="relative overflow-hidden">
          <div
            className="relative h-40 w-full"
            style={{ background: `linear-gradient(135deg, ${meta.color}33, transparent 70%), #0d0d11` }}
          >
            <div className="pointer-events-none absolute -right-6 -top-8 h-40 w-40 rounded-full blur-3xl" style={{ background: `${meta.color}22` }} />
            {/* Silhouette icon as premium placeholder */}
            <div className="absolute inset-0 grid place-items-center">
              <Icon size={72} strokeWidth={1.2} style={{ color: meta.color }} className="opacity-90" />
            </div>
            <div className="absolute left-4 top-4 flex items-center gap-2">
              <span className="rounded-lg px-2 py-1 text-[11px] font-semibold" style={{ background: `${meta.color}22`, color: meta.color }}>
                {meta.label}
              </span>
            </div>
            <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
              <div>
                <p className="text-[11px] text-white/50">Job Value</p>
                <p className="font-num text-2xl font-bold text-white">{inr(job.amount)}</p>
              </div>
              <Badge tone={payTone[job.pay]}>{job.pay}</Badge>
            </div>
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-4 px-4 py-3 text-xs text-white/55">
            <span className="flex items-center gap-1.5"><Clock size={14} className="text-white/35" />{job.eta}</span>
            {worker && (
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-white/35" />
                {worker.name.split(' ')[0]}
              </span>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Payment breakdown */}
      <section className="grid grid-cols-3 gap-2">
        <div className="rounded-2xl glass px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wide text-white/40">Total</p>
          <p className="font-num text-base font-bold text-white">{inr(job.amount, { compact: job.amount >= 100000 })}</p>
        </div>
        <div className="rounded-2xl bg-lime/[0.08] px-3 py-3 text-center">
          <p className="text-[10px] uppercase tracking-wide text-lime-soft/70">Paid</p>
          <p className="font-num text-base font-bold text-lime-soft">{inr(job.paidAmount ?? 0, { compact: (job.paidAmount ?? 0) >= 100000 })}</p>
        </div>
        <div className={`rounded-2xl px-3 py-3 text-center ${(job.amount - (job.paidAmount ?? 0)) > 0 ? 'bg-amber/[0.08]' : 'glass'}`}>
          <p className="text-[10px] uppercase tracking-wide text-white/40">Balance</p>
          <p className={`font-num text-base font-bold ${(job.amount - (job.paidAmount ?? 0)) > 0 ? 'text-amber' : 'text-white/50'}`}>
            {inr(Math.max(0, job.amount - (job.paidAmount ?? 0)), { compact: job.amount >= 100000 })}
          </p>
        </div>
      </section>

      {/* Captured photos (from Worker Mode) */}
      {(job.beforeImages?.length && job.afterImages?.length) ? (
        <section className="space-y-3">
          <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Before / After · drag to compare</h3>
          <Card hairline className="overflow-hidden p-3">
            <BeforeAfter before={job.beforeImages[0]} after={job.afterImages[0]} height="h-60" rounded="rounded-2xl" />
            <div className="mt-2 grid grid-cols-2 gap-2 text-center text-[11px] text-white/40">
              <span>Before · {job.beforeImages.length}</span>
              <span className="text-lime-soft">After · {job.afterImages.length}</span>
            </div>
          </Card>
        </section>
      ) : (job.beforeImages?.length || job.afterImages?.length) ? (
        <section className="space-y-3">
          <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Job Photos</h3>
          <Card className="space-y-3 p-4">
            {job.beforeImages?.length ? (
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-white/45">Before · {job.beforeImages.length}</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {job.beforeImages.map((src, i) => (
                    <img key={i} src={src} alt={`before ${i + 1}`} className="h-24 w-24 shrink-0 rounded-xl object-cover ring-1 ring-white/10" />
                  ))}
                </div>
              </div>
            ) : null}
            {job.afterImages?.length ? (
              <div>
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-lime-soft">After · {job.afterImages.length}</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {job.afterImages.map((src, i) => (
                    <img key={i} src={src} alt={`after ${i + 1}`} className="h-24 w-24 shrink-0 rounded-xl object-cover ring-1 ring-lime/25" />
                  ))}
                </div>
              </div>
            ) : null}
          </Card>
        </section>
      ) : null}

      {/* Materials used (logged by the worker at finish) */}
      {job.materialsUsed && job.materialsUsed.length > 0 && (
        <section className="space-y-3">
          <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Materials Used</h3>
          <Card className="divide-y divide-white/6">
            {job.materialsUsed.map((m) => (
              <div key={m.id} className="flex items-center gap-3 p-3.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/6 text-white/70">
                  <Boxes size={16} />
                </div>
                <p className="min-w-0 flex-1 truncate text-sm font-medium">{m.name}</p>
                <p className="font-num text-sm font-semibold text-rose">-{m.qty} {m.unit}</p>
              </div>
            ))}
            <p className="px-4 py-2.5 text-[11px] text-white/35">Logged by {worker?.name.split(' ')[0] ?? 'the worker'} at finish · deducted from stock</p>
          </Card>
        </section>
      )}

      {/* Timeline */}
      <section className="space-y-3">
        <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Progress Timeline</h3>
        <Card className="p-4">
          <div className="relative">
            {STAGES.map((stage, i) => {
              const done = i < currentIdx
              const active = i === currentIdx
              const last = i === STAGES.length - 1
              return (
                <div key={stage} className="relative flex gap-3.5 pb-5 last:pb-0">
                  {/* connector */}
                  {!last && (
                    <span
                      className={cx(
                        'absolute left-[13px] top-7 h-full w-[2px] rounded',
                        done ? 'bg-lime/60' : 'bg-white/8',
                      )}
                    />
                  )}
                  {/* node */}
                  <div
                    className={cx(
                      'relative z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition-all',
                      done && 'border-lime bg-lime text-ink-950',
                      active && 'border-blue bg-blue/20 text-blue-300',
                      !done && !active && 'border-white/15 bg-ink-800 text-white/30',
                    )}
                  >
                    {done ? <Check size={14} /> : active ? <span className="h-2 w-2 rounded-full bg-blue animate-pulseSoft" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </div>
                  <div className="pt-0.5">
                    <p className={cx('text-sm font-semibold', active ? 'text-white' : done ? 'text-white/70' : 'text-white/35')}>
                      {stage}
                    </p>
                    {active && <p className="text-[11px] text-blue-300">In progress now</p>}
                    {done && <p className="text-[11px] text-white/30">Completed</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </section>

      {/* Customer + comms */}
      <section className="space-y-3">
        <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Customer Timeline</h3>
        <Card className="flex items-center gap-3 p-3.5">
          <Avatar name={custName} color={meta.color} />
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{custName}</p>
            <p className="truncate text-xs text-white/45">{custPhone}</p>
          </div>
          {customer && <Badge tone="gold">{customer.tier}</Badge>}
        </Card>

        <Card className="p-4">
          <div className="relative space-y-4">
            {commsFeed.map((c, i) => {
              const toneColor = c.tone === 'lime' ? '#A3E635' : c.tone === 'amber' ? '#f5b544' : '#2E6BFF'
              const last = i === commsFeed.length - 1
              return (
                <div key={i} className="relative flex gap-3">
                  {!last && <span className="absolute left-[15px] top-8 h-full w-[2px] rounded bg-white/8" />}
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl" style={{ background: `${toneColor}1f`, color: toneColor }}>
                    <c.icon size={15} />
                  </div>
                  <div className="flex flex-1 items-center justify-between pt-1">
                    <p className="text-sm text-white/80">{c.label}</p>
                    <span className="text-[11px] text-white/35">{c.time}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </section>

      {/* Assigned worker — the WhatsApp handoff */}
      {worker && (
        <section className="space-y-3">
          <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Assigned Worker</h3>
          <Card className="p-3.5">
            <div className="flex items-center gap-3">
              <Avatar name={worker.name} color={worker.avatarColor} size={44} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{worker.name}</p>
                <p className="truncate text-xs text-white/45">{worker.role}</p>
              </div>
              <Badge tone="lime" dot>Notified</Badge>
            </div>
            <div className="mt-3 flex items-start gap-2 rounded-2xl bg-[#005c4b]/60 px-3 py-2">
              <MessageCircle size={13} className="mt-0.5 shrink-0 text-white/70" />
              <p className="text-[12px] leading-snug text-white/85">
                New job assigned: {job.car} {job.model} · {job.service}. Tap to start →
              </p>
            </div>
            <Link to={`/worker/${worker.id}`}>
              <Button variant="glass" full className="mt-3" icon={<ExternalLink size={16} />}>
                Open Worker View (their link)
              </Button>
            </Link>
          </Card>
        </section>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="glass"
          size="lg"
          icon={<Phone size={18} />}
          onClick={() => custPhone && openCall(custPhone)}
        >
          Call
        </Button>
        <Button
          variant="success"
          size="lg"
          icon={<Send size={18} />}
          onClick={() =>
            custPhone &&
            openWhatsApp(
              custPhone,
              `Hello ${custName.split(' ')[0]}! Update on your ${job.car} ${job.model} (${job.service}): currently "${job.stage}". Track live 👉 ${trackLink}`,
            )
          }
        >
          Send Update
        </Button>
        <Button
          variant="glass"
          size="lg"
          full
          className="col-span-2"
          icon={<ExternalLink size={18} />}
          onClick={() => window.open(trackLink, '_blank')}
        >
          Open Customer Tracking Link
        </Button>
        <Button variant="gold" size="lg" full className="col-span-2" icon={<FileText size={18} />}>
          Generate Invoice
        </Button>
      </div>
    </div>
  )
}
