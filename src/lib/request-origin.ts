import 'server-only'

import { headers } from 'next/headers'

export async function getRequestOrigin() {
  const headerStore = await headers()

  return headerStore.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
}
