export const dynamic = 'force-dynamic'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { SignOutButton } from './sign-out-button'
import { PushSubscribe } from '@/components/push/push-subscribe'
import { ChevronRight, Shield, Heart, MapPin, Globe, Calendar, User } from 'lucide-react'

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
  const roleFmt = role === 'super_admin' ? 'Super Admin' : role.charAt(0).toUpperCase() + role.slice(1)
  const isAdmin = role === 'admin' || role === 'moderator' || role === 'super_admin'

  return (
    <div className="py-2">

      {/* Identity card */}
      <div className="mb-5 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]">
        <div className="flex items-center gap-4 px-4 py-5">
          <div className="relative shrink-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111827] text-lg font-bold tracking-tight text-[#FFFFFF]">
              {initials}
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#D97706] text-[#111827] ring-2 ring-[#FFFFFF]">
              <User size={10} aria-hidden="true" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-[#111827]">{user.name}</p>
            <p className="truncate text-xs text-[#6B7280]">{user.email}</p>
          </div>
          <span className="shrink-0 rounded-full bg-[#FEF3C7] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#92400E]">
            {roleFmt}
          </span>
        </div>

        <div className="grid grid-cols-2 divide-x divide-[#E5E7EB] border-t border-[#E5E7EB]">
          <div className="flex items-center gap-2 px-4 py-3">
            <MapPin size={12} className="shrink-0 text-[#D97706]" aria-hidden="true" />
            <span className="truncate text-xs text-[#4B5563]">{(u.county as string) ?? 'No county set'}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-3">
            <Globe size={12} className="shrink-0 text-[#D97706]" aria-hidden="true" />
            <span className="truncate text-xs text-[#4B5563]">{(u.nationality as string) ?? 'No nationality'}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-[#E5E7EB] px-4 py-3">
          <Calendar size={12} className="shrink-0 text-[#9CA3AF]" aria-hidden="true" />
          <span className="text-xs text-[#9CA3AF]">Member since {joined}</span>
        </div>
      </div>

      {/* Actions */}
      {isAdmin && (
        <Link
          href="/admin"
          className="mb-2 flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 transition-colors hover:border-[#D97706]/50"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6] text-[#111827]">
            <Shield size={13} aria-hidden="true" />
          </div>
          <span className="flex-1 text-xs font-semibold text-[#111827]">Admin panel</span>
          <ChevronRight size={14} className="shrink-0 text-[#9CA3AF]" aria-hidden="true" />
        </Link>
      )}

      <Link
        href="/donate"
        className="mb-5 flex items-center gap-3 rounded-xl border border-[#D97706]/30 bg-[#FEF3C7]/40 px-4 py-3 transition-colors hover:bg-[#FEF3C7]/70"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#D97706]/15 text-[#D97706]">
          <Heart size={13} aria-hidden="true" />
        </div>
        <span className="flex-1 text-xs font-semibold text-[#D97706]">Support VOADI</span>
        <ChevronRight size={14} className="shrink-0 text-[#D97706]" aria-hidden="true" />
      </Link>

      {/* Push notifications */}
      <div className="mb-5">
        <PushSubscribe vapidPublicKey={process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''} />
      </div>

      {/* Legal */}
      <div className="mb-5 overflow-hidden rounded-xl border border-[#E5E7EB]">
        {[
          { label: 'Terms & Conditions', href: '/terms' },
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Transparency & Funding', href: '/transparency' },
        ].map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-between border-b border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 last:border-0 transition-colors hover:bg-[#F9FAFB]"
          >
            <span className="text-xs text-[#4B5563]">{label}</span>
            <ChevronRight size={14} className="shrink-0 text-[#9CA3AF]" aria-hidden="true" />
          </Link>
        ))}
      </div>

      <SignOutButton />
    </div>
  )
}
