export const dynamic = 'force-dynamic'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { SignOutButton } from './sign-out-button'

export const metadata = { title: 'Profile — VOADI' }

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const { user } = session
  const u = user as Record<string, unknown>
  const joined = new Date(user.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const initials = user.name
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const role = ((u.role as string) ?? 'member')
  const roleFmt = role.charAt(0).toUpperCase() + role.slice(1)

  return (
    <div className="py-2">
      <h1 className="mb-6 text-lg font-bold text-white">Profile</h1>

      {/* Avatar + name */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D97706] text-xl font-bold text-[#1C0D0D]">
          {initials}
        </div>
        <div>
          <p className="font-bold text-white">{user.name}</p>
          <p className="text-sm text-[#8B7B6B]">{user.email}</p>
          <span className="mt-1 inline-block rounded-full bg-[#2A1515] px-2 py-0.5 text-[10px] font-medium text-[#D97706]">
            {roleFmt}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="mb-6 overflow-hidden rounded-xl border border-[#2A1515]">
        <Row label="County" value={(u.county as string) ?? '—'} />
        <Row label="Nationality" value={(u.nationality as string) ?? '—'} />
        <Row label="Country of birth" value={(u.countryOfBirth as string) ?? '—'} />
        <Row label="Member since" value={joined} />
      </div>

      {/* Legal links */}
      <div className="mb-6 overflow-hidden rounded-xl border border-[#2A1515]">
        {[
          { label: 'Terms & Conditions', href: '/terms' },
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Transparency & Funding', href: '/transparency' },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between border-b border-[#2A1515] bg-[#1E0E0E] px-4 py-3 last:border-0 hover:bg-[#2A1515]/50"
          >
            <span className="text-xs text-[#8B7B6B]">{label}</span>
            <span className="text-xs text-[#3D2020]">›</span>
          </Link>
        ))}
      </div>

      {/* Sign out */}
      <SignOutButton />
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#2A1515] bg-[#1E0E0E] px-4 py-3 last:border-0">
      <span className="text-xs text-[#8B7B6B]">{label}</span>
      <span className="text-sm text-[#F5EDD0]">{value}</span>
    </div>
  )
}
