import * as React from 'react'

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#140909', color: '#F5EDD0', padding: '40px 24px', maxWidth: '520px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#F5EDD0', letterSpacing: '-0.02em' }}>
          <span style={{ color: '#D97706' }}>V</span>OADI
        </span>
      </div>
      <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#F5EDD0', marginBottom: '12px' }}>
        Welcome, {name}.
      </h1>
      <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#A89080', marginBottom: '24px' }}>
        You have joined VOADI — the civic platform for the African diaspora in Ireland.
        Your voice matters here.
      </p>
      <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#A89080', marginBottom: '32px' }}>
        Here is what you can do right now:
      </p>
      <ul style={{ color: '#A89080', fontSize: '14px', lineHeight: '2', paddingLeft: '20px', marginBottom: '32px' }}>
        <li>Browse the <strong style={{ color: '#F5EDD0' }}>Resources</strong> directory — free services most people never hear about</li>
        <li>Sign or start a <strong style={{ color: '#F5EDD0' }}>Petition</strong> on something that matters to you</li>
        <li>Find <strong style={{ color: '#F5EDD0' }}>Events</strong> in your county</li>
        <li>Ask for or offer help in the <strong style={{ color: '#F5EDD0' }}>Help Hub</strong></li>
      </ul>
      <a
        href="https://voadi.org/feed"
        style={{ display: 'inline-block', background: '#D97706', color: '#1C0D0D', fontWeight: 'bold', fontSize: '14px', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}
      >
        Go to the app
      </a>
      <p style={{ marginTop: '40px', fontSize: '12px', color: '#3D2020' }}>
        VOADI — Coalition of Africans Diaspora Ireland · voadi.org
      </p>
    </div>
  )
}
