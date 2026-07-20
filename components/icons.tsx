interface IconProps {
  size?: number
  className?: string
  strokeWidth?: number
}

function Icon({ children, size = 16, className = '', strokeWidth = 1.75 }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function IconFolder(p: IconProps) {
  return <Icon {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2.5h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"/></Icon>
}

export function IconBolt(p: IconProps) {
  return <Icon {...p}><path d="M13 3 4 14h7l-1 7 9-11h-7l1-7z"/></Icon>
}

export function IconChip(p: IconProps) {
  return (
    <Icon {...p}>
      <rect x="5" y="5" width="14" height="14" rx="2"/>
      <rect x="9" y="9" width="6" height="6"/>
      <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>
    </Icon>
  )
}

export function IconDollar(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M12 3v18"/>
      <path d="M17 7.5c0-1.93-2.24-3.5-5-3.5s-5 1.57-5 3.5S9.24 11 12 11s5 1.57 5 3.5S14.76 18 12 18s-5-1.57-5-3.5"/>
    </Icon>
  )
}

export function IconDashboard(p: IconProps) {
  return (
    <Icon {...p}>
      <rect x="3" y="3" width="8" height="9" rx="1.5"/>
      <rect x="13" y="3" width="8" height="5" rx="1.5"/>
      <rect x="13" y="10" width="8" height="11" rx="1.5"/>
      <rect x="3" y="14" width="8" height="7" rx="1.5"/>
    </Icon>
  )
}

export function IconBox(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9z"/>
      <path d="M3 7.5 12 12l9-4.5M12 12v9"/>
    </Icon>
  )
}

export function IconTerminal(p: IconProps) {
  return (
    <Icon {...p}>
      <path d="M5 8l4 4-4 4M12 16h7"/>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2"/>
    </Icon>
  )
}

export function IconChevronRight(p: IconProps) {
  return <Icon {...p}><path d="M9 6l6 6-6 6"/></Icon>
}

export function IconChevronLeft(p: IconProps) {
  return <Icon {...p}><path d="M15 6l-6 6 6 6"/></Icon>
}

export function IconShield(p: IconProps) {
  return <Icon {...p}><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"/></Icon>
}

export function IconSearch(p: IconProps) {
  return (
    <Icon {...p}>
      <circle cx="11" cy="11" r="8"/>
      <path d="M21 21l-4.35-4.35"/>
    </Icon>
  )
}
