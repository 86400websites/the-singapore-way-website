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
export type LoginValues = z.infer<typeof loginSchema>
export type SignupValues = z.infer<typeof signupSchema>
export type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>
