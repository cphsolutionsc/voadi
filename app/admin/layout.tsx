import Link from 'next/link'
import { VoadiLogo } from '@/components/voadi-logo'
import { LayoutDashboard, Users, CalendarDays, FileText, Bell } from 'lucide-react'

const NAV = [
  { href: '/admin',           label: 'Dashboard',  Icon: LayoutDashboard },
  { href: '/admin/members',   label: 'Members',    Icon: Users },
  { href: '/admin/events',    label: 'Events',     Icon: CalendarDays },
  { href: '/admin/petitions', label: 'Petitions',  Icon: FileText },
  { href: '/admin/missing',   label: 'Missing',    Icon: Bell },
  { href: '/admin/push',      label: 'Push',       Icon: Bell },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-[#0A0404]">
      {/* Sidebar — desktop only */}
      <aside className="hidden w-52 shrink-0 flex-col border-r border-[#2A1515] bg-[#0D0505] lg:flex">
        <div className="border-b border-[#2A1515] px-5 py-5">
          <VoadiLogo size="sm" />
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#D97706]">Admin</p>
        </div>
        <nav className="flex-1 space-y-0.5 px-2 py-4">
          {NAV.map(({ href, label, Icon }) => (
            <Link key={href} href={href}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#5C4040] transition-colors hover:bg-[#2A1515] hover:text-[#F5EDD0]">
              <Icon size={14} aria-hidden="true" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-[#2A1515] px-4 py-4">
          <Link href="/feed" className="text-xs text-[#3D2020] hover:text-[#8B7B6B]">
            &larr; Back to app
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-[#2A1515] bg-[#0D0505] px-4 py-3 lg:hidden">
        <VoadiLogo size="sm" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]">Admin</span>
        <Link href="/feed" className="text-xs text-[#5C4040]">Exit</Link>
      </div>

      <main className="flex-1 overflow-auto px-4 pb-10 pt-16 lg:px-8 lg:pt-8">
        {children}
      </main>
    </div>
  )
}
