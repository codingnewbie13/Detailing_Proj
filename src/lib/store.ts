// Global app store — makes the whole demo behave like a live product.
// Backed by localStorage so state persists across navigation & refresh.
// Any component can read live data with the hooks and mutate via the actions.

import { useSyncExternalStore } from 'react'
import {
  jobs as seedJobs,
  workers as seedWorkers,
  stock as seedStock,
  customers as seedCustomers,
  type Job,
  type Worker,
  type StockItem,
  type Customer,
  type JobStage,
  type JobStatus,
  type ServiceType,
  type PayStatus,
} from '../data/mock'

export interface Activity {
  id: string
  label: string
  time: string
  tone: 'blue' | 'lime' | 'amber' | 'gold' | 'rose'
}

export interface AppState {
  jobs: Job[]
  workers: Worker[]
  stock: StockItem[]
  customers: Customer[]
  activity: Activity[]
}

const KEY = 'lustre_state_v1'

// Recipe of materials consumed per service (auto-deduct on finish)
const recipe: Record<ServiceType, { id: string; qty: number; label: string }[]> = {
  PPF: [{ id: 's1', qty: 3, label: '3 m' }, { id: 's4', qty: 4, label: '4 pcs' }],
  Ceramic: [{ id: 's2', qty: 1, label: '1 bottle' }, { id: 's5', qty: 0.3, label: '0.3 L' }, { id: 's4', qty: 3, label: '3 pcs' }],
  Wrap: [{ id: 's4', qty: 5, label: '5 pcs' }],
  Wash: [{ id: 's4', qty: 4, label: '4 pcs' }],
  Detailing: [{ id: 's3', qty: 1, label: '1 unit' }, { id: 's4', qty: 4, label: '4 pcs' }],
  Correction: [{ id: 's3', qty: 2, label: '2 units' }, { id: 's4', qty: 4, label: '4 pcs' }],
}

function seed(): AppState {
  return {
    jobs: seedJobs.map((j) => ({ ...j })),
    workers: seedWorkers.map((w) => ({ ...w })),
    stock: seedStock.map((s) => ({ ...s })),
    customers: seedCustomers.map((c) => ({ ...c })),
    activity: [
      { id: 'a1', label: 'Ceramic coating on Mercedes C220 marked Ready', time: '2m ago', tone: 'lime' },
      { id: 'a2', label: 'Payment link shared for BMW X5 PPF', time: '18m ago', tone: 'amber' },
      { id: 'a3', label: 'Fortuner Wash delivered', time: '1h ago', tone: 'gold' },
    ],
  }
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as AppState
  } catch {}
  return seed()
}

let state: AppState = load()
const listeners = new Set<() => void>()

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // localStorage quota exceeded (usually due to captured photos).
    // Persist a lighter copy without image data so the rest still survives refresh.
    try {
      const light: AppState = {
        ...state,
        jobs: state.jobs.map((j) => ({ ...j, beforeImages: undefined, afterImages: undefined })),
      }
      localStorage.setItem(KEY, JSON.stringify(light))
    } catch {
      // give up silently; in-memory state still drives the live session
    }
  }
}

function emit() {
  persist()
  listeners.forEach((l) => l())
}

function set(updater: (s: AppState) => AppState) {
  state = updater(state)
  emit()
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  return () => listeners.delete(cb)
}

function getSnapshot() {
  return state
}

/* ------------------------------- Read hooks ------------------------------ */
export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
}
export function useJobs() {
  return useAppState().jobs
}
export function useWorkers() {
  return useAppState().workers
}
export function useStock() {
  return useAppState().stock
}
export function useCustomers() {
  return useAppState().customers
}
export function useActivity() {
  return useAppState().activity
}
export function useJob(id?: string) {
  return useAppState().jobs.find((j) => j.id === id)
}
export function useWorker(id?: string) {
  return useAppState().workers.find((w) => w.id === id)
}
export function useCustomer(id?: string) {
  return useAppState().customers.find((c) => c.id === id)
}

/* --------------------------------- Getters ------------------------------- */
export function getJob(id?: string) {
  return state.jobs.find((j) => j.id === id)
}
export function getWorker(id?: string) {
  return state.workers.find((w) => w.id === id)
}

function now(): string {
  return new Date().toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
}

function logActivity(label: string, tone: Activity['tone']) {
  state.activity = [
    { id: `a${Date.now()}`, label, time: 'just now', tone },
    ...state.activity,
  ].slice(0, 12)
}

/* --------------------------------- Actions ------------------------------- */

export interface NewBookingInput {
  name: string
  phone: string
  car: string
  model?: string
  reg: string
  service: ServiceType
  eta: string
  workerId: string
  pay: PayStatus
  amount: number
  paidAmount?: number
}

const serviceColor: Record<ServiceType, string> = {
  PPF: '#2E6BFF', Ceramic: '#A3E635', Wrap: '#d8c08a', Wash: '#f5b544', Detailing: '#7ea3ff', Correction: '#c6f26a',
}

export function createBooking(input: NewBookingInput): Job {
  const id = `j${Date.now()}`
  // split car into make + model if model not provided
  const parts = input.car.trim().split(' ')
  const make = parts[0] || input.car
  const model = input.model ?? parts.slice(1).join(' ')

  // find or create customer
  let customer = state.customers.find((c) => c.phone === input.phone || c.name.toLowerCase() === input.name.toLowerCase())
  if (!customer) {
    customer = {
      id: `c${Date.now()}`,
      name: input.name,
      phone: input.phone,
      cars: [{ model: input.car, reg: input.reg }],
      services: [input.service],
      lifetime: input.paidAmount ?? 0,
      visits: 1,
      lastVisitDays: 0,
      tier: 'New',
    }
    state.customers = [customer, ...state.customers]
  } else {
    if (!customer.services.includes(input.service)) customer.services = [...customer.services, input.service]
    if (!customer.cars.some((c) => c.reg === input.reg)) customer.cars = [...customer.cars, { model: input.car, reg: input.reg }]
  }

  const job: Job = {
    id,
    car: make,
    model,
    reg: input.reg,
    service: input.service,
    status: 'In Progress',
    stage: 'Booked',
    amount: input.amount,
    pay: input.pay,
    paidAmount: input.pay === 'Paid' ? input.amount : Math.min(input.amount, input.paidAmount ?? 0),
    customerId: customer.id,
    customerName: customer.name,
    customerPhone: customer.phone,
    workerId: input.workerId,
    eta: input.eta,
    color: serviceColor[input.service],
    beforePhotos: 0,
    afterPhotos: 0,
    createdAtLabel: now(),
  }

  set((s) => ({ ...s, jobs: [job, ...s.jobs] }))
  logActivity(`New booking: ${make} ${model} · ${input.service}`, 'blue')
  emit()
  return job
}

/** Advance a job to a given stage and keep status in sync. */
export function setJobStage(jobId: string, stage: JobStage) {
  set((s) => ({
    ...s,
    jobs: s.jobs.map((j) => {
      if (j.id !== jobId) return j
      let status: JobStatus = j.status
      if (stage === 'Ready') status = 'Ready'
      else if (stage === 'Delivered') status = 'Delivered'
      else status = 'In Progress'
      return { ...j, stage, status }
    }),
  }))
}

export function startJob(jobId: string) {
  const job = getJob(jobId)
  if (!job) return
  set((s) => ({
    ...s,
    jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, stage: 'Started', status: 'In Progress' } : j)),
    workers: s.workers.map((w) => (w.id === job.workerId ? { ...w, status: 'Working', activeJobId: jobId } : w)),
  }))
  logActivity(`${job.car} ${job.model}: work started`, 'blue')
  emit()
}

export function addBeforePhotos(jobId: string, images: string[] = []) {
  set((s) => ({
    ...s,
    jobs: s.jobs.map((j) => {
      if (j.id !== jobId) return j
      const beforeImages = [...(j.beforeImages ?? []), ...images]
      return { ...j, beforeImages, beforePhotos: beforeImages.length }
    }),
  }))
}
export function addAfterPhotos(jobId: string, images: string[] = []) {
  set((s) => ({
    ...s,
    jobs: s.jobs.map((j) => {
      if (j.id !== jobId) return j
      const afterImages = [...(j.afterImages ?? []), ...images]
      return { ...j, afterImages, afterPhotos: afterImages.length }
    }),
  }))
}

/** Planned materials for a service, resolved with current stock names/units. */
export function plannedMaterials(service: ServiceType) {
  const mats = recipe[service] ?? []
  return mats
    .map((m) => {
      const item = state.stock.find((s) => s.id === m.id)
      if (!item) return null
      return { id: m.id, name: item.name, qty: m.qty, unit: item.unit }
    })
    .filter(Boolean) as { id: string; name: string; qty: number; unit: string }[]
}

/** Finish a job: mark Ready, deduct materials, free the worker, log usage.
 *  Pass `actual` (from the worker's Materials Used step) to deduct real amounts;
 *  otherwise the service recipe estimate is used. */
export function finishJob(
  jobId: string,
  actual?: { id: string; name: string; qty: number; unit: string }[],
) {
  const job = getJob(jobId)
  if (!job) return
  const used =
    actual ??
    plannedMaterials(job.service)
  const usedFiltered = used.filter((u) => u.qty > 0)

  set((s) => ({
    ...s,
    jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, stage: 'Ready', status: 'Ready', materialsUsed: usedFiltered } : j)),
    workers: s.workers.map((w) =>
      w.id === job.workerId ? { ...w, status: 'Idle', activeJobId: undefined, jobsToday: w.jobsToday + 1 } : w,
    ),
    stock: s.stock.map((st) => {
      const use = usedFiltered.find((m) => m.id === st.id)
      if (!use) return st
      const usedToday = `${(parseFloat(st.usedToday) || 0) + use.qty} ${st.unit}`
      const remaining = Math.max(0, st.remaining - use.qty)
      return { ...st, remaining, low: remaining / st.capacity < 0.35, usedToday }
    }),
  }))
  logActivity(`${job.car} ${job.model} finished · materials logged by worker`, 'lime')
  emit()
}

export function markDelivered(jobId: string) {
  const job = getJob(jobId)
  if (!job) return
  set((s) => ({ ...s, jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, stage: 'Delivered', status: 'Delivered' } : j)) }))
  logActivity(`${job.car} ${job.model} delivered`, 'gold')
  emit()
}

export function collectPayment(jobId: string) {
  const job = getJob(jobId)
  if (!job) return
  set((s) => ({ ...s, jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, pay: 'Paid', paidAmount: j.amount } : j)) }))
  logActivity(`Payment collected for ${job.car} ${job.model}`, 'lime')
  emit()
}

/* ------------------------------ Staff actions ---------------------------- */
export function addWorker(w: Omit<Worker, 'id'>): Worker {
  const worker: Worker = { ...w, id: `w${Date.now()}` }
  set((s) => ({ ...s, workers: [...s.workers, worker] }))
  return worker
}
export function removeWorker(id: string) {
  set((s) => ({ ...s, workers: s.workers.filter((w) => w.id !== id) }))
}

/* ---------------------------- Inventory actions -------------------------- */
export function addStockItem(item: Omit<StockItem, 'id'>): StockItem {
  const it: StockItem = { ...item, id: `s${Date.now()}` }
  set((s) => ({ ...s, stock: [...s.stock, it] }))
  return it
}
export function restockItem(id: string, amount: number) {
  set((s) => ({
    ...s,
    stock: s.stock.map((st) => {
      if (st.id !== id) return st
      const remaining = st.remaining + amount
      const capacity = Math.max(st.capacity, remaining)
      return { ...st, remaining, capacity, low: remaining / capacity < 0.35 }
    }),
  }))
}

/* ------------------------------- Utilities ------------------------------- */
export function resetStore() {
  state = seed()
  emit()
}

export const materialRecipe = recipe
