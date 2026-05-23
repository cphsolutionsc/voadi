import type { Metadata } from 'next'
import { Section, H2, H3, P, UL, LI, Updated } from '../components'

export const metadata: Metadata = { title: 'Privacy Policy — VOADI' }

export default function PrivacyPage() {
  return (
    <>
      <div className="mb-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#D97706]">Legal</p>
        <h1 className="text-3xl font-bold text-[#111827]">Privacy Policy</h1>
        <Updated date="23 May 2026" />
        <p className="mt-4 text-sm leading-relaxed text-[#4B5563]">
          This policy explains what personal data VOADI collects, why we collect it, how we use it, and your rights under the GDPR and the Data Protection Act 2018 (Ireland).
        </p>
      </div>

      <div className="space-y-10 text-[#6B7280]">

        {/* 1 */}
        <Section>
          <H2 n="1">Data Controller</H2>
          <P>
            The data controller for all personal data collected through the VOADI platform is the <strong className="text-[#111827]">Coalition of Africans Diaspora Ireland</strong>, operating as VOADI. Contact: <strong className="text-[#111827]">privacy@voadi.org</strong>.
          </P>
          <P>
            You have the right to lodge a complaint with the Irish Data Protection Commission (DPC) at any time: <a href="https://www.dataprotection.ie" className="text-[#D97706] underline underline-offset-2 hover:text-[#111827]" target="_blank" rel="noopener noreferrer">dataprotection.ie</a> · +353 57 868 4800.
          </P>
        </Section>

        {/* 2 */}
        <Section>
          <H2 n="2">What Data We Collect &amp; Why</H2>

          <H3>Account data</H3>
          <UL>
            <LI><strong className="text-[#111827]">Full name</strong> — to identify your account and personalise your experience. Legal basis: performance of contract (Article 6(1)(b) GDPR).</LI>
            <LI><strong className="text-[#111827]">Email address</strong> — for account login, security notifications, and platform communications. Legal basis: performance of contract (Article 6(1)(b) GDPR).</LI>
            <LI><strong className="text-[#111827]">Password</strong> — stored as a one-way hash (bcrypt). We cannot read your password. Legal basis: performance of contract.</LI>
            <LI><strong className="text-[#111827]">County of residence</strong> — to surface relevant county-specific events and resources. Legal basis: performance of contract / consent.</LI>
          </UL>

          <H3>Optional profile data — special category</H3>
          <P>
            The following fields are entirely optional. They are treated as <strong className="text-[#111827]">special category data</strong> under Article 9 GDPR because, in the context of this platform, they may reveal or allow inference of racial or ethnic origin.
          </P>
          <UL>
            <LI><strong className="text-[#111827]">Nationality</strong> — to help us understand the diaspora groups using the platform and to tailor resources accordingly. Legal basis: your explicit consent (Article 9(2)(a) GDPR). You may withdraw consent at any time.</LI>
            <LI><strong className="text-[#111827]">Country of birth</strong> — same purpose and basis as nationality above.</LI>
          </UL>
          <P>
            Withdrawal of consent for these fields does not affect your right to use the platform. You may update or remove this data from your profile at any time.
          </P>

          <H3>Usage data</H3>
          <UL>
            <LI>Standard server logs (IP address, browser type, pages visited, timestamps) retained for 30 days for security and debugging purposes. Legal basis: legitimate interests (Article 6(1)(f) GDPR) — specifically, the security and integrity of the platform.</LI>
            <LI>We do not use analytics cookies or third-party tracking. We do not use Google Analytics or any equivalent service.</LI>
          </UL>
        </Section>

        {/* 3 */}
        <Section>
          <H2 n="3">How We Use Your Data</H2>
          <UL>
            <LI>To operate your account and provide access to the platform.</LI>
            <LI>To display your name in connection with petitions you have signed or community content you have posted, where you have chosen to make this public.</LI>
            <LI>To send you transactional notifications (account security, platform updates). You can opt out of non-essential communications in your account settings.</LI>
            <LI>To improve the resources directory and community features, using aggregated and anonymised data about how members use the platform.</LI>
            <LI>To comply with legal obligations, including responding to valid court orders or requests from competent Irish authorities.</LI>
          </UL>
          <P>We will never use your data for advertising, profiling for commercial purposes, or to make automated decisions that significantly affect you.</P>
        </Section>

        {/* 4 */}
        <Section>
          <H2 n="4">Who We Share Data With</H2>
          <P>We do not sell your data. We share data only in the following limited circumstances:</P>
          <UL>
            <LI><strong className="text-[#111827]">Hosting infrastructure</strong> — your data is stored on servers provided by our hosting provider. Our hosting provider processes data as a data processor under a Data Processing Agreement and may not use your data for any independent purpose.</LI>
            <LI><strong className="text-[#111827]">Payment processing</strong> — if you make a voluntary contribution, payment details are processed by our payment provider (Stripe). VOADI does not receive or store full card details. Stripe's privacy policy applies to their processing.</LI>
            <LI><strong className="text-[#111827]">Legal obligations</strong> — we may disclose data if required by a valid court order, warrant, or instruction from a competent Irish authority. We will notify you of any such disclosure where legally permitted to do so.</LI>
          </UL>
          <P>
            Our hosting infrastructure is located in the EU/EEA. No personal data is transferred outside the EEA except where necessary for payment processing (Stripe operates globally under Standard Contractual Clauses).
          </P>
        </Section>

        {/* 5 */}
        <Section>
          <H2 n="5">How Long We Keep Your Data</H2>
          <div className="overflow-hidden rounded-xl border border-[#E5E7EB]">
            {[
              ['Account data', 'For the duration of your account, plus 90 days after closure to allow for dispute resolution.'],
              ['Optional profile data (nationality, country of birth)', 'Until you withdraw consent or close your account.'],
              ['Server logs', '30 days from creation.'],
              ['Petition signatures', 'For the duration of the petition plus 2 years, then anonymised.'],
              ['Backup copies', 'Up to 90 days after the primary data is deleted.'],
            ].map(([type, period]) => (
              <div key={type} className="flex flex-col gap-1 border-b border-[#E5E7EB] bg-[#FFFFFF] px-4 py-3 last:border-0 sm:flex-row sm:items-start sm:gap-4">
                <span className="w-52 shrink-0 text-xs font-semibold text-[#111827]">{type}</span>
                <span className="text-xs leading-relaxed text-[#4B5563]">{period}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* 6 */}
        <Section>
          <H2 n="6">Your Rights</H2>
          <P>Under the GDPR and the Data Protection Act 2018, you have the following rights:</P>
          <UL>
            <LI><strong className="text-[#111827]">Right of access (Article 15)</strong> — to receive a copy of all personal data we hold about you.</LI>
            <LI><strong className="text-[#111827]">Right to rectification (Article 16)</strong> — to have inaccurate data corrected.</LI>
            <LI><strong className="text-[#111827]">Right to erasure (Article 17)</strong> — to have your data deleted where there is no legitimate reason to retain it.</LI>
            <LI><strong className="text-[#111827]">Right to restriction (Article 18)</strong> — to have processing restricted in certain circumstances.</LI>
            <LI><strong className="text-[#111827]">Right to data portability (Article 20)</strong> — to receive your data in a structured, commonly used, machine-readable format.</LI>
            <LI><strong className="text-[#111827]">Right to object (Article 21)</strong> — to object to processing based on legitimate interests.</LI>
            <LI><strong className="text-[#111827]">Right to withdraw consent</strong> — for any processing based on consent, including nationality and country of birth, at any time without affecting processing already carried out.</LI>
          </UL>
          <P>
            To exercise any of these rights, contact <strong className="text-[#111827]">privacy@voadi.org</strong>. We will respond within one calendar month (Article 12 GDPR). Where a request is complex, we may extend this by a further two months, notifying you of the extension within the first month.
          </P>
          <P>
            If you are not satisfied with our response, you have the right to lodge a complaint with the Data Protection Commission: <a href="https://www.dataprotection.ie" className="text-[#D97706] underline underline-offset-2 hover:text-[#111827]" target="_blank" rel="noopener noreferrer">dataprotection.ie</a>.
          </P>
        </Section>

        {/* 7 */}
        <Section>
          <H2 n="7">Cookies</H2>
          <P>
            VOADI uses only essential cookies required for the platform to function (session authentication, CSRF protection). We do not use tracking cookies, advertising cookies, or third-party analytics cookies.
          </P>
          <P>
            Essential cookies do not require your consent under the ePrivacy Regulations (SI 336/2011) as they are strictly necessary for the service you have requested.
          </P>
        </Section>

        {/* 8 */}
        <Section>
          <H2 n="8">Children</H2>
          <P>
            The age of digital consent in Ireland is 16 years (Data Protection Act 2018). VOADI does not knowingly collect personal data from persons under 16 without verified parental or guardian consent. If you believe we have inadvertently collected data from a person under 16 without consent, please contact <strong className="text-[#111827]">privacy@voadi.org</strong> immediately.
          </P>
        </Section>

        {/* 9 */}
        <Section>
          <H2 n="9">Changes to This Policy</H2>
          <P>
            We may update this Privacy Policy. Material changes will be notified to registered members by email at least 30 days before taking effect. The date at the top of this page reflects the most recent update.
          </P>
        </Section>

      </div>
    </>
  )
}
