import { z } from 'zod'

const emailSchema = z
  .string()
  .trim()
  .min(1, 'Please enter your email address.')
  .email('Please enter a valid email address.')

const optionalNameSchema = z.string().trim().max(80, 'Please keep this under 80 characters.').optional()

export const newsletterSignupSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'Please enter your first name.')
    .max(80, 'Please keep this under 80 characters.'),
  lastName: optionalNameSchema,
  email: emailSchema,
})

export const resourceRequestSchema = newsletterSignupSchema.extend({
  consent: z
    .boolean()
    .refine((value) => value, 'Please agree to receive emails before submitting.'),
})

// Exhaustive allowlist of public form types that may apply a Mailchimp tag.
// Any value the API receives outside this list is rejected (Zod enum). The
// tag mapping for each key lives in `src/lib/mailchimp/marketing.ts`. The
// client never sends a raw Mailchimp tag string — only one of these keys.
export const MAILCHIMP_FORM_TYPES = [
  'free-book-summary',
  'localization-kits',
  'use-cases',
  'case-studies',
  'newsletter',
] as const

export const mailchimpFormTypeSchema = z.enum(MAILCHIMP_FORM_TYPES)

// Public API schema for /api/mailchimp/subscribe. Includes the visible
// consent checkbox required by the lead-magnet UI flows.
export const mailchimpSubscribeSchema = resourceRequestSchema.extend({
  formType: mailchimpFormTypeSchema,
})

// Helper-only input shape. Consent is enforced at the API layer (by the
// concrete request schema) and is not part of the Mailchimp call itself,
// so the helper does not require it.
export const mailchimpSubscriberInputSchema = newsletterSignupSchema.extend({
  formType: mailchimpFormTypeSchema,
})

export const contactRequestSchema = resourceRequestSchema.extend({
  kind: z
    .string()
    .trim()
    .min(1, 'Please include what you are requesting.')
    .max(120, 'Please keep this under 120 characters.'),
  description: z.string().trim().max(500, 'Please keep this under 500 characters.').optional(),
})

export const authEmailSchema = z.object({
  email: emailSchema,
})

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')

export const loginSchema = authEmailSchema.extend({
  password: z.string().min(1, 'Please enter your password.'),
})

export const signupSchema = authEmailSchema
  .extend({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords do not match.',
    path: ['confirm'],
  })

export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: 'Passwords do not match.',
    path: ['confirm'],
  })

export type NewsletterSignupValues = z.infer<typeof newsletterSignupSchema>
export type ResourceRequestValues = z.infer<typeof resourceRequestSchema>
export type ContactRequestValues = z.infer<typeof contactRequestSchema>
export type MailchimpFormType = z.infer<typeof mailchimpFormTypeSchema>
export type MailchimpSubscribeValues = z.infer<typeof mailchimpSubscribeSchema>
export type MailchimpSubscriberInput = z.infer<typeof mailchimpSubscriberInputSchema>
export type LoginValues = z.infer<typeof loginSchema>
export type SignupValues = z.infer<typeof signupSchema>
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>
