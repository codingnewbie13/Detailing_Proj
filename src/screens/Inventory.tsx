import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Boxes,
  AlertTriangle,
  ShoppingCart,
  TrendingDown,
  Shield,
  Sparkles,
  Layers,
  Droplets,
  Package,
  FlaskConical,
  Plus,
  Check,
  PackagePlus,
} from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Card, Badge, Button, Progress, IconButton } from '../components/ui'
import { Sheet, Field, Select } from '../components/form'
import { type StockItem } from '../data/mock'
import { useStock, useJobs, useWorkers, addStockItem, restockItem as restockAction } from '../lib/store'
import { cx } from '../lib/format'

const itemIcon: Record<string, typeof Shield> = {
  s1: Shield,
  s2: Sparkles,
  s3: Layers,
  s4: Droplets,
  s5: FlaskConical,
}

const unitOptions = [
  { value: 'm', label: 'metres (m)' },
  { value: 'bottles', label: 'bottles' },
  { value: 'units', label: 'units' },
  { value: 'pcs', label: 'pieces (pcs)' },
  { value: 'L', label: 'litres (L)' },
  { value: 'kg', label: 'kilograms (kg)' },
]

const demoUsage = [
  { item: 'PPF Roll (Gloss)', qty: '3.2 m', job: 'BMW X5 · PPF', worker: 'Arjun', time: '11:20 AM' },
  { item: 'Ceramic Coating 9H', qty: '1 bottle', job: 'Mercedes C220', worker: 'Sahil', time: '10:05 AM' },
  { item: 'Microfiber Cloths', qty: '6 pcs', job: 'Fortuner · Wash', worker: 'Vikram', time: '9:40 AM' },
  { item: 'IPA Solution', qty: '0.8 L', job: 'Audi RS5 · Wrap', worker: 'Imran', time: '9:15 AM' },
]

export default function Inventory() {
  const stock = useStock()
  const jobs = useJobs()
  const workers = useWorkers()
  const [addOpen, setAddOpen] = useState(false)
  const [restockId, setRestockId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  // Add item form
  const [name, setName] = useState('')
  const [unit, setUnit] = useState('units')
  const [qty, setQty] = useState('')
  const [cap, setCap] = useState('')

  // Restock form
  const [restockAmt, setRestockAmt] = useState('')

  const lowItems = stock.filter((s) => s.low)
  const restockItem = stock.find((s) => s.id === restockId)

  // Live usage feed from finished jobs (worker-logged), newest first, then demo
  const liveUsage = jobs
    .filter((j) => j.materialsUsed && j.materialsUsed.length > 0)
    .flatMap((j) => {
      const w = workers.find((x) => x.id === j.workerId)
      return (j.materialsUsed ?? []).map((m) => ({
        item: m.name,
        qty: `${m.qty} ${m.unit}`,
        job: `${j.car} ${j.model} · ${j.service}`,
        worker: w?.name.split(' ')[0] ?? 'Worker',
        time: j.createdAtLabel ?? 'today',
      }))
    })
  const usageFeed = [...liveUsage, ...demoUsage]

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  function resetAdd() {
    setName(''); setUnit('units'); setQty(''); setCap('')
  }

  function addItem() {
    const q = parseFloat(qty)
    const c = parseFloat(cap) || q
    if (!name.trim() || isNaN(q)) return
    addStockItem({
      name: name.trim(),
      unit,
      remaining: q,
      capacity: c,
      low: q / c < 0.35,
      usedToday: '0',
    })
    setAddOpen(false)
    resetAdd()
    showToast('Item added to inventory')
  }

  function doRestock() {
    const add = parseFloat(restockAmt)
    if (!restockItem || isNaN(add) || add <= 0) return
    restockAction(restockItem.id, add)
    setRestockId(null)
    setRestockAmt('')
    showToast(`Restocked ${restockItem.name}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        subtitle="Live stock · auto-deducted per job"
        right={
          <IconButton label="Add item" onClick={() => setAddOpen(true)}>
            <Plus size={18} />
          </IconButton>
        }
      />

      {/* Low stock alert */}
      {lowItems.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border border-amber/25 bg-amber/[0.06] p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber/15 text-amber">
                <AlertTriangle size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-amber">Low Stock Alert</p>
                <p className="mt-0.5 text-sm text-white/60">
                  {lowItems.map((i) => i.name.replace(/\s*\(.*\)/, '')).join(', ')} running low.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button variant="gold" size="sm" icon={<ShoppingCart size={15} />} onClick={() => showToast('Reorder request sent to supplier')}>
                    Order Now
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => showToast('Alert snoozed for 24h')}>Snooze</Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Current stock */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Current Stock</h3>
          <span className="text-[11px] text-white/35">{stock.length} items</span>
        </div>
        <div className="space-y-2.5">
          {stock.map((s, i) => {
            const Icon = itemIcon[s.id] ?? Package
            const pct = Math.round((s.remaining / s.capacity) * 100)
            const tone = s.low ? 'rose' : pct < 40 ? 'amber' : 'lime'
            return (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={cx('grid h-11 w-11 shrink-0 place-items-center rounded-2xl', s.low ? 'bg-rose/15 text-rose' : 'bg-white/6 text-white/70')}>
                      <Icon size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="truncate font-semibold">{s.name}</p>
                        {s.low && <Badge tone="rose" dot>Low</Badge>}
                      </div>
                      <p className="text-xs text-white/40">Used today: {s.usedToday}{s.usedToday !== '0' ? '' : ` ${s.unit}`}</p>
                    </div>
                    <div className="text-right">
                      <p className={cx('font-num text-xl font-bold', s.low ? 'text-rose' : 'text-white')}>
                        {s.remaining}
                        <span className="ml-0.5 text-xs font-medium text-white/40">{s.unit}</span>
                      </p>
                      <p className="text-[10px] text-white/30">of {s.capacity}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Progress value={pct} tone={tone} />
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] text-white/35">{pct}% remaining</span>
                      <Button variant="glass" size="sm" icon={<PackagePlus size={14} />} onClick={() => { setRestockId(s.id); setRestockAmt('') }}>
                        Restock
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <Button variant="glass" full size="lg" icon={<Plus size={18} />} onClick={() => setAddOpen(true)}>
          Add Inventory Item
        </Button>
      </section>

      {/* Usage today */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <TrendingDown size={15} className="text-blue-300" />
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">
            Usage Today · Auto-Deducted
          </h3>
        </div>
        <Card className="divide-y divide-white/6">
          {usageFeed.map((u, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-blue/12 text-blue-300">
                <TrendingDown size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{u.item}</p>
                <p className="truncate text-[11px] text-white/40">{u.job} · by {u.worker}</p>
              </div>
              <div className="text-right">
                <p className="font-num text-sm font-semibold text-rose">-{u.qty}</p>
                <p className="text-[10px] text-white/30">{u.time}</p>
              </div>
            </div>
          ))}
        </Card>
        <p className="px-1 text-[11px] text-white/30">
          Every material is auto-deducted when a worker finishes a job. No manual entry, no wastage, full traceability.
        </p>
      </section>

      {/* -------- Add item sheet -------- */}
      <Sheet open={addOpen} onClose={() => setAddOpen(false)} title="Add Inventory Item">
        <div className="space-y-4">
          <Field label="Item Name" value={name} onChange={setName} placeholder="e.g. Graphene Coating" icon={<Package size={17} />} />
          <Select label="Unit" value={unit} options={unitOptions} onChange={setUnit} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Current Qty" value={qty} onChange={setQty} placeholder="10" type="number" />
            <Field label="Full Capacity" value={cap} onChange={setCap} placeholder="20" type="number" />
          </div>
          <Button variant="primary" size="lg" full icon={<Check size={19} />} onClick={addItem} className={!(name.trim() && qty) ? 'pointer-events-none opacity-40' : ''}>
            Add to Inventory
          </Button>
          <p className="text-center text-[11px] text-white/35">
            Lustre will auto-deduct this item as workers use it on jobs.
          </p>
        </div>
      </Sheet>

      {/* -------- Restock sheet -------- */}
      <Sheet open={!!restockId} onClose={() => setRestockId(null)} title={restockItem ? `Restock ${restockItem.name}` : 'Restock'}>
        {restockItem && (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-2xl glass px-4 py-3">
              <span className="text-sm text-white/55">Current</span>
              <span className="font-num text-lg font-bold">{restockItem.remaining} {restockItem.unit}</span>
            </div>
            <Field label={`Add quantity (${restockItem.unit})`} value={restockAmt} onChange={setRestockAmt} placeholder="e.g. 20" type="number" icon={<PackagePlus size={17} />} />
            {restockAmt && !isNaN(parseFloat(restockAmt)) && (
              <div className="flex items-center justify-between rounded-2xl bg-lime/[0.08] px-4 py-3">
                <span className="text-sm text-lime-soft">New total</span>
                <span className="font-num text-lg font-bold text-lime-soft">
                  {restockItem.remaining + parseFloat(restockAmt)} {restockItem.unit}
                </span>
              </div>
            )}
            <Button variant="success" size="lg" full icon={<Check size={19} />} onClick={doRestock} className={!restockAmt ? 'pointer-events-none opacity-40' : ''}>
              Confirm Restock
            </Button>
          </div>
        )}
      </Sheet>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-x-4 bottom-24 z-[60] mx-auto max-w-md"
        >
          <div className="flex items-center gap-3 rounded-2xl glass-strong p-3.5 shadow-float">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-lime/15 text-lime">
              <Check size={18} />
            </div>
            <p className="flex-1 text-sm font-medium">{toast}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
