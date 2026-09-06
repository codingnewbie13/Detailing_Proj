import { useParams, Navigate, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Phone,
  Send,
  CalendarPlus,
  FileText,
  Car,
  Star,
  BellRing,
  Clock,
  Wallet,
  Repeat,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Card, Badge, Button, Avatar } from '../components/ui'
import { useCustomers } from '../lib/store'
import { serviceMeta } from '../lib/service'
import { inr } from '../lib/format'
import { openWhatsApp, openCall } from '../lib/contact'

const tierTone = { VIP: 'gold', Regular: 'blue', New: 'lime' } as const

const invoiceHistory = [
  { service: 'Ceramic Coating 9H', date: '14 Jun 2026', amount: 62000, paid: true },
  { service: 'Full Body PPF', date: '02 Mar 2026', amount: 145000, paid: true },
  { service: 'Premium Wash + Interior', date: '18 Jan 2026', amount: 8500, paid: true },
]

export default function CustomerHistory() {
  const { id } = useParams()
  const nav = useNavigate()
  const customers = useCustomers()
  const c = customers.find((x) => x.id === id)
  if (!c) return <Navigate to="/customers" replace />

  const accent = c.tier === 'VIP' ? '#d8c08a' : c.tier === 'New' ? '#A3E635' : '#2E6BFF'

  return (
    <div className="space-y-6">
      <PageHeader title={c.name} subtitle={c.phone} right={<Badge tone={tierTone[c.tier]}>{c.tier}</Badge>} />

      {/* Profile hero */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card hairline className="p-5">
          <div className="flex items-center gap-4">
            <Avatar name={c.name} color={accent} size={60} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xl font-bold">{c.name}</p>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {c.services.map((s) => (
                  <span key={s} className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: `${serviceMeta[s].color}1f`, color: serviceMeta[s].color }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Stat row */}
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-white/6 pt-4">
            <Stat icon={<Wallet size={15} />} label="Lifetime" value={inr(c.lifetime, { compact: true })} tone="text-lime-soft" />
            <Stat icon={<Repeat size={15} />} label="Visits" value={String(c.visits)} tone="text-blue-300" />
            <Stat icon={<Clock size={15} />} label="Last visit" value={`${c.lastVisitDays}d`} tone="text-champagne" />
          </div>
        </Card>
      </motion.div>

      {/* Upcoming reminder */}
      {c.nextReminder && (
        <Card className="flex items-center gap-3 border border-amber/25 bg-amber/[0.06] p-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber/15 text-amber">
            <BellRing size={19} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-amber">Upcoming Reminder</p>
            <p className="text-xs text-white/55">{c.nextReminder}</p>
          </div>
          <Button
            variant="gold"
            size="sm"
            icon={<Send size={14} />}
            onClick={() => openWhatsApp(c.phone, `Hi ${c.name.split(' ')[0]}, a friendly reminder from Monarch Auto Atelier: ${c.nextReminder}. Reply to book your slot!`)}
          >
            Send
          </Button>
        </Card>
      )}

      {/* Cars owned */}
      <section className="space-y-3">
        <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Cars Owned</h3>
        <div className="space-y-2.5">
          {c.cars.map((car) => (
            <Card key={car.reg} className="flex items-center gap-3.5 p-3.5">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/6 text-white/70">
                <Car size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{car.model}</p>
                <p className="text-xs text-white/40">{car.reg}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Invoice history */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Invoice History</h3>
          <span className="text-[11px] text-white/35">{invoiceHistory.length} invoices</span>
        </div>
        <Card className="divide-y divide-white/6">
          {invoiceHistory.map((inv, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/6 text-white/60">
                <FileText size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{inv.service}</p>
                <p className="text-[11px] text-white/40">{inv.date}</p>
              </div>
              <div className="text-right">
                <p className="font-num text-sm font-semibold">{inr(inv.amount)}</p>
                <Badge tone="lime">Paid</Badge>
              </div>
            </div>
          ))}
        </Card>
      </section>

      {/* Review */}
      <Card className="p-4">
        <div className="flex items-center gap-1 text-champagne">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} fill="currentColor" />
          ))}
        </div>
        <p className="mt-2 text-sm text-white/70">
          "Exceptional finish on my {c.cars[0].model}. The team kept me updated on WhatsApp at every step. Truly premium."
        </p>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="primary" size="lg" icon={<CalendarPlus size={18} />} onClick={() => nav('/bookings')}>Book Again</Button>
        <Button
          variant="success"
          size="lg"
          icon={<Send size={18} />}
          onClick={() => openWhatsApp(c.phone, `Hello ${c.name.split(' ')[0]}! Greetings from Monarch Auto Atelier. `)}
        >
          WhatsApp
        </Button>
        <Button
          variant="glass"
          size="lg"
          full
          className="col-span-2"
          icon={<Phone size={18} />}
          onClick={() => openCall(c.phone)}
        >
          Call Customer
        </Button>
      </div>

      <div className="text-center">
        <Link to="/whatsapp" className="text-xs font-semibold text-blue-300">View WhatsApp automation journey →</Link>
      </div>
    </div>
  )
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <div className="text-center">
      <span className={`mx-auto flex items-center justify-center gap-1 ${tone}`}>{icon}</span>
      <p className={`mt-1 font-num text-lg font-bold ${tone}`}>{value}</p>
      <p className="text-[10px] text-white/40">{label}</p>
    </div>
  )
}
