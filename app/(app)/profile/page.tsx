export const dynamic = 'force-dynamic'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { SignOutButton } from './sign-out-button'

export const metadata = { title: 'Profile — VOADI' }

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect('/login')

  const { user } = session
  const joined = new Date(user.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const initials = user.name
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

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
        </div>
      </div>

      {/* Details */}
      <div className="mb-6 space-y-0 overflow-hidden rounded-xl border border-[#2A1515]">
        <Row label="County" value={(user as Record<string, unknown>).county as string ?? '—'} />
        <Row label="Member since" value={joined} />
        <Row label="Role" value={((user as Record<string, unknown>).role as string ?? 'member').charAt(0).toUpperCase() + ((user as Record<string, unknown>).role as string ?? 'member').slice(1)} />
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
