import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sparkles,
  MessageCircle,
  Clock,
  ReceiptText,
  Hash,
  Crown,
  Bell,
  Users,
  Shield,
  ChevronRight,
  Camera,
  LogOut,
  BadgeIndianRupee,
  RotateCcw,
  UserPlus,
  User,
  Phone,
  Check,
  Trash2,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Card, Badge, Button, Avatar } from '../components/ui'
import { Toggle, Sheet, Field, Select, SegToggle } from '../components/form'
import { studio } from '../data/mock'
import { useWorkers, addWorker, removeWorker, resetStore } from '../lib/store'
import { useWaMode } from '../lib/contact'
import { cx } from '../lib/format'

type Role = 'PPF Specialist' | 'Ceramic Lead' | 'Wash & Prep' | 'Detailer' | 'Paint Correction'
type Access = 'owner' | 'manager' | 'worker'

const roleOptions: { value: Role; label: string }[] = [
  { value: 'PPF Specialist', label: 'PPF Specialist' },
  { value: 'Ceramic Lead', label: 'Ceramic Lead' },
  { value: 'Wash & Prep', label: 'Wash & Prep' },
  { value: 'Detailer', label: 'Detailer' },
  { value: 'Paint Correction', label: 'Paint Correction' },
]

const accessMeta: Record<Access, { label: string; desc: string; tone: 'gold' | 'blue' | 'neutral' }> = {
  owner: { label: 'Owner', desc: 'Full access including revenue & analytics', tone: 'gold' },
  manager: { label: 'Manager', desc: 'Bookings, jobs, inventory & customers', tone: 'blue' },
  worker: { label: 'Worker', desc: 'Only Worker Mode — their assigned jobs', tone: 'neutral' },
}

const avatarColors = ['#2E6BFF', '#A3E635', '#f5b544', '#d8c08a', '#7ea3ff', '#c6f26a']

function accessForRole(role: string): Access {
  return role.includes('Lead') || role.includes('Specialist') ? 'manager' : 'worker'
}

function Row({
  icon,
  label,
  value,
  tone = 'text-white/70',
  right,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  value?: React.ReactNode
  tone?: string
  right?: React.ReactNode
  onClick?: () => void
}) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors active:bg-white/[0.03]">
      <span className={cx('grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/6', tone)}>{icon}</span>
      <span className="flex-1 text-sm font-medium text-white/85">{label}</span>
      {value && <span className="text-sm text-white/45">{value}</span>}
      {right ?? (onClick && <ChevronRight size={17} className="text-white/25" />)}
    </button>
  )
}

export default function Settings() {
  const [notifJobs, setNotifJobs] = useState(true)
  const [notifPay, setNotifPay] = useState(true)
  const [notifReminders, setNotifReminders] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [waMode, setWaMode] = useWaMode()

  // Live staff list from the shared store
  const staff = useWorkers()

  // Add member sheet state
  const [sheetOpen, setSheetOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<Role>('Detailer')
  const [access, setAccess] = useState<Access>('worker')
  const [justAdded, setJustAdded] = useState<string | null>(null)

  function resetForm() {
    setName('')
    setPhone('')
    setRole('Detailer')
    setAccess('worker')
  }

  function addMember() {
    if (!name.trim() || !phone.trim()) return
    const created = addWorker({
      name: name.trim(),
      role,
      avatarColor: avatarColors[staff.length % avatarColors.length],
      status: 'Idle',
      jobsToday: 0,
      phone: phone.trim(),
    })
    setJustAdded(created.id)
    setSheetOpen(false)
    resetForm()
    setTimeout(() => setJustAdded(null), 2500)
  }

  function removeMember(id: string) {
    removeWorker(id)
  }

  const canAdd = name.trim() && phone.trim()

  return (
    <div className="space-y-6">
      <PageHeader title="Profile & Settings" subtitle={studio.name} />

      {/* Business identity */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card hairline className="p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-champagne-soft to-champagne-deep shadow-[0_10px_30px_-8px_rgba(216,192,138,0.6)]">
                <Sparkles size={30} className="text-ink-950" />
              </div>
              <button className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-ink-700 ring-2 ring-ink-950">
                <Camera size={13} className="text-white/70" />
              </button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-xl font-bold">{studio.name}</p>
              <p className="text-sm text-white/45">{studio.city}, India</p>
              <div className="mt-1.5 flex items-center gap-2">
                <Badge tone="gold"><Crown size={11} /> {studio.plan}</Badge>
                <Badge tone="lime" dot>WhatsApp Live</Badge>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Subscription */}
      <Card hairline className="overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-champagne/15 text-champagne">
              <Crown size={20} />
            </div>
            <div>
              <p className="font-semibold">{studio.plan}</p>
              <p className="text-xs text-white/45">Renews 12 Aug 2026 · ₹4,999/mo</p>
            </div>
          </div>
          <Button variant="gold" size="sm">Manage</Button>
        </div>
      </Card>

      {/* Business config */}
      <section className="space-y-2.5">
        <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Business</h3>
        <Card className="divide-y divide-white/6">
          <Row icon={<MessageCircle size={17} />} tone="text-lime-soft" label="WhatsApp Business" right={<Badge tone="lime" dot>Connected</Badge>} />
          <Row icon={<Clock size={17} />} label="Business Hours" value="9:00 AM – 8:00 PM" onClick={() => {}} />
          <Row icon={<BadgeIndianRupee size={17} />} tone="text-champagne" label="GSTIN" value="27ABCDE1234F1Z5" onClick={() => {}} />
          <Row icon={<Hash size={17} />} label="Invoice Prefix" value="MAA-2026-" onClick={() => {}} />
          <Row icon={<ReceiptText size={17} />} label="Tax & Invoicing" onClick={() => {}} />
        </Card>
      </section>

      {/* WhatsApp mode */}
      <section className="space-y-2.5">
        <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">WhatsApp Sending</h3>
        <Card className="p-4">
          <SegToggle
            value={waMode}
            onChange={(v) => setWaMode(v as 'auto' | 'manual')}
            options={[
              { value: 'auto', label: 'Automated (API)' },
              { value: 'manual', label: 'Manual' },
            ]}
          />
          <div className="mt-3 flex items-start gap-2 rounded-2xl bg-white/[0.03] px-3 py-2.5">
            <MessageCircle size={14} className="mt-0.5 shrink-0 text-lime" />
            <p className="text-[12px] leading-snug text-white/55">
              {waMode === 'auto'
                ? 'Messages send automatically via your WhatsApp Business API. Hands-free.'
                : 'No API needed. Tapping Send opens WhatsApp with the message pre-filled, you just hit send.'}
            </p>
          </div>
        </Card>
      </section>

      {/* Notifications */}
      <section className="space-y-2.5">
        <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Notifications</h3>
        <Card className="divide-y divide-white/6">
          <Row icon={<Bell size={17} />} tone="text-blue-300" label="Job status updates" right={<Toggle on={notifJobs} onChange={setNotifJobs} />} />
          <Row icon={<BadgeIndianRupee size={17} />} tone="text-lime-soft" label="Payment alerts" right={<Toggle on={notifPay} onChange={setNotifPay} />} />
          <Row icon={<MessageCircle size={17} />} tone="text-champagne" label="Reminder automations" right={<Toggle on={notifReminders} onChange={setNotifReminders} />} />
          <Row icon={<Sparkles size={17} />} label="Dark mode" right={<Toggle on={darkMode} onChange={setDarkMode} />} />
        </Card>
      </section>

      {/* Staff & roles */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Staff & Roles</h3>
          <span className="text-[11px] text-white/35">{staff.length} members</span>
        </div>
        <Card className="divide-y divide-white/6">
          {staff.map((w) => (
            <motion.div
              key={w.id}
              initial={justAdded === w.id ? { opacity: 0, y: -8 } : false}
              animate={{ opacity: 1, y: 0 }}
              className={cx('group flex items-center gap-3 p-3.5', justAdded === w.id && 'bg-lime/[0.06]')}
            >
              <Avatar name={w.name} color={w.avatarColor} size={38} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{w.name}</p>
                <p className="truncate text-[11px] text-white/40">{w.role}</p>
              </div>
              <Badge tone={accessMeta[accessForRole(w.role)].tone}>{accessMeta[accessForRole(w.role)].label}</Badge>
              <button
                onClick={() => removeMember(w.id)}
                className="grid h-8 w-8 place-items-center rounded-lg text-white/25 transition-colors hover:bg-rose/10 hover:text-rose"
                aria-label={`Remove ${w.name}`}
              >
                <Trash2 size={15} />
              </button>
            </motion.div>
          ))}
          <Row
            icon={<UserPlus size={17} />}
            tone="text-blue-300"
            label="Add team member"
            onClick={() => setSheetOpen(true)}
          />
          <Row icon={<Shield size={17} />} label="Permissions & roles" onClick={() => setSheetOpen(true)} />
        </Card>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="glass" size="lg" icon={<LogOut size={18} />} className="text-rose">
          Sign Out
        </Button>
        <Button
          variant="glass"
          size="lg"
          icon={<RotateCcw size={18} />}
          onClick={() => { if (confirm('Reset all demo data to the original state?')) resetStore() }}
        >
          Reset Demo
        </Button>
      </div>

      <p className="pb-2 text-center text-[11px] text-white/25">Lustre · Detailing Studio OS · v1.0</p>

      {/* -------- Add Team Member sheet -------- */}
      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Add Team Member">
        <div className="space-y-4">
          <Field label="Full Name" value={name} onChange={setName} placeholder="e.g. Rahul Desai" icon={<User size={17} />} />
          <Field label="Phone (WhatsApp login)" value={phone} onChange={setPhone} placeholder="+91 98765 43210" type="tel" icon={<Phone size={17} />} />
          <Select label="Role" value={role} options={roleOptions} onChange={setRole} />

          {/* Access level */}
          <div>
            <SegToggle
              label="Access Level"
              value={access}
              onChange={(v) => setAccess(v as Access)}
              options={[
                { value: 'worker', label: 'Worker' },
                { value: 'manager', label: 'Manager' },
                { value: 'owner', label: 'Owner' },
              ]}
            />
            <div className="mt-2 flex items-start gap-2 rounded-2xl bg-white/[0.03] px-3 py-2.5">
              <Shield size={14} className="mt-0.5 shrink-0 text-blue-300" />
              <p className="text-[12px] leading-snug text-white/55">{accessMeta[access].desc}</p>
            </div>
          </div>

          <Button variant="primary" size="lg" full icon={<Check size={19} />} onClick={addMember} className={!canAdd ? 'pointer-events-none opacity-40' : ''}>
            Add & Send WhatsApp Invite
          </Button>
          <p className="text-center text-[11px] text-white/35">
            They'll get a WhatsApp invite to log in — no app install needed.
          </p>
        </div>
      </Sheet>

      {/* Success toast */}
      {justAdded && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed inset-x-4 bottom-24 z-[60] mx-auto max-w-md"
        >
          <div className="flex items-center gap-3 rounded-2xl glass-strong p-3.5 shadow-float">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-lime/15 text-lime">
              <Check size={18} />
            </div>
            <p className="flex-1 text-sm font-medium">Team member added · invite sent on WhatsApp</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
