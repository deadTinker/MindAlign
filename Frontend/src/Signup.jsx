import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Mock wellness "shows/sessions" for the soft light-mode background grid
const BACKDROP_TILES = [
  { title: 'Deep Sleep', tag: 'Audio Series', gradient: 'from-emerald-100 via-green-50 to-white' },
  { title: 'Anxiety Reset', tag: '7-Day Course', gradient: 'from-teal-100 via-emerald-50 to-white' },
  { title: 'Morning Clarity', tag: 'Daily Ritual', gradient: 'from-lime-100 via-green-50 to-white' },
  { title: 'Focus Flow', tag: 'Soundscapes', gradient: 'from-green-100 via-teal-50 to-white' },
  { title: 'Letting Go', tag: 'Guided Breath', gradient: 'from-emerald-100 via-slate-50 to-white' },
  { title: 'Inner Calm', tag: 'Mindfulness', gradient: 'from-green-200/70 via-emerald-50 to-white' },
  { title: 'Night Wind Down', tag: 'Sleep Stories', gradient: 'from-teal-100 via-cyan-50 to-white' },
  { title: 'Self Compassion', tag: 'Audio Journal', gradient: 'from-lime-100 via-emerald-50 to-white' },
  { title: 'Stress Relief', tag: 'Quick Reset', gradient: 'from-emerald-100 via-green-50 to-white' },
  { title: 'Emotional Balance', tag: 'Masterclass', gradient: 'from-green-100 via-slate-50 to-white' },
  { title: 'Quiet Mind', tag: 'Meditation', gradient: 'from-teal-100 via-green-50 to-white' },
  { title: 'Renewal', tag: 'Evening Routine', gradient: 'from-emerald-200/60 via-lime-50 to-white' },
]

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !email.trim() || !password) {
      setError('Please enter your name, email, and a password to continue.')
      return
    }

    if (password !== confirmPassword) {
      setError('Your passwords do not match. Please try again.')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Unable to create your account.')
        setIsLoading(false)
        return
      }

      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err) {
      console.error('Signup error:', err)
      setError("Couldn't connect to the server. Please try again later.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 relative flex flex-col justify-between overflow-x-hidden selection:bg-[#22C55E] selection:text-white">
      
      {/* Light Tiled Content Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden opacity-75"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 p-3 -rotate-3 scale-110">
          {BACKDROP_TILES.map((tile, idx) => (
            <div
              key={idx}
              className={`h-44 sm:h-52 rounded bg-gradient-to-br ${tile.gradient} border border-emerald-200/60 p-4 flex flex-col justify-end relative overflow-hidden`}
            >
              <span className="text-[10px] uppercase tracking-widest text-emerald-700/60 font-semibold">
                {tile.tag}
              </span>
              <p className="text-lg font-bold tracking-tight text-slate-800/70">
                {tile.title}
              </p>
            </div>
          ))}
        </div>
        {/* Soft White Radial + Linear Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/75 to-white/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.95)_100%)]" />
      </div>

      {/* Top Navigation Header (Signature Top-Left Logo) */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 py-6 flex items-center justify-between">
        <Link to="/" className="inline-flex items-center select-none group">
          <span className="text-2xl sm:text-4xl font-black tracking-tighter uppercase text-[#22C55E] drop-shadow-[0_2px_10px_rgba(34,197,94,0.2)]">
            MIND<span className="text-slate-900">ALIGN</span>
          </span>
        </Link>

        <Link
          to="/login"
          className="px-4 py-1.5 rounded bg-[#22C55E] hover:bg-[#16A34A] text-white text-sm font-semibold shadow-sm transition-colors"
        >
          Sign In
        </Link>
      </header>

      {/* Center Clean White Modal Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-[450px] bg-white/90 backdrop-blur-md sm:px-16 sm:py-12 px-7 py-10 rounded-md border border-slate-200/90 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <h1 className="text-[32px] font-bold text-slate-900 tracking-tight mb-2">
            Sign Up
          </h1>
          <p className="text-sm text-slate-500 mb-7">
            Unlimited guided sessions, sleep stories, and daily clarity.
          </p>

          {/* Error Alert Box */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium leading-snug">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Floating Label Input: Full Name */}
            <div className="relative">
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                placeholder=" "
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="peer w-full px-4 pt-6 pb-2 rounded bg-slate-50/90 border border-slate-300 text-slate-900 text-base outline-none transition-colors focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 focus:bg-white"
              />
              <label
                htmlFor="signup-name"
                className="pointer-events-none absolute left-4 top-2 text-[11px] text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-[#16A34A]"
              >
                Full Name
              </label>
            </div>

            {/* Floating Label Input: Email */}
            <div className="relative">
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="peer w-full px-4 pt-6 pb-2 rounded bg-slate-50/90 border border-slate-300 text-slate-900 text-base outline-none transition-colors focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 focus:bg-white"
              />
              <label
                htmlFor="signup-email"
                className="pointer-events-none absolute left-4 top-2 text-[11px] text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-[#16A34A]"
              >
                Email address
              </label>
            </div>

            {/* Floating Label Input: Password */}
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full px-4 pt-6 pb-2 pr-16 rounded bg-slate-50/90 border border-slate-300 text-slate-900 text-base outline-none transition-colors focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 focus:bg-white"
              />
              <label
                htmlFor="signup-password"
                className="pointer-events-none absolute left-4 top-2 text-[11px] text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-[#16A34A]"
              >
                Add a password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-[#16A34A] transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Floating Label Input: Confirm Password */}
            <div className="relative">
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="peer w-full px-4 pt-6 pb-2 pr-16 rounded bg-slate-50/90 border border-slate-300 text-slate-900 text-base outline-none transition-colors focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20 focus:bg-white"
              />
              <label
                htmlFor="signup-confirm-password"
                className="pointer-events-none absolute left-4 top-2 text-[11px] text-slate-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-[11px] peer-focus:text-[#16A34A]"
              >
                Confirm password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-[#16A34A] transition-colors"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>

            {/* Primary Light Green CTA */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-3 rounded bg-[#22C55E] hover:bg-[#16A34A] active:bg-[#15803D] text-white font-semibold text-base shadow-md shadow-emerald-500/20 transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>

          {/* Secondary Login Prompt */}
          <div className="mt-8 text-base text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-[#16A34A] font-semibold hover:underline"
            >
              Sign in now.
            </Link>
          </div>

          <p className="mt-4 text-xs text-slate-400 leading-relaxed">
            Your mental wellness journey is private and encrypted. By signing up, you agree to MindAlign&apos;s Terms of Use.
          </p>
        </div>
      </main>

      {/* Subtle Bottom Footer Bar */}
      <footer className="relative z-10 w-full bg-white/80 border-t border-slate-200/80 py-6 px-6 sm:px-12 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>MindAlign • Understand Your Mind. Improve Your Journey.</span>
          <span>Questions? Support is available 24/7.</span>
        </div>
      </footer>
    </div>
  )
}

export default Signup