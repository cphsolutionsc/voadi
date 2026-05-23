import type { Metadata } from 'next'
import { Section, H2, H3, P, UL, LI, Updated } from '../components'

export const metadata: Metadata = { title: 'Transparency & Funding — VOADI' }

export default function TransparencyPage() {
  return (
    <>
      <div className="mb-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#D97706]">Legal</p>
        <h1 className="text-3xl font-bold text-white">Transparency &amp; Funding</h1>
        <Updated date="23 May 2026" />
        <p className="mt-4 text-sm leading-relaxed text-[#8B7B6B]">
          We believe the community we serve has a right to know exactly who runs this platform, how it is funded, how money is spent, and what principles guide our decisions. This declaration is our commitment to that transparency.
        </p>
      </div>

      <div className="space-y-10 text-[#A89080]">

        {/* 1 */}
        <Section>
          <H2 n="1">Who Runs VOADI</H2>
          <P>
            VOADI is operated by the <strong className="text-[#F5EDD0]">Coalition of Africans Diaspora Ireland</strong> — a community organisation founded and led by members of the African diaspora in Ireland. We are not a subsidiary of any corporation, media organisation, government body, or political party.
          </P>
          <P>
            VOADI was founded with a single purpose: to give the African diaspora in Ireland a dedicated civic platform — one that we own, control, and operate entirely in our community's interest. Every decision about what the platform does and does not do is made with that purpose as the primary consideration.
          </P>
          <H3>Leadership &amp; governance</H3>
          <P>
            VOADI is governed by a coordinating committee whose members are drawn from the African diaspora community across Ireland. The platform operates without a single point of control — operational responsibilities are distributed across independent working groups (community, legal, technology, and communications) that each operate with autonomy within an agreed framework, coordinating through the central committee. Full details of our governance structure and committee membership are published on this page and updated annually.
          </P>
          <P>
            No single individual, county chapter, or working group can unilaterally make decisions that affect the platform's core mission, data policies, or financial commitments. Decisions on those matters require agreement from the coordinating committee.
          </P>
        </Section>

        {/* 2 */}
        <Section>
          <H2 n="2">How VOADI is Funded</H2>
          <P>
            VOADI operates on a community-supported funding model. We are not funded by advertising, and we do not sell user data. We do not accept undisclosed funding from any source.
          </P>

          <H3>Current funding sources</H3>
          <div className="space-y-3">
            {[
              {
                source: 'Voluntary community contributions',
                detail: 'Individual members of the African diaspora community who choose to make a voluntary financial contribution to support the platform. These are the foundation of our funding model.',
                status: 'Active',
                colour: 'text-[#16A34A]',
              },
              {
                source: 'Community grants',
                detail: 'We apply for grants from bodies such as Pobal (Community Services Programme), the Ireland Against Racism Fund, and other public or philanthropic grant programmes whose objectives align with our mission. All grants accepted are publicly disclosed below.',
                status: 'Active',
                colour: 'text-[#16A34A]',
              },
              {
                source: 'Institutional partnerships',
                detail: 'We may enter into partnerships with universities, community organisations, or public bodies for specific research or programme delivery. Any such partnership is disclosed here and subject to an editorial independence clause — no partner can influence platform content or moderation decisions.',
                status: 'None current',
                colour: 'text-[#D97706]',
              },
            ].map(({ source, detail, status, colour }) => (
              <div key={source} className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold text-[#F5EDD0]">{source}</span>
                  <span className={`shrink-0 text-[10px] font-bold uppercase tracking-wide ${colour}`}>{status}</span>
                </div>
                <p className="text-xs leading-relaxed text-[#8B7B6B]">{detail}</p>
              </div>
            ))}
          </div>

          <H3>Funding we do not accept</H3>
          <UL>
            <LI>Funding from political parties, political campaigns, or candidates for public office.</LI>
            <LI>Funding from any government or state body that would create a conflict of interest with our advocacy work.</LI>
            <LI>Funding from any organisation that requires editorial control, content influence, or access to user data as a condition of funding.</LI>
            <LI>Advertising revenue of any kind — there are no advertisements on VOADI and there will be no advertisements in the future.</LI>
            <LI>Funding from organisations whose activities are inconsistent with the rights and welfare of the African diaspora community.</LI>
          </UL>
        </Section>

        {/* 3 */}
        <Section>
          <H2 n="3">Where the Money Goes</H2>
          <P>
            All funds received by VOADI are used exclusively for the following purposes. We publish a summary breakdown annually.
          </P>
          <div className="overflow-hidden rounded-xl border border-[#2A1515]">
            {[
              ['Platform infrastructure', 'Server hosting, database, CDN, domain registration, and technical maintenance of the platform.'],
              ['Platform development', 'Building and improving platform features — including accessibility improvements, the resources directory, and community tools.'],
              ['Legal advocacy', 'Supporting members with legal resources, funding Know Your Rights content, and engaging with Irish public authorities on matters affecting the community.'],
              ['Community programmes', 'Supporting community events, outreach, and the operational costs of the coordinating committee.'],
              ['Administration', 'Essential administrative costs including accounting, insurance, and regulatory compliance. Administration will never exceed 15% of total expenditure.'],
            ].map(([cat, desc]) => (
              <div key={cat} className="flex flex-col gap-1 border-b border-[#2A1515] bg-[#1E0E0E] px-4 py-3 last:border-0 sm:flex-row sm:items-start sm:gap-4">
                <span className="w-44 shrink-0 text-xs font-semibold text-[#F5EDD0]">{cat}</span>
                <span className="text-xs leading-relaxed text-[#8B7B6B]">{desc}</span>
              </div>
            ))}
          </div>
          <P>
            No funds are used to pay salaries, dividends, or personal benefits to any member of the coordinating committee or working groups. VOADI currently operates entirely on a volunteer basis.
          </P>
        </Section>

        {/* 4 */}
        <Section>
          <H2 n="4">Grants &amp; Donations Register</H2>
          <P>
            The following table records all grants and institutional donations received by VOADI above €500. This register is updated within 30 days of receipt of any new funding.
          </P>
          <div className="overflow-hidden rounded-xl border border-[#2A1515]">
            <div className="grid grid-cols-3 gap-3 border-b border-[#2A1515] bg-[#140909] px-4 py-2.5 text-[9px] font-bold uppercase tracking-widest text-[#5C4040]">
              <span>Source</span>
              <span>Amount</span>
              <span>Purpose</span>
            </div>
            <div className="bg-[#1E0E0E] px-4 py-6 text-center text-xs text-[#3D2828]">
              No grants or institutional donations have been received to date.
            </div>
          </div>
          <P>
            Aggregate voluntary community contributions will be reported in our annual transparency report, published each January for the preceding calendar year.
          </P>
        </Section>

        {/* 5 */}
        <Section>
          <H2 n="5">Editorial Independence</H2>
          <P>
            VOADI's editorial decisions — what appears in the resources directory, what community content is moderated, what petitions are hosted, what guidance is published — are made entirely by the VOADI team on the basis of community benefit. They are not influenced by funders, grant bodies, partners, or any external organisation.
          </P>
          <P>
            Any organisation listed in our resources directory has been included on merit — because it provides genuine, free, or accessible support to our community. We do not charge for inclusion in the directory. We do not accept payment, sponsorship, or advertising from organisations in exchange for inclusion, prominence, or positive description.
          </P>
          <P>
            The "hidden gem" designation on certain resources indicates services that our research has identified as significantly underused by the community. It is an editorial judgement, not a commercial arrangement.
          </P>
          <P>
            If you believe a resource listing is inaccurate, outdated, or that an organisation's conduct is inconsistent with the welfare of our community, please contact us at <strong className="text-[#F5EDD0]">resources@voadi.org</strong>.
          </P>
        </Section>

        {/* 6 */}
        <Section>
          <H2 n="6">Your Data &amp; Why We Collect It</H2>
          <P>
            We collect the minimum data necessary to operate a community platform that is genuinely useful to its members. Full details are in our <a href="/privacy" className="text-[#D97706] underline underline-offset-2 hover:text-[#F5EDD0]">Privacy Policy</a>. Here is a plain-English summary:
          </P>
          <div className="space-y-2">
            {[
              {
                field: 'Name & email',
                why: 'To create your account and communicate with you about the platform.',
                basis: 'Contract (account creation)',
              },
              {
                field: 'County of residence',
                why: 'To connect you with county-specific events, resources, and community groups.',
                basis: 'Contract / Consent',
              },
              {
                field: 'Nationality & country of birth',
                why: 'Optional. Helps us understand the diversity of our community and tailor the resources directory to the specific needs of different diaspora groups (e.g., resources relevant to Nigerian nationals differ from those relevant to Ghanaian nationals). We treat this as special category data.',
                basis: 'Explicit consent (Article 9(2)(a) GDPR)',
              },
            ].map(({ field, why, basis }) => (
              <div key={field} className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] p-4">
                <p className="mb-1 text-sm font-semibold text-[#F5EDD0]">{field}</p>
                <p className="mb-1.5 text-xs leading-relaxed text-[#8B7B6B]">{why}</p>
                <span className="rounded-full bg-[#2A1515] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#D97706]">
                  {basis}
                </span>
              </div>
            ))}
          </div>
          <P>
            We do not sell your data. We do not share your data with advertisers. We do not use your data to profile you for commercial purposes. We do not share your nationality or country of birth with any third party. Full data retention schedules and your rights are in our Privacy Policy.
          </P>
        </Section>

        {/* 7 */}
        <Section>
          <H2 n="7">Accountability &amp; Annual Reports</H2>
          <P>
            VOADI publishes an annual transparency report each January covering:
          </P>
          <UL>
            <LI>Total income received in the preceding calendar year, broken down by source category.</LI>
            <LI>Total expenditure broken down by the categories in Section 3 above.</LI>
            <LI>A register of all grants and institutional donations above €500 received during the year.</LI>
            <LI>A summary of content moderation activity (number of reports received, content removed, account actions taken).</LI>
            <LI>Any material changes to the platform's data processing activities.</LI>
            <LI>Any changes to the coordinating committee's composition.</LI>
          </UL>
          <P>
            Annual reports are published on this page and remain publicly accessible indefinitely.
          </P>
          <div className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] px-4 py-5 text-center">
            <p className="text-xs text-[#3D2828]">First annual report will be published January 2027, covering the 2026 financial year.</p>
          </div>
        </Section>

        {/* 8 */}
        <Section>
          <H2 n="8">How to Raise Concerns</H2>
          <P>
            If you have concerns about VOADI's funding, governance, editorial decisions, or data practices, we want to hear from you.
          </P>
          <div className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] divide-y divide-[#2A1515]">
            {[
              ['Transparency concerns', 'transparency@voadi.org'],
              ['Resources directory', 'resources@voadi.org'],
              ['Data & privacy', 'privacy@voadi.org'],
              ['General', 'hello@voadi.org'],
            ].map(([label, email]) => (
              <div key={email} className="flex items-center justify-between px-4 py-3">
                <span className="text-xs text-[#5C4040]">{label}</span>
                <a href={`mailto:${email}`} className="text-sm text-[#D97706] hover:text-[#F5EDD0]">{email}</a>
              </div>
            ))}
          </div>
        </Section>

      </div>
    </>
  )
}
