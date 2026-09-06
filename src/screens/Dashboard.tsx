import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bell,
  Plus,
  Boxes,
  HardHat,
  Users,
  TrendingUp,
  Car,
  Timer,
  PackageCheck,
  CircleDollarSign,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  MessageCircle,
  Images,
} from 'lucide-react'
import { Card, Badge, IconButton, SectionHeader, CountUp } from '../components/ui'
import JobCard from '../components/JobCard'
import { inr, cx } from '../lib/format'
import { studio } from '../data/mock'
import { useJobs } from '../lib/store'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good Morning'
  if (h < 17) return 'Good Afternoon'
  return 'Good Evening'
}

const quickActions = [
  { label: 'New Booking', to: '/bookings', icon: Plus, tone: 'blue' as const },
  { label: 'Inventory', to: '/inventory', icon: Boxes, tone: 'lime' as const },
  { label: 'Workers', to: '/workers', icon: HardHat, tone: 'amber' as const },
  { label: 'Customers', to: '/customers', icon: Users, tone: 'gold' as const },
]

const toneClasses: Record<string, string> = {
  blue: 'from-blue/25 to-blue/5 text-blue-300 ring-blue/25',
  lime: 'from-lime/25 to-lime/5 text-lime-soft ring-lime/25',
  amber: 'from-amber/25 to-amber/5 text-amber ring-amber/25',
  gold: 'from-champagne/25 to-champagne/5 text-champagne ring-champagne/25',
}

export default function Dashboard() {
  const jobs = useJobs()
  const recent = jobs.slice(0, 4)

  // Live KPIs derived from the store
  const kpis = {
    revenueToday: jobs.filter((j) => j.pay === 'Paid').reduce((s, j) => s + (j.paidAmount ?? j.amount), 0),
    carsToday: jobs.length,
    inProgress: jobs.filter((j) => j.status === 'In Progress' || j.status === 'Delayed').length,
    waitingPickup: jobs.filter((j) => j.status === 'Ready').length,
    completedToday: jobs.filter((j) => j.status === 'Delivered').length,
    unpaid: jobs.filter((j) => j.pay === 'Pending' && j.status !== 'Delivered').length,
  }

  return (
    <div className="space-y-7">
      {/* ---------------- Header ---------------- */}
      <header className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-champagne-soft to-champagne-deep shadow-[0_6px_20px_-6px_rgba(216,192,138,0.6)]">
            <Sparkles size={19} className="text-ink-950" />
          </div>
          <div>
            <p className="text-xs text-white/45">{greeting()}, {studio.owner}</p>
            <h1 className="font-display text-lg font-bold leading-tight tracking-tight">
              {studio.name}
            </h1>
          </div>
        </div>
        <div className="relative">
          <IconButton label="Notifications">
            <Bell size={18} />
          </IconButton>
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-rose ring-2 ring-ink-950" />
        </div>
      </header>

      {/* ---------------- Revenue hero ---------------- */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card hairline className="relative p-5">
          {/* ambient glow */}
          <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-lime/10 blur-3xl" />
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-white/45">Today's Revenue</p>
              <div className="mt-1.5 font-num text-4xl font-extrabold tracking-tightest text-white">
                <CountUp value={kpis.revenueToday} format={(n) => inr(n)} />
              </div>
            </div>
            <Badge tone="lime" className="mt-1">
              <ArrowUpRight size={13} /> 18%
            </Badge>
          </div>

          <div className="mt-4 flex items-center gap-4 border-t border-white/6 pt-3.5 text-xs">
            <span className="flex items-center gap-1.5 text-white/55">
              <TrendingUp size={14} className="text-lime" />
              vs ₹32,600 yesterday
            </span>
            <span className="flex items-center gap-1.5 text-white/45">
              <CircleDollarSign size={14} className="text-amber" />
              {kpis.unpaid} unpaid
            </span>
          </div>
        </Card>
      </motion.div>

      {/* ---------------- KPI grid ---------------- */}
      <section className="grid grid-cols-2 gap-3">
        <KpiTile label="Today's Cars" value={kpis.carsToday} icon={<Car size={17} />} tone="blue" delay={0.05} />
        <KpiTile label="Jobs In Progress" value={kpis.inProgress} icon={<Timer size={17} />} tone="amber" delay={0.1} />
        <KpiTile label="Waiting Pickup" value={kpis.waitingPickup} icon={<PackageCheck size={17} />} tone="gold" delay={0.15} />
        <KpiTile label="Completed Today" value={kpis.completedToday} icon={<TrendingUp size={17} />} tone="lime" delay={0.2} />
      </section>

      {/* ---------------- Quick actions ---------------- */}
      <section className="space-y-3">
        <SectionHeader title="Quick Actions" />
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
            >
              <Link to={a.to} className="group flex flex-col items-center gap-2">
                <div
                  className={cx(
                    'grid h-16 w-full place-items-center rounded-2xl bg-gradient-to-br ring-1 transition-all active:scale-95',
                    toneClasses[a.tone],
                  )}
                >
                  <a.icon size={22} strokeWidth={2.2} />
                </div>
                <span className="text-[11px] font-medium text-white/60">{a.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- Insights shortcuts ---------------- */}
      <section className="space-y-3">
        <SectionHeader title="Insights" />
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {[
            { to: '/analytics', label: 'Analytics', icon: BarChart3, tone: 'text-blue-300 bg-blue/12' },
            { to: '/whatsapp', label: 'WhatsApp Automation', icon: MessageCircle, tone: 'text-lime-soft bg-lime/12' },
            { to: '/gallery', label: 'Before & After', icon: Images, tone: 'text-champagne bg-champagne/12' },
          ].map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className="flex shrink-0 items-center gap-2 rounded-2xl glass px-3.5 py-2.5 transition-all active:scale-95"
            >
              <span className={cx('grid h-7 w-7 place-items-center rounded-lg', p.tone)}>
                <p.icon size={15} />
              </span>
              <span className="text-[13px] font-semibold text-white/80">{p.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- Recent jobs ---------------- */}
      <section className="space-y-3">
        <SectionHeader
          title="Recent Jobs"
          action={
            <Link to="/bookings" className="text-xs font-semibold text-blue-300">
              View all
            </Link>
          }
        />
        <div className="space-y-2.5">
          {recent.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>
      </section>

      <p className="pt-1 text-center text-[11px] text-white/25">
        Lustre · {studio.plan}
      </p>
    </div>
  )
}

/* Local KPI tile with icon chip */
function KpiTile({
  label,
  value,
  icon,
  tone,
  delay,
}: {
  label: string
  value: number
  icon: React.ReactNode
  tone: 'blue' | 'lime' | 'amber' | 'gold'
  delay: number
}) {
  const accent: Record<string, string> = {
    blue: 'text-blue-300 bg-blue/12',
    lime: 'text-lime-soft bg-lime/12',
    amber: 'text-amber bg-amber/12',
    gold: 'text-champagne bg-champagne/12',
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium text-white/50">{label}</span>
          <span className={cx('grid h-8 w-8 place-items-center rounded-xl', accent[tone])}>
            {icon}
          </span>
        </div>
        <div className="mt-2 font-num text-3xl font-bold text-white">
          <CountUp value={value} />
        </div>
      </Card>
    </motion.div>
  )
}
