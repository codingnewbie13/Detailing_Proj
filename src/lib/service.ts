import type { ServiceType, JobStatus, PayStatus } from '../data/mock'
import { Droplets, Shield, Layers, Sparkles, Car, Wand2 } from 'lucide-react'

export const serviceMeta: Record<
  ServiceType,
  { color: string; icon: typeof Shield; label: string }
> = {
  PPF: { color: '#2E6BFF', icon: Shield, label: 'Paint Protection Film' },
  Ceramic: { color: '#A3E635', icon: Sparkles, label: 'Ceramic Coating' },
  Wrap: { color: '#d8c08a', icon: Layers, label: 'Vinyl Wrap' },
  Wash: { color: '#f5b544', icon: Droplets, label: 'Premium Wash' },
  Detailing: { color: '#7ea3ff', icon: Car, label: 'Full Detailing' },
  Correction: { color: '#c6f26a', icon: Wand2, label: 'Paint Correction' },
}

export const statusTone: Record<JobStatus, 'blue' | 'lime' | 'gold' | 'rose'> = {
  'In Progress': 'blue',
  Ready: 'lime',
  Delivered: 'gold',
  Delayed: 'rose',
}

export const payTone: Record<PayStatus, 'lime' | 'amber'> = {
  Paid: 'lime',
  Pending: 'amber',
}
