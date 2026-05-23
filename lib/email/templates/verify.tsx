import * as React from 'react'

export function VerificationEmail({ name, url }: { name: string; url: string }) {
  return (
    <div style={{ fontFamily: 'Georgia, serif', background: '#140909', color: '#F5EDD0', padding: '40px 24px', maxWidth: '520px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#F5EDD0', letterSpacing: '-0.02em' }}>
          <span style={{ color: '#D97706' }}>V</span>OADI
        </span>
      </div>
      <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#F5EDD0', marginBottom: '12px' }}>
        Verify your email address
      </h1>
      <p style={{ fontSize: '15px', lineHeight: '1.7', color: '#A89080', marginBottom: '32px' }}>
        Hi {name}, please click the button below to verify your VOADI account. This link expires in 24 hours.
      </p>
      <a href={url}
        style={{ display: 'inline-block', background: '#D97706', color: '#1C0D0D', fontWeight: 'bold', fontSize: '14px', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none' }}>
        Verify my email
      </a>
      <p style={{ marginTop: '32px', fontSize: '13px', color: '#5C4040' }}>
        If you did not create a VOADI account, you can safely ignore this email.
      </p>
      <p style={{ marginTop: '40px', fontSize: '12px', color: '#3D2020' }}>
        VOADI — Coalition of Africans Diaspora Ireland · voadi.org
      </p>
    </div>
  )
}
