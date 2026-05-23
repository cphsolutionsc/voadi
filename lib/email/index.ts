import { Resend } from 'resend'
import * as React from 'react'

export const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  react,
}: {
  to: string
  subject: string
  react: React.ReactElement
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping send')
    return
  }
  await resend.emails.send({
    from: 'VOADI <hello@voadi.org>',
    to,
    subject,
    react,
  })
}
