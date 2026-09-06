import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Users, ChevronRight, Search, BellRing } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Card, Badge, Avatar } from '../components/ui'
import { useCustomers } from '../lib/store'
import { inr } from '../lib/format'

const tierTone = { VIP: 'gold', Regular: 'blue', New: 'lime' } as const

export default function Customers() {
  const customers = useCustomers()
  const withReminders = customers.filter((c) => c.nextReminder)
  const totalLifetime = customers.reduce((s, c) => s + c.lifetime, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} clients · ${inr(totalLifetime, { compact: true })} lifetime`}
        right={
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-champagne/15 text-champagne">
            <Users size={19} />
          </div>
        }
      />

      {/* Search (decorative for demo) */}
      <div className="flex items-center gap-2.5 rounded-2xl glass px-3.5">
        <Search size={17} className="text-white/35" />
        <input
          placeholder="Search name, phone, car..."
          className="h-11 w-full bg-transparent text-[15px] placeholder:text-white/25 focus:outline-none"
        />
      </div>

      {/* Reminders due */}
      {withReminders.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <BellRing size={15} className="text-amber" />
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">
              Reminders Due · Bring Them Back
            </h3>
          </div>
          <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
            {withReminders.map((c) => (
              <Link key={c.id} to={`/customer/${c.id}`} className="shrink-0">
                <Card className="w-56 p-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={c.name} color="#d8c08a" size={36} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{c.name}</p>
                      <p className="truncate text-[11px] text-white/40">{c.cars[0].model}</p>
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-amber/10 px-2.5 py-1.5">
                    <BellRing size={12} className="shrink-0 text-amber" />
                    <span className="truncate text-[11px] text-amber">{c.nextReminder}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All customers */}
      <section className="space-y-3">
        <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">All Customers</h3>
        <div className="space-y-2.5">
          {customers.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/customer/${c.id}`}>
                <Card className="flex items-center gap-3.5 p-3.5 transition-all active:scale-[0.99]">
                  <Avatar name={c.name} color={c.tier === 'VIP' ? '#d8c08a' : c.tier === 'New' ? '#A3E635' : '#2E6BFF'} size={48} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-semibold">{c.name}</p>
                      <Badge tone={tierTone[c.tier]}>{c.tier}</Badge>
                    </div>
                    <p className="truncate text-xs text-white/45">
                      {c.cars.length} car{c.cars.length > 1 ? 's' : ''} · {c.services.join(', ')}
                    </p>
                    <p className="mt-1 text-[11px] text-white/30">Last visit {c.lastVisitDays}d ago</p>
                  </div>
                  <div className="text-right">
                    <p className="font-num text-base font-bold text-white">{inr(c.lifetime, { compact: true })}</p>
                    <p className="text-[10px] text-white/30">lifetime</p>
                  </div>
                  <ChevronRight size={18} className="text-white/25" />
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
