import { useNavigate, useParams, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  Flame,
  ListChecks,
  LogOut,
} from 'lucide-react'
import { Avatar, Card, Badge, Button } from '../components/ui'
import { studio } from '../data/mock'
import { useWorker, useJobs, useJob, useCustomer } from '../lib/store'
import { serviceMeta, statusTone } from '../lib/service'
import { cx } from '../lib/format'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function WorkerDashboard() {
  const { id } = useParams()
  const nav = useNavigate()
  const worker = useWorker(id)
  const jobs = useJobs()
  if (!worker) return <Navigate to="/workers" replace />

  // Jobs assigned to this worker (fallback to a couple so the demo always shows work)
  let myJobs = jobs.filter((j) => j.workerId === worker.id && j.status !== 'Delivered')
  if (myJobs.length === 0) myJobs = jobs.filter((j) => j.status !== 'Delivered').slice(0, 2)

  const active = myJobs.find((j) => j.status === 'In Progress' || j.status === 'Delayed')
  const pending = myJobs.filter((j) => j !== active)
  const doneToday = worker.jobsToday

  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-white">
      {/* Ambient backdrop */}
      <div className="pointer-events-none fixed inset-0 bg-mesh-lux" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.03] [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:22px_22px]" />

      <div className="relative mx-auto min-h-screen w-full max-w-md px-4 pb-10 pt-5">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={worker.name} color={worker.avatarColor} size={46} />
            <div>
              <p className="text-xs text-white/45">{greeting()}</p>
              <h1 className="font-display text-lg font-bold leading-tight">{worker.name.split(' ')[0]}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full glass px-3 py-1.5">
            <Sparkles size={13} className="text-champagne" />
            <span className="text-[11px] font-semibold">{studio.name}</span>
          </div>
        </header>

        {/* Role + status */}
        <div className="mt-4 flex items-center gap-2">
          <Badge tone="blue">{worker.role}</Badge>
          <Badge tone={worker.status === 'Working' ? 'lime' : worker.status === 'Break' ? 'amber' : 'neutral'} dot={worker.status === 'Working'}>
            {worker.status}
          </Badge>
        </div>

        {/* Stat strip */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          <StatBox icon={<ListChecks size={16} />} label="Assigned" value={myJobs.length} tone="text-blue-300" />
          <StatBox icon={<Flame size={16} />} label="Active" value={active ? 1 : 0} tone="text-amber" />
          <StatBox icon={<CheckCircle2 size={16} />} label="Done today" value={doneToday} tone="text-lime-soft" />
        </div>

        {/* Active job — big CTA */}
        {active && (
          <section className="mt-6 space-y-3">
            <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Current Job</h3>
            <ActiveJobCard workerId={worker.id} jobId={active.id} />
          </section>
        )}

        {/* Up next */}
        <section className="mt-6 space-y-3">
          <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">
            {active ? 'Up Next' : 'Your Jobs'}
          </h3>
          {pending.length === 0 ? (
            <Card className="p-6 text-center">
              <CheckCircle2 size={30} className="mx-auto text-lime" />
              <p className="mt-2 text-sm text-white/60">All caught up. No jobs waiting.</p>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {pending.map((j, i) => (
                <QueueCard key={j.id} workerId={worker.id} jobId={j.id} index={i} />
              ))}
            </div>
          )}
        </section>

        {/* Exit */}
        <button
          onClick={() => nav('/workers')}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl glass py-3 text-sm font-semibold text-white/60 transition-all active:scale-[0.98]"
        >
          <LogOut size={16} /> Exit Worker View
        </button>

        <p className="mt-4 text-center text-[11px] text-white/25">
          You only see your own jobs. Revenue & customer data stay private to the owner.
        </p>
      </div>
    </div>
  )
}

function StatBox({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: string }) {
  return (
    <Card className="p-3.5 text-center">
      <span className={cx('mx-auto flex items-center justify-center', tone)}>{icon}</span>
      <p className={cx('mt-1 font-num text-2xl font-bold', tone)}>{value}</p>
      <p className="text-[10px] text-white/40">{label}</p>
    </Card>
  )
}

function ActiveJobCard({ workerId, jobId }: { workerId: string; jobId: string }) {
  const job = useJob(jobId)!
  const meta = serviceMeta[job.service]
  const Icon = meta.icon
  const storeCustomer = useCustomer(job.customerId)
  const customer = storeCustomer ?? (job.customerName ? { name: job.customerName } : undefined)
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card hairline className="relative overflow-hidden p-5">
        <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full blur-3xl" style={{ background: `${meta.color}22` }} />
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-2xl" style={{ background: `${meta.color}1f`, color: meta.color }}>
            <Icon size={28} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xl font-bold">{job.car} {job.model}</p>
            <p className="text-sm text-white/50">{job.service} · {job.reg}</p>
          </div>
          <Badge tone={statusTone[job.status]} dot>{job.status}</Badge>
        </div>
        <div className="mt-3 flex items-center gap-4 text-xs text-white/45">
          <span className="flex items-center gap-1.5"><Clock size={13} /> {job.eta}</span>
          {customer && <span className="truncate">Customer: {customer.name}</span>}
        </div>
        <Link to={`/worker/${workerId}/job/${jobId}`}>
          <Button variant="primary" size="lg" full className="mt-4" icon={<Play size={19} />}>
            Continue Work
          </Button>
        </Link>
      </Card>
    </motion.div>
  )
}

function QueueCard({ workerId, jobId, index }: { workerId: string; jobId: string; index: number }) {
  const job = useJob(jobId)!
  const meta = serviceMeta[job.service]
  const Icon = meta.icon
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
      <Link to={`/worker/${workerId}/job/${jobId}`}>
        <Card className="flex items-center gap-3.5 p-3.5 transition-all active:scale-[0.99]">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl" style={{ background: `${meta.color}1f`, color: meta.color }}>
            <Icon size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{job.car} {job.model}</p>
            <p className="truncate text-xs text-white/45">{job.service} · {job.reg}</p>
            <p className="mt-1 flex items-center gap-1 text-[11px] text-white/35"><Clock size={11} /> {job.eta}</p>
          </div>
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue/12 text-blue-300">
            <Play size={16} />
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
