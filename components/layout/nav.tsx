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
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#2A1515] bg-[#140909]/95 pb-safe backdrop-blur-sm">
      <ul className="mx-auto flex max-w-lg">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`flex flex-col items-center gap-0.5 py-3 text-[10px] font-medium uppercase tracking-wider transition-colors ${
                  active ? 'text-[#F5EDD0]' : 'text-[#8B7B6B]'
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.5 : 2} aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
