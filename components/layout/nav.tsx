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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0E0606]/98 pb-safe backdrop-blur-md">
      {/* Subtle top border glow */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[#2A1515] to-transparent" />

      <ul className="mx-auto flex max-w-lg px-2 py-1">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="relative flex flex-col items-center gap-1 px-1 py-2 transition-colors"
              >
                {/* Active pill background */}
                <span
                  className={`absolute inset-x-1.5 inset-y-1 rounded-xl transition-all duration-200 ${
                    active ? 'bg-[#2A1515]' : 'bg-transparent'
                  }`}
                />

                {/* Icon */}
                <span className={`relative transition-colors duration-200 ${
                  active ? 'text-[#D97706]' : 'text-[#5C4040]'
                }`}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} aria-hidden="true" />
                  {/* Active dot indicator */}
                  {active && (
                    <span className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#D97706]" />
                  )}
                </span>

                {/* Label */}
                <span className={`relative text-[9px] font-semibold uppercase tracking-widest transition-colors duration-200 ${
                  active ? 'text-[#D97706]' : 'text-[#4A3030]'
                }`}>
                  {label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
