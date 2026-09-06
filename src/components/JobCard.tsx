import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import type { Job } from '../data/mock'
import { serviceMeta, statusTone, payTone } from '../lib/service'
import { Badge } from './ui'
import { cx, inr } from '../lib/format'
import { useCustomer } from '../lib/store'

export default function JobCard({ job, index = 0 }: { job: Job; index?: number }) {
  const meta = serviceMeta[job.service]
  const Icon = meta.icon
  const storeCustomer = useCustomer(job.customerId)
  const customerName = job.customerName ?? storeCustomer?.name ?? meta.label

  return (
    <Link
      to={`/job/${job.id}`}
      className="group block animate-fade-up"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative flex items-center gap-3.5 overflow-hidden rounded-3xl glass p-3.5 transition-all active:scale-[0.99]">
        {/* left color rail */}
        <span
          className="absolute inset-y-3 left-0 w-1 rounded-full"
          style={{ background: meta.color }}
        />

        {/* service icon */}
        <div
          className="ml-1 grid h-12 w-12 shrink-0 place-items-center rounded-2xl"
          style={{ background: `${meta.color}1f`, color: meta.color }}
        >
          <Icon size={22} strokeWidth={2.2} />
        </div>

        {/* body */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold">
              {job.car} {job.model}
            </p>
            <span className="shrink-0 rounded-md bg-white/6 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white/45">
              {job.reg}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-white/45">{customerName}</span>
            <span className="text-white/20">·</span>
            <span className="font-num text-xs text-white/55">{inr(job.amount, { compact: true })}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge tone={statusTone[job.status]} dot={job.status === 'In Progress' || job.status === 'Delayed'}>
              {job.status}
            </Badge>
            <Badge tone={payTone[job.pay]}>{job.pay}</Badge>
          </div>
        </div>

        <ChevronRight
          size={18}
          className={cx('shrink-0 text-white/25 transition-transform group-active:translate-x-0.5')}
        />
      </div>
    </Link>
  )
}
