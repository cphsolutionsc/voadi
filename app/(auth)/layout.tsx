import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#1C0D0D] px-4 py-12">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block text-2xl font-bold tracking-tight text-white">
          VOADI<span className="text-[#16a34a]">.</span>
        </Link>
        <p className="mt-1 text-xs text-[#5C4A3A]">Voices of Africans Diaspora Ireland</p>
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
