import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import {
  ArrowUpRight,
  Brain,
  Activity,
  BookOpen,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Clock3,
  Moon,
  Users,
  ClipboardCheck,
  FileChartColumn
} from 'lucide-react'

function Dashboard() {
  const navigate = useNavigate()

  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLatestAssessment = async () => {
      try {
        const token = localStorage.getItem('token')

        if (!token) {
          setLoading(false)
          return
        }

        const response = await fetch(
          'http://localhost:5000/api/assessment/latest',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        if (!response.ok) {
          setLoading(false)
          return
        }

        const data = await response.json()
        setAssessment(data.assessment)
      } catch (error) {
        console.error('Error fetching assessment:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestAssessment()
  }, [])

  const scorePercentage =
    assessment && Number(assessment.total) > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (Number(assessment.score) / Number(assessment.total)) * 100
          )
        )
      : 0

  const optionAssessmentCompleted =
    assessment?.optionAssessmentCompleted === true
  const textAssessmentCompleted =
    assessment?.textAssessmentCompleted === true
  const bothAssessmentsCompleted =
    optionAssessmentCompleted && textAssessmentCompleted
  const resultsReady =
    bothAssessmentsCompleted &&
    assessment?.riskLevel &&
    assessment.riskLevel !== 'Pending' &&
    assessment.burnoutProbability !== null &&
    assessment.burnoutProbability !== undefined
  const missingAssessmentPath = !optionAssessmentCompleted
    ? '/assessment/option'
    : '/assessment/text'
  const missingAssessmentLabel = !optionAssessmentCompleted
    ? 'option-based'
    : 'text-based'

  const infoCards = [
    {
      icon: Brain,
      number: '01',
      title: 'Understanding Burnout',
      description:
        'Burnout is physical, emotional, and mental exhaustion that can develop after prolonged or excessive stress.',
      accent: 'from-blue-500/[0.12] to-cyan-500/[0.02]',
      iconColor: 'text-cyan-300',
      iconBg: 'bg-cyan-400/[0.08]',
      border: 'hover:border-cyan-400/25',
    },
    {
      icon: Activity,
      number: '02',
      title: 'Common Causes',
      description:
        'Excessive workload, academic pressure, insufficient rest, and limited support can contribute to burnout.',
      accent: 'from-blue-500/[0.12] to-indigo-500/[0.02]',
      iconColor: 'text-blue-300',
      iconBg: 'bg-blue-400/[0.08]',
      border: 'hover:border-blue-400/25',
    },
    {
      icon: HeartPulse,
      number: '03',
      title: 'Recognizing the Signs',
      description:
        'Exhaustion, difficulty concentrating, reduced motivation, irritability, and feeling overwhelmed are possible signs.',
      accent: 'from-violet-500/[0.12] to-blue-500/[0.02]',
      iconColor: 'text-violet-300',
      iconBg: 'bg-violet-400/[0.08]',
      border: 'hover:border-violet-400/25',
    },
    {
      icon: ShieldCheck,
      number: '04',
      title: 'Taking Care of Yourself',
      description:
        'Regular breaks, adequate sleep, realistic goals, physical activity, and support from trusted people can help.',
      accent: 'from-cyan-500/[0.10] to-teal-500/[0.02]',
      iconColor: 'text-teal-300',
      iconBg: 'bg-teal-400/[0.08]',
      border: 'hover:border-teal-400/25',
    },
  ]

  const wellnessTips = [
    {
      icon: Moon,
      title: 'Prioritize rest',
      description: 'Make room for consistent, restorative sleep.',
    },
    {
      icon: Clock3,
      title: 'Take meaningful breaks',
      description: 'Give yourself time to recharge between tasks.',
    },
    {
      icon: Users,
      title: 'Stay connected',
      description: 'Reach out to people you trust when things feel difficult.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#070B16] text-white relative overflow-hidden selection:bg-cyan-400/20">

      {/* Aurora Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 left-[15%] w-[450px] h-[450px] rounded-full bg-blue-600/[0.10] blur-3xl" />
        <div className="absolute top-[20%] -right-48 w-[400px] h-[400px] rounded-full bg-cyan-500/[0.06] blur-3xl" />
        <div className="absolute -bottom-56 left-[35%] w-[450px] h-[450px] rounded-full bg-violet-600/[0.06] blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <Sidebar />

      {/* Main Content */}
      <main className="relative z-10 ml-64 min-h-screen p-6 md:p-10">

        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 animate-[fadeInUp_0.6s_ease-out_both]">

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan-400/15 bg-cyan-400/[0.05] text-cyan-300 text-[11px] font-semibold tracking-[0.14em] mb-5">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-30" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-cyan-400" />
                </span>
                YOUR PERSONAL WELLNESS SPACE
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Your mind matters
                <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                  .
                </span>
              </h1>

              <p className="text-slate-400 mt-3 max-w-xl leading-7">
                A little space to pause, reflect, and understand your well-being.
                Take things one step at a time.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm border border-white/[0.08] bg-[#0D1424]/80 rounded-2xl px-4 py-3 self-start sm:self-auto transition-all duration-300 hover:border-cyan-400/20 hover:bg-[#111C30]">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400/15 to-blue-500/10 border border-cyan-400/10 flex items-center justify-center">
                <HeartPulse size={20} className="text-cyan-300" />
              </div>
              <div>
                <p className="text-white font-medium">Your well-being</p>
                <p className="text-xs text-slate-500 mt-1">Starts with you</p>
              </div>
            </div>

          </header>

          {/* Assessment Overview */}
          <section className="group relative rounded-3xl border border-white/[0.09] bg-gradient-to-br from-[#101B31] via-[#0D1425] to-[#101024] p-6 md:p-9 shadow-2xl shadow-black/20 mb-7 overflow-hidden animate-[fadeInUp_0.7s_ease-out_both]">

            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/[0.04] via-transparent to-cyan-400/[0.04] pointer-events-none" />
            <div className="absolute -top-32 -right-16 w-80 h-80 rounded-full bg-cyan-400/[0.08] blur-[100px] pointer-events-none transition-opacity duration-700 group-hover:bg-cyan-400/[0.12]" />
            <div className="absolute -bottom-36 left-1/3 w-72 h-72 rounded-full bg-violet-500/[0.08] blur-[100px] pointer-events-none" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">

              <div className="max-w-xl">

                <div className="flex items-center gap-2 text-cyan-300 text-xs font-semibold tracking-[0.16em] mb-5">
                  <Activity size={15} />
                  WELLNESS OVERVIEW
                </div>

                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {loading
                    ? 'Checking in with your progress'
                    : resultsReady
                      ? 'Your latest assessment'
                      : assessment
                        ? 'Your assessment progress'
                        : 'Start with a check-in'}
                </h2>

                {loading ? (
                  <p className="mt-4 text-slate-400 leading-7">
                    Loading your latest assessment. Just a moment...
                  </p>
                ) : resultsReady ? (
                  <>
                    <p className="mt-4 text-slate-400 leading-7">
                      Both assessments are complete and your results are ready.
                      Take a moment to reflect on how you've been feeling.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-7">
                      <button
                        onClick={() => navigate('/summary')}
                        className="group/button inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-blue-950/40 transition-all duration-300 hover:shadow-cyan-500/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
                      >
                        View Results
                        <ArrowUpRight
                          size={17}
                          className="transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
                        />
                      </button>

                      <button
                        onClick={() => navigate('/assessment/option')}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 font-medium text-sm transition-all duration-300 hover:bg-white/[0.07] hover:border-cyan-400/20 hover:text-white"
                      >
                        Retake Assessment
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-slate-400 leading-7">
                      {assessment
                        ? bothAssessmentsCompleted
                          ? 'Both assessments are complete, but your analysis is still processing. Check back shortly.'
                          : `Your ${optionAssessmentCompleted ? 'option-based' : 'text-based'} assessment is recorded. Complete the ${missingAssessmentLabel} assessment to receive your results.`
                        : "You haven't completed an assessment yet. Complete both the option-based and text-based assessments to receive your results."}
                    </p>

                    <button
                      onClick={() => navigate(assessment ? (bothAssessmentsCompleted ? '/summary' : missingAssessmentPath) : '/assessment/option')}
                      className="group/button inline-flex items-center gap-2 mt-7 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-blue-950/40 transition-all duration-300 hover:shadow-cyan-500/20 hover:shadow-xl hover:-translate-y-0.5"
                    >
                      <ClipboardCheck size={17} />
                      {assessment
                        ? bothAssessmentsCompleted
                          ? 'Check Results'
                          : `Complete ${missingAssessmentLabel} Assessment`
                        : 'Start Option-Based Assessment'}
                      <ArrowUpRight
                        size={17}
                        className="transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
                      />
                    </button>
                  </>
                )}

                <p className="text-xs text-slate-600 mt-5">
                  For self-awareness only, not a clinical diagnosis.
                </p>

              </div>

              {/* Animated Score Ring */}
              <div className="flex items-center justify-center shrink-0">

                {loading ? (
                  <div className="w-44 h-44 rounded-full border border-white/[0.08] bg-white/[0.02] flex flex-col items-center justify-center gap-3">
                    <div className="w-9 h-9 border-2 border-cyan-400/20 border-t-cyan-400 rounded-full animate-spin" />
                    <span className="text-xs text-slate-500">Loading score</span>
                  </div>
                ) : resultsReady ? (
                  <div className="flex flex-col items-center">

                    <div
                      className="relative w-44 h-44 rounded-full flex items-center justify-center transition-transform duration-500 hover:scale-105 animate-[scoreReveal_0.9s_ease-out_both]"
                      style={{
                        background: `conic-gradient(from -90deg, #22D3EE 0%, #3B82F6 ${scorePercentage * 0.7}%, #818CF8 ${scorePercentage}%, rgba(255,255,255,0.06) ${scorePercentage}% 100%)`,
                      }}
                    >
                      <div className="absolute inset-[2px] rounded-full bg-cyan-400/10 blur-md" />

                      <div className="absolute inset-[7px] rounded-full bg-[#0D1528] border border-white/[0.06] flex flex-col items-center justify-center shadow-inner">

                        <span className="text-4xl font-bold tracking-tight bg-gradient-to-br from-white via-cyan-100 to-blue-300 bg-clip-text text-transparent">
                          {assessment.score}
                        </span>

                        <span className="text-xs text-slate-500 mt-1">
                          out of {assessment.total}
                        </span>

                        <div className="mt-2 px-2.5 py-1 rounded-full border border-cyan-400/10 bg-cyan-400/[0.06] text-cyan-300 text-[9px] font-semibold tracking-[0.12em]">
                          LATEST SCORE
                        </div>

                      </div>
                    </div>

                    <p className="mt-4 text-sm font-medium text-cyan-200">
                      {assessment.riskLevel} risk
                    </p>

                  </div>
                ) : (
                  <div className="w-44 h-44 rounded-full border border-dashed border-cyan-400/20 bg-cyan-400/[0.025] flex flex-col items-center justify-center">
                    <ClipboardCheck size={34} className="text-cyan-300/70 mb-3" />
                    <span className="text-sm font-medium text-slate-300">
                      {assessment
                        ? bothAssessmentsCompleted
                          ? 'Analyzing'
                          : 'In progress'
                        : 'Your journey'}
                    </span>
                    <span className="text-xs text-slate-600 mt-1">
                      {assessment
                        ? `${Number(optionAssessmentCompleted) + Number(textAssessmentCompleted)} of 2 complete`
                        : 'Starts here'}
                    </span>
                  </div>
                )}

              </div>
            </div>
          </section>

          {/* Quick Access */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-11">

            <button
              onClick={() => navigate('/assessment/option')}
              className="group text-left rounded-2xl border border-white/[0.08] bg-[#0C1322]/80 p-5 transition-all duration-300 hover:bg-blue-500/[0.06] hover:border-blue-400/25 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/20 animate-[fadeInUp_0.7s_ease-out_both]"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-400/15 to-cyan-400/[0.04] border border-blue-400/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <ClipboardCheck size={21} className="text-cyan-300" />
                </div>
                <ArrowUpRight size={18} className="text-slate-600 transition-all duration-300 group-hover:text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <h3 className="text-base font-semibold mt-4">Wellness Assessment</h3>
              <p className="text-sm text-slate-500 mt-2 leading-6">
                Take a moment to reflect on your current well-being.
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-cyan-300/70 group-hover:text-cyan-300 transition-colors">
                Get started <span>→</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/summary')}
              className="group text-left rounded-2xl border border-white/[0.08] bg-[#0C1322]/80 p-5 transition-all duration-300 hover:bg-violet-500/[0.06] hover:border-violet-400/25 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-950/20 animate-[fadeInUp_0.85s_ease-out_both]"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-400/15 to-blue-400/[0.04] border border-violet-400/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <FileChartColumn size={21} className="text-violet-300" />
                </div>
                <ArrowUpRight size={18} className="text-slate-600 transition-all duration-300 group-hover:text-violet-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>

              <h3 className="text-base font-semibold mt-4">Assessment Summary</h3>
              <p className="text-sm text-slate-500 mt-2 leading-6">
                Revisit your latest results and reflect on your responses.
              </p>

              <div className="mt-4 flex items-center gap-2 text-xs text-violet-300/70 group-hover:text-violet-300 transition-colors">
                View summary <span>→</span>
              </div>
            </button>

          </div>

          {/* Educational Resources */}
          <section className="mb-11">

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-3">
                  KNOWLEDGE & AWARENESS
                </p>
                <h2 className="text-2xl font-bold tracking-tight">
                  Understanding burnout
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Recognize the signs and learn ways to take care of yourself.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
                <BookOpen size={15} className="text-cyan-400/70" />
                Wellness essentials
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {infoCards.map((card, index) => {
                const Icon = card.icon

                return (
                  <article
                    key={card.number}
                    style={{ animationDelay: `${index * 100}ms` }}
                    className={`group relative rounded-2xl border border-white/[0.07] bg-gradient-to-br ${card.accent} p-6 overflow-hidden transition-all duration-300 ${card.border} hover:-translate-y-1 hover:shadow-xl hover:shadow-black/10 animate-[fadeInUp_0.7s_ease-out_both]`}
                  >
                    <div className="absolute top-4 right-5 text-5xl font-bold text-white/[0.035] transition-colors duration-300 group-hover:text-white/[0.07]">
                      {card.number}
                    </div>

                    <div className={`w-11 h-11 rounded-xl ${card.iconBg} border border-white/[0.05] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                      <Icon size={21} className={card.iconColor} />
                    </div>

                    <h3 className="text-lg font-semibold text-white">
                      {card.title}
                    </h3>

                    <p className="text-sm text-slate-400 leading-7 mt-3">
                      {card.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-slate-600 group-hover:text-cyan-300/70 transition-colors duration-300">
                      <span className="w-5 h-px bg-current" />
                      MindAlign Wellness
                    </div>
                  </article>
                )
              })}

            </div>
          </section>

          {/* Wellness Reminders */}
          <section className="relative rounded-3xl border border-cyan-400/[0.10] bg-gradient-to-br from-[#0D1925] via-[#0B1421] to-[#101225] p-6 md:p-8 mb-6 overflow-hidden">

            <div className="absolute -top-28 right-0 w-64 h-64 bg-cyan-500/[0.06] rounded-full blur-[90px] pointer-events-none" />

            <div className="relative flex items-start gap-4 mb-7">
              <div className="w-11 h-11 rounded-xl bg-cyan-400/[0.08] border border-cyan-400/10 flex items-center justify-center shrink-0">
                <HeartPulse size={21} className="text-cyan-300" />
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300 mb-2">
                  A GENTLE REMINDER
                </p>
                <h2 className="text-xl font-bold">
                  You deserve time to recharge.
                </h2>
                <p className="text-sm text-slate-400 mt-2 leading-6">
                  Small, realistic steps are worthwhile. You don't have to do everything at once.
                </p>
              </div>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-3">

              {wellnessTips.map((tip) => {
                const Icon = tip.icon

                return (
                  <div
                    key={tip.title}
                    className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-all duration-300 hover:bg-cyan-400/[0.035] hover:border-cyan-400/15"
                  >
                    <div className="mt-0.5 text-cyan-300/80">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-slate-200">
                        {tip.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-5 mt-1.5">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                )
              })}

            </div>
          </section>

          {/* Footer */}
          <footer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-5 text-xs text-slate-600">
            <p>MindAlign · Your space for self-awareness</p>
            <p>Take it one step at a time.</p>
          </footer>

        </div>
      </main>

      {/* Page Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scoreReveal {
          from {
            opacity: 0;
            transform: scale(0.82) rotate(-12deg);
          }
          to {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes gentleFloat {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

    </div>
  )
}

export default Dashboard