import { Link, useLocation } from 'react-router-dom'

function Sidebar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-950 border-r border-white/10 px-4 py-8 flex flex-col">

      {/* Brand */}
      <div className="px-4 mb-10">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Mind<span className="text-indigo-400">Align</span>
        </h1>

        <p className="text-xs text-slate-500 mt-1 tracking-wide">
          Mental Wellness Dashboard
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">

        {/* Profile */}
        <Link
          to="/profile"
          className={`group relative flex items-center w-full px-4 py-3.5 rounded-2xl font-medium transition-all duration-300 ${
            isActive('/profile')
              ? 'bg-indigo-600/20 text-white border border-indigo-400/20 shadow-lg shadow-indigo-900/20'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300 ${
              isActive('/profile')
                ? 'h-8 bg-indigo-400'
                : 'h-0 bg-transparent group-hover:h-5 group-hover:bg-indigo-500'
            }`}
          />

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            Profile
          </span>
        </Link>
      {/* Dashboard */}
<Link
  to="/dashboard"
  className={`group relative flex items-center w-full px-4 py-3.5 rounded-2xl font-medium transition-all duration-300 ${
    isActive('/dashboard')
      ? 'bg-indigo-600/20 text-white border border-indigo-400/20 shadow-lg shadow-indigo-900/20'
      : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
  }`}
>
  <span
    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300 ${
      isActive('/dashboard')
        ? 'h-8 bg-indigo-400'
        : 'h-0 bg-transparent group-hover:h-5 group-hover:bg-indigo-500'
    }`}
  />

  <span className="transition-transform duration-300 group-hover:translate-x-1">
    Dashboard
  </span>
</Link>
        {/* Assessment */}
        <div className="mt-1">

          <div className="px-4 py-3.5 text-slate-300 font-semibold tracking-wide">
            Assessment
          </div>

          <div className="ml-3 pl-4 border-l border-white/10 flex flex-col gap-1.5">

            {/* Option-Based */}
            <Link
              to="/assessment/option"
              className={`group relative flex items-center px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                isActive('/assessment/option')
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-400/10'
                  : 'text-slate-500 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span
                className={`mr-3 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isActive('/assessment/option')
                    ? 'bg-indigo-400 shadow-lg shadow-indigo-400/50'
                    : 'bg-slate-700 group-hover:bg-indigo-400'
                }`}
              />

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                Option-Based
              </span>
            </Link>

            {/* Text-Based */}
            <Link
              to="/assessment/text"
              className={`group relative flex items-center px-4 py-3 rounded-xl text-sm transition-all duration-300 ${
                isActive('/assessment/text')
                  ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-400/10'
                  : 'text-slate-500 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <span
                className={`mr-3 w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  isActive('/assessment/text')
                    ? 'bg-indigo-400 shadow-lg shadow-indigo-400/50'
                    : 'bg-slate-700 group-hover:bg-indigo-400'
                }`}
              />

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                Text-Based
              </span>
            </Link>

          </div>
        </div>

        {/* Summary */}
        <Link
          to="/summary"
          className={`group relative flex items-center w-full px-4 py-3.5 rounded-2xl font-medium transition-all duration-300 ${
            isActive('/summary')
              ? 'bg-indigo-600/20 text-white border border-indigo-400/20 shadow-lg shadow-indigo-900/20'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
          }`}
        >
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full transition-all duration-300 ${
              isActive('/summary')
                ? 'h-8 bg-indigo-400'
                : 'h-0 bg-transparent group-hover:h-5 group-hover:bg-indigo-500'
            }`}
          />

          <span className="transition-transform duration-300 group-hover:translate-x-1">
            Summary
          </span>
        </Link>

      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6">

        <button
          className="group w-full flex items-center px-4 py-3.5 rounded-2xl text-slate-500 font-medium transition-all duration-300 hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            Logout
          </span>
        </button>

      </div>

    </aside>
  )
}

export default Sidebar