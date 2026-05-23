interface VoadiLogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function HarpIcon({ height }: { height: number }) {
  const w = Math.round(height * 0.72)
  return (
    <svg
      width={w}
      height={height}
      viewBox="0 0 22 30"
      fill="none"
      aria-hidden="true"
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      {/* Forepillar — left column, slight outward curve */}
      <path
        d="M3.5 26 C3 18 4 10 7.5 3.5"
        stroke="#D97706"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Neck — sweeping curve from top across and down */}
      <path
        d="M7.5 3.5 C11 0.5 17 2 18.5 7.5 C19.5 13 18 20 15.5 25.5"
        stroke="#D97706"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Base — connects forepillar bottom to neck bottom */}
      <path
        d="M3.5 26 C3.5 28.5 6.5 29.5 10 29.5 C13.5 29.5 16.5 28.5 15.5 25.5"
        stroke="#D97706"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Strings — 5 diagonals from neck to soundbox area */}
      <line x1="6.5" y1="7"   x2="4.5"  y2="25"   stroke="#D97706" strokeWidth="0.85" strokeLinecap="round" opacity="0.7" />
      <line x1="9.5" y1="4.5" x2="7"    y2="25.5"  stroke="#D97706" strokeWidth="0.85" strokeLinecap="round" opacity="0.7" />
      <line x1="12.5" y1="3.5" x2="9.5" y2="25.5"  stroke="#D97706" strokeWidth="0.85" strokeLinecap="round" opacity="0.7" />
      <line x1="15.5" y1="4.5" x2="12.5" y2="25.5" stroke="#D97706" strokeWidth="0.85" strokeLinecap="round" opacity="0.7" />
      <line x1="17.5" y1="7.5" x2="14.5" y2="25"   stroke="#D97706" strokeWidth="0.85" strokeLinecap="round" opacity="0.7" />
    </svg>
  )
}

const SIZE_MAP = {
  sm: { harp: 16, text: 'text-base' },
  md: { harp: 20, text: 'text-xl'  },
  lg: { harp: 28, text: 'text-3xl' },
}

export function VoadiLogo({ size = 'md', className = '' }: VoadiLogoProps) {
  const { harp, text } = SIZE_MAP[size]
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <HarpIcon height={harp} />
      <span className={`${text} font-bold leading-none tracking-tight text-white`}>
        VOADI
      </span>
    </span>
  )
}
