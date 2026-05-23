import Link from 'next/link'
import { VoadiLogo } from '@/components/voadi-logo'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-[#FFFFFF]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-[#FFFFFF]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-4">
          <Link href="/" className="inline-flex items-center">
            <VoadiLogo size="sm" />
          </Link>
          <Link
            href="/feed"
            className="rounded-full border border-[#E5E7EB] px-4 py-1.5 text-xs font-semibold text-[#4B5563] transition-colors hover:border-[#D97706]/50 hover:text-[#111827]"
          >
            Back to app
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-2xl px-5 py-10 pb-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] px-5 py-8">
        <div className="mx-auto max-w-2xl flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-[#9CA3AF]">© 2026 VOADI — Coalition of Africans Diaspora Ireland</p>
          <nav className="flex gap-4 text-xs text-[#9CA3AF]">
            <Link href="/terms" className="hover:text-[#4B5563]">Terms</Link>
            <Link href="/privacy" className="hover:text-[#4B5563]">Privacy</Link>
            <Link href="/transparency" className="hover:text-[#4B5563]">Transparency</Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
