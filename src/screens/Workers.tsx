import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HardHat, ChevronRight, Activity, Coffee, Circle } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Card, Badge, Avatar } from '../components/ui'
import { useWorkers, useJobs } from '../lib/store'
import { cx } from '../lib/format'

const statusMeta = {
  Working: { tone: 'lime' as const, icon: Activity, label: 'Working' },
  Break: { tone: 'amber' as const, icon: Coffee, label: 'On Break' },
  Idle: { tone: 'neutral' as const, icon: Circle, label: 'Idle' },
}

export default function Workers() {
  const workers = useWorkers()
  const jobs = useJobs()
  const workingCount = workers.filter((w) => w.status === 'Working').length

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workers"
        subtitle={`${workingCount} of ${workers.length} active right now`}
        right={
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-lime/15 text-lime">
            <HardHat size={19} />
          </div>
        }
      />

      {/* Live summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Working', value: workingCount, tone: 'lime' as const },
          { label: 'On Break', value: workers.filter((w) => w.status === 'Break').length, tone: 'amber' as const },
          { label: 'Idle', value: workers.filter((w) => w.status === 'Idle').length, tone: 'neutral' as const },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-3.5 text-center">
              <p className={cx('font-num text-2xl font-bold', s.tone === 'lime' ? 'text-lime-soft' : s.tone === 'amber' ? 'text-amber' : 'text-white/70')}>
                {s.value}
              </p>
              <p className="mt-0.5 text-[11px] text-white/45">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Roster */}
      <section className="space-y-3">
        <h3 className="px-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/45">Team</h3>
        <div className="space-y-2.5">
          {workers.map((w, i) => {
            const meta = statusMeta[w.status]
            const activeJob = jobs.find((j) => j.id === w.activeJobId)
            return (
              <motion.div key={w.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <Link to={`/worker/${w.id}`}>
                  <Card className="flex items-center gap-3.5 p-3.5 transition-all active:scale-[0.99]">
                    <div className="relative">
                      <Avatar name={w.name} color={w.avatarColor} size={48} />
                      <span
                        className={cx(
                          'absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full ring-2 ring-ink-850',
                          w.status === 'Working' ? 'bg-lime' : w.status === 'Break' ? 'bg-amber' : 'bg-white/30',
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">{w.name}</p>
                      <p className="truncate text-xs text-white/45">{w.role}</p>
                      {activeJob ? (
                        <p className="mt-1 truncate text-[11px] text-lime-soft">
                          ● {activeJob.car} {activeJob.model} · {activeJob.service}
                        </p>
                      ) : (
                        <p className="mt-1 text-[11px] text-white/30">No active job</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge tone={meta.tone} dot={w.status === 'Working'}>{meta.label}</Badge>
                      <span className="text-[11px] text-white/35">{w.jobsToday} jobs today</span>
                    </div>
                    <ChevronRight size={18} className="text-white/25" />
                  </Card>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      <p className="text-center text-[11px] text-white/25">Tap a worker to open glove-friendly Worker Mode</p>
    </div>
  )
}
