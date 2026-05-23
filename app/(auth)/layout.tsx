import Link from 'next/link'
import { VoadiLogo } from '@/components/voadi-logo'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1C0D0D] px-4 py-12">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex flex-col items-center gap-1.5">
          <VoadiLogo size="lg" />
          <span className="text-xs text-[#8B7B6B]">Voices of Africans Diaspora Ireland</span>
        </Link>
      </div>
      <div className="w-full max-w-[420px] rounded-2xl border border-[#2A1515] bg-[#1E0E0E] p-8">
        {children}
      </div>
      <p className="mt-8 text-xs text-[#3D2020]">
        © 2026 VOADI · Coalition of Africans Diaspora Ireland
      </p>
    </div>
  )
}
