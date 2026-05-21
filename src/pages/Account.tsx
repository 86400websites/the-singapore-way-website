import { useNavigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'
import PageHero from '../components/PageHero'

export default function Account() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <PageHero
        eyebrow="Account"
        title="Your account"
        description="You are signed in."
        variant="light"
      />
      <section className="bg-white">
        <div className="max-w-md mx-auto px-5 sm:px-6 lg:px-8 py-12">
          <dl className="space-y-3 mb-8">
            <div>
              <dt className="text-xs font-bold tracking-[0.12em] text-gray-500 uppercase">Email</dt>
              <dd className="text-[15px] text-[#111111] mt-1 break-all">{user?.email ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-xs font-bold tracking-[0.12em] text-gray-500 uppercase">User ID</dt>
              <dd className="text-[13px] text-gray-600 mt-1 break-all font-mono">{user?.id ?? '—'}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full bg-[#111111] text-white text-[14px] font-bold py-3 rounded-full hover:bg-black transition-colors"
          >
            Sign out
          </button>
        </div>
      </section>
    </>
  )
}
