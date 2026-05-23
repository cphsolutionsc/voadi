import { reportMissingPerson } from '@/lib/actions'

export const metadata = { title: 'Report Missing Person — VOADI' }

const INPUT = 'w-full rounded-lg border border-[#2A1515] bg-[#140909] px-4 py-3 text-sm text-[#F5EDD0] placeholder-[#5C4A3A] focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706]'

export default function ReportMissingPage() {
  return (
    <div className="py-2">
      <h1 className="mb-1 text-lg font-bold text-white">Report Missing Person</h1>
      <p className="mb-6 text-xs text-[#8B7B6B]">Reports are reviewed before appearing publicly. In emergencies, call 999.</p>

      <form action={reportMissingPerson} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#A89080]">Full name</label>
          <input name="fullName" required placeholder="Full name" className={INPUT} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#A89080]">Age (optional)</label>
          <input name="age" type="number" min="1" max="120" placeholder="Age" className={INPUT} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#A89080]">Last seen location</label>
          <input name="lastSeenLocation" required placeholder="e.g. Dublin city centre" className={INPUT} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#A89080]">Last seen date and time</label>
          <input name="lastSeenAt" type="datetime-local" required className={INPUT} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#A89080]">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            placeholder="Physical description, clothing, any other relevant details…"
            className={`${INPUT} resize-none`}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium text-[#A89080]">Contact information</label>
          <input name="contactInfo" required placeholder="Phone number or email for anyone with information" className={INPUT} />
        </div>
        <button
          type="submit"
          className="w-full rounded-xl bg-[#D97706] py-3.5 text-sm font-bold text-[#1C0D0D] transition-opacity hover:opacity-90"
        >
          Submit report
        </button>
      </form>
    </div>
  )
}
