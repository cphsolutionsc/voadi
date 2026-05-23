'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  AlertCircle,
  Bell,
  MessageSquare,
} from 'lucide-react'

const NAV = [
  { href: '/admin',           label: 'Dashboard',  Icon: LayoutDashboard, exact: true },
  { href: '/admin/members',   label: 'Members',    Icon: Users,           exact: false },
  { href: '/admin/events',    label: 'Events',     Icon: CalendarDays,    exact: false },
  { href: '/admin/petitions', label: 'Petitions',  Icon: FileText,        exact: false },
  { href: '/admin/missing',   label: 'Missing',    Icon: AlertCircle,     exact: false },
  { href: '/admin/help',      label: 'Help',       Icon: MessageSquare,   exact: false },
  { href: '/admin/push',      label: 'Push',       Icon: Bell,            exact: false },
] as const

function isActive(pathname: string, href: string, exact: boolean): boolean {
  return exact ? pathname === href : pathname.startsWith(href)
}

/** Sidebar nav — renders inside the desktop aside */
export function AdminNav() {
  const pathname = usePathname()

  return (
    <>
      {NAV.map(({ href, label, Icon, exact }) => {
        const active = isActive(pathname, href, exact)
        return (
          <Link
            key={href}
            href={href}
            className={
              active
                ? 'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-bold bg-[#D97706]/10 text-[#D97706] transition-colors'
                : 'flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#6B7280] transition-colors hover:bg-[#F3F4F6] hover:text-[#111827]'
            }
          >
            <Icon size={14} aria-hidden="true" />
            {label}
          </Link>
        )
      })}
    </>
  )
}

/** Mobile bottom tab bar — fixed strip, shown only below lg breakpoint */
export function AdminMobileNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Admin mobile navigation"
      className="fixed bottom-0 left-0 right-0 z-10 flex items-stretch border-t border-[#E5E7EB] bg-[#FFFFFF] lg:hidden"
    >
      {NAV.map(({ href, label, Icon, exact }) => {
        const active = isActive(pathname, href, exact)
        return (
          <Link
            key={href}
            href={href}
            className={
              active
                ? 'flex flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-bold text-[#D97706] transition-colors'
                : 'flex flex-1 flex-col items-center gap-0.5 px-1 py-2 text-[10px] font-semibold text-[#6B7280] transition-colors hover:text-[#111827]'
            }
          >
            <Icon size={18} aria-hidden="true" />
            <span className="leading-none">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
