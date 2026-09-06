import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User,
  Phone,
  Car,
  Hash,
  Check,
  Send,
  Sparkles,
  MessageCircle,
  CalendarClock,
  Clock,
  IndianRupee,
  Wallet,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Card, Button, Avatar, Badge } from '../components/ui'
import { Field, Select, SegToggle } from '../components/form'
import { serviceMeta } from '../lib/service'
import type { ServiceType, PayStatus } from '../data/mock'
import { studio } from '../data/mock'
import { useWorkers, createBooking } from '../lib/store'
import { inr } from '../lib/format'
import { openWhatsApp, useWaMode } from '../lib/contact'

const serviceOptions = (Object.keys(serviceMeta) as ServiceType[]).map((s) => ({
  value: s,
  label: s,
  color: serviceMeta[s].color,
}))

const priceHint: Record<ServiceType, number> = {
  PPF: 145000,
  Ceramic: 62000,
  Wrap: 210000,
  Wash: 4500,
  Detailing: 18000,
  Correction: 28000,
}

type PayType = 'Full' | 'Advance' | 'Unpaid'

const timeOptions = [
  '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM',
  '3:00 PM', '4:00 PM', '5:00 PM', '6:30 PM', '7:30 PM',
].map((t) => ({ value: t, label: t }))

function todayISO(offsetDays = 0) {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

function prettyDate(iso: string) {
  if (!iso) return ''
  const d = new Date(iso + 'T00:00:00')
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000)
  const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  if (diff === 0) return `Today, ${label}`
  if (diff === 1) return `Tomorrow, ${label}`
  return label
}

export default function NewBooking() {
  const nav = useNavigate()
  const workers = useWorkers()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [car, setCar] = useState('')
  const [reg, setReg] = useState('')
  const [service, setService] = useState<ServiceType>('Ceramic')
  const [date, setDate] = useState(todayISO(1))
  const [time, setTime] = useState('4:00 PM')
  const [worker, setWorker] = useState(workers[0]?.id ?? '')
  const [payType, setPayType] = useState<PayType>('Unpaid')
  const [amountStr, setAmountStr] = useState('')
  const [paidStr, setPaidStr] = useState('')
  const [created, setCreated] = useState(false)
  const [waMode] = useWaMode()
  const [createdJobId, setCreatedJobId] = useState<string | null>(null)

  // Total amount: prefilled from service, but editable
  const amount = amountStr.trim() ? Math.max(0, parseFloat(amountStr) || 0) : priceHint[service]
  const paidNow =
    payType === 'Full' ? amount : payType === 'Advance' ? Math.min(amount, Math.max(0, parseFloat(paidStr) || 0)) : 0
  const balance = Math.max(0, amount - paidNow)
  const pay: PayStatus = balance <= 0 && amount > 0 ? 'Paid' : 'Pending'
  const eta = `${prettyDate(date)} · ${time}`
  const assigned = workers.find((w) => w.id === worker)!

  const waMessage = useMemo(() => {
    const first = name.trim().split(' ')[0] || 'there'
    const payLine =
      pay === 'Paid'
        ? `💳 Payment: Paid ✅ ${inr(amount)}`
        : paidNow > 0
        ? `💳 Paid: ${inr(paidNow)} · Balance: ${inr(balance)}`
        : `💳 Amount: ${inr(amount)} (due at delivery)`
    return `Hello ${first}! ✨ Your ${service} booking at ${studio.name} is confirmed.

🚗 ${car || 'Your car'}${reg ? ` (${reg})` : ''}
🛠️ Service: ${serviceMeta[service].label}
📅 Ready by: ${eta}
${payLine}

We'll keep you updated at every step. Thank you for choosing us!`
  }, [name, car, reg, service, eta, pay, paidNow, balance, amount])

  const canCreate = name.trim() && phone.trim() && car.trim()

  function persistBooking() {
    if (createdJobId) return createdJobId
    const job = createBooking({
      name: name.trim(),
      phone: phone.trim(),
      car: car.trim(),
      reg: reg.trim(),
      service,
      eta,
      workerId: worker,
      pay,
      amount,
      paidAmount: paidNow,
    })
    setCreatedJobId(job.id)
    return job.id
  }

  function sendConfirmation() {
    if (!canCreate) return
    persistBooking()
    if (waMode === 'manual') {
      openWhatsApp(phone, waMessage)
    }
    setCreated(true)
  }

  function createOnly() {
    if (!canCreate) return
    persistBooking()
    setCreated(true)
  }

  // Notify the assigned worker on WhatsApp with a link to their task
  function notifyWorker() {
    const jobId = persistBooking()
    const link = `${window.location.origin}/worker/${worker}`
    const msg = `👋 Hi ${assigned?.name.split(' ')[0]}, new job assigned at ${studio.name}:
🚗 ${car} ${reg ? `(${reg})` : ''}
🛠️ ${serviceMeta[service].label}
📅 Deliver by ${eta}

Open your tasks to start 👉 ${link}`
    if (assigned?.phone) openWhatsApp(assigned.phone, msg)
    setCreated(true)
    void jobId
  }

  return (
    <div className="space-y-6">
      <PageHeader title="New Booking" subtitle="Create a job in under 30 seconds" />

      {/* Form */}
      <Card className="space-y-4 p-4">
        <div className="grid grid-cols-1 gap-3.5">
          <Field label="Customer Name" value={name} onChange={setName} placeholder="Aditya Kapoor" icon={<User size={17} />} />
          <Field label="Phone (WhatsApp)" value={phone} onChange={setPhone} placeholder="+91 98200 11223" type="tel" icon={<Phone size={17} />} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Car" value={car} onChange={setCar} placeholder="BMW X5" icon={<Car size={17} />} />
            <Field label="Reg. No." value={reg} onChange={setReg} placeholder="MH01 AK 4321" icon={<Hash size={17} />} />
          </div>
          <Select label="Service" value={service} options={serviceOptions} onChange={setService} />

          {/* Delivery date + time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="mb-1.5 block px-1 text-[12px] font-medium text-white/50">Delivery Date</span>
              <div className="flex items-center gap-2.5 rounded-2xl glass px-3.5 focus-within:ring-1 focus-within:ring-blue/40">
                <CalendarClock size={17} className="text-white/35" />
                <input
                  type="date"
                  value={date}
                  min={todayISO(0)}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-12 w-full bg-transparent text-[15px] text-white focus:outline-none [color-scheme:dark]"
                />
              </div>
            </div>
            <Select label="Time" value={time} options={timeOptions} onChange={setTime} />
          </div>
          <div className="flex items-center gap-2 px-1 text-[11px] text-white/40">
            <Clock size={12} /> Ready by {eta}
          </div>
        </div>

        {/* Quick date chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {[
            { label: 'Today', v: todayISO(0) },
            { label: 'Tomorrow', v: todayISO(1) },
            { label: 'In 2 days', v: todayISO(2) },
            { label: 'In 3 days', v: todayISO(3) },
          ].map((d) => (
            <button
              key={d.v}
              onClick={() => setDate(d.v)}
              className={`shrink-0 rounded-xl border px-3 py-1.5 text-[12px] font-semibold transition-all active:scale-95 ${
                date === d.v ? 'border-blue/40 bg-blue/10 text-blue-300' : 'border-white/8 bg-white/[0.03] text-white/60'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Worker assignment */}
        <div>
          <span className="mb-1.5 block px-1 text-[12px] font-medium text-white/50">Assign Worker</span>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {workers.map((w) => {
              const active = w.id === worker
              return (
                <button
                  key={w.id}
                  onClick={() => setWorker(w.id)}
                  className={`flex shrink-0 items-center gap-2.5 rounded-2xl border px-3 py-2 transition-all active:scale-95 ${
                    active ? 'border-blue/40 bg-blue/10' : 'border-white/8 bg-white/[0.03]'
                  }`}
                >
                  <Avatar name={w.name} color={w.avatarColor} size={30} />
                  <div className="text-left">
                    <p className="text-[13px] font-semibold leading-tight">{w.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-white/40">{w.role}</p>
                  </div>
                  {active && <Check size={15} className="text-blue-300" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Payment */}
        <div className="space-y-3">
          <Field
            label="Total Amount (₹)"
            value={amountStr}
            onChange={(v) => setAmountStr(v.replace(/[^\d]/g, ''))}
            placeholder={String(priceHint[service])}
            type="tel"
            icon={<IndianRupee size={17} />}
            hint={`Suggested for ${service}: ${inr(priceHint[service])}`}
          />

          <SegToggle
            label="Payment"
            value={payType}
            onChange={setPayType}
            options={[
              { value: 'Unpaid', label: 'Pay Later', tone: 'amber' },
              { value: 'Advance', label: 'Advance', tone: 'blue' },
              { value: 'Full', label: 'Full Paid', tone: 'lime' },
            ]}
          />

          {payType === 'Advance' && (
            <Field
              label="Advance Paid Now (₹)"
              value={paidStr}
              onChange={(v) => setPaidStr(v.replace(/[^\d]/g, ''))}
              placeholder="e.g. 20000"
              type="tel"
              icon={<Wallet size={17} />}
            />
          )}

          {/* Payment summary */}
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl glass px-3 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-wide text-white/40">Total</p>
              <p className="font-num text-base font-bold text-white">{inr(amount, { compact: amount >= 100000 })}</p>
            </div>
            <div className="rounded-2xl bg-lime/[0.08] px-3 py-2.5 text-center">
              <p className="text-[10px] uppercase tracking-wide text-lime-soft/70">Paid Now</p>
              <p className="font-num text-base font-bold text-lime-soft">{inr(paidNow, { compact: paidNow >= 100000 })}</p>
            </div>
            <div className={`rounded-2xl px-3 py-2.5 text-center ${balance > 0 ? 'bg-amber/[0.08]' : 'glass'}`}>
              <p className="text-[10px] uppercase tracking-wide text-white/40">Balance</p>
              <p className={`font-num text-base font-bold ${balance > 0 ? 'text-amber' : 'text-white/50'}`}>{inr(balance, { compact: balance >= 100000 })}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Live WhatsApp preview */}
      <section className="space-y-2.5">
        <div className="flex items-center gap-2 px-1">
          <MessageCircle size={15} className="text-lime" />
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">
            WhatsApp Confirmation Preview
          </h3>
        </div>

        <Card className="p-3">
          <div className="rounded-2xl bg-[#0b141a] p-1">
            {/* WA header */}
            <div className="flex items-center gap-2.5 rounded-t-2xl bg-[#1f2c33] px-3 py-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-champagne-soft to-champagne-deep">
                <Sparkles size={16} className="text-ink-950" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-white">{studio.name}</p>
                <p className="text-[10px] text-lime">● online</p>
              </div>
              <span className="text-[10px] text-white/40">Business</span>
            </div>
            {/* WA bubble */}
            <div className="min-h-[180px] space-y-2 rounded-b-2xl bg-[#0b141a] p-3 [background-image:radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:16px_16px]">
              <motion.div
                key={waMessage}
                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-[#005c4b] px-3 py-2 shadow"
              >
                <p className="whitespace-pre-line text-[13px] leading-relaxed text-white/95">{waMessage}</p>
                <div className="mt-1 flex items-center justify-end gap-1">
                  <span className="text-[10px] text-white/50">now</span>
                  <Check size={12} className="text-sky-300" />
                  <Check size={12} className="-ml-2.5 text-sky-300" />
                </div>
              </motion.div>
            </div>
          </div>
        </Card>
      </section>

      {/* Actions */}
      <div className="space-y-3">
        {created ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
            <Card hairline className="flex items-center gap-3 p-4">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-lime/15 text-lime">
                <Check size={22} />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Booking created</p>
                <p className="text-xs text-white/45">Job added · customer confirmation ready</p>
              </div>
              <Badge tone="lime" dot>Live</Badge>
            </Card>

            {/* Notify the assigned worker with a link to start */}
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Avatar name={assigned.name} color={assigned.avatarColor} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{assigned.name}</p>
                  <p className="truncate text-[11px] text-white/45">{assigned.role} · {assigned.phone}</p>
                </div>
              </div>
              <Button variant="success" full className="mt-3" icon={<Send size={17} />} onClick={notifyWorker}>
                Send Job to Worker on WhatsApp
              </Button>
              <p className="mt-2 text-center text-[11px] text-white/35">
                He gets a WhatsApp with a link that opens his tasks to start work.
              </p>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="glass" onClick={() => nav('/')}>Dashboard</Button>
              <Button variant="primary" onClick={() => createdJobId && nav(`/job/${createdJobId}`)}>View Job</Button>
            </div>
          </motion.div>
        ) : (
          <>
            <Button
              variant="primary"
              size="lg"
              full
              icon={<Check size={20} />}
              onClick={createOnly}
              className={!canCreate ? 'pointer-events-none opacity-40' : ''}
            >
              Create Booking
            </Button>
            <Button
              variant="success"
              size="lg"
              full
              icon={<Send size={19} />}
              onClick={sendConfirmation}
              className={!canCreate ? 'pointer-events-none opacity-40' : ''}
            >
              {waMode === 'manual' ? 'Create & Open WhatsApp' : 'Create & Send WhatsApp'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
