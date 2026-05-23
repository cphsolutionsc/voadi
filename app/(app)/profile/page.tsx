export const dynamic = 'force-dynamic'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { SignOutButton } from './sign-out-button'
import { PushSubscribe } from '@/components/push/push-subscribe'

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
      <h1 className="mb-6 text-lg font-bold text-[#111827]">Profile</h1>

      {/* Avatar + name */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#D97706] text-xl font-bold text-[#111827]">
          {initials}
        </div>
        <div>
          <p className="font-bold text-[#111827]">{user.name}</p>
          <p className="text-sm text-[#4B5563]">{user.email}</p>
          <span className="mt-1 inline-block rounded-full bg-[#E5E7EB] px-2 py-0.5 text-[10px] font-medium text-[#D97706]">
            {roleFmt}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="mb-6 overflow-hidden rounded-xl border border-[#E5E7EB]">
        <Row label="County" value={(u.county as string) ?? '—'} />
        <Row label="Nationality" value={(u.nationality as string) ?? '—'} />
        <Row label="Country of birth" value={(u.countryOfBirth as string) ?? '—'} />
        <Row label="Member since" value={joined} />
      </div>

      {/* Admin panel link — only visible to admins and moderators */}
      {(role === 'admin' || role === 'moderator') && (
        <Link
          href="/admin"
          className="mb-4 flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 hover:bg-[#E5E7EB]/50"
        >
          <span className="text-xs font-semibold text-[#111827]">Admin panel</span>
          <span className="text-xs text-[#D97706]">›</span>
        </Link>
      )}

      {/* Support VOADI */}
      <Link
        href="/donate"
        className="mb-4 flex items-center justify-between rounded-xl border border-[#D97706]/30 bg-[#D97706]/5 px-4 py-3 hover:bg-[#D97706]/10"
      >
        <span className="text-xs font-semibold text-[#D97706]">Support VOADI</span>
        <span className="text-xs text-[#D97706]">›</span>
      </Link>

      {/* Push notifications */}
      <div className="mb-6">
        <PushSubscribe vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''} />
      </div>

      {/* Legal links */}
      <div className="mb-6 overflow-hidden rounded-xl border border-[#E5E7EB]">
        {[
          { label: 'Terms & Conditions', href: '/terms' },
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Transparency & Funding', href: '/transparency' },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 last:border-0 hover:bg-[#E5E7EB]/50"
          >
            <span className="text-xs text-[#4B5563]">{label}</span>
            <span className="text-xs text-[#9CA3AF]">›</span>
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
    <div className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 last:border-0">
      <span className="text-xs text-[#4B5563]">{label}</span>
      <span className="text-sm text-[#111827]">{value}</span>
    </div>
  )
}
