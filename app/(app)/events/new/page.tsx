import { createEvent } from '@/lib/actions'

export const metadata = { title: 'Create Event — VOADI' }

const COUNTIES = [
  'Carlow','Cavan','Clare','Cork','Donegal','Dublin','Galway','Kerry','Kildare',
  'Kilkenny','Laois','Leitrim','Limerick','Longford','Louth','Mayo','Meath',
  'Monaghan','Offaly','Roscommon','Sligo','Tipperary','Waterford','Westmeath',
  'Wexford','Wicklow',
]

const INPUT = 'w-full rounded-lg border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] transition-colors focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706]'

export default function NewEventPage() {
  return (
    <div className="py-2">
      <h1 className="mb-1 text-lg font-bold text-[#111827]">Create an event</h1>
      <p className="mb-6 text-xs text-[#4B5563]">Events are visible to all members.</p>

      <form action={createEvent} className="space-y-4">
        <div>
          <label htmlFor="title" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">Event name</label>
          <input id="title" name="title" type="text" required maxLength={120}
            placeholder="What is the event called?"
            className={INPUT} />
        </div>
        <div>
          <label htmlFor="description" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">Description</label>
          <textarea id="description" name="description" required rows={4} maxLength={1000}
            placeholder="What will happen? Who should come?"
            className={`${INPUT} resize-none`} />
        </div>
        <div>
          <label htmlFor="location" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">Location</label>
          <input id="location" name="location" type="text" required maxLength={200}
            placeholder="Address or venue name"
            className={INPUT} />
        </div>
        <div>
          <label htmlFor="county" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">County</label>
          <select id="county" name="county" required className={`${INPUT} appearance-none`}>
            <option value="" className="bg-[#FFFFFF]">Select county</option>
            {COUNTIES.map(c => <option key={c} value={c} className="bg-[#FFFFFF]">{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="startsAt" className="mb-1.5 block text-xs font-semibold text-[#4B5563]">Date &amp; time</label>
          <input id="startsAt" name="startsAt" type="datetime-local" required
            className={INPUT} />
        </div>
        <button type="submit"
          className="w-full rounded-lg bg-[#D97706] py-3 text-sm font-bold text-[#111827] transition-opacity hover:opacity-90">
          Create event
        </button>
      </form>
    </div>
  )
}
