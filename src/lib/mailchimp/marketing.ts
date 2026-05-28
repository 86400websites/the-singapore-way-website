import 'server-only'

import crypto from 'node:crypto'

import mailchimp from '@mailchimp/mailchimp_marketing'

import { requireServerEnv } from '@/lib/server-env'
import type {
  MailchimpFormType,
  MailchimpSubscriberInput,
} from '@/lib/validation/forms'

// Server-owned map from public formType keys to Mailchimp tag names.
// All five keys below are intentionally public and intentionally supported in
// Phase 2 of the Mailchimp automation work. The client may send a formType
// key on a POST body, but it can never send a raw tag string — the server
// is the single source of truth for the tag applied to each subscriber.
export const FORM_TYPE_TAGS: Record<MailchimpFormType, string> = {
  'free-book-summary': 'TSW Free Book Summary',
  'localization-kits': 'TSW Localization Kits',
  'use-cases': 'TSW Use Cases',
  'case-studies': 'TSW Case Studies',
  newsletter: 'TSW Newsletter',
}

function configureMailchimp() {
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

  return { audienceId: MAILCHIMP_AUDIENCE_ID }
}

function subscriberHashFor(email: string) {
  return crypto.createHash('md5').update(email).digest('hex')
}

// Upserts a Mailchimp list member and applies exactly one tag derived
// from the (server-owned) FORM_TYPE_TAGS map. Callers must already have
// validated `formType` against the public allowlist.
export async function subscribeWithFormTag(values: MailchimpSubscriberInput) {
  const { audienceId } = configureMailchimp()

  const email = values.email.trim().toLowerCase()
  const subscriberHash = subscriberHashFor(email)
  const tagName = FORM_TYPE_TAGS[values.formType]

  await mailchimp.lists.setListMember(audienceId, subscriberHash, {
    email_address: email,
    status_if_new: 'subscribed',
    merge_fields: {
      FNAME: values.firstName.trim(),
      LNAME: values.lastName?.trim() ?? '',
    },
  })

  await mailchimp.lists.updateListMemberTags(audienceId, subscriberHash, {
    tags: [{ name: tagName, status: 'active' }],
  })
}
