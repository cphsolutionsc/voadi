import type { Metadata } from 'next'
import { Section, H2, H3, P, UL, LI, Updated } from '../components'

export const metadata: Metadata = { title: 'Terms & Conditions — VOADI' }

export default function TermsPage() {
  return (
    <>
      <div className="mb-10">
        <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#D97706]">Legal</p>
        <h1 className="text-3xl font-bold text-white">Terms &amp; Conditions</h1>
        <Updated date="23 May 2026" />
      </div>

      <div className="space-y-10 text-[#A89080]">

        <Section>
          <P>
            These Terms &amp; Conditions govern your use of the VOADI platform — the website, progressive web app, and all related services operated by the Coalition of Africans Diaspora Ireland (<strong className="text-[#F5EDD0]">"VOADI", "we", "us", "our"</strong>). By creating an account or using any part of the platform you agree to these terms in full. If you do not agree, do not use the platform.
          </P>
          <P>
            VOADI is a civic community platform serving the African diaspora in Ireland. It is not a social media company. It exists solely to advance the civic, social, and legal interests of its community.
          </P>
        </Section>

        {/* 1 */}
        <Section>
          <H2 n="1">Who We Are</H2>
          <P>
            VOADI — Coalition of Africans Diaspora Ireland is a community organisation registered in Ireland. Our registered contact address and data controller details are set out in our <a href="/privacy" className="text-[#D97706] underline underline-offset-2 hover:text-[#F5EDD0]">Privacy Policy</a>.
          </P>
          <P>
            VOADI is not a registered charity. We do not operate for profit. All voluntary contributions received by VOADI are used exclusively to fund platform operations, community programmes, and legal advocacy. We do not solicit or accept donations as a registered charitable organisation within the meaning of the Charities Act 2009. Any voluntary contributions are received as community funding and are not eligible for charitable tax relief.
          </P>
          <P>
            Our single point of contact for regulatory and law enforcement authorities as required under Article 11 of the EU Digital Services Act (Regulation 2022/2065) is: <strong className="text-[#F5EDD0]">legal@voadi.org</strong>.
          </P>
        </Section>

        {/* 2 */}
        <Section>
          <H2 n="2">Eligibility &amp; Account Registration</H2>
          <UL>
            <LI>You must be at least 16 years of age to create an account and use the platform. This reflects the age of digital consent under the Data Protection Act 2018 (Ireland).</LI>
            <LI>If you are under 16, you must obtain verified parental or guardian consent before registering. By registering you declare that you are 16 or older, or that you have obtained such consent.</LI>
            <LI>You must provide accurate information at registration. You are responsible for keeping your account details up to date.</LI>
            <LI>You are responsible for maintaining the confidentiality of your password and for all activity that occurs under your account.</LI>
            <LI>You may only hold one account. Creating multiple accounts to circumvent a suspension or ban is prohibited.</LI>
            <LI>We reserve the right to suspend or terminate accounts that violate these terms, without prior notice where necessary to prevent harm.</LI>
          </UL>
        </Section>

        {/* 3 */}
        <Section>
          <H2 n="3">What the Platform Provides</H2>
          <P>VOADI currently provides the following services to registered members:</P>
          <UL>
            <LI><strong className="text-[#F5EDD0]">Community Feed</strong> — a space for community announcements, discussion, and updates.</LI>
            <LI><strong className="text-[#F5EDD0]">Events</strong> — listings of community events across Ireland.</LI>
            <LI><strong className="text-[#F5EDD0]">Petitions</strong> — a tool for members to create and sign civic petitions on matters affecting the African diaspora in Ireland.</LI>
            <LI><strong className="text-[#F5EDD0]">Resources</strong> — a curated directory of free legal, housing, healthcare, welfare, and community support services.</LI>
            <LI><strong className="text-[#F5EDD0]">Help Hub</strong> — a space for members to request or offer community assistance.</LI>
          </UL>
          <P>
            These services are provided as a digital service within the meaning of the Consumer Rights Act 2022. Where personal data is provided as consideration for access to the platform, we acknowledge our obligations under Part 3 of that Act.
          </P>
        </Section>

        {/* 4 */}
        <Section>
          <H2 n="4">Acceptable Use</H2>
          <P>You agree not to use the platform to:</P>
          <UL>
            <LI>Post, upload, or share content that is defamatory, harassing, threatening, or discriminatory on grounds of race, ethnicity, nationality, religion, gender, sexual orientation, disability, or any other protected characteristic.</LI>
            <LI>Publish false or misleading statements of fact about any person or organisation (Defamation Act 2009).</LI>
            <LI>Impersonate any person or organisation, or misrepresent your identity or affiliation.</LI>
            <LI>Collect, harvest, or scrape personal data about other users without their explicit consent.</LI>
            <LI>Distribute spam, unsolicited commercial messages, or malicious software.</LI>
            <LI>Interfere with or disrupt the platform's technical infrastructure.</LI>
            <LI>Use the platform for political campaigning, electoral canvassing, or third-party spending in connection with any Irish or EU election or referendum, in a manner that would require registration or disclosure under the Electoral Acts or the Standards in Public Office Act 2001.</LI>
            <LI>Use the platform for any purpose that is unlawful under Irish law or the law of any jurisdiction from which you access the platform.</LI>
          </UL>
          <P>
            VOADI is a platform for civic engagement, not political campaigning. Petitions must relate to matters of community welfare, rights, or public interest. Petitions that constitute political advertising within the meaning of the Electoral (Amendment) (Political Funding) Act 2012 are not permitted.
          </P>
        </Section>

        {/* 5 */}
        <Section>
          <H2 n="5">Community Content — Your Responsibilities</H2>
          <P>
            You retain ownership of content you post on VOADI. By posting content, you grant VOADI a non-exclusive, royalty-free, worldwide licence to display, store, and distribute that content solely for the purpose of operating the platform and fulfilling these terms.
          </P>
          <P>
            You are solely responsible for the accuracy, legality, and appropriateness of content you post. VOADI is not the publisher of user-generated content and does not endorse, verify, or take editorial responsibility for content posted by members.
          </P>
          <P>
            VOADI operates as an "online platform" within the meaning of Article 3(i) of the EU Digital Services Act 2022. We store and publicly disseminate user-uploaded content. Our content moderation policy is described in Section 6.
          </P>
        </Section>

        {/* 6 */}
        <Section>
          <H2 n="6">Content Moderation &amp; Complaints (DSA Obligations)</H2>
          <P>
            In accordance with Article 14 of the Digital Services Act, our content moderation policy is as follows:
          </P>
          <H3>Grounds for removal or restriction</H3>
          <P>We may remove, restrict, or label content that:</P>
          <UL>
            <LI>Violates the Acceptable Use provisions in Section 4 above.</LI>
            <LI>Is reported to us as potentially defamatory, harassing, or unlawful.</LI>
            <LI>Constitutes illegal content as defined under Irish or EU law.</LI>
            <LI>Has been the subject of a valid court order or instruction from a competent authority.</LI>
          </UL>
          <H3>Account suspension and termination</H3>
          <P>
            We may suspend or terminate accounts where a member repeatedly posts content that violates these terms, or where a member's conduct poses a risk to other community members or to the platform's integrity.
          </P>
          <H3>How to report content</H3>
          <P>
            To report content that you believe violates these terms or constitutes illegal content, contact us at <strong className="text-[#F5EDD0]">moderation@voadi.org</strong>. Reports are reviewed within 10 working days for non-urgent matters and within 24 hours for content reporting imminent harm.
          </P>
          <H3>Internal complaints mechanism (Article 20 DSA)</H3>
          <P>
            If your content has been removed or your account has been restricted or suspended, you have the right to lodge an internal complaint. Contact us at <strong className="text-[#F5EDD0]">appeals@voadi.org</strong> within 30 days of the decision. We will review your complaint and provide a reasoned response within 15 working days.
          </P>
          <H3>Out-of-court dispute settlement</H3>
          <P>
            In accordance with Article 21 of the DSA, you may refer unresolved disputes regarding our content moderation decisions to a certified out-of-court dispute settlement body. Information on certified bodies in Ireland is available from Coimisiún na Meán (<a href="https://www.cnam.ie" className="text-[#D97706] underline underline-offset-2 hover:text-[#F5EDD0]" target="_blank" rel="noopener noreferrer">cnam.ie</a>).
          </P>
        </Section>

        {/* 7 */}
        <Section>
          <H2 n="7">Petitions — Specific Terms</H2>
          <UL>
            <LI>Any registered member may create a petition on a matter of civic or community interest.</LI>
            <LI>The member who creates a petition (<strong className="text-[#F5EDD0]">"petition author"</strong>) is solely responsible for its content and for ensuring it is accurate and lawful.</LI>
            <LI>VOADI does not verify the accuracy of petition claims and does not endorse any petition by hosting it.</LI>
            <LI>Petition authors must not make false statements of fact about named individuals or organisations. Making a knowingly false statement in a petition may constitute defamation under the Defamation Act 2009.</LI>
            <LI>Signatures on VOADI petitions are expressions of support by individual community members. VOADI makes no representation that a petition will achieve its stated aim or that it will be presented to any public authority.</LI>
            <LI>Petitions may be removed at any time where they violate these terms or are the subject of a valid legal challenge.</LI>
          </UL>
        </Section>

        {/* 8 */}
        <Section>
          <H2 n="8">Voluntary Contributions</H2>
          <P>
            VOADI may, from time to time, invite voluntary financial contributions from community members to support platform operations and community programmes.
          </P>
          <UL>
            <LI>All contributions are entirely voluntary. No member is required to contribute in order to access the platform.</LI>
            <LI>VOADI is not a registered charity. Contributions are not eligible for tax relief under the Taxes Consolidation Act 1997 or the Charities Tax legislation.</LI>
            <LI>Contributions are used to fund platform hosting, development, legal advocacy, and community support activities. Full details are set out in our <a href="/transparency" className="text-[#D97706] underline underline-offset-2 hover:text-[#F5EDD0]">Transparency &amp; Funding Declaration</a>.</LI>
            <LI>Contributions are non-refundable except where required by law.</LI>
            <LI>VOADI does not accept donations from political parties, governmental bodies, or any organisation that would create a conflict of interest with our mission to serve the African diaspora community independently.</LI>
          </UL>
        </Section>

        {/* 9 */}
        <Section>
          <H2 n="9">Data Protection &amp; Privacy</H2>
          <P>
            The collection and use of your personal data is governed by our <a href="/privacy" className="text-[#D97706] underline underline-offset-2 hover:text-[#F5EDD0]">Privacy Policy</a>, which forms part of these terms.
          </P>
          <P>
            VOADI collects and processes personal data including name, email address, county of residence, nationality, and country of birth. Nationality and country of birth are treated as special category data under Article 9 of the GDPR in the context of this platform, as they may reveal or allow inference of racial or ethnic origin. This data is collected only with your explicit consent (Article 9(2)(a) GDPR) and is used solely to improve the platform's resources and services for the community.
          </P>
          <P>
            Your data rights — including the right to access, rectify, erase, and port your data — are described in full in our Privacy Policy. To exercise any data right, contact our data controller at <strong className="text-[#F5EDD0]">privacy@voadi.org</strong>. You also have the right to lodge a complaint with the Data Protection Commission (DPC) at <a href="https://www.dataprotection.ie" className="text-[#D97706] underline underline-offset-2 hover:text-[#F5EDD0]" target="_blank" rel="noopener noreferrer">dataprotection.ie</a>.
          </P>
        </Section>

        {/* 10 */}
        <Section>
          <H2 n="10">Intellectual Property</H2>
          <P>
            The VOADI name, logo (the harp-V mark), platform design, and all original content created by VOADI are the intellectual property of the Coalition of Africans Diaspora Ireland. You may not reproduce, distribute, or create derivative works from VOADI's intellectual property without our prior written consent.
          </P>
          <P>
            The resources directory contains information about third-party organisations. Links to those organisations are provided for information only. VOADI does not claim any rights over third-party content and is not responsible for the accuracy or availability of third-party websites.
          </P>
        </Section>

        {/* 11 */}
        <Section>
          <H2 n="11">Disclaimers &amp; Limitation of Liability</H2>
          <P>
            The VOADI platform and all information on it — including the resources directory, community posts, and petition content — are provided for informational purposes only and do not constitute legal, financial, medical, or professional advice. Nothing on the platform creates a professional relationship between VOADI and any member.
          </P>
          <P>
            VOADI makes no warranty, express or implied, that the platform will be available without interruption, free from errors, or free from security vulnerabilities. We take reasonable steps to maintain the security and availability of the platform but cannot guarantee uninterrupted access.
          </P>
          <P>
            To the fullest extent permitted by Irish law, VOADI's liability to you for any loss or damage arising from your use of the platform — whether in contract, tort, or otherwise — is limited to the amount you have paid to VOADI in the 12 months preceding the event giving rise to the claim, or €100, whichever is greater. This limitation does not apply to liability for death or personal injury caused by negligence, fraudulent misrepresentation, or any other liability that cannot be excluded or limited under Irish law.
          </P>
          <P>
            Nothing in these terms affects your statutory rights as a consumer under the Consumer Rights Act 2022 or any other applicable Irish consumer protection legislation.
          </P>
        </Section>

        {/* 12 */}
        <Section>
          <H2 n="12">Termination</H2>
          <P>
            You may close your account at any time by contacting us at <strong className="text-[#F5EDD0]">support@voadi.org</strong>. Upon closure, your account data will be handled in accordance with our Privacy Policy retention schedule.
          </P>
          <P>
            We may suspend or terminate your access to the platform if you breach these terms, if we are required to do so by law or a competent authority, or if we cease to operate the platform. Where we terminate your access for reasons other than your breach, we will provide reasonable notice except where immediate termination is necessary to protect the safety or rights of other users or the platform.
          </P>
          <P>
            Under the Consumer Rights Act 2022, if we materially alter the platform in a way that negatively affects your access, you will receive at least 30 days' notice and the right to terminate without penalty.
          </P>
        </Section>

        {/* 13 */}
        <Section>
          <H2 n="13">Governing Law &amp; Disputes</H2>
          <P>
            These terms are governed by and construed in accordance with the laws of Ireland. Any disputes arising from these terms or your use of the platform shall be subject to the exclusive jurisdiction of the courts of Ireland.
          </P>
          <P>
            In accordance with the EU Alternative Dispute Resolution Directive (implemented by SI 343/2015), we are obliged to inform you of the availability of alternative dispute resolution (ADR). We do not currently subscribe to an ADR scheme for general consumer disputes, but you may use the EU Online Dispute Resolution Platform at <a href="https://ec.europa.eu/consumers/odr" className="text-[#D97706] underline underline-offset-2 hover:text-[#F5EDD0]" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.
          </P>
        </Section>

        {/* 14 */}
        <Section>
          <H2 n="14">Changes to These Terms</H2>
          <P>
            We may update these terms from time to time. Where changes are material, we will notify registered members by email and display a notice on the platform at least 30 days before the changes take effect. Continued use of the platform after that date constitutes acceptance of the revised terms. If you do not accept the revised terms, you may close your account before the effective date.
          </P>
        </Section>

        {/* 15 */}
        <Section>
          <H2 n="15">Contact</H2>
          <div className="rounded-xl border border-[#2A1515] bg-[#1E0E0E] divide-y divide-[#2A1515]">
            {[
              ['General enquiries', 'hello@voadi.org'],
              ['Data protection / privacy', 'privacy@voadi.org'],
              ['Content reports', 'moderation@voadi.org'],
              ['Account appeals', 'appeals@voadi.org'],
              ['Legal / DSA contact point', 'legal@voadi.org'],
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
