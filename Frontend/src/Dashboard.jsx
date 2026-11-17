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
  Clock3,
  Moon,
  Users,
  ClipboardCheck,
  FileChartColumn,
} from 'lucide-react'

// Subtle wellness backdrop tiles matching the Login & Signup aesthetic
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
        console.log('Latest assessment:', data.assessment)
        console.log('Questionnaire score:', data.assessment?.questionnaireScore)
        console.log('Questionnaire total:', data.assessment?.questionnaireTotal)
      } catch (error) {
        console.error('Error fetching assessment:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLatestAssessment()
  }, [])

  const scorePercentage =
    assessment && Number(assessment.questionnaireTotal) > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (Number(assessment.questionnaireScore) /
              Number(assessment.questionnaireTotal)) *
              100
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
      accent: 'from-emerald-50/90 via-white to-white',
      iconColor: 'text-[#16A34A]',
      iconBg: 'bg-emerald-50 border-emerald-200/70',
      border: 'hover:border-[#22C55E]/50',
    },
    {
      icon: Activity,
      number: '02',
      title: 'Common Causes',
      description:
        'Excessive workload, academic pressure, insufficient rest, and limited support can contribute to burnout.',
      accent: 'from-teal-50/90 via-white to-white',
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50 border-teal-200/70',
      border: 'hover:border-teal-400/50',
    },
    {
      icon: HeartPulse,
      number: '03',
      title: 'Recognizing the Signs',
      description:
        'Exhaustion, difficulty concentrating, reduced motivation, irritability, and feeling overwhelmed are possible signs.',
      accent: 'from-lime-50/90 via-white to-white',
      iconColor: 'text-lime-700',
      iconBg: 'bg-lime-50 border-lime-200/70',
      border: 'hover:border-lime-400/60',
    },
    {
      icon: ShieldCheck,
      number: '04',
      title: 'Taking Care of Yourself',
      description:
        'Regular breaks, adequate sleep, realistic goals, physical activity, and support from trusted people can help.',
      accent: 'from-green-50/90 via-white to-white',
      iconColor: 'text-[#15803D]',
      iconBg: 'bg-green-50 border-green-200/70',
      border: 'hover:border-[#22C55E]/50',
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
    <div className="min-h-screen bg-white text-slate-900 relative overflow-x-hidden selection:bg-[#22C55E] selection:text-white">
      {/* Light Tiled Content Backdrop (Matches Login Page) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden opacity-45"
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
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.96)_100%)]" />
      </div>

      <Sidebar />

      {/* Main Content */}
      <main className="relative z-10 ml-64 min-h-screen p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10 animate-[fadeInUp_0.6s_ease-out_both]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 text-[#16A34A] text-[11px] font-semibold tracking-[0.14em] mb-4">
                <span className="relative flex w-2 h-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-50" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-[#22C55E]" />
                </span>
                YOUR PERSONAL WELLNESS SPACE
              </div>

              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
                Your mind matters
                <span className="text-[#22C55E]">.</span>
              </h1>

              <p className="text-slate-500 mt-3 max-w-xl leading-7">
                A calm space to pause, reflect, and understand your well-being.
                Take things one step at a time.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm border border-slate-200/90 bg-white/90 backdrop-blur-md rounded-2xl px-4 py-3 self-start sm:self-auto shadow-sm transition-all duration-300 hover:border-[#22C55E]/40 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center">
                <HeartPulse size={20} className="text-[#16A34A]" />
              </div>
              <div>
                <p className="text-slate-900 font-semibold">Your well-being</p>
                <p className="text-xs text-slate-500 mt-0.5">Starts with you</p>
              </div>
            </div>
          </header>

          {/* Assessment Overview Card */}
          <section className="group relative rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md p-6 md:p-9 shadow-[0_20px_60px_rgba(15,23,42,0.06)] mb-7 overflow-hidden animate-[fadeInUp_0.7s_ease-out_both]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/70 via-white/40 to-teal-50/40 pointer-events-none" />
            <div className="absolute -top-28 -right-16 w-72 h-72 rounded-full bg-[#22C55E]/[0.08] blur-3xl pointer-events-none transition-opacity duration-700 group-hover:bg-[#22C55E]/[0.12]" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-[#16A34A] text-xs font-bold tracking-[0.16em] mb-4">
                  <Activity size={15} />
                  WELLNESS OVERVIEW
                </div>

                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                  {loading
                    ? 'Checking in with your progress'
                    : resultsReady
                      ? 'Your latest assessment'
                      : assessment
                        ? 'Your assessment progress'
                        : 'Start with a check-in'}
                </h2>

                {loading ? (
                  <p className="mt-4 text-slate-500 leading-7">
                    Loading your latest assessment. Just a moment...
                  </p>
                ) : resultsReady ? (
                  <>
                    <p className="mt-4 text-slate-600 leading-7">
                      Both assessments are complete and your results are ready.
                      Take a moment to reflect on how you&apos;ve been feeling.
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-7">
                      <button
                        onClick={() => navigate('/summary')}
                        className="group/button inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] active:bg-[#15803D] text-white font-semibold text-sm shadow-md shadow-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        View Results
                        <ArrowUpRight
                          size={17}
                          className="transition-transform duration-300 group-hover/button:translate-x-0.5 group-hover/button:-translate-y-0.5"
                        />
                      </button>

                      <button
                        onClick={() => navigate('/assessment/option')}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 bg-slate-50/90 text-slate-700 font-semibold text-sm transition-all duration-200 hover:bg-white hover:border-[#22C55E] hover:text-[#16A34A]"
                      >
                        Retake Assessment
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-4 text-slate-600 leading-7">
                      {assessment
                        ? bothAssessmentsCompleted
                          ? 'Both assessments are complete, but your analysis is still processing. Check back shortly.'
                          : `Your ${optionAssessmentCompleted ? 'option-based' : 'text-based'} assessment is recorded. Complete the ${missingAssessmentLabel} assessment to receive your results.`
                        : "You haven't completed an assessment yet. Complete both the option-based and text-based assessments to receive your results."}
                    </p>

                    <button
                      onClick={() =>
                        navigate(
                          assessment
                            ? bothAssessmentsCompleted
                              ? '/summary'
                              : missingAssessmentPath
                            : '/assessment/option'
                        )
                      }
                      className="group/button inline-flex items-center gap-2 mt-7 px-5 py-3 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] active:bg-[#15803D] text-white font-semibold text-sm shadow-md shadow-emerald-500/20 transition-all duration-200 hover:-translate-y-0.5"
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

                <p className="text-xs text-slate-400 mt-5">
                  For self-awareness only, not a clinical diagnosis.
                </p>
              </div>

              {/* Animated Score Ring */}
              <div className="flex items-center justify-center shrink-0">
                {loading ? (
                  <div className="w-44 h-44 rounded-full border border-slate-200 bg-slate-50/90 flex flex-col items-center justify-center gap-3">
                    <div className="w-9 h-9 border-2 border-emerald-200 border-t-[#22C55E] rounded-full animate-spin" />
                    <span className="text-xs text-slate-500 font-medium">
                      Loading score
                    </span>
                  </div>
                ) : resultsReady ? (
                  <div className="flex flex-col items-center">
                    <div
                      className="relative w-44 h-44 rounded-full flex items-center justify-center shadow-md shadow-emerald-500/10 transition-transform duration-500 hover:scale-105 animate-[scoreReveal_0.9s_ease-out_both]"
                      style={{
                        background: `conic-gradient(from -90deg, #22C55E 0%, #16A34A ${
                          scorePercentage * 0.7
                        }%, #14B8A6 ${scorePercentage}%, #E2E8F0 ${scorePercentage}% 100%)`,
                      }}
                    >
                      <div className="absolute inset-[8px] rounded-full bg-white border border-slate-100 flex flex-col items-center justify-center shadow-inner">
                        <span className="text-4xl font-bold tracking-tight text-slate-900">
                          {assessment.questionnaireScore}
                        </span>

                        <span className="text-xs text-slate-500 mt-1">
                          out of {assessment.questionnaireTotal}
                        </span>

                        <div className="mt-2 px-2.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-[#16A34A] text-[9px] font-bold tracking-[0.12em]">
                          LATEST SCORE
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-sm font-semibold text-[#16A34A]">
                      {assessment.riskLevel} risk
                    </p>
                  </div>
                ) : (
                  <div className="w-44 h-44 rounded-full border-2 border-dashed border-emerald-300/80 bg-emerald-50/40 flex flex-col items-center justify-center">
                    <ClipboardCheck
                      size={34}
                      className="text-[#22C55E] mb-3"
                    />
                    <span className="text-sm font-semibold text-slate-800">
                      {assessment
                        ? bothAssessmentsCompleted
                          ? 'Analyzing'
                          : 'In progress'
                        : 'Your journey'}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">
                      {assessment
                        ? `${
                            Number(optionAssessmentCompleted) +
                            Number(textAssessmentCompleted)
                          } of 2 complete`
                        : 'Starts here'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-11">
            <button
              onClick={() => navigate('/assessment/option')}
              className="group text-left rounded-xl border border-slate-200/90 bg-white/90 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:bg-emerald-50/40 hover:border-[#22C55E]/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 animate-[fadeInUp_0.7s_ease-out_both]"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <ClipboardCheck size={21} className="text-[#16A34A]" />
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-slate-400 transition-all duration-300 group-hover:text-[#16A34A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-4">
                Wellness Assessment
              </h3>
              <p className="text-sm text-slate-500 mt-1.5 leading-6">
                Take a moment to reflect on your current well-being.
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] group-hover:text-[#15803D] transition-colors">
                Get started <span>→</span>
              </div>
            </button>

            <button
              onClick={() => navigate('/summary')}
              className="group text-left rounded-xl border border-slate-200/90 bg-white/90 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:bg-teal-50/40 hover:border-teal-400/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/10 animate-[fadeInUp_0.85s_ease-out_both]"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-teal-50 border border-teal-200/70 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <FileChartColumn size={21} className="text-teal-600" />
                </div>
                <ArrowUpRight
                  size={18}
                  className="text-slate-400 transition-all duration-300 group-hover:text-teal-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-4">
                Assessment Summary
              </h3>
              <p className="text-sm text-slate-500 mt-1.5 leading-6">
                Revisit your latest results and reflect on your responses.
              </p>

              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-teal-600 group-hover:text-teal-700 transition-colors">
                View summary <span>→</span>
              </div>
            </button>
          </div>

          {/* Educational Resources */}
          <section className="mb-11">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#16A34A] mb-2">
                  KNOWLEDGE & AWARENESS
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Understanding burnout
                </h2>
                <p className="text-sm text-slate-500 mt-1.5">
                  Recognize the signs and learn ways to take care of yourself.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
                <BookOpen size={15} className="text-[#22C55E]" />
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
                    className={`group relative rounded-xl border border-slate-200/90 bg-gradient-to-br ${card.accent} backdrop-blur-md p-6 shadow-sm overflow-hidden transition-all duration-300 ${card.border} hover:-translate-y-1 hover:shadow-md animate-[fadeInUp_0.7s_ease-out_both]`}
                  >
                    <div className="absolute top-3 right-5 text-5xl font-black text-slate-900/[0.04] transition-colors duration-300 group-hover:text-[#22C55E]/[0.12]">
                      {card.number}
                    </div>

                    <div
                      className={`w-11 h-11 rounded-xl ${card.iconBg} border flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}
                    >
                      <Icon size={21} className={card.iconColor} />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">
                      {card.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-7 mt-2.5">
                      {card.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400 group-hover:text-[#16A34A] transition-colors duration-300">
                      <span className="w-5 h-px bg-current" />
                      MindAlign Wellness
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {/* Wellness Reminders */}
          <section className="relative rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 backdrop-blur-md p-6 md:p-8 mb-6 shadow-sm overflow-hidden">
            <div className="absolute -top-24 right-0 w-64 h-64 bg-[#22C55E]/[0.08] rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex items-start gap-4 mb-7">
              <div className="w-11 h-11 rounded-xl bg-white border border-emerald-200/80 shadow-xs flex items-center justify-center shrink-0">
                <HeartPulse size={21} className="text-[#16A34A]" />
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#16A34A] mb-1.5">
                  A GENTLE REMINDER
                </p>
                <h2 className="text-xl font-bold text-slate-900">
                  You deserve time to recharge.
                </h2>
                <p className="text-sm text-slate-600 mt-1.5 leading-6">
                  Small, realistic steps are worthwhile. You don&apos;t have to do
                  everything at once.
                </p>
              </div>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-3">
              {wellnessTips.map((tip) => {
                const Icon = tip.icon

                return (
                  <div
                    key={tip.title}
                    className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-2xs transition-all duration-300 hover:border-[#22C55E]/40 hover:shadow-sm"
                  >
                    <div className="mt-0.5 text-[#16A34A]">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {tip.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-5 mt-1">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Footer (Matches Login Page Footer) */}
          <footer className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-t border-slate-200/80 py-6 mt-8 text-xs text-slate-500">
            <p>MindAlign • Understand Your Mind. Improve Your Journey.</p>
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