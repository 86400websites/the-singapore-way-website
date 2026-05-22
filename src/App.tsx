import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './lib/AuthContext'
import ProtectedRoute from './lib/ProtectedRoute'

const Home = lazy(() => import('./pages/Home'))
const TheBook = lazy(() => import('./pages/TheBook'))
const Learn = lazy(() => import('./pages/Learn'))
const Apply = lazy(() => import('./pages/Apply'))
const Teach = lazy(() => import('./pages/Teach'))
const Ideate = lazy(() => import('./pages/Ideate'))
const About = lazy(() => import('./pages/About'))
const Blog = lazy(() => import('./pages/Blog'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const OnlineCourse = lazy(() => import('./pages/OnlineCourse'))
const Podcast = lazy(() => import('./pages/Podcast'))
const LocalizationKits = lazy(() => import('./pages/LocalizationKits'))
const Possibilities = lazy(() => import('./pages/Possibilities'))
const TeachingMaterials = lazy(() => import('./pages/TeachingMaterials'))
const QA = lazy(() => import('./pages/QA'))
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const UpdatePassword = lazy(() => import('./pages/UpdatePassword'))
const Account = lazy(() => import('./pages/Account'))

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#C8102E] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/thebook" element={<TheBook />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/apply" element={<Apply />} />
                <Route path="/teach" element={<Teach />} />
                <Route path="/ideate" element={<Ideate />} />
                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/online-course" element={<OnlineCourse />} />
                <Route path="/podcasts" element={<Podcast />} />
                <Route path="/localization-kits" element={<LocalizationKits />} />
                <Route path="/possibilities" element={<Possibilities />} />
                <Route path="/teaching-materials" element={<TeachingMaterials />} />
                <Route path="/q-a" element={<QA />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
