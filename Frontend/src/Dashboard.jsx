import Sidebar from './Sidebar'

function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">

      {/* Background Glows */}
      <div className="fixed top-[-180px] left-[-180px] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="fixed bottom-[-180px] right-[-180px] w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 min-h-screen p-6 md:p-10 relative">

        {/* Header */}
        <div className="mb-8">
          <p className="text-indigo-400 text-sm font-medium mb-2">
            Welcome to MindAlign
          </p>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            MindAlign Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Understand your mental well-being and keep track of your burnout risk.
          </p>
        </div>

        {/* Burnout Risk Score */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl p-6 md:p-8 shadow-2xl mb-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div>
              <p className="text-sm text-indigo-400 font-medium mb-2">
                Your Current Status
              </p>

              <h2 className="text-2xl font-semibold text-white">
                Burnout Risk Score
              </h2>

              <p className="text-slate-400 mt-3 max-w-xl">
                Please take the burnout assessment to understand your
                current risk level and receive personalized insights.
              </p>

              <button
                className="mt-6 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold transition-all duration-200 hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/20"
              >
                Take Assessment
              </button>
            </div>

            {/* Score */}
            <div className="flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-8 border-slate-700 flex items-center justify-center bg-slate-900/60 shadow-lg">

                <div className="text-center">
                  <p className="text-3xl font-bold text-slate-400">
                    --
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    No Score
                  </p>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* Information Cards */}
        <div className="flex flex-col gap-6">

          {/* What is Burnout */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6 shadow-lg transition-all duration-200 hover:bg-white/[0.08] hover:-translate-y-1">

            <h2 className="text-xl font-semibold text-white">
              What is Burnout?
            </h2>

            <p className="mt-4 text-slate-400 leading-7">
              Burnout is a state of physical, emotional, and mental
              exhaustion caused by prolonged or excessive stress. It can
              occur when the demands placed on a person consistently
              exceed their ability to cope with them.
            </p>

          </section>

          {/* Causes */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6 shadow-lg transition-all duration-200 hover:bg-white/[0.08] hover:-translate-y-1">

            <h2 className="text-xl font-semibold text-white">
              Causes of Burnout
            </h2>

            <ul className="mt-4 space-y-3 text-slate-400">

              <li>• Excessive workload or academic pressure</li>
              <li>• Lack of adequate rest and recovery</li>
              <li>• Long-term or unmanaged stress</li>
              <li>• Lack of control over responsibilities</li>
              <li>• Lack of support from others</li>
              <li>• Poor work-life or study-life balance</li>

            </ul>

          </section>

          {/* Effects */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6 shadow-lg transition-all duration-200 hover:bg-white/[0.08] hover:-translate-y-1">

            <h2 className="text-xl font-semibold text-white">
              Effects of Burnout
            </h2>

            <ul className="mt-4 space-y-3 text-slate-400">

              <li>• Physical and emotional exhaustion</li>
              <li>• Difficulty concentrating</li>
              <li>• Reduced motivation</li>
              <li>• Decreased productivity</li>
              <li>• Irritability and emotional distress</li>
              <li>• Feeling overwhelmed or detached</li>

            </ul>

          </section>

          {/* Prevention */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-6 shadow-lg transition-all duration-200 hover:bg-white/[0.08] hover:-translate-y-1">

            <h2 className="text-xl font-semibold text-white">
              How to Prevent Burnout
            </h2>

            <ul className="mt-4 space-y-3 text-slate-400">

              <li>• Take regular breaks and get adequate rest</li>
              <li>• Maintain a healthy sleep schedule</li>
              <li>• Set realistic goals and manage your workload</li>
              <li>• Maintain a healthy balance between work, study, and personal life</li>
              <li>• Stay physically active and maintain healthy habits</li>
              <li>• Talk to trusted people when you're feeling overwhelmed</li>

            </ul>

          </section>

        </div>

      </main>
    </div>
  )
}

export default Dashboard