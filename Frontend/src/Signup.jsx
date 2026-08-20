import { useState } from 'react'
import { Link } from 'react-router-dom'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 flex items-center justify-center px-4">

      {/* Background Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-indigo-600/30 rounded-full blur-3xl"></div>

      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-3xl"></div>

      {/* Signup Container */}
      <div className="relative w-full max-w-md">

        {/* Brand */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold tracking-tight text-white">
            Mind<span className="text-indigo-400">Align</span>
          </h1>

          <p className="text-slate-400 mt-2 text-sm">
            Understand Your Mind. Improve Your Journey.
          </p>

        </div>

        {/* Signup Card */}
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* Heading */}
          <div className="mb-7">

            <h2 className="text-2xl font-semibold text-white">
              Create Account
            </h2>

            <p className="text-slate-400 text-sm mt-2">
              Sign up to begin your journey
            </p>

          </div>

          {/* Name */}
          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 hover:border-slate-600"
            />

          </div>

          {/* Email */}
          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 hover:border-slate-600"
            />

          </div>

          {/* Password */}
          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>

            <div className="relative">

              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-20 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 hover:border-slate-600"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>

            </div>

          </div>

          {/* Confirm Password */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Confirm Password
            </label>

            <div className="relative">

              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3.5 pr-20 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 hover:border-slate-600"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>

            </div>

          </div>

          {/* Signup Button */}
          <button
            onClick={() => console.log(name, email, password, confirmPassword)}
            className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/20 transition-all duration-200 hover:bg-indigo-500 hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Create Account
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">

            <div className="h-px flex-1 bg-slate-700"></div>

            <span className="text-xs text-slate-500">
              OR
            </span>

            <div className="h-px flex-1 bg-slate-700"></div>

          </div>

          {/* Login */}
          <p className="text-center text-sm text-slate-400">

            Already have an account?{' '}

            <Link
              to="/login"
              className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
            >
              Login
            </Link>

          </p>

        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-600 mt-6">
          MindAlign • Your Mental Wellness Companion
        </p>

      </div>

    </div>
  )
}

export default Signup