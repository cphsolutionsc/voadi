import { reportMissingPerson } from '@/lib/actions'

export const metadata = { title: 'Report Missing Person — VOADI' }

const INPUT = 'w-full rounded-lg border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706]'

export default function ReportMissingPage() {
  return (
    <div className="py-2">
      <h1 className="mb-1 text-lg font-bold text-[#111827]">Report Missing Person</h1>
      <p className="mb-6 text-xs text-[#4B5563]">Reports are reviewed before appearing publicly. In emergencies, call 999.</p>

      <form action={reportMissingPerson} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">Full name</label>
          <input name="fullName" required placeholder="Full name" className={INPUT} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">Age (optional)</label>
          <input name="age" type="number" min="1" max="120" placeholder="Age" className={INPUT} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">Last seen location</label>
          <input name="lastSeenLocation" required placeholder="e.g. Dublin city centre" className={INPUT} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">Last seen date and time</label>
          <input name="lastSeenAt" type="datetime-local" required className={INPUT} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Physical description, clothing, any other relevant details…"
            className={`${INPUT} resize-none`}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">Contact information</label>
          <input name="contactInfo" required placeholder="Phone number or email for anyone with information" className={INPUT} />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-[#D97706] py-3.5 text-sm font-bold text-[#111827] transition-opacity hover:opacity-90"
        >
          Submit report
        </button>
      </form>
    </div>
  )
}
