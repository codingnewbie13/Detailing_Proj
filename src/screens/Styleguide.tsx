import { motion } from 'framer-motion'
import {
  Plus,
  Bell,
  Phone,
  Send,
  Shield,
  Sparkles,
  Droplets,
  Layers,
  ArrowRight,
} from 'lucide-react'
import {
  Card,
  Badge,
  Button,
  IconButton,
  SectionHeader,
  StatTile,
  Progress,
  Avatar,
  CountUp,
} from '../components/ui'
import { inr } from '../lib/format'
import { studio } from '../data/mock'

const swatches = [
  { name: 'Ink 950', hex: '#060608' },
  { name: 'Ink 850', hex: '#0f0f13' },
  { name: 'Ink 700', hex: '#1b1b21' },
  { name: 'Electric Blue', hex: '#2E6BFF' },
  { name: 'Lime', hex: '#A3E635' },
  { name: 'Amber', hex: '#f5b544' },
  { name: 'Rose', hex: '#ff6b6b' },
  { name: 'Champagne', hex: '#d8c08a' },
]

export default function Styleguide() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between pt-2">
        <div>
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-champagne-soft to-champagne-deep">
              <Sparkles size={18} className="text-ink-950" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight">Lustre</span>
          </div>
          <p className="mt-1 text-xs text-white/40">Design System · Phase 0</p>
        </div>
        <div className="flex gap-2">
          <IconButton label="Notifications"><Bell size={18} /></IconButton>
          <IconButton label="Add"><Plus size={18} /></IconButton>
        </div>
      </header>

      {/* Hero brand card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <Card hairline className="p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Detailing Studio OS</p>
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tightest">
            Software your studio is <span className="text-gradient-gold">proud</span> to open.
          </h1>
          <p className="mt-2 text-sm text-white/55">
            {studio.name} · {studio.city}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Button variant="primary" icon={<Plus size={18} />}>New Booking</Button>
            <Button variant="glass" icon={<ArrowRight size={16} />}>Explore</Button>
          </div>
        </Card>
      </motion.div>

      {/* Color system */}
      <section className="space-y-3">
        <SectionHeader title="Color System" />
        <div className="grid grid-cols-4 gap-3">
          {swatches.map((s) => (
            <div key={s.name} className="space-y-1.5">
              <div
                className="h-14 w-full rounded-2xl border border-white/8"
                style={{ background: s.hex }}
              />
              <p className="truncate text-[11px] text-white/50">{s.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stat tiles */}
      <section className="space-y-3">
        <SectionHeader title="Stat Tiles" />
        <div className="grid grid-cols-2 gap-3">
          <StatTile
            label="Today's Revenue"
            tone="lime"
            value={<CountUp value={38500} format={(n) => inr(n)} />}
            delay={0.05}
          />
          <StatTile label="Today's Cars" tone="blue" value={<CountUp value={12} />} delay={0.1} />
          <StatTile label="In Progress" tone="amber" value={<CountUp value={4} />} delay={0.15} />
          <StatTile label="Waiting Pickup" tone="gold" value={<CountUp value={3} />} delay={0.2} />
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-3">
        <SectionHeader title="Status Badges" />
        <div className="flex flex-wrap gap-2">
          <Badge tone="blue" dot>In Progress</Badge>
          <Badge tone="lime" dot>Ready for Pickup</Badge>
          <Badge tone="gold">Delivered</Badge>
          <Badge tone="rose" dot>Delayed</Badge>
          <Badge tone="amber">Payment Pending</Badge>
          <Badge tone="lime">Paid</Badge>
          <Badge tone="neutral">VIP</Badge>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-3">
        <SectionHeader title="Buttons" />
        <div className="flex flex-wrap gap-3">
          <Button variant="primary" icon={<Phone size={16} />}>Call Customer</Button>
          <Button variant="success" icon={<Send size={16} />}>Send WhatsApp</Button>
          <Button variant="gold">Generate Invoice</Button>
          <Button variant="glass">Details</Button>
          <Button variant="danger">Cancel</Button>
        </div>
        <Button variant="primary" size="lg" full icon={<Plus size={20} />}>
          Full-width Action
        </Button>
      </section>

      {/* Service chips + progress */}
      <section className="space-y-3">
        <SectionHeader title="Service Cards & Progress" />
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'PPF', icon: Shield, color: '#2E6BFF', pct: 68 },
            { name: 'Ceramic', icon: Sparkles, color: '#A3E635', pct: 40 },
            { name: 'Wrap', icon: Layers, color: '#d8c08a', pct: 22 },
            { name: 'Wash', icon: Droplets, color: '#f5b544', pct: 90 },
          ].map((s) => (
            <Card key={s.name} className="p-4">
              <div className="flex items-center gap-2.5">
                <div
                  className="grid h-9 w-9 place-items-center rounded-xl"
                  style={{ background: `${s.color}22`, color: s.color }}
                >
                  <s.icon size={18} />
                </div>
                <span className="font-semibold">{s.name}</span>
              </div>
              <div className="mt-3">
                <Progress value={s.pct} tone={s.name === 'Wash' ? 'amber' : s.name === 'Ceramic' ? 'lime' : 'blue'} />
                <p className="mt-1.5 text-[11px] text-white/45">{s.pct}% complete</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Worker row */}
      <section className="space-y-3">
        <SectionHeader title="Worker Row" />
        <Card className="divide-y divide-white/6">
          {[
            { n: 'Arjun Mehta', r: 'PPF Specialist', c: '#2E6BFF', s: 'Working' },
            { n: 'Sahil Khan', r: 'Ceramic Lead', c: '#A3E635', s: 'Working' },
            { n: 'Vikram Rao', r: 'Wash & Prep', c: '#f5b544', s: 'Break' },
          ].map((w) => (
            <div key={w.n} className="flex items-center gap-3 p-3.5">
              <Avatar name={w.n} color={w.c} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{w.n}</p>
                <p className="truncate text-xs text-white/45">{w.r}</p>
              </div>
              <Badge tone={w.s === 'Working' ? 'lime' : 'amber'} dot={w.s === 'Working'}>
                {w.s}
              </Badge>
            </div>
          ))}
        </Card>
      </section>

      <p className="pt-2 text-center text-xs text-white/30">
        Lustre design system · matte black · glass · electric blue · lime
      </p>
    </div>
  )
}
