import type { ScheduledTask } from '@/types'

/**
 * Hunter progression — a read-only, derived view over existing task data.
 * It never writes anything and never feeds back into scheduling or recovery.
 *   completed task = 10 EXP, partial task = 5 EXP.
 */
export interface HunterStatus {
  exp: number
  level: number
  expIntoLevel: number
  expForNext: number
  levelPct: number
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S'
  title: string
}

const EXP_COMPLETED = 10
const EXP_PARTIAL = 5

function expNeededForLevel(level: number): number {
  return 100 + (level - 1) * 50
}

function rankForLevel(level: number): HunterStatus['rank'] {
  if (level >= 50) return 'S'
  if (level >= 35) return 'A'
  if (level >= 20) return 'B'
  if (level >= 10) return 'C'
  if (level >= 5) return 'D'
  return 'E'
}

const TITLES: Record<HunterStatus['rank'], string> = {
  E: 'Weakest Hunter',
  D: 'Awakened',
  C: 'Gate Clearer',
  B: 'Elite Hunter',
  A: 'Rank-A Hunter',
  S: 'Shadow Monarch',
}

export function computeHunterStatus(tasks: ScheduledTask[]): HunterStatus {
  let exp = 0
  for (const t of tasks) {
    if (t.deletedAt) continue
    if (t.status === 'completed') exp += EXP_COMPLETED
    else if (t.status === 'partial') exp += EXP_PARTIAL
  }

  let level = 1
  let remaining = exp
  while (remaining >= expNeededForLevel(level)) {
    remaining -= expNeededForLevel(level)
    level += 1
  }
  const expForNext = expNeededForLevel(level)
  const rank = rankForLevel(level)
  return {
    exp,
    level,
    expIntoLevel: remaining,
    expForNext,
    levelPct: Math.round((remaining / expForNext) * 100),
    rank,
    title: TITLES[rank],
  }
}
