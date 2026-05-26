import { Resend } from 'resend'

import { requireServerEnv } from '@/lib/server-env'
import type { ContactRequestValues } from '@/lib/validation/forms'

export async function sendResourceRequest(values: ContactRequestValues) {
  const { RESEND_API_KEY, RESEND_FROM_EMAIL, RESEND_TO_EMAIL } = requireServerEnv([
    'RESEND_API_KEY',
    'RESEND_FROM_EMAIL',
    'RESEND_TO_EMAIL',
  ])

  const resend = new Resend(RESEND_API_KEY)
  const name = [values.firstName.trim(), values.lastName?.trim()].filter(Boolean).join(' ')
  const subject = `The Singapore Way request: ${values.kind}`

  const lines = [
    `Request: ${values.kind}`,
    `Name: ${name}`,
    `Email: ${values.email.trim()}`,
    values.description ? `Description: ${values.description}` : '',
    '',
    'Consent: The user agreed to receive emails from The Singapore Way.',
  ].filter(Boolean)

  await resend.emails.send({
    from: RESEND_FROM_EMAIL,
    to: [RESEND_TO_EMAIL],
    replyTo: values.email.trim(),
    subject,
    text: lines.join('\n'),
  })
}
