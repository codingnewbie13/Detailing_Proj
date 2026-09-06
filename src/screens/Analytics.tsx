import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import {
  BarChart3,
  TrendingUp,
  Repeat,
  Receipt,
  ArrowUpRight,
  Trophy,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Card, CountUp } from '../components/ui'
import { SegToggle as Seg } from '../components/form'
import { revenueSeries, topServices } from '../data/mock'
import { useJobs } from '../lib/store'
import { inr, cx } from '../lib/format'

type Range = 'today' | 'week' | 'month'

const ranges = {
  today: { revenue: 38500, delta: 18, cars: 12 },
  week: { revenue: 366500, delta: 12, cars: 74 },
  month: { revenue: 1485000, delta: 24, cars: 312 },
}

function ChartTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-white/10 bg-ink-800/95 px-3 py-2 shadow-float backdrop-blur">
      <p className="font-num text-sm font-bold text-white">{inr(payload[0].value)}</p>
    </div>
  )
}

export default function Analytics() {
  const [range, setRange] = useState<Range>('week')
  const jobs = useJobs()

  // Today's figures come live from the store; week/month stay as demo aggregates
  const todayRevenue = jobs.filter((j) => j.pay === 'Paid').reduce((s, j) => s + (j.paidAmount ?? j.amount), 0)
  const liveRanges = {
    ...ranges,
    today: { revenue: todayRevenue, delta: 18, cars: jobs.length },
  }
  const r = liveRanges[range]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Revenue, retention & top services"
        right={
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-blue/15 text-blue-300">
            <BarChart3 size={19} />
          </div>
        }
      />

      {/* Range toggle */}
      <Seg
        value={range}
        onChange={(v) => setRange(v as Range)}
        options={[
          { value: 'today', label: 'Today' },
          { value: 'week', label: 'Weekly' },
          { value: 'month', label: 'Monthly' },
        ]}
      />

      {/* Revenue hero + area chart */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card hairline className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-white/45">
                {range === 'today' ? "Today's" : range === 'week' ? 'Weekly' : 'Monthly'} Revenue
              </p>
              <div className="mt-1 font-num text-4xl font-extrabold tracking-tightest">
                <CountUp key={range} value={r.revenue} format={(n) => inr(n)} />
              </div>
            </div>
            <span className="mt-1 flex items-center gap-1 rounded-full bg-lime/15 px-2.5 py-1 text-[12px] font-semibold text-lime">
              <ArrowUpRight size={13} /> {r.delta}%
            </span>
          </div>

          <div className="mt-4 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries} margin={{ top: 6, right: 4, left: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2E6BFF" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#2E6BFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 11 }} />
                <YAxis hide />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.15)' }} />
                <Area type="monotone" dataKey="v" stroke="#5583ff" strokeWidth={2.5} fill="url(#rev)" dot={{ r: 3, fill: '#5583ff' }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* Metric tiles */}
      <div className="grid grid-cols-2 gap-3">
        <Metric icon={<Receipt size={17} />} label="Avg Ticket Size" value={inr(48200)} tone="text-champagne" delay={0.05} />
        <Metric icon={<Repeat size={17} />} label="Repeat Customers" value="62%" tone="text-lime-soft" delay={0.1} />
        <Metric icon={<TrendingUp size={17} />} label="Cars Served" value={String(r.cars)} tone="text-blue-300" delay={0.15} />
        <Metric icon={<Trophy size={17} />} label="Best Day" value="Saturday" tone="text-amber" delay={0.2} />
      </div>

      {/* Top services */}
      <section className="space-y-3">
        <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Top Services</h3>
        <Card className="p-4">
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topServices} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} width={64} />
                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.04)' }} content={({ active, payload }: any) => active && payload?.length ? (
                  <div className="rounded-xl border border-white/10 bg-ink-800/95 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur">{payload[0].value}%</div>
                ) : null} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={20}>
                  {topServices.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5">
            {topServices.map((s) => (
              <div key={s.name} className="flex items-center gap-1.5 text-[11px] text-white/55">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                {s.name} · {s.value}%
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Revenue by service bars (extra premium touch) */}
      <Card className="p-4">
        <p className="mb-3 text-[13px] font-semibold text-white/70">Revenue vs Target</p>
        <div className="space-y-3">
          {[
            { label: 'This month', value: 1485000, target: 1500000, tone: '#2E6BFF' },
            { label: 'Target', value: 1500000, target: 1500000, tone: '#A3E635' },
          ].map((row) => (
            <div key={row.label}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-white/55">{row.label}</span>
                <span className="font-num font-semibold">{inr(row.value, { compact: true })}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/8">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${Math.min(100, (row.value / row.target) * 100)}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full"
                  style={{ background: row.tone }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-white/40">99% to monthly target. On track for a record month.</p>
      </Card>
    </div>
  )
}

function Metric({ icon, label, value, tone, delay }: { icon: React.ReactNode; label: string; value: string; tone: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium text-white/50">{label}</span>
          <span className={cx('opacity-80', tone)}>{icon}</span>
        </div>
        <p className={cx('mt-2 font-num text-2xl font-bold', tone)}>{value}</p>
      </Card>
    </motion.div>
  )
}
