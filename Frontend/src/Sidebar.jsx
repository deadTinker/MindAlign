import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  UserRound,
  ClipboardList,
  FileChartColumn,
  LogOut,
  Brain,
  ChevronRight,
  Sparkles
} from 'lucide-react'

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const linkClass = (path) =>
    `group relative flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-300 ease-out ${
      isActive(path)
        ? 'bg-gradient-to-r from-blue-500/[0.16] to-cyan-400/[0.06] text-white border-cyan-400/[0.18] shadow-lg shadow-blue-950/20'
        : 'text-slate-400 border-transparent hover:text-white hover:bg-white/[0.04] hover:border-white/[0.05]'
    }`

  const iconClass = (path) =>
    `shrink-0 transition-all duration-300 ${
      isActive(path)
        ? 'text-cyan-300'
        : 'text-slate-500 group-hover:text-cyan-300 group-hover:scale-110'
    }`

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#080D19]/95 backdrop-blur-2xl border-r border-white/[0.07] px-4 py-7 flex flex-col overflow-hidden">

      {/* Ambient Sidebar Glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-blue-600/[0.10] blur-[90px] pointer-events-none" />
      <div className="absolute bottom-20 -left-32 w-64 h-64 rounded-full bg-violet-600/[0.07] blur-[90px] pointer-events-none" />

      {/* Brand */}
      <div className="relative px-2 mb-10">
        <Link to="/dashboard" className="group flex items-center gap-3 w-fit">
          <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 transition-all duration-300 group-hover:shadow-cyan-400/25 group-hover:scale-105">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent to-white/20" />
            <Brain size={23} className="relative text-white" />
          </div>

          <div>
            <h1 className="text-[21px] font-bold tracking-tight text-white">
              Mind<span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">Align</span>
            </h1>
            <p className="text-[10px] text-slate-500 mt-0.5 tracking-[0.12em] uppercase">
              Student Wellness
            </p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="relative">
        <div className="flex items-center gap-2 px-4 mb-3">
          <Sparkles size={12} className="text-cyan-500/70" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Workspace
          </p>
        </div>

        <nav className="flex flex-col gap-1.5">

          {/* Dashboard */}
          <Link to="/dashboard" className={linkClass('/dashboard')}>
            {isActive('/dashboard') && (
              <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gradient-to-b from-cyan-300 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.35)]" />
            )}

            <LayoutDashboard size={19} className={iconClass('/dashboard')} />
            <span className="flex-1">Dashboard</span>

            {isActive('/dashboard') && (
              <ChevronRight size={15} className="text-cyan-400 animate-[fadeIn_0.25s_ease-out]" />
            )}
          </Link>

          {/* Profile */}
          <Link to="/profile" className={linkClass('/profile')}>
            {isActive('/profile') && (
              <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gradient-to-b from-cyan-300 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.35)]" />
            )}

            <UserRound size={19} className={iconClass('/profile')} />
            <span className="flex-1">Profile</span>

            {isActive('/profile') && (
              <ChevronRight size={15} className="text-cyan-400 animate-[fadeIn_0.25s_ease-out]" />
            )}
          </Link>

        </nav>
      </div>

      {/* Assessment Navigation */}
      <div className="relative mt-7">
        <div className="flex items-center gap-2 px-4 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400/80" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Assessments
          </p>
        </div>

        <div className="ml-3 pl-3 border-l border-white/[0.08] flex flex-col gap-1.5">

          {/* Option-Based */}
          <Link
            to="/assessment/option"
            className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm border transition-all duration-300 ${
              isActive('/assessment/option')
                ? 'bg-blue-500/[0.10] text-cyan-200 border-cyan-400/[0.12]'
                : 'text-slate-500 border-transparent hover:text-slate-200 hover:bg-white/[0.035] hover:border-white/[0.04]'
            }`}
          >
            <ClipboardList
              size={17}
              className={`shrink-0 transition-all duration-300 ${
                isActive('/assessment/option')
                  ? 'text-cyan-300'
                  : 'text-slate-600 group-hover:text-cyan-300 group-hover:scale-110'
              }`}
            />

            <span className="flex-1">Option-Based</span>

            {isActive('/assessment/option') && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
            )}
          </Link>

          {/* Text-Based */}
          <Link
            to="/assessment/text"
            className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm border transition-all duration-300 ${
              isActive('/assessment/text')
                ? 'bg-violet-500/[0.10] text-violet-200 border-violet-400/[0.12]'
                : 'text-slate-500 border-transparent hover:text-slate-200 hover:bg-white/[0.035] hover:border-white/[0.04]'
            }`}
          >
            <Brain
              size={17}
              className={`shrink-0 transition-all duration-300 ${
                isActive('/assessment/text')
                  ? 'text-violet-300'
                  : 'text-slate-600 group-hover:text-violet-300 group-hover:scale-110'
              }`}
            />

            <span className="flex-1">Text-Based</span>

            {isActive('/assessment/text') && (
              <span className="w-1.5 h-1.5 rounded-full bg-violet-300 shadow-[0_0_8px_rgba(167,139,250,0.7)]" />
            )}
          </Link>

        </div>
      </div>

      {/* Summary */}
      <div className="relative mt-7">
        <div className="flex items-center gap-2 px-4 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400/80" />
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Insights
          </p>
        </div>

        <Link to="/summary" className={linkClass('/summary')}>
          {isActive('/summary') && (
            <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-gradient-to-b from-cyan-300 to-blue-500 shadow-[0_0_10px_rgba(34,211,238,0.35)]" />
          )}

          <FileChartColumn size={19} className={iconClass('/summary')} />
          <span className="flex-1">Summary</span>

          {isActive('/summary') && (
            <ChevronRight size={15} className="text-cyan-400 animate-[fadeIn_0.25s_ease-out]" />
          )}
        </Link>
      </div>

      {/* Bottom Section */}
      <div className="relative mt-auto">

        <div className="mb-4 mx-2 border-t border-white/[0.07]" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 text-sm font-medium border border-transparent transition-all duration-300 hover:bg-rose-500/[0.07] hover:text-rose-300 hover:border-rose-400/[0.10]"
        >
          <LogOut
            size={19}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          <span>Logout</span>
        </button>

        {/* Footer Branding */}
        <div className="mt-5 mx-2 rounded-xl border border-white/[0.06] bg-gradient-to-br from-white/[0.035] to-transparent p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_7px_rgba(34,211,238,0.6)]" />
            <span className="text-[10px] font-semibold tracking-[0.13em] text-slate-400 uppercase">
              MindAlign
            </span>
          </div>
          <p className="text-[10px] leading-4 text-slate-600">
            Your space to pause, reflect, and grow.
          </p>
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-3px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

    </aside>
  )
}

export default Sidebar