'use client'

import * as React from 'react'
import { useAuth } from '@/lib/auth'
import { getScheduledTasksByUser } from '@/lib/db'
import { computeHunterStatus, type HunterStatus } from '@/lib/hunter'
import { Progress } from '@/components/ui/progress'

/** Solo-Leveling-style status window. Read-only; shows only in the Hunter theme (via CSS). */
export function HunterStatusWindow() {
  const { account } = useAuth()
  const [status, setStatus] = React.useState<HunterStatus | null>(null)

  React.useEffect(() => {
    if (!account) return
    let cancelled = false
    const load = () =>
      getScheduledTasksByUser(account.id)
        .then((tasks) => !cancelled && setStatus(computeHunterStatus(tasks)))
        .catch(() => {})
    void load()
    const id = window.setInterval(load, 15000)
    return () => {
      cancelled = true
      window.clearInterval(id)
    }
  }, [account])

  if (!status) return null

  return (
    <div className="sl-only sl-panel mx-3 mb-3 p-3 text-xs">
      <div className="mb-2 text-[10px] uppercase tracking-[0.25em] text-primary">[ Status ]</div>
      <div className="flex items-end justify-between">
        <div>
          <div className="text-muted-foreground uppercase tracking-widest">Level</div>
          <div className="text-3xl font-bold leading-none text-primary">{status.level}</div>
        </div>
        <div className="text-right">
          <div className="text-muted-foreground uppercase tracking-widest">Rank</div>
          <div className="sl-pulse inline-block border border-primary px-2 py-0.5 text-lg font-bold">{status.rank}</div>
        </div>
      </div>
      <div className="mt-1 uppercase tracking-widest text-muted-foreground">{status.title}</div>
      <Progress value={status.levelPct} className="mt-2" aria-label="Experience" />
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>EXP</span>
        <span>
          {status.expIntoLevel}/{status.expForNext}
        </span>
      </div>
    </div>
  )
}
