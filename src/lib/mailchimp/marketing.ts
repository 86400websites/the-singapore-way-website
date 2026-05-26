import crypto from 'node:crypto'

import mailchimp from '@mailchimp/mailchimp_marketing'

import { requireServerEnv } from '@/lib/server-env'
import type { NewsletterSignupValues } from '@/lib/validation/forms'

export async function subscribeToNewsletter(values: NewsletterSignupValues) {
  const {
    MAILCHIMP_API_KEY,
    MAILCHIMP_SERVER_PREFIX,
    MAILCHIMP_AUDIENCE_ID,
  } = requireServerEnv([
    'MAILCHIMP_API_KEY',
    'MAILCHIMP_SERVER_PREFIX',
    'MAILCHIMP_AUDIENCE_ID',
  ])

  mailchimp.setConfig({
    apiKey: MAILCHIMP_API_KEY,
    server: MAILCHIMP_SERVER_PREFIX,
  })

  const email = values.email.trim().toLowerCase()
  const subscriberHash = crypto.createHash('md5').update(email).digest('hex')

  await mailchimp.lists.setListMember(MAILCHIMP_AUDIENCE_ID, subscriberHash, {
    email_address: email,
    status_if_new: 'subscribed',
    merge_fields: {
      FNAME: values.firstName.trim(),
      LNAME: values.lastName?.trim() ?? '',
    },
  })
}
