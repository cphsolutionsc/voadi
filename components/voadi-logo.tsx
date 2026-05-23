interface VoadiLogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// The V in VOADI IS the harp:
//  - left stroke  = forepillar  (straight diagonal)
//  - right stroke = neck        (slight outward curve)
//  - amber arc    = crown       (connects at the top)
//  - amber lines  = strings     (span the interior, shortening as V narrows)
function HarpV({ px }: { px: number }) {
  const w = Math.round(px * 0.68)
  return (
    <svg
      width={w}
      height={px}
      viewBox="0 0 17 25"
      fill="none"
      aria-hidden="true"
      style={{ display: 'inline-block', flexShrink: 0 }}
    >
      {/* Forepillar — left diagonal stroke */}
      <path d="M1.5 1.5 L8.5 23.5" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      {/* Neck / soundbox — right diagonal, slight outward bow */}
      <path d="M15.5 1.5 C17.5 7 16 16 8.5 23.5" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      {/* Crown arc — amber, connects top of both strokes */}
      <path d="M1.5 1.5 C3.5 -1.5 13.5 -1.5 15.5 1.5" stroke="#D97706" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      {/* Strings — amber, span from forepillar to neck, 3 rows */}
      <line x1="3.5"  y1="7.5"  x2="14.5" y2="7"   stroke="#D97706" strokeWidth="1.5"  strokeLinecap="round" opacity="0.95" />
      <line x1="5.5"  y1="13"   x2="13"   y2="13"   stroke="#D97706" strokeWidth="1.4"  strokeLinecap="round" opacity="0.95" />
      <line x1="7.5"  y1="18.5" x2="11"   y2="18.5" stroke="#D97706" strokeWidth="1.3"  strokeLinecap="round" opacity="0.95" />
    </svg>
  )
}

const SIZE_MAP = {
  sm: { px: 17, textCls: 'text-base'  },
  md: { px: 22, textCls: 'text-[22px]' },
  lg: { px: 30, textCls: 'text-3xl'   },
}

export function VoadiLogo({ size = 'md', className = '' }: VoadiLogoProps) {
  const { px, textCls } = SIZE_MAP[size]
  return (
    <span className={`inline-flex items-end gap-[1px] ${className}`}>
      <HarpV px={px} />
      <span
        className={`${textCls} font-bold leading-none tracking-tight text-white`}
        style={{ letterSpacing: '-0.02em' }}
      >
        OADI
      </span>
    </span>
  )
}
