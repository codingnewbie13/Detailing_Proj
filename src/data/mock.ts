// Central mock data for the Lustre demo. Frontend-only, no backend.

export type ServiceType =
  | 'PPF'
  | 'Ceramic'
  | 'Wrap'
  | 'Wash'
  | 'Detailing'
  | 'Correction'

export type JobStage =
  | 'Booked'
  | 'Started'
  | 'Washing'
  | 'Coating'
  | 'Inspection'
  | 'Ready'
  | 'Delivered'

export type JobStatus = 'In Progress' | 'Ready' | 'Delivered' | 'Delayed'
export type PayStatus = 'Paid' | 'Pending'

export interface Worker {
  id: string
  name: string
  role: string
  avatarColor: string
  status: 'Working' | 'Idle' | 'Break'
  activeJobId?: string
  jobsToday: number
  phone?: string
}

export interface Job {
  id: string
  car: string
  model: string
  reg: string
  service: ServiceType
  status: JobStatus
  stage: JobStage
  amount: number
  pay: PayStatus
  paidAmount?: number
  customerId: string
  customerName?: string
  customerPhone?: string
  workerId?: string
  eta: string
  startedMinsAgo?: number
  color: string
  beforePhotos?: number
  afterPhotos?: number
  beforeImages?: string[]
  afterImages?: string[]
  materialsUsed?: { id: string; name: string; qty: number; unit: string }[]
  createdAtLabel?: string
}

export interface Customer {
  id: string
  name: string
  phone: string
  cars: { model: string; reg: string }[]
  services: ServiceType[]
  lifetime: number
  visits: number
  lastVisitDays: number
  nextReminder?: string
  tier: 'VIP' | 'Regular' | 'New'
}

export interface StockItem {
  id: string
  name: string
  unit: string
  remaining: number
  capacity: number
  low: boolean
  usedToday: string
}

export const studio = {
  name: 'Monarch Auto Atelier',
  owner: 'Raj',
  city: 'Mumbai',
  plan: 'Atelier Pro',
}

export const kpis = {
  revenueToday: 38500,
  carsToday: 12,
  inProgress: 4,
  waitingPickup: 3,
  completedToday: 5,
  unpaid: 2,
}

export const workers: Worker[] = [
  { id: 'w1', name: 'Arjun Mehta', role: 'PPF Specialist', avatarColor: '#2E6BFF', status: 'Working', activeJobId: 'j1', jobsToday: 3, phone: '+91 98201 11111' },
  { id: 'w2', name: 'Sahil Khan', role: 'Ceramic Lead', avatarColor: '#A3E635', status: 'Working', activeJobId: 'j2', jobsToday: 2, phone: '+91 98202 22222' },
  { id: 'w3', name: 'Vikram Rao', role: 'Wash & Prep', avatarColor: '#f5b544', status: 'Break', jobsToday: 4, phone: '+91 98203 33333' },
  { id: 'w4', name: 'Imran Sheikh', role: 'Detailer', avatarColor: '#d8c08a', status: 'Idle', jobsToday: 1, phone: '+91 98204 44444' },
]

export const customers: Customer[] = [
  {
    id: 'c1', name: 'Aditya Kapoor', phone: '+91 98200 11223',
    cars: [{ model: 'BMW X5', reg: 'MH01 AK 4321' }, { model: 'Mercedes C220', reg: 'MH02 CD 8890' }],
    services: ['PPF', 'Ceramic'], lifetime: 425000, visits: 7, lastVisitDays: 14,
    nextReminder: '30-Day Ceramic Checkup', tier: 'VIP',
  },
  {
    id: 'c2', name: 'Neha Sharma', phone: '+91 98330 55447',
    cars: [{ model: 'Audi RS5', reg: 'MH04 NS 2201' }],
    services: ['Wrap', 'Detailing'], lifetime: 268000, visits: 4, lastVisitDays: 42,
    nextReminder: 'Wrap Care Reminder', tier: 'VIP',
  },
  {
    id: 'c3', name: 'Rohan Verma', phone: '+91 90040 77812',
    cars: [{ model: 'Toyota Fortuner', reg: 'MH12 RV 9087' }],
    services: ['Wash', 'Detailing'], lifetime: 62000, visits: 9, lastVisitDays: 6,
    tier: 'Regular',
  },
  {
    id: 'c4', name: 'Priya Nair', phone: '+91 99870 33221',
    cars: [{ model: 'Land Rover Defender', reg: 'MH14 PN 1120' }],
    services: ['PPF'], lifetime: 189000, visits: 2, lastVisitDays: 90,
    nextReminder: '180-Day Maintenance', tier: 'Regular',
  },
  {
    id: 'c5', name: 'Karan Malhotra', phone: '+91 98110 66009',
    cars: [{ model: 'Nissan GT-R', reg: 'MH01 KM 0007' }],
    services: ['Ceramic', 'Correction'], lifetime: 512000, visits: 5, lastVisitDays: 3,
    tier: 'VIP',
  },
]

export const jobs: Job[] = [
  { id: 'j1', car: 'BMW', model: 'X5', reg: 'MH01 AK 4321', service: 'PPF', status: 'In Progress', stage: 'Coating', amount: 145000, pay: 'Pending', customerId: 'c1', workerId: 'w1', eta: 'Tomorrow, 4:00 PM', startedMinsAgo: 95, color: '#2E6BFF' },
  { id: 'j2', car: 'Mercedes', model: 'C220', reg: 'MH02 CD 8890', service: 'Ceramic', status: 'Ready', stage: 'Ready', amount: 62000, pay: 'Paid', customerId: 'c1', workerId: 'w2', eta: 'Today, 6:30 PM', startedMinsAgo: 240, color: '#A3E635' },
  { id: 'j3', car: 'Toyota', model: 'Fortuner', reg: 'MH12 RV 9087', service: 'Wash', status: 'Delivered', stage: 'Delivered', amount: 4500, pay: 'Paid', customerId: 'c3', workerId: 'w3', eta: 'Delivered 1:15 PM', color: '#f5b544' },
  { id: 'j4', car: 'Audi', model: 'RS5', reg: 'MH04 NS 2201', service: 'Wrap', status: 'In Progress', stage: 'Washing', amount: 210000, pay: 'Pending', customerId: 'c2', workerId: 'w4', eta: 'In 2 days', startedMinsAgo: 30, color: '#d8c08a' },
  { id: 'j5', car: 'Nissan', model: 'GT-R', reg: 'MH01 KM 0007', service: 'Ceramic', status: 'Delayed', stage: 'Inspection', amount: 98000, pay: 'Pending', customerId: 'c5', workerId: 'w2', eta: 'Overdue 40m', startedMinsAgo: 300, color: '#ff6b6b' },
]

export const stock: StockItem[] = [
  { id: 's1', name: 'PPF Roll (Gloss)', unit: 'm', remaining: 8.5, capacity: 30, low: true, usedToday: '3.2 m' },
  { id: 's2', name: 'Ceramic Coating 9H', unit: 'bottles', remaining: 5, capacity: 20, low: false, usedToday: '1 bottle' },
  { id: 's3', name: 'Cutting Compound', unit: 'units', remaining: 12, capacity: 24, low: false, usedToday: '2 units' },
  { id: 's4', name: 'Microfiber Cloths', unit: 'pcs', remaining: 28, capacity: 120, low: false, usedToday: '6 pcs' },
  { id: 's5', name: 'IPA Solution', unit: 'L', remaining: 2.0, capacity: 10, low: true, usedToday: '0.8 L' },
]

export const revenueSeries = [
  { d: 'Mon', v: 42000 }, { d: 'Tue', v: 38000 }, { d: 'Wed', v: 51000 },
  { d: 'Thu', v: 47500 }, { d: 'Fri', v: 62000 }, { d: 'Sat', v: 88000 }, { d: 'Sun', v: 38500 },
]

export const topServices = [
  { name: 'PPF', value: 46, color: '#2E6BFF' },
  { name: 'Ceramic', value: 31, color: '#A3E635' },
  { name: 'Wrap', value: 14, color: '#d8c08a' },
  { name: 'Wash', value: 9, color: '#f5b544' },
]

export function customerById(id: string) {
  return customers.find((c) => c.id === id)
}
export function workerById(id?: string) {
  return workers.find((w) => w.id === id)
}
