import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            password
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        alert(data.message)
        return
      }

      console.log("Login successful:", data)
      localStorage.setItem("token", data.token)
      navigate("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      alert("Couldn't connect to server")
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-950 flex items-center justify-center px-4">
      {/* Background Glow */}
      <div className="absolute top-[-150px] left-[-150px] w-[400px] h-[400px] bg-blue-600/25 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-cyan-500/15 rounded-full blur-3xl"></div>

      {/* Login Container */}
      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Mind<span className="text-cyan-400">Align</span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Understand Your Mind. Improve Your Journey.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/20">
          {/* Heading */}
          <div className="mb-7 text-center">
            <h2 className="text-2xl font-semibold text-white">
              Welcome Back
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Sign in to continue to your account
            </p>
          </div>

          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3.5 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 hover:border-slate-600"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLogin()
                }}
                className="w-full px-4 py-3.5 pr-20 rounded-xl bg-slate-900/60 border border-slate-700 text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 hover:border-slate-600"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-cyan-300 transition-colors"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="button"
            onClick={handleLogin}
            className="w-full py-3.5 rounded-xl bg-cyan-400 text-slate-950 font-semibold shadow-lg shadow-cyan-400/20 transition-all duration-200 hover:bg-cyan-300 hover:shadow-cyan-300/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            Login
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-slate-700"></div>
            <span className="text-xs text-slate-500">OR</span>
            <div className="h-px flex-1 bg-slate-700"></div>
          </div>

          {/* Signup */}
          <p className="text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors"
            >
              Create Account
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

export default Login
