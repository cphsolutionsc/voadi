'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, CalendarDays, FileText, BookOpen, Users } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/feed',      label: 'Feed',      Icon: Home },
  { href: '/events',    label: 'Events',    Icon: CalendarDays },
  { href: '/petitions', label: 'Petitions', Icon: FileText },
  { href: '/resources', label: 'Resources', Icon: BookOpen },
  { href: '/help',      label: 'Help',      Icon: Users },
] as const

export function Nav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-6" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
      <nav
        className="relative flex items-center rounded-full border border-white/[0.08] bg-[#0D0505]/75 px-2 py-2 shadow-[0_8px_40px_rgba(0,0,0,0.8),0_0_0_0.5px_rgba(255,255,255,0.04)_inset] backdrop-blur-2xl"
        style={{ WebkitBackdropFilter: 'blur(24px)' }}
      >
        {/* Subtle top-edge highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <ul className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="relative flex flex-col items-center gap-0.5 px-3 py-1.5"
                  aria-label={label}
                >
                  {/* Active pill background */}
                  {active && (
                    <span className="absolute inset-0 rounded-full bg-[#D97706] shadow-[0_0_16px_rgba(217,119,6,0.45)]" />
                  )}

                  <Icon
                    size={19}
                    strokeWidth={active ? 2.4 : 1.7}
                    className={`relative z-10 transition-colors duration-200 ${
                      active ? 'text-[#1C0D0D]' : 'text-[#6B4A4A]'
                    }`}
                    aria-hidden="true"
                  />
                  <span className={`relative z-10 text-[8px] font-bold uppercase tracking-widest transition-colors duration-200 ${
                    active ? 'text-[#1C0D0D]' : 'text-[#4A2A2A]'
                  }`}>
                    {label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
