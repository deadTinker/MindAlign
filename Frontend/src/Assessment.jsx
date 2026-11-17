import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  MessageSquareText,
  Sparkles,
} from 'lucide-react'
import Sidebar from './Sidebar'

const questionConfig = [
  {
    feature: 'study_hours_per_day',
    question: 'How many hours do you usually study per day?',
    options: [
      { label: 'Less than 2 hours', value: 1 },
      { label: '2–4 hours', value: 3 },
      { label: '4–6 hours', value: 5 },
      { label: '6–8 hours', value: 7 },
      { label: 'More than 8 hours', value: 9 },
    ],
  },
  {
    feature: 'exam_pressure',
    question: 'How much pressure do you feel because of exams?',
    options: [
      { label: 'Very low', value: 1 },
      { label: 'Low', value: 3 },
      { label: 'Moderate', value: 5 },
      { label: 'High', value: 8 },
      { label: 'Very high', value: 10 },
    ],
  },
  {
    feature: 'academic_performance',
    question: 'How would you describe your academic performance?',
    options: [
      { label: 'Very poor', value: 55 },
      { label: 'Poor', value: 62 },
      { label: 'Average', value: 70 },
      { label: 'Good', value: 79 },
      { label: 'Excellent', value: 87 },
    ],
  },
  {
    feature: 'sleep_hours',
    question: 'How many hours do you usually sleep per night?',
    options: [
      { label: 'Less than 4 hours', value: 3.5 },
      { label: '4–5 hours', value: 4.5 },
      { label: '5–6 hours', value: 5.5 },
      { label: '6–8 hours', value: 7 },
      { label: 'More than 8 hours', value: 9 },
    ],
  },
  {
    feature: 'physical_activity',
    question: 'How physically active are you?',
    options: [
      { label: 'Not at all active', value: 0 },
      { label: 'Slightly active', value: 2 },
      { label: 'Moderately active', value: 4 },
      { label: 'Very active', value: 6 },
      { label: 'Extremely active', value: 7 },
    ],
  },
  {
    feature: 'social_support',
    question: 'How much social support do you feel you have?',
    options: [
      { label: 'Very little', value: 1 },
      { label: 'Little', value: 3 },
      { label: 'Moderate', value: 5 },
      { label: 'Good', value: 8 },
      { label: 'Very strong', value: 10 },
    ],
  },
  {
    feature: 'screen_time',
    question: 'How many hours of screen time do you have per day?',
    options: [
      { label: 'Less than 2 hours', value: 1.5 },
      { label: '2–4 hours', value: 3 },
      { label: '4–6 hours', value: 5 },
      { label: '6–8 hours', value: 7 },
      { label: 'More than 8 hours', value: 9 },
    ],
  },
  {
    feature: 'internet_usage',
    question: 'How many hours do you spend using the internet per day?',
    options: [
      { label: 'Less than 2 hours', value: 1.5 },
      { label: '2–4 hours', value: 3 },
      { label: '4–6 hours', value: 5 },
      { label: '6–8 hours', value: 7 },
      { label: 'More than 8 hours', value: 9 },
    ],
  },
  {
    feature: 'financial_stress',
    question: 'How much financial stress do you experience?',
    options: [
      { label: 'None', value: 0 },
      { label: 'Low', value: 2.5 },
      { label: 'Moderate', value: 5 },
      { label: 'High', value: 7.5 },
      { label: 'Very high', value: 10 },
    ],
  },
  {
    feature: 'family_expectation',
    question: 'How much pressure do you feel from family expectations?',
    options: [
      { label: 'None', value: 0 },
      { label: 'Low', value: 2.5 },
      { label: 'Moderate', value: 5 },
      { label: 'High', value: 7.5 },
      { label: 'Very high', value: 10 },
    ],
  },
]

const textQuestions = [
  'What has been the biggest source of stress for you recently?',
  'How have your studies or workload been affecting you emotionally?',
  'Describe how you have been feeling about your daily routine lately.',
  'What difficulties have you been experiencing with sleep, concentration, or motivation?',
  'Is there anything else about your current situation that you think is affecting your well-being?',
]

function Assessment() {
  const navigate = useNavigate()
  const location = useLocation()
  const isTextAssessment = location.pathname.endsWith('/text')
  const isRetake = new URLSearchParams(location.search).get('retake') === 'true'
  const questions = isTextAssessment ? textQuestions : questionConfig
  const totalQuestions = questions.length

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(Array(questionConfig.length).fill(null))
  const [textResponses, setTextResponses] = useState(Array(textQuestions.length).fill(''))
  const [completed, setCompleted] = useState(false)
  const [bothCompleted, setBothCompleted] = useState(false)
  const [missingAssessment, setMissingAssessment] = useState(
    isTextAssessment ? 'option' : 'text'
  )
  const [submitting, setSubmitting] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const [error, setError] = useState('')

  // Re-check saved completion status whenever the assessment route changes.
  useEffect(() => {
    let cancelled = false

    const checkAssessmentStatus = async () => {
      setCheckingStatus(true)
      setCurrentQuestion(0)
      setCompleted(false)
      setBothCompleted(false)
      setAnswers(Array(questionConfig.length).fill(null))
      setTextResponses(Array(textQuestions.length).fill(''))
      setMissingAssessment(isTextAssessment ? 'option' : 'text')
      setError('')

      try {
        const token = localStorage.getItem('token')
        if (!token) {
          if (!cancelled) setCheckingStatus(false)
          return
        }

        const response = await fetch('http://localhost:5000/api/assessment/latest', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.status === 404) {
          if (!cancelled) {
            setCompleted(false)
            setBothCompleted(false)
            setCheckingStatus(false)
          }
          return
        }

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || 'Could not check assessment status.')
        }

        const savedAssessment = data.assessment
        const optionDone = savedAssessment?.optionAssessmentCompleted === true
        const textDone = savedAssessment?.textAssessmentCompleted === true
        const analysisReady =
          optionDone &&
          textDone &&
          savedAssessment?.riskLevel &&
          savedAssessment.riskLevel !== 'Pending' &&
          savedAssessment?.burnoutProbability !== null &&
          savedAssessment?.burnoutProbability !== undefined

        if (!cancelled) {
          setBothCompleted(Boolean(!isRetake && analysisReady))
          setMissingAssessment(!optionDone ? 'option' : !textDone ? 'text' : null)

          const thisTestDone = isTextAssessment ? textDone : optionDone
          setCompleted(Boolean(!isRetake && (thisTestDone || (optionDone && textDone))))

          localStorage.setItem(
            'mindalignAssessment',
            JSON.stringify({
              assessment: savedAssessment,
              optionAssessmentCompleted: optionDone,
              textAssessmentCompleted: textDone,
            })
          )
        }
      } catch (statusError) {
        if (!cancelled) {
          console.error('Error checking assessment status:', statusError)
          setError(statusError.message || 'Could not check assessment status.')
        }
      } finally {
        if (!cancelled) setCheckingStatus(false)
      }
    }

    checkAssessmentStatus()

    return () => {
      cancelled = true
    }
  }, [location.pathname, isTextAssessment, isRetake])

  const questionIndex = Math.min(currentQuestion, totalQuestions - 1)
  const progress = ((questionIndex + 1) / totalQuestions) * 100
  const currentAnswered = isTextAssessment
    ? (textResponses[questionIndex] ?? '').trim().length > 0
    : answers[questionIndex] !== null && answers[questionIndex] !== undefined

  const selectAnswer = (value) => {
    setAnswers((previous) =>
      previous.map((answer, index) =>
        index === currentQuestion ? value : answer
      )
    )
  }

  const updateTextResponse = (value) => {
    setTextResponses((previous) =>
      previous.map((answer, index) =>
        index === currentQuestion ? value : answer
      )
    )
  }

  const submitCurrentAssessment = async () => {
    const token = localStorage.getItem('token')

    if (!token) {
      setError('Please log in again before submitting your assessment.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const payload = isTextAssessment
        ? { textResponses, ...(isRetake ? { retakeAssessment: true } : {}) }
        : {
            answers,
            features: questionConfig.map((question, index) => ({
              feature: question.feature,
              value: answers[index],
            })),
            ...(isRetake ? { retakeAssessment: true } : {}),
          }

      const response = await fetch('http://localhost:5000/api/assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit assessment.')
      }

      localStorage.setItem(
        'mindalignAssessment',
        JSON.stringify({
          assessment: data.assessment,
          optionAssessmentCompleted:
            data.assessment?.optionAssessmentCompleted ?? !isTextAssessment,
          textAssessmentCompleted:
            data.assessment?.textAssessmentCompleted ?? isTextAssessment,
        })
      )

      setBothCompleted(data.completed === true)
      setMissingAssessment(data.missingAssessment || (isTextAssessment ? 'option' : 'text'))
      setCompleted(true)
    } catch (submitError) {
      console.error('Assessment submission error:', submitError)
      setError(submitError.message || 'Unable to submit assessment.')
    } finally {
      setSubmitting(false)
    }
  }

  const nextQuestion = () => {
    if (!currentAnswered || submitting) return

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((previous) => previous + 1)
      return
    }

    submitCurrentAssessment()
  }

  const previousQuestion = () => {
    if (currentQuestion > 0 && !submitting) {
      setCurrentQuestion((previous) => previous - 1)
    }
  }

  const goToMissingAssessment = () => {
    navigate(missingAssessment === 'text' ? '/assessment/text' : '/assessment/option')
  }

  // Consistent Light Mode Ambient Background matching Community & Profile
  const background = (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -top-40 left-[25%] h-[420px] w-[420px] rounded-full bg-emerald-400/[0.08] blur-[120px]" />
      <div className="absolute right-[-180px] top-[35%] h-[380px] w-[380px] rounded-full bg-teal-400/[0.07] blur-[110px]" />
    </div>
  )

  if (checkingStatus) {
    return (
      <div className="relative min-h-screen bg-white text-slate-900">
        {background}
        <Sidebar />
        <main className="relative z-10 ml-0 min-h-screen flex items-center justify-center p-6 md:ml-64">
          <div className="text-center">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-emerald-200 border-t-[#22C55E]" />
            <p className="text-sm text-slate-500">Checking your saved assessment progress...</p>
          </div>
        </main>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900 selection:bg-[#22C55E] selection:text-white">
        {background}
        <Sidebar />
        <main className="relative z-10 ml-0 min-h-screen px-5 pb-16 pt-24 md:ml-64 md:px-10 md:pt-8 lg:px-14 flex items-center justify-center">
          <section className="w-full max-w-2xl rounded-2xl border border-slate-200/95 bg-white/95 p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.05)] backdrop-blur-md md:p-10">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-[#16A34A] shadow-sm">
              {bothCompleted ? (
                <CheckCircle2 size={30} />
              ) : (
                <Sparkles size={30} />
              )}
            </div>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#16A34A]">
              {bothCompleted ? 'Assessment complete' : missingAssessment ? 'Responses saved' : 'Analysis pending'}
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {bothCompleted
                ? 'Both assessments are complete'
                : missingAssessment
                  ? 'One more step to get your results'
                  : 'Your responses are saved'}
            </h1>
            <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-500">
              {bothCompleted
                ? 'Thank you for completing both parts. Your combined assessment results are now ready.'
                : missingAssessment
                  ? `Your ${isTextAssessment ? 'text-based' : 'option-based'} responses have been saved. Complete the ${missingAssessment === 'text' ? 'text-based' : 'option-based'} assessment too so MindAlign can generate your results.`
                  : 'Both assessments have been submitted. Your combined analysis is still pending, so results are not available yet.'}
            </p>
            {error && <p className="mt-4 text-sm text-rose-600">{error}</p>}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              {bothCompleted ? (
                <button
                  onClick={() => navigate('/summary')}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] px-6 py-3 font-semibold text-white shadow-md shadow-emerald-500/25 transition hover:-translate-y-0.5"
                >
                  View results <ArrowRight size={17} />
                </button>
              ) : missingAssessment ? (
                <button
                  onClick={goToMissingAssessment}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] px-6 py-3 font-semibold text-white shadow-md shadow-emerald-500/25 transition hover:-translate-y-0.5"
                >
                  {missingAssessment === 'text' ? 'Take text-based assessment' : 'Take option-based assessment'}
                  <ArrowRight size={17} />
                </button>
              ) : null}

              <button
                onClick={() => navigate(`${isTextAssessment ? '/assessment/text' : '/assessment/option'}?retake=true`)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 shadow-2xs transition hover:border-[#22C55E] hover:text-[#16A34A]"
              >
                Retake {isTextAssessment ? 'Text-Based' : 'Option-Based'} Assessment
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="rounded-xl border border-slate-200 bg-slate-50/50 px-6 py-3 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Dashboard
              </button>
            </div>
          </section>
        </main>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-slate-900 selection:bg-[#22C55E] selection:text-white">
      {background}
      <Sidebar />

      <main className="relative z-10 ml-0 min-h-screen px-5 pb-16 pt-24 md:ml-64 md:px-10 md:pt-8 lg:px-14">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/90 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#16A34A]">
              {isTextAssessment ? (
                <MessageSquareText size={14} />
              ) : (
                <ClipboardCheck size={14} />
              )}
              {isTextAssessment ? 'TEXT-BASED ASSESSMENT' : 'OPTION-BASED ASSESSMENT'}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {isTextAssessment ? 'Tell us in your own words' : 'Student well-being assessment'}
            </h1>
            <p className="mt-3 max-w-2xl leading-7 text-slate-500">
              {isTextAssessment
                ? 'Share what your recent experiences have been like. Your responses help complete your overall assessment.'
                : 'Answer based on your recent experiences. There are no right or wrong answers.'}
            </p>
          </header>

          <div className="mb-7">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-slate-500 font-medium">
                Question {questionIndex + 1} of {totalQuestions}
              </span>
              <span className="font-bold text-[#16A34A]">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 border border-slate-200/60">
              <div
                className="h-full rounded-full bg-[#22C55E] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <section className="rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] backdrop-blur-md md:p-10">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.16em] text-[#16A34A]">
              {isTextAssessment
                ? `Your thoughts · ${questionIndex + 1}`
                : `Question ${questionIndex + 1}`}
            </p>
            <h2 className="mb-8 text-xl font-semibold leading-relaxed text-slate-900 md:text-2xl">
              {isTextAssessment
                ? textQuestions[questionIndex]
                : questionConfig[questionIndex].question}
            </h2>

            {isTextAssessment ? (
              <textarea
                value={textResponses[questionIndex] ?? ''}
                onChange={(event) => updateTextResponse(event.target.value)}
                placeholder="Write your response here..."
                rows={7}
                className="w-full resize-y rounded-xl border border-slate-300 bg-slate-50/90 p-5 leading-7 text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#22C55E] focus:bg-white focus:ring-2 focus:ring-[#22C55E]/20"
              />
            ) : (
              <div className="space-y-3">
                {questionConfig[questionIndex].options.map((option) => {
                  const selected = answers[questionIndex] === option.value
                  return (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => selectAnswer(option.value)}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${
                        selected
                          ? 'border-emerald-300 bg-emerald-50/90 text-slate-900 font-semibold shadow-2xs'
                          : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/40 hover:text-slate-900'
                      }`}
                    >
                      <span className="flex items-center gap-4">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            selected
                              ? 'border-[#16A34A] bg-[#22C55E]'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {selected && <span className="h-2 w-2 rounded-full bg-white" />}
                        </span>
                        {option.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {error && (
              <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </p>
            )}

            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
              <button
                type="button"
                onClick={previousQuestion}
                disabled={questionIndex === 0 || submitting}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-3 font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ArrowLeft size={17} /> Previous
              </button>
              <button
                type="button"
                onClick={nextQuestion}
                disabled={!currentAnswered || submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#22C55E] hover:bg-[#16A34A] px-5 py-3 font-semibold text-white shadow-md shadow-emerald-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting
                  ? 'Submitting...'
                  : questionIndex === totalQuestions - 1
                    ? 'Submit assessment'
                    : 'Next question'}
                {!submitting && <ArrowRight size={17} />}
              </button>
            </div>
          </section>

          <p className="mt-6 text-center text-xs leading-6 text-slate-400">
            Both assessment types are required before your combined results can be shown. This tool is intended for awareness and self-reflection, not medical diagnosis.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Assessment