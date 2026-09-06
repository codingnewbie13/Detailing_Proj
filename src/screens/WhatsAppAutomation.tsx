import { motion } from 'framer-motion'
import {
  MessageCircle,
  Check,
  CheckCheck,
  Clock,
  Zap,
  Sparkles,
  CalendarCheck,
  Wrench,
  Car,
  PackageCheck,
  HeartHandshake,
  ShieldCheck,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Card, Badge } from '../components/ui'
import { cx } from '../lib/format'
import { useWaMode } from '../lib/contact'

type Step = {
  title: string
  msg: string
  icon: typeof MessageCircle
  state: 'sent' | 'live' | 'scheduled'
  when: string
}

const steps: Step[] = [
  { title: 'Booking Created', msg: 'Your booking is received. Welcome to Monarch Auto Atelier!', icon: CalendarCheck, state: 'sent', when: 'Day 0 · 9:12 AM' },
  { title: 'Confirmation Sent', msg: 'Booking confirmed ✅ Ceramic Coating · Ready by 6:30 PM.', icon: Check, state: 'sent', when: 'Day 0 · 9:12 AM' },
  { title: 'Job Started', msg: 'Work has started on your car 🚗 We will keep you posted.', icon: Wrench, state: 'sent', when: 'Day 0 · 9:45 AM' },
  { title: 'Car Ready', msg: 'Your car is ready for pickup ✨ Looking spotless!', icon: Car, state: 'live', when: 'Now' },
  { title: 'Delivered', msg: 'Thank you! Hope you love the finish. Rate us ⭐', icon: PackageCheck, state: 'scheduled', when: 'On delivery' },
  { title: '30-Day Checkup', msg: 'How is the coating holding up? Book a free inspection.', icon: HeartHandshake, state: 'scheduled', when: 'in 30 days' },
  { title: '180-Day Maintenance', msg: 'Time for your maintenance service to keep protection at its best.', icon: ShieldCheck, state: 'scheduled', when: 'in 180 days' },
]

const stateMeta = {
  sent: { color: '#A3E635', badge: 'lime' as const, label: 'Sent' },
  live: { color: '#2E6BFF', badge: 'blue' as const, label: 'Sending now' },
  scheduled: { color: '#d8c08a', badge: 'gold' as const, label: 'Scheduled' },
}

export default function WhatsAppAutomation() {
  const [waMode] = useWaMode()
  const sent = steps.filter((s) => s.state === 'sent').length
  const scheduled = steps.filter((s) => s.state === 'scheduled').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="WhatsApp Automation"
        subtitle="Every customer, every step — automatic"
        right={
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-lime/15 text-lime">
            <MessageCircle size={19} />
          </div>
        }
      />

      {/* Live status card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card hairline className="relative overflow-hidden p-5">
          <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-lime/10 blur-3xl" />
          <div className="flex items-center gap-2">
            <span className="flex h-6 items-center gap-1.5 rounded-full bg-lime/15 px-2.5 text-[11px] font-semibold text-lime">
              <Zap size={12} /> {waMode === 'manual' ? 'Manual Send' : 'Automation Live'}
            </span>
          </div>
          <p className="mt-3 font-display text-2xl font-bold leading-tight">
            {waMode === 'manual' ? (
              <><span className="text-gradient-gold">One-tap messages.</span><br />No API needed.</>
            ) : (
              <><span className="text-gradient-gold">Zero manual messages.</span><br />100% follow-up.</>
            )}
          </p>
          <div className="mt-4 flex gap-6 border-t border-white/6 pt-3.5">
            <div>
              <p className="font-num text-2xl font-bold text-lime-soft">{sent}</p>
              <p className="text-[11px] text-white/45">sent today</p>
            </div>
            <div>
              <p className="font-num text-2xl font-bold text-champagne">{scheduled}</p>
              <p className="text-[11px] text-white/45">scheduled</p>
            </div>
            <div>
              <p className="font-num text-2xl font-bold text-blue-300">62%</p>
              <p className="text-[11px] text-white/45">rebook rate</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Cinematic journey timeline */}
      <section className="space-y-3">
        <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Customer Journey</h3>
        <div className="relative pl-2">
          {steps.map((step, i) => {
            const meta = stateMeta[step.state]
            const Icon = step.icon
            const last = i === steps.length - 1
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="relative flex gap-4 pb-5 last:pb-0"
              >
                {/* connector line */}
                {!last && (
                  <span
                    className="absolute left-[21px] top-11 h-full w-[2px] rounded"
                    style={{
                      background:
                        step.state === 'sent'
                          ? 'linear-gradient(#A3E635aa, #A3E63533)'
                          : 'rgba(255,255,255,0.08)',
                    }}
                  />
                )}

                {/* node */}
                <div className="relative z-10 shrink-0">
                  <div
                    className={cx(
                      'grid h-11 w-11 place-items-center rounded-2xl border transition-all',
                      step.state === 'live' && 'animate-pulseSoft',
                    )}
                    style={{
                      background: `${meta.color}1a`,
                      borderColor: `${meta.color}55`,
                      color: meta.color,
                      boxShadow: step.state === 'live' ? `0 0 24px -4px ${meta.color}88` : 'none',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                </div>

                {/* content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{step.title}</p>
                    <Badge tone={meta.badge} dot={step.state === 'live'}>{meta.label}</Badge>
                  </div>

                  {/* WA mini-bubble */}
                  <div className="mt-2 flex items-start gap-2 rounded-2xl rounded-tl-md bg-[#005c4b]/90 px-3 py-2">
                    <MessageCircle size={13} className="mt-0.5 shrink-0 text-white/70" />
                    <p className="text-[13px] leading-snug text-white/95">{step.msg}</p>
                  </div>

                  <div className="mt-1.5 flex items-center gap-1.5 pl-1 text-[11px] text-white/35">
                    {step.state === 'sent' ? (
                      <><CheckCheck size={13} className="text-sky-400" /> {step.when}</>
                    ) : step.state === 'live' ? (
                      <><Check size={13} className="text-white/50" /> {step.when}</>
                    ) : (
                      <><Clock size={12} /> {step.when}</>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </section>

      <Card className="flex items-center gap-3 p-4">
        <Sparkles size={18} className="shrink-0 text-champagne" />
        <p className="text-xs text-white/55">
          Owners save 2+ hours daily. Customers feel cared for, so they come back. This is how detailing studios grow revenue without extra staff.
        </p>
      </Card>
    </div>
  )
}
