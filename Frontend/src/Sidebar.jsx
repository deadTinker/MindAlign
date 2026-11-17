import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserRound,
  ClipboardList,
  FileChartColumn,
  LogOut,
  Brain,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const isActive = (path) =>
    path === '/community'
      ? location.pathname.startsWith('/community')
      : location.pathname === path

  const linkClass = (path) =>
    `group relative flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-300 ease-out ${
      isActive(path)
        ? 'bg-emerald-50 text-[#16A34A] border-emerald-200 shadow-sm shadow-emerald-500/10 font-semibold'
        : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50 hover:border-slate-200/80'
    }`

  const iconClass = (path) =>
    `shrink-0 transition-all duration-300 ${
      isActive(path)
        ? 'text-[#16A34A]'
        : 'text-slate-400 group-hover:text-[#16A34A] group-hover:scale-110'
    }`

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white/95 backdrop-blur-2xl border-r border-slate-200 px-4 py-7 flex flex-col overflow-hidden shadow-[4px_0_24px_rgba(15,23,42,0.03)]">
      {/* Brand */}
      <div className="relative px-2 mb-10">
        <Link to="/dashboard" className="group flex items-center gap-3 w-fit">
          <div className="relative w-11 h-11 rounded-2xl bg-[#22C55E] flex items-center justify-center shadow-md shadow-emerald-500/20 transition-all duration-300 group-hover:bg-[#16A34A] group-hover:scale-105">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent to-white/20" />
            <Brain size={23} className="relative text-white" />
          </div>

          <div>
            <h1 className="text-[21px] font-black tracking-tight uppercase text-[#22C55E]">
              MIND<span className="text-slate-900">ALIGN</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 tracking-[0.12em] uppercase">
              Student Wellness
            </p>
          </div>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="relative">
        <div className="flex items-center gap-2 px-4 mb-3">
          <Sparkles size={12} className="text-[#22C55E]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Workspace
          </p>
        </div>

        <nav className="flex flex-col gap-1.5">
          {/* Dashboard */}
          <Link to="/dashboard" className={linkClass('/dashboard')}>
            {isActive('/dashboard') && (
              <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            )}

            <LayoutDashboard size={19} className={iconClass('/dashboard')} />
            <span className="flex-1">Dashboard</span>

            {isActive('/dashboard') && (
              <ChevronRight
                size={15}
                className="text-[#22C55E] animate-[fadeIn_0.25s_ease-out]"
              />
            )}
          </Link>

          {/* Community */}
          <Link to="/community" className={linkClass('/community')}>
            {isActive('/community') && (
              <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            )}

            <Users size={19} className={iconClass('/community')} />
            <span className="flex-1">Community</span>

            {isActive('/community') && (
              <ChevronRight
                size={15}
                className="text-[#22C55E] animate-[fadeIn_0.25s_ease-out]"
              />
            )}
          </Link>

          {/* Profile */}
          <Link to="/profile" className={linkClass('/profile')}>
            {isActive('/profile') && (
              <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
            )}

            <UserRound size={19} className={iconClass('/profile')} />
            <span className="flex-1">Profile</span>

            {isActive('/profile') && (
              <ChevronRight
                size={15}
                className="text-[#22C55E] animate-[fadeIn_0.25s_ease-out]"
              />
            )}
          </Link>
        </nav>
      </div>

      {/* Assessment Navigation */}
      <div className="relative mt-7">
        <div className="flex items-center gap-2 px-4 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Assessments
          </p>
        </div>

        <div className="ml-3 pl-3 border-l border-slate-200 flex flex-col gap-1.5">
          {/* Option-Based */}
          <Link
            to="/assessment/option"
            className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm border transition-all duration-300 ${
              isActive('/assessment/option')
                ? 'bg-emerald-50 text-[#16A34A] border-emerald-200 font-semibold'
                : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-50 hover:border-slate-200/80'
            }`}
          >
            <ClipboardList
              size={17}
              className={`shrink-0 transition-all duration-300 ${
                isActive('/assessment/option')
                  ? 'text-[#16A34A]'
                  : 'text-slate-400 group-hover:text-[#16A34A] group-hover:scale-110'
              }`}
            />

            <span className="flex-1">Option-Based</span>

            {isActive('/assessment/option') && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
            )}
          </Link>

          {/* Text-Based */}
          <Link
            to="/assessment/text"
            className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm border transition-all duration-300 ${
              isActive('/assessment/text')
                ? 'bg-teal-50 text-teal-700 border-teal-200 font-semibold'
                : 'text-slate-500 border-transparent hover:text-slate-900 hover:bg-slate-50 hover:border-slate-200/80'
            }`}
          >
            <Brain
              size={17}
              className={`shrink-0 transition-all duration-300 ${
                isActive('/assessment/text')
                  ? 'text-teal-600'
                  : 'text-slate-400 group-hover:text-teal-600 group-hover:scale-110'
              }`}
            />

            <span className="flex-1">Text-Based</span>

            {isActive('/assessment/text') && (
              <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shadow-[0_0_6px_rgba(20,184,166,0.6)]" />
            )}
          </Link>
        </div>
      </div>

      {/* Summary */}
      <div className="relative mt-7">
        <div className="flex items-center gap-2 px-4 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Insights
          </p>
        </div>

        <Link to="/summary" className={linkClass('/summary')}>
          {isActive('/summary') && (
            <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-[#22C55E] shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          )}

          <FileChartColumn size={19} className={iconClass('/summary')} />
          <span className="flex-1">Summary</span>

          {isActive('/summary') && (
            <ChevronRight
              size={15}
              className="text-[#22C55E] animate-[fadeIn_0.25s_ease-out]"
            />
          )}
        </Link>
      </div>

      {/* Bottom Section */}
      <div className="relative mt-auto">
        <div className="mb-4 mx-2 border-t border-slate-200" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="group w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 text-sm font-medium border border-transparent transition-all duration-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
        >
          <LogOut
            size={19}
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          <span>Logout</span>
        </button>

        {/* Footer Branding */}
        <div className="mt-4 mx-2 rounded-xl border border-slate-200 bg-emerald-50/40 p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
            <span className="text-[10px] font-bold tracking-[0.13em] text-slate-700 uppercase">
              MindAlign
            </span>
          </div>
          <p className="text-[10px] leading-4 text-slate-500">
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