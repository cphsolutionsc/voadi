import Link from 'next/link'
import { VoadiLogo } from '@/components/voadi-logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F9FAFB] px-4 py-12">
      {/* Ambient amber glow — top right */}
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-30"
        style={{ background: 'radial-gradient(circle, #D97706 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      {/* Ambient amber glow — bottom left */}
      <div
        className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #D97706 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex w-full max-w-[420px] flex-col">
        {/* Logo */}
        <div className="mb-7 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-1.5">
            <VoadiLogo size="lg" />
            <span className="text-[10px] uppercase tracking-widest text-[#9CA3AF]">
              Voices of Africans Diaspora Ireland
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          {/* Amber top accent line */}
          <div className="h-1 w-full bg-[#D97706]" />
          <div className="p-8">
            {children}
          </div>
        </div>

        <p className="mt-7 text-center text-[10px] text-[#9CA3AF]">
          © 2026 VOADI · Coalition of Africans Diaspora Ireland
        </p>
      </div>
    </div>
  )
}
