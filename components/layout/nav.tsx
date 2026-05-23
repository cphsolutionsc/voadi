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
    <div className="fixed bottom-0 left-0 right-0 z-40 px-3 pb-5 pb-safe">
      <nav className="overflow-hidden rounded-2xl border border-[#3D2020] bg-[#0A0404]/95 shadow-[0_-4px_32px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        {/* Amber shimmer line across the top */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D97706]/40 to-transparent" />

        <ul className="flex px-1 py-2">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <li key={href} className="flex-1">
                <Link
                  href={href}
                  className="flex flex-col items-center gap-1 py-1"
                >
                  {/* Icon container */}
                  <span className={`relative flex items-center justify-center rounded-xl px-4 py-1.5 transition-all duration-200 ${
                    active
                      ? 'bg-[#D97706] shadow-[0_0_12px_rgba(217,119,6,0.4)]'
                      : 'bg-transparent'
                  }`}>
                    <Icon
                      size={19}
                      strokeWidth={active ? 2.5 : 1.8}
                      className={`transition-colors duration-200 ${active ? 'text-[#1C0D0D]' : 'text-[#5C4040]'}`}
                      aria-hidden="true"
                    />
                  </span>

                  {/* Label */}
                  <span className={`text-[9px] font-bold uppercase tracking-widest transition-colors duration-200 ${
                    active ? 'text-[#D97706]' : 'text-[#3D2828]'
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
