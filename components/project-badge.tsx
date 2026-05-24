import { getProjectColor } from '@/lib/format'

export default function ProjectBadge({ name }: { name: string }) {
  const color = getProjectColor(name)
  return (
    <span className="badge" style={{ background: color.bg, color: color.fg }}>
      <span className="badge-dot" style={{ background: color.dot }} />
      {name}
    </span>
  )
}
