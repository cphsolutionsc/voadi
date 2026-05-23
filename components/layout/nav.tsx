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
    <div
      className="fixed bottom-0 left-0 right-0 z-50 flex justify-center px-6"
      style={{
        paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))',
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    >
      <nav
        className="relative flex items-center rounded-full border border-[#E5E7EB] bg-white/90 px-2 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.12)] backdrop-blur-2xl"
        style={{ WebkitBackdropFilter: 'blur(24px)' }}
      >
        {/* Subtle top-edge highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-black/5 to-transparent" />

        <ul className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="flex flex-col items-center gap-0.5 px-3 py-1"
                  aria-label={label}
                >
                  {/* Icon with amber pill only when active */}
                  <span className={`relative flex items-center justify-center rounded-full px-3 py-1.5 transition-all duration-200 ${
                    active
                      ? 'bg-[#D97706] shadow-[0_0_16px_rgba(217,119,6,0.45)]'
                      : ''
                  }`}>
                    <Icon
                      size={18}
                      strokeWidth={active ? 2.4 : 1.7}
                      className={`transition-colors duration-200 ${
                        active ? 'text-[#FFFFFF]' : 'text-[#9CA3AF]'
                      }`}
                      aria-hidden="true"
                    />
                  </span>

                  {/* Label always outside the pill */}
                  <span className={`text-[8px] font-bold uppercase tracking-widest transition-colors duration-200 ${
                    active ? 'text-[#D97706]' : 'text-[#9CA3AF]'
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
