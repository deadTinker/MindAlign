import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Brain,
  ClipboardCheck,
  PenLine,
  FileChartColumn,
  Users,
  ShieldCheck,
  Lock,
  Moon,
  HeartPulse,
  Sparkles,
  Clock3,
} from 'lucide-react'

const SIGNS = [
  'Always tired, even after sleeping',
  "Can't focus on lectures",
  'Dread before classes',
  'Racing thoughts at night',
  'Feeling behind everyone',
  'Short temper, low motivation',
]

const STEPS = [
  {
    icon: ClipboardCheck,
    number: '01',
    title: 'Answer a short questionnaire',
    text: 'Quick, option-based questions about workload, sleep, mood and motivation. No right or wrong answers.',
  },
  {
    icon: PenLine,
    number: '02',
    title: 'Say it in your own words',
    text: 'Write freely about how the semester feels. Our language model reads the emotional signals behind your words.',
  },
  {
    icon: FileChartColumn,
    number: '03',
    title: 'See your burnout risk',
    text: 'Both check-ins combine into a clear Low, Medium or High risk level with a summary you can act on.',
  },
]

const STYLES = `
  html { scroll-behavior: smooth; }
  @keyframes ma-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
  @keyframes ma-grow { from { width: 0 } }
  @keyframes ma-pulse { 0% { box-shadow: 0 0 0 0 rgba(34,197,94,.45) } 100% { box-shadow: 0 0 0 14px rgba(34,197,94,0) } }
  .ma-float { animation: ma-float 6s ease-in-out infinite; }
  .ma-float-slow { animation: ma-float 8s ease-in-out infinite reverse; }
  .ma-grow { animation: ma-grow 1.4s .5s cubic-bezier(.2,.8,.2,1) both; }
  .ma-pulse { animation: ma-pulse 2s ease-out infinite; }
  @media (prefers-reduced-motion: reduce) {
    html { scroll-behavior: auto; }
    .ma-float, .ma-float-slow, .ma-grow, .ma-pulse { animation: none; }
  }
`

function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      {children}
    </div>
  )
}

const SKIN = '#c98f5b'
const HOODIE = '#22C55E'
const HAIR = '#1f2937'

function HeroScene({ className = '' }) {
  return (
    <svg viewBox="0 0 400 500" role="img" preserveAspectRatio="xMidYMid slice" className={className}
      aria-label="Illustration of an exhausted student with their head in their hands at a desk late at night">
      <defs>
        <linearGradient id="hs-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0b1220" /><stop offset="1" stopColor="#134e4a" /></linearGradient>
        <radialGradient id="hs-glow"><stop offset="0" stopColor="#99f6e4" stopOpacity=".5" /><stop offset="1" stopColor="#99f6e4" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="400" height="500" fill="url(#hs-bg)" />
      {[[40, 50], [90, 130], [150, 40], [240, 70], [360, 190], [370, 40], [30, 210], [200, 22]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.2 : 1.4} fill="#e2e8f0" opacity=".8" />
      ))}
      <circle cx="320" cy="95" r="62" fill="url(#hs-glow)" />
      <circle cx="320" cy="95" r="28" fill="#fef9c3" />
      {/* wall clock showing 3:00 */}
      <circle cx="75" cy="125" r="32" fill="#f8fafc" stroke="#475569" strokeWidth="4" />
      <path d="M75 125 V102 M75 125 H95" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
      {/* sticky note */}
      <g transform="rotate(-8 60 230)">
        <rect x="26" y="196" width="76" height="62" fill="#fde68a" />
        <text x="64" y="224" textAnchor="middle" fontSize="12" fontWeight="800" fill="#92400e">DUE</text>
        <text x="64" y="242" textAnchor="middle" fontSize="12" fontWeight="800" fill="#92400e">TOMORROW</text>
      </g>
      {/* desk */}
      <rect y="372" width="400" height="128" fill="#1e293b" />
      <rect y="368" width="400" height="8" fill="#334155" />
      <ellipse cx="200" cy="335" rx="140" ry="70" fill="url(#hs-glow)" />
      {/* student */}
      <rect x="148" y="262" width="104" height="130" rx="44" fill={HOODIE} />
      <rect x="188" y="240" width="24" height="30" fill={SKIN} />
      <circle cx="200" cy="212" r="38" fill={SKIN} />
      <path d="M160 208 C156 160 244 160 240 208 C232 190 168 190 160 208Z" fill={HAIR} />
      <path d="M184 216 q4 4 8 0 M208 216 q4 4 8 0 M193 236 q7 -5 14 0" stroke="#5b3a1e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M158 292 L120 352 L168 232 M242 292 L280 352 L232 232" stroke={HOODIE} strokeWidth="26" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="168" cy="226" r="15" fill={SKIN} />
      <circle cx="232" cy="226" r="15" fill={SKIN} />
      <path d="M130 170 l-14 -8 M138 148 l-8 -14 M270 170 l14 -8 M262 148 l8 -14" stroke="#fca5a5" strokeWidth="3" strokeLinecap="round" />
      {/* laptop (back) */}
      <rect x="130" y="300" width="140" height="78" rx="6" fill="#64748b" />
      <rect x="134" y="296" width="132" height="5" rx="2" fill="#99f6e4" />
      <circle cx="200" cy="339" r="7" fill="#cbd5e1" />
      {/* mug, paper balls, books */}
      <rect x="40" y="335" width="32" height="36" rx="6" fill="#f8fafc" />
      <path d="M72 343 q14 4 0 18" stroke="#f8fafc" strokeWidth="4" fill="none" />
      <path d="M50 325 q-5 -8 0 -14 M62 325 q-5 -8 0 -14" stroke="#cbd5e1" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="98" cy="360" r="9" fill="#cbd5e1" /><circle cx="112" cy="364" r="7" fill="#94a3b8" />
      <rect x="290" y="354" width="84" height="14" fill="#f59e0b" />
      <rect x="296" y="340" width="72" height="14" fill="#38bdf8" />
      <rect x="288" y="326" width="78" height="14" fill="#f43f5e" />
    </svg>
  )
}

function AnxietyScene({ className = '' }) {
  return (
    <svg viewBox="0 0 400 300" role="img" preserveAspectRatio="xMidYMid slice" className={className}
      aria-label="Illustration of an anxious student gripping their hair, surrounded by worried thoughts and a failed exam paper">
      <defs><linearGradient id="an-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#99f6e4" /><stop offset="1" stopColor="#ecfccb" /></linearGradient></defs>
      <rect width="400" height="300" fill="url(#an-bg)" />
      <path d="M70 90 q25 -35 50 -12 t50 -8 M240 60 q30 -25 55 0 t45 10 M60 150 q-20 20 5 40" stroke="#0f766e" strokeWidth="3" fill="none" opacity=".35" strokeLinecap="round" />
      <text x="78" y="70" fontSize="38" fontWeight="800" fill="#0f766e" opacity=".5">?</text>
      <text x="318" y="100" fontSize="34" fontWeight="800" fill="#0f766e" opacity=".5">?</text>
      <text x="290" y="44" fontSize="28" fontWeight="800" fill="#be123c" opacity=".55">!</text>
      <g transform="rotate(-10 70 245)">
        <rect x="22" y="190" width="96" height="110" fill="#fff" stroke="#cbd5e1" />
        <text x="70" y="214" textAnchor="middle" fontSize="12" fontWeight="800" fill="#475569">EXAM</text>
        <text x="70" y="268" textAnchor="middle" fontSize="48" fontWeight="900" fill="#ef4444">F</text>
      </g>
      <rect x="188" y="185" width="24" height="62" fill={SKIN} />
      <path d="M110 300 C110 205 290 205 290 300Z" fill={HOODIE} />
      <path d="M178 232 Q200 252 222 232" stroke="#16A34A" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M128 275 Q94 215 150 163 M272 275 Q306 215 250 163" stroke={HOODIE} strokeWidth="22" fill="none" strokeLinecap="round" />
      <g transform="translate(0 28)">
      <circle cx="200" cy="150" r="44" fill={SKIN} />
      <path d="M156 146 C150 96 250 96 244 146 C232 120 168 120 156 146Z" fill={HAIR} />
      <circle cx="150" cy="134" r="14" fill={SKIN} /><circle cx="250" cy="134" r="14" fill={SKIN} />
      <circle cx="184" cy="152" r="8" fill="#fff" /><circle cx="216" cy="152" r="8" fill="#fff" />
      <circle cx="185" cy="153" r="3.5" fill="#1f2937" /><circle cx="215" cy="153" r="3.5" fill="#1f2937" />
      <path d="M174 138 l16 -6 M226 138 l-16 -6" stroke={HAIR} strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="200" cy="178" rx="7" ry="6" fill="#7f1d1d" />
      <path d="M262 112 q8 14 0 20 q-8 -6 0 -20Z" fill="#7dd3fc" />
      </g>
    </svg>
  )
}

function BurnoutScene({ className = '' }) {
  return (
    <svg viewBox="0 0 400 300" role="img" preserveAspectRatio="xMidYMid slice" className={className}
      aria-label="Illustration of an exhausted student slumped over a desk with a nearly empty battery">
      <defs><linearGradient id="bu-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d9f99d" /><stop offset="1" stopColor="#e2e8f0" /></linearGradient></defs>
      <rect width="400" height="300" fill="url(#bu-bg)" />
      <rect x="296" y="40" width="64" height="30" rx="7" fill="none" stroke="#475569" strokeWidth="4" />
      <rect x="360" y="48" width="7" height="14" rx="2" fill="#475569" />
      <rect x="302" y="46" width="12" height="18" rx="2" fill="#ef4444" />
      <text x="140" y="104" fontSize="30" fontWeight="800" fontStyle="italic" fill="#64748b" opacity=".7">Z</text>
      <text x="168" y="80" fontSize="22" fontWeight="800" fontStyle="italic" fill="#64748b" opacity=".6">z</text>
      <ellipse cx="318" cy="232" rx="62" ry="48" fill="#16A34A" />
      <rect y="216" width="400" height="84" fill="#94a3b8" />
      <rect y="212" width="400" height="8" fill="#64748b" />
      <rect x="26" y="182" width="64" height="32" rx="4" fill="#475569" />
      <rect x="98" y="186" width="22" height="28" rx="5" fill="#f8fafc" />
      <rect x="132" y="190" width="170" height="34" rx="17" fill={HOODIE} />
      <circle cx="214" cy="168" r="36" fill={SKIN} />
      <path d="M180 164 C176 126 252 126 248 164 C238 146 190 146 180 164Z" fill={HAIR} />
      <path d="M196 172 q5 5 10 0 M222 172 q5 5 10 0 M208 190 q6 -3 12 0" stroke="#5b3a1e" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M58 250 h60 M300 262 h50" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" opacity=".6" />
    </svg>
  )
}

function AloneScene({ className = '' }) {
  return (
    <svg viewBox="0 0 400 300" role="img" preserveAspectRatio="xMidYMid slice" className={className}
      aria-label="Illustration of a student sitting alone on a bench under a small rain cloud while others walk together in the distance">
      <defs><linearGradient id="al-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#cbd5e1" /><stop offset="1" stopColor="#ecfdf5" /></linearGradient></defs>
      <rect width="400" height="300" fill="url(#al-bg)" />
      <rect y="252" width="400" height="48" fill="#bbf7d0" />
      <g fill="#94a3b8"><ellipse cx="110" cy="56" rx="46" ry="20" /><ellipse cx="82" cy="64" rx="30" ry="16" /><ellipse cx="140" cy="64" rx="30" ry="16" /></g>
      <path d="M86 90 l-4 14 M108 92 l-4 14 M130 90 l-4 14" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
      <rect x="50" y="176" width="140" height="8" rx="3" fill="#78716c" />
      <rect x="50" y="150" width="140" height="8" rx="3" fill="#78716c" />
      <rect x="62" y="184" width="8" height="68" fill="#57534e" /><rect x="170" y="184" width="8" height="68" fill="#57534e" />
      <rect x="96" y="140" width="40" height="44" rx="16" fill={HOODIE} />
      <rect x="100" y="178" width="14" height="40" rx="6" fill="#334155" /><rect x="118" y="178" width="14" height="40" rx="6" fill="#334155" />
      <circle cx="118" cy="122" r="26" fill="#16A34A" />
      <circle cx="122" cy="126" r="17" fill={SKIN} />
      <path d="M112 140 q6 3 14 -2" stroke="#5b3a1e" strokeWidth="2" fill="none" />
      <rect x="146" y="214" width="26" height="36" rx="8" fill="#14b8a6" />
      {[[270, 6], [330, 0]].map(([x, d], i) => (
        <g key={i} fill="#cbd5e1">
          <circle cx={x} cy={170 + d} r="13" /><rect x={x - 12} y={184 + d} width="24" height="46" rx="10" />
          <circle cx={x + 34} cy={172 + d} r="13" /><rect x={x + 22} y={186 + d} width="24" height="46" rx="10" />
        </g>
      ))}
    </svg>
  )
}

function Wordmark({ size = 'text-2xl sm:text-3xl' }) {
  return (
    <span className={`${size} font-black tracking-tighter uppercase text-[#22C55E] select-none`}>
      MIND<span className="text-slate-900">ALIGN</span>
    </span>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#16A34A]">
      <Sparkles size={13} /> {children}
    </p>
  )
}

function Index() {

  const navLinks = [
    { href: '#why', label: 'Why it matters' },
    { href: '#how', label: 'How it works' },
    { href: '#features', label: 'Features' },
  ]

  const primaryCta = '/signup'

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden selection:bg-[#22C55E] selection:text-white">
      <style>{STYLES}</style>

      {/* ---------------------------- NAV ---------------------------- */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-12 h-[72px] flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-2.5 shrink-0">
            <img src="/MindAlign.jpg" alt="" className="w-8 h-8 sm:w-9 sm:h-9 rounded-full" />
            <Wordmark size="text-xl sm:text-3xl" />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="hover:text-[#16A34A] transition-colors">{l.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl border border-slate-300 hover:border-[#22C55E] hover:text-[#16A34A] text-sm font-semibold text-slate-700 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] text-white text-sm font-semibold shadow-md shadow-emerald-500/20 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------------------- HERO ---------------------------- */}
      <section className="relative">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-0 bg-[radial-gradient(60%_50%_at_85%_10%,rgba(34,197,94,0.16),transparent),radial-gradient(45%_40%_at_0%_90%,rgba(20,184,166,0.12),transparent)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:26px_26px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 pt-14 pb-20 lg:pt-20 lg:pb-28 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-semibold text-[#15803D]">
              <span className="w-2 h-2 rounded-full bg-[#22C55E] ma-pulse" />
              Built for students, by students
            </span>

            <h1 className="mt-6 text-[40px] sm:text-6xl lg:text-[68px] font-black tracking-tight leading-[1.03] text-slate-900">
              You're not lazy.
              <br />
              You're{' '}
              <span className="relative inline-block text-[#22C55E]">
                running on empty.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 12"
                  className="absolute left-0 -bottom-2 w-full text-[#22C55E]/40"
                  preserveAspectRatio="none"
                >
                  <path d="M2 8 C 60 2, 120 12, 180 6 S 280 4, 298 8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg text-slate-600 leading-relaxed">
              Deadlines, exams, expectations, and not enough sleep. MindAlign spots the early signs of student
              anxiety and burnout with a short questionnaire and your own words, so you can act before it takes over
              your semester.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row gap-3">
              <Link
                to={primaryCta}
                className="group inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] active:bg-[#15803D] text-white font-semibold text-base shadow-lg shadow-emerald-500/25 transition-colors"
              >
                Check my burnout risk
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              {(
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-7 py-4 rounded-xl bg-white border border-slate-300 hover:border-[#22C55E] hover:text-[#16A34A] text-slate-800 font-semibold text-base transition-colors"
                >
                  Login
                </Link>
              )}
            </div>

            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
              <li className="inline-flex items-center gap-2"><Lock size={15} className="text-[#16A34A]" /> Private & encrypted</li>
              <li className="inline-flex items-center gap-2"><Clock3 size={15} className="text-[#16A34A]" /> Two short check-ins</li>
              <li className="inline-flex items-center gap-2"><ShieldCheck size={15} className="text-[#16A34A]" /> Not a diagnosis, a starting point</li>
            </ul>
          </div>

          {/* Hero visual */}
          <div className="relative mx-auto w-full max-w-[520px]">
            <div aria-hidden="true" className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-emerald-200/70 via-green-100/40 to-teal-100/60 blur-2xl" />
            <HeroScene className="relative w-full aspect-[4/5] rounded-[2rem] border border-white shadow-[0_30px_80px_rgba(15,23,42,0.18)]" />
            <div aria-hidden="true" className="absolute inset-0 rounded-[2rem] bg-gradient-to-t from-slate-900/35 via-transparent to-transparent" />

            {/* floating: thought */}
            <div className="ma-float absolute -left-4 sm:-left-10 top-10 max-w-[230px] bg-white/95 backdrop-blur rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400">3:12 AM</p>
              <p className="mt-1 text-sm font-semibold text-slate-800 leading-snug">
                "I've read the same page six times."
              </p>
            </div>

            {/* floating: risk meter */}
            <div className="ma-float-slow absolute -right-3 sm:-right-8 bottom-10 w-[250px] bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/10 p-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <HeartPulse size={14} className="text-[#16A34A]" /> Burnout risk
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                  Medium
                </span>
              </div>
              <div className="mt-3 h-2.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="ma-grow h-full w-[62%] rounded-full bg-gradient-to-r from-[#22C55E] via-lime-400 to-amber-400" />
              </div>
              <p className="mt-2.5 text-xs text-slate-500">Caught early. Here's what helps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------- SOUND FAMILIAR ----------------------- */}
      <section id="why" className="scroll-mt-24 bg-slate-50/70 border-y border-slate-200/70 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <Reveal className="max-w-2xl">
            <SectionLabel>Sound familiar?</SectionLabel>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight text-slate-900">
              Most students struggle quietly.
            </h2>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed">
              Anxiety and burnout rarely show up all at once. They build slowly, behind good grades and "I'm fine."
              Naming what you feel is the first step.
            </p>
          </Reveal>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { Scene: AnxietyScene, tag: 'Anxiety', quote: '"What if I fail this exam?"', text: 'Racing thoughts, tight chest and restless nights before every test.', alt: 'An anxious student gripping their head before an exam' },
              { Scene: BurnoutScene, tag: 'Burnout', quote: '"I\'m exhausted and I can\'t stop."', text: 'Drained, detached and unmotivated, even about things you used to enjoy.', alt: 'An exhausted student slumped over books and a laptop' },
              { Scene: AloneScene, tag: 'Overwhelm', quote: '"Everyone else seems fine."', text: 'Feeling behind and isolated while pressure keeps stacking up.', alt: 'A student sitting alone and overwhelmed on campus' },
            ].map((c, i) => (
              <Reveal key={c.tag} delay={i * 120}>
                <article className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 hover:-translate-y-1 transition-all duration-300">
                  <div className="relative">
                    <c.Scene className="w-full h-72 group-hover:scale-[1.03] transition-transform duration-700" />
                    <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 text-[10px] font-bold uppercase tracking-widest text-[#15803D]">
                      {c.tag}
                    </span>
                    <p className="absolute bottom-4 left-5 right-5 text-xl font-bold text-white leading-snug drop-shadow">
                      {c.quote}
                    </p>
                  </div>
                  <p className="p-6 text-slate-600 leading-relaxed">{c.text}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Common signs</p>
            <div className="flex flex-wrap gap-3">
              {SIGNS.map((s) => (
                <span key={s} className="px-4 py-2 rounded-full bg-white border border-emerald-200/80 text-sm font-medium text-slate-700 shadow-sm">
                  {s}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------- HOW ---------------------------- */}
      <section id="how" className="scroll-mt-24 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <Reveal className="text-center max-w-2xl mx-auto">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">Clarity in three steps.</h2>
            <p className="mt-4 text-lg text-slate-600">No jargon, no pressure. Just an honest look at where you are right now.</p>
          </Reveal>

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => {
              const Icon = s.icon
              return (
                <Reveal key={s.number} delay={i * 120}>
                  <div className="relative h-full overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-emerald-50/80 via-white to-white p-8 hover:border-[#22C55E]/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
                    <span className="absolute -top-3 right-4 text-8xl font-black text-emerald-100/80 select-none">{s.number}</span>
                    <div className="relative w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/70 flex items-center justify-center">
                      <Icon size={22} className="text-[#16A34A]" />
                    </div>
                    <h3 className="relative mt-6 text-xl font-bold tracking-tight">{s.title}</h3>
                    <p className="relative mt-2 text-slate-600 leading-relaxed">{s.text}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* -------------------------- FEATURES -------------------------- */}
      <section id="features" className="scroll-mt-24 bg-slate-50/70 border-y border-slate-200/70 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">
          <Reveal className="max-w-2xl">
            <SectionLabel>Inside MindAlign</SectionLabel>
            <h2 className="mt-3 text-3xl sm:text-5xl font-black tracking-tight">Insight, then support.</h2>
          </Reveal>

          <div className="mt-12 grid lg:grid-cols-3 gap-6">
            {/* big card */}
            <Reveal className="lg:col-span-2">
              <div className="h-full rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-sm">
                <Brain size={26} className="text-[#16A34A]" />
                <h3 className="mt-4 text-2xl font-bold tracking-tight">A burnout score that explains itself</h3>
                <p className="mt-2 max-w-lg text-slate-600 leading-relaxed">
                  Machine learning on your questionnaire plus language analysis of your writing. You get a risk level
                  you can understand, not a mystery number.
                </p>
                <div className="mt-8 grid grid-cols-3 gap-3 text-center text-sm font-semibold">
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 text-[#15803D] py-3">Low</div>
                  <div className="rounded-xl bg-amber-50 border border-amber-200 text-amber-600 py-3">Medium</div>
                  <div className="rounded-xl bg-rose-50 border border-rose-200 text-rose-600 py-3">High</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="h-full rounded-3xl bg-gradient-to-br from-[#22C55E] to-[#15803D] p-8 text-white shadow-lg shadow-emerald-600/20">
                <Users size={26} />
                <h3 className="mt-4 text-2xl font-bold tracking-tight">Community Hub</h3>
                <p className="mt-2 text-white/85 leading-relaxed">
                  Read and share stories, tips and coping strategies with other students who get it.
                </p>
              </div>
            </Reveal>

            <Reveal>
              <div className="h-full rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
                <FileChartColumn size={26} className="text-[#16A34A]" />
                <h3 className="mt-4 text-xl font-bold tracking-tight">Personal summary</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">Track your results and see what's driving your stress.</p>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="h-full rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
                <Moon size={26} className="text-[#16A34A]" />
                <h3 className="mt-4 text-xl font-bold tracking-tight">Gentle guidance</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">Practical next steps for rest, focus and recovery.</p>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="h-full rounded-3xl bg-white border border-slate-200 p-8 shadow-sm">
                <ShieldCheck size={26} className="text-[#16A34A]" />
                <h3 className="mt-4 text-xl font-bold tracking-tight">Private by design</h3>
                <p className="mt-2 text-slate-600 leading-relaxed">Your journey stays yours, protected by MindAlign Security.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------- CTA ----------------------------- */}
      <section className="py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 sm:px-12">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#22C55E] via-[#16A34A] to-[#15803D] px-8 py-14 sm:px-16 sm:py-20 text-center text-white shadow-2xl shadow-emerald-700/25">
              <div aria-hidden="true" className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10" />
              <div aria-hidden="true" className="absolute -bottom-28 -right-16 w-80 h-80 rounded-full bg-white/10" />
              <h2 className="relative text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                Understand your mind.
                <br />
                Improve your journey.
              </h2>
              <p className="relative mt-5 max-w-xl mx-auto text-lg text-white/85">
                It takes a few minutes, and it could change how you handle the rest of the semester.
              </p>
              <Link
                to={primaryCta}
                className="relative group mt-9 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#15803D] font-bold text-base shadow-lg hover:bg-emerald-50 transition-colors"
              >
                Start my check-in
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="relative mt-5 text-sm text-white/85">
                Already have an account?{' '}
                <Link to="/login" className="font-bold underline underline-offset-4 hover:text-white">Login</Link>
              </p>
            </div>
          </Reveal>

          <p className="mt-8 text-center text-xs text-slate-500 leading-relaxed max-w-2xl mx-auto">
            MindAlign is a self-awareness tool and does not provide medical diagnosis or treatment. If you are in
            crisis or thinking about harming yourself, please contact your local emergency number or a crisis
            helpline right away.
          </p>
        </div>
      </section>

      {/* ---------------------------- FOOTER ---------------------------- */}
      <footer className="bg-white/80 border-t border-slate-200/80 py-6 px-6 sm:px-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>MindAlign • Understand Your Mind. Improve Your Journey.</span>
          <span>Questions? Support is available 24/7.</span>
        </div>
      </footer>
    </div>
  )
}

export default Index