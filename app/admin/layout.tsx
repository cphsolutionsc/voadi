import Link from 'next/link'
import { VoadiLogo } from '@/components/voadi-logo'
import { AdminNav, AdminMobileNav } from '@/components/admin/nav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh bg-[#FFFFFF]">
      {/* Sidebar — desktop only */}
      <aside className="hidden w-52 shrink-0 flex-col border-r border-[#E5E7EB] bg-[#FFFFFF] lg:flex">
        <div className="border-b border-[#E5E7EB] px-5 py-5">
          <VoadiLogo size="sm" />
          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#D97706]">Admin</p>
        </div>
        <nav className="flex-1 space-y-0.5 px-2 py-4">
          <AdminNav />
        </nav>
        <div className="border-t border-[#E5E7EB] px-4 py-4">
          <Link href="/feed" className="text-xs text-[#9CA3AF] hover:text-[#4B5563]">
            &larr; Back to app
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between border-b border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 lg:hidden">
        <VoadiLogo size="sm" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#D97706]">Admin</span>
        <Link href="/feed" className="text-xs text-[#6B7280]">Exit</Link>
      </div>

      <main className="flex-1 overflow-auto px-4 pb-20 pt-16 lg:px-8 lg:pb-10 lg:pt-8">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <AdminMobileNav />
    </div>
  )
}
