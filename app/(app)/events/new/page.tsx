'use client'

import { useState } from 'react'
import { createEvent } from '@/lib/actions'

const COUNTIES = [
  'Carlow','Cavan','Clare','Cork','Donegal','Dublin','Galway','Kerry','Kildare',
  'Kilkenny','Laois','Leitrim','Limerick','Longford','Louth','Mayo','Meath',
  'Monaghan','Offaly','Roscommon','Sligo','Tipperary','Waterford','Westmeath',
  'Wexford','Wicklow',
]

const INPUT = 'w-full rounded-lg border border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 text-sm text-[#111827] placeholder-[#9CA3AF] transition-colors focus:border-[#D97706] focus:outline-none focus:ring-1 focus:ring-[#D97706]'
const LABEL = 'mb-1.5 block text-xs font-semibold text-[#4B5563]'

export default function NewEventPage() {
  const [eventType, setEventType] = useState<'in_person' | 'virtual'>('in_person')

  return (
    <div className="py-2">
      <h1 className="mb-1 text-lg font-bold text-[#111827]">Create an event</h1>
      <p className="mb-6 text-xs text-[#4B5563]">Events are visible to all members.</p>

      <form action={createEvent} className="space-y-4">
        {/* Event type toggle */}
        <div>
          <label className={LABEL}>Event type</label>
          <div className="flex gap-2">
            {(['in_person', 'virtual'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setEventType(t)}
                className={`flex-1 rounded-lg border py-2.5 text-xs font-semibold transition-colors ${
                  eventType === t
                    ? 'border-[#D97706] bg-[#FEF3C7] text-[#92400E]'
                    : 'border-[#E5E7EB] text-[#6B7280]'
                }`}
              >
                {t === 'in_person' ? 'In person' : 'Virtual'}
              </button>
            ))}
          </div>
          <input type="hidden" name="eventType" value={eventType} />
        </div>

        <div>
          <label htmlFor="title" className={LABEL}>Event name</label>
          <input id="title" name="title" type="text" required maxLength={120}
            placeholder="What is the event called?" className={INPUT} />
        </div>
        <div>
          <label htmlFor="description" className={LABEL}>Description</label>
          <textarea id="description" name="description" required rows={4} maxLength={1000}
            placeholder="What will happen? Who should come?"
            className={`${INPUT} resize-none`} />
        </div>

        {eventType === 'in_person' && (
          <div>
            <label htmlFor="location" className={LABEL}>Location</label>
            <input id="location" name="location" type="text" maxLength={200}
              placeholder="Address or venue name" className={INPUT} />
          </div>
        )}

        <div>
          <label htmlFor="county" className={LABEL}>County</label>
          <select id="county" name="county" required className={`${INPUT} appearance-none`}>
            <option value="" className="bg-[#FFFFFF]">Select county</option>
            {COUNTIES.map(c => <option key={c} value={c} className="bg-[#FFFFFF]">{c}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="startsAt" className={LABEL}>Start date &amp; time</label>
          <input id="startsAt" name="startsAt" type="datetime-local" required className={INPUT} />
        </div>

        {eventType === 'virtual' && (
          <div>
            <label htmlFor="endsAt" className={LABEL}>
              End date &amp; time <span className="font-normal text-[#9CA3AF]">(for scheduling)</span>
            </label>
            <input id="endsAt" name="endsAt" type="datetime-local" className={INPUT} />
          </div>
        )}

        <button type="submit"
          className="w-full rounded-lg bg-[#D97706] py-3 text-sm font-bold text-[#111827] transition-opacity hover:opacity-90">
          Create event
        </button>
      </form>
    </div>
  )
}
