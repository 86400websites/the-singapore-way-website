'use client'

import { useRouter } from 'next/navigation'

import { createClient } from '@/lib/supabase/client'

export default function AccountActions() {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.replace('/login')
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="w-full bg-[#111111] text-white text-[14px] font-bold py-3 rounded-full hover:bg-black transition-colors"
    >
      Sign out
    </button>
  )
}
