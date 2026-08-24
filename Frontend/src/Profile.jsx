import Sidebar from './Sidebar'

function Profile() {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">

      {/* Same Background Glows as Dashboard */}
      <div className="fixed top-[-180px] left-[-180px] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="fixed bottom-[-180px] right-[-180px] w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-6 md:p-10 relative">

        {/* Header */}
        <div className="mb-8">
          <p className="text-indigo-400 text-sm font-medium mb-2">
            Account Settings
          </p>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Profile
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your account information and preferences.
          </p>
        </div>

        {/* Profile Card */}
        <section className="max-w-5xl rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl p-6 md:p-8 shadow-2xl">

          {/* Profile Information */}
          <div className="flex flex-col md:flex-row md:items-center gap-6">

            {/* Profile Image */}
            <div className="relative">

              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-indigo-500/20 bg-slate-900 shadow-xl flex items-center justify-center">
                <img
                  src="/favicon.svg"
                  alt="Profile"
                  className="w-full h-full object-cover p-5"
                />
              </div>

              {/* Active Indicator */}
              <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-4 border-slate-950"></div>

            </div>

            {/* User Details */}
            <div>
              <p className="text-sm text-indigo-400 font-medium mb-1">
                Your Profile
              </p>

              <h2 className="text-2xl font-semibold text-white">
                Username
              </h2>

              <p className="text-slate-400 mt-1">
                user@example.com
              </p>

              <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-400/10">
                Student Account
              </span>
            </div>

          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-white/10"></div>

          {/* Account Settings */}
          <div>

            <div className="mb-5">
              <h3 className="text-xl font-semibold text-white">
                Account Settings
              </h3>

              <p className="text-slate-500 text-sm mt-1">
                Manage your personal information and security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {/* Change Username */}
              <button
                className="group text-left rounded-2xl border border-white/10 bg-white/[0.05] p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-indigo-400/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-400/10 flex items-center justify-center mb-5">
                  <span className="text-indigo-400 font-bold">
                    U
                  </span>
                </div>

                <h4 className="text-lg font-semibold text-white">
                  Change Username
                </h4>

                <p className="text-sm text-slate-500 mt-2 leading-6">
                  Update the name displayed on your MindAlign account.
                </p>

                <p className="text-sm text-indigo-400 mt-5 font-medium group-hover:translate-x-1 transition-transform">
                  Manage →
                </p>
              </button>

              {/* Change Email */}
              <button
                className="group text-left rounded-2xl border border-white/10 bg-white/[0.05] p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-indigo-400/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-400/10 flex items-center justify-center mb-5">
                  <span className="text-indigo-400 font-bold">
                    @
                  </span>
                </div>

                <h4 className="text-lg font-semibold text-white">
                  Change Email
                </h4>

                <p className="text-sm text-slate-500 mt-2 leading-6">
                  Update the email address connected to your account.
                </p>

                <p className="text-sm text-indigo-400 mt-5 font-medium group-hover:translate-x-1 transition-transform">
                  Manage →
                </p>
              </button>

              {/* Change Password */}
              <button
                className="group text-left rounded-2xl border border-white/10 bg-white/[0.05] p-6 transition-all duration-300 hover:bg-white/[0.08] hover:border-indigo-400/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-950/20"
              >
                <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-400/10 flex items-center justify-center mb-5">
                  <span className="text-indigo-400 font-bold">
                    *
                  </span>
                </div>

                <h4 className="text-lg font-semibold text-white">
                  Change Password
                </h4>

                <p className="text-sm text-slate-500 mt-2 leading-6">
                  Update your password and keep your account secure.
                </p>

                <p className="text-sm text-indigo-400 mt-5 font-medium group-hover:translate-x-1 transition-transform">
                  Manage →
                </p>
              </button>

            </div>

          </div>

        </section>

      </main>
    </div>
  )
}

export default Profile