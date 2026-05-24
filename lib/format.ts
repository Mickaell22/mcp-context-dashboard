export function timeAgo(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date)
  const s = Math.floor((Date.now() - d.getTime()) / 1000)
  if (s < 60) return `${s}s ago`
  if (s < 3600) return `${Math.floor(s / 60)}m ago`
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`
  if (s < 86400 * 7) return `${Math.floor(s / 86400)}d ago`
  return `${Math.floor(s / (86400 * 7))}w ago`
}

export function fmtNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 10_000) return Math.floor(n / 1000) + 'k'
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  return n.toLocaleString('en-US')
}

export function fmtCost(n: number): string {
  if (n < 0.01) return '$' + n.toFixed(4)
  if (n < 1) return '$' + n.toFixed(3)
  return '$' + n.toFixed(2)
}

export function fmtDateTime(d: Date | string): string {
  const date = d instanceof Date ? d : new Date(d)
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const yy = date.getFullYear()
  const hh = String(date.getHours()).padStart(2, '0')
  const mn = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${yy}-${mm}-${dd} ${hh}:${mn}:${ss}`
}

const COLOR_NAMES = ['indigo', 'amber', 'emerald', 'rose', 'sky', 'violet', 'teal', 'slate'] as const

export const BADGE_COLORS: Record<string, { bg: string; fg: string; dot: string }> = {
  indigo:  { bg: 'rgba(99, 102, 241, 0.12)',  fg: '#a5b4fc', dot: '#818cf8' },
  amber:   { bg: 'rgba(245, 158, 11, 0.12)',  fg: '#fcd34d', dot: '#f59e0b' },
  emerald: { bg: 'rgba(16, 185, 129, 0.12)',  fg: '#6ee7b7', dot: '#10b981' },
  rose:    { bg: 'rgba(244, 63, 94, 0.12)',   fg: '#fda4af', dot: '#f43f5e' },
  sky:     { bg: 'rgba(14, 165, 233, 0.12)',  fg: '#7dd3fc', dot: '#0ea5e9' },
  violet:  { bg: 'rgba(139, 92, 246, 0.12)',  fg: '#c4b5fd', dot: '#8b5cf6' },
  teal:    { bg: 'rgba(20, 184, 166, 0.12)',  fg: '#5eead4', dot: '#14b8a6' },
  slate:   { bg: 'rgba(148, 163, 184, 0.12)', fg: '#cbd5e1', dot: '#94a3b8' },
}

export function getProjectColor(name: string): { bg: string; fg: string; dot: string } {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash) + name.charCodeAt(i)
    hash |= 0
  }
  const colorName = COLOR_NAMES[Math.abs(hash) % COLOR_NAMES.length]
  return BADGE_COLORS[colorName]
}
