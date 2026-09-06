import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'

const questionConfig = [
  {
    type: 'structured',
    feature: 'study_hours_per_day',
    question: 'How many hours do you usually study per day?',
    options: [
      { label: 'Less than 2 hours', value: 1 },
      { label: '2–4 hours', value: 3 },
      { label: '4–6 hours', value: 5 },
      { label: '6–8 hours', value: 7 },
      { label: 'More than 8 hours', value: 9 }
    ]
  },
  {
    type: 'structured',
    feature: 'exam_pressure',
    question: 'How much pressure do you feel because of exams?',
    options: [
      { label: 'Very low', value: 1 },
      { label: 'Low', value: 3 },
      { label: 'Moderate', value: 5 },
      { label: 'High', value: 8 },
      { label: 'Very high', value: 10 }
    ]
  },
  {
    type: 'structured',
    feature: 'academic_performance',
    question: 'How would you describe your academic performance?',
    options: [
      { label: 'Very poor', value: 55 },
      { label: 'Poor', value: 62 },
      { label: 'Average', value: 70 },
      { label: 'Good', value: 79 },
      { label: 'Excellent', value: 87 }
    ]
  },
  {
    type: 'structured',
    feature: 'sleep_hours',
    question: 'How many hours do you usually sleep per night?',
    options: [
      { label: 'Less than 4 hours', value: 3.5 },
      { label: '4–5 hours', value: 4.5 },
      { label: '5–6 hours', value: 5.5 },
      { label: '6–8 hours', value: 7 },
      { label: 'More than 8 hours', value: 9 }
    ]
  },
  {
    type: 'structured',
    feature: 'physical_activity',
    question: 'How physically active are you?',
    options: [
      { label: 'Not at all active', value: 0 },
      { label: 'Slightly active', value: 2 },
      { label: 'Moderately active', value: 4 },
      { label: 'Very active', value: 6 },
      { label: 'Extremely active', value: 7 }
    ]
  },
  {
    type: 'structured',
    feature: 'social_support',
    question: 'How much social support do you feel you have?',
    options: [
      { label: 'Very little', value: 1 },
      { label: 'Little', value: 3 },
      { label: 'Moderate', value: 5 },
      { label: 'Good', value: 8 },
      { label: 'Very strong', value: 10 }
    ]
  },
  {
    type: 'structured',
    feature: 'screen_time',
    question: 'How many hours of screen time do you have per day?',
    options: [
      { label: 'Less than 2 hours', value: 1.5 },
      { label: '2–4 hours', value: 3 },
      { label: '4–6 hours', value: 5 },
      { label: '6–8 hours', value: 7 },
      { label: 'More than 8 hours', value: 9 }
    ]
  },
  {
    type: 'structured',
    feature: 'internet_usage',
    question: 'How many hours do you spend using the internet per day?',
    options: [
      { label: 'Less than 2 hours', value: 1.5 },
      { label: '2–4 hours', value: 3 },
      { label: '4–6 hours', value: 5 },
      { label: '6–8 hours', value: 7 },
      { label: 'More than 8 hours', value: 9 }
    ]
  },
  {
    type: 'structured',
    feature: 'financial_stress',
    question: 'How much financial stress do you experience?',
    options: [
      { label: 'None', value: 0 },
      { label: 'Low', value: 2.5 },
      { label: 'Moderate', value: 5 },
      { label: 'High', value: 7.5 },
      { label: 'Very high', value: 10 }
    ]
  },
  {
    type: 'structured',
    feature: 'family_expectation',
    question: 'How much pressure do you feel from family expectations?',
    options: [
      { label: 'None', value: 0 },
      { label: 'Low', value: 2.5 },
      { label: 'Moderate', value: 5 },
      { label: 'High', value: 7.5 },
      { label: 'Very high', value: 10 }
    ]
  }
]

const textQuestions = [
  'What has been the biggest source of stress for you recently?',
  'How have your studies or workload been affecting you emotionally?',
  'Describe how you have been feeling about your daily routine lately.',
  'What difficulties have you been experiencing with sleep, concentration, or motivation?',
  'Is there anything else about your current situation that you think is affecting your well-being?'
]

function Assessment() {
  const navigate = useNavigate()

  const totalQuestions =
    questionConfig.length + textQuestions.length

  const [currentQuestion, setCurrentQuestion] = useState(0)

  const [answers, setAnswers] = useState(
    Array(questionConfig.length).fill(null)
  )

  const [textResponses, setTextResponses] = useState(
    Array(textQuestions.length).fill('')
  )

  const [completed, setCompleted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isStructured =
    currentQuestion < questionConfig.length

  const textIndex =
    currentQuestion - questionConfig.length

  const question = isStructured
    ? questionConfig[currentQuestion]
    : null

  const progress =
    ((currentQuestion + 1) / totalQuestions) * 100

  const currentAnswered = isStructured
    ? answers[currentQuestion] !== null
    : textResponses[textIndex].trim().length > 0

  const selectAnswer = (value) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = value
    setAnswers(newAnswers)
  }

  const updateTextResponse = (value) => {
    const newResponses = [...textResponses]
    newResponses[textIndex] = value
    setTextResponses(newResponses)
  }

  const nextQuestion = async () => {
    if (!currentAnswered || submitting) return

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
      return
    }

    const token = localStorage.getItem('token')

    if (!token) {
      alert('Please log in again.')
      return
    }

    setSubmitting(true)

    try {
      const features = questionConfig.map((q, index) => ({
        feature: q.feature,
        value: answers[index]
      }))

      const response = await fetch(
        'http://localhost:5000/api/assessment',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            answers,
            features,
            textResponses
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || 'Failed to submit assessment'
        )
      }

      localStorage.setItem(
        'mindalignAssessment',
        JSON.stringify({
          answers,
          features,
          textResponses,
          assessment: data.assessment
        })
      )

      setCompleted(true)

    } catch (error) {
      console.error('Assessment submission error:', error)
      alert(error.message || 'Unable to submit assessment.')
    } finally {
      setSubmitting(false)
    }
  }

  const previousQuestion = () => {
    if (currentQuestion > 0 && !submitting) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">

        <div className="fixed top-[-180px] left-[-180px] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="fixed bottom-[-180px] right-[-180px] w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <Sidebar />

        <main className="ml-64 min-h-screen p-6 md:p-10 flex items-center justify-center relative">

          <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl p-10 text-center shadow-2xl">

            <div className="w-16 h-16 mx-auto rounded-full bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center mb-6">
              <span className="text-2xl text-indigo-400">✓</span>
            </div>

            <p className="text-indigo-400 text-sm font-medium mb-2">
              Assessment Complete
            </p>

            <h1 className="text-3xl font-bold text-white">
              Your responses have been recorded
            </h1>

            <p className="text-slate-400 mt-4 leading-7">
              Your assessment has been completed. Your responses
              will now be used to generate your preliminary results.
            </p>

            <button
              onClick={() => navigate('/summary')}
              className="mt-8 px-7 py-3 rounded-xl bg-indigo-600 text-white font-semibold transition-all duration-200 hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/20"
            >
              View Results
            </button>

          </div>

        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">

      <div className="fixed top-[-180px] left-[-180px] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="fixed bottom-[-180px] right-[-180px] w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <Sidebar />

      <main className="ml-64 min-h-screen p-6 md:p-10 relative">

        <div className="max-w-4xl mx-auto">

          <div className="mb-8">

            <p className="text-indigo-400 text-sm font-medium mb-2">
              MindAlign Assessment
            </p>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Student Well-being Assessment
            </h1>

            <p className="text-slate-400 mt-2 max-w-2xl">
              Answer each question based on your recent experiences.
              There are no right or wrong answers.
            </p>

          </div>

          <div className="mb-8">

            <div className="flex justify-between text-sm mb-3">

              <span className="text-slate-400">
                Question {currentQuestion + 1} of {totalQuestions}
              </span>

              <span className="text-indigo-400">
                {Math.round(progress)}%
              </span>

            </div>

            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />

            </div>

          </div>

          <section className="rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl p-6 md:p-10 shadow-2xl">

            <div className="mb-8">

              <p className="text-xs uppercase tracking-widest text-slate-500 mb-4">
                {isStructured
                  ? `Structured Question ${currentQuestion + 1}`
                  : `Your Thoughts ${textIndex + 1}`}
              </p>

              <h2 className="text-xl md:text-2xl font-semibold leading-relaxed text-white">
                {isStructured
                  ? question.question
                  : textQuestions[textIndex]}
              </h2>

            </div>

            {isStructured ? (

              <div className="space-y-3">

                {question.options.map((option) => {

                  const selected =
                    answers[currentQuestion] === option.value

                  return (
                    <button
                      key={option.label}
                      onClick={() => selectAnswer(option.value)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
                        selected
                          ? 'border-indigo-400/40 bg-indigo-500/15 text-white shadow-lg shadow-indigo-900/20'
                          : 'border-white/10 bg-white/[0.03] text-slate-400 hover:bg-white/[0.07] hover:text-white hover:border-white/20'
                      }`}
                    >

                      <div className="flex items-center gap-4">

                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                            selected
                              ? 'border-indigo-400 bg-indigo-500'
                              : 'border-slate-600'
                          }`}
                        >

                          {selected && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}

                        </div>

                        <span>{option.label}</span>

                      </div>

                    </button>
                  )
                })}

              </div>

            ) : (

              <textarea
                value={textResponses[textIndex]}
                onChange={(e) => updateTextResponse(e.target.value)}
                placeholder="Write your response here..."
                rows={7}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] text-white placeholder:text-slate-600 p-5 outline-none resize-none focus:border-indigo-400/40 focus:bg-white/[0.05] transition-all"
              />

            )}

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">

              <button
                onClick={previousQuestion}
                disabled={currentQuestion === 0 || submitting}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  currentQuestion === 0 || submitting
                    ? 'text-slate-700 cursor-not-allowed'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                ← Previous
              </button>

              <button
                onClick={nextQuestion}
                disabled={!currentAnswered || submitting}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  !currentAnswered || submitting
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/20'
                }`}
              >
                {submitting
                  ? 'Submitting...'
                  : currentQuestion === totalQuestions - 1
                    ? 'Submit Assessment'
                    : 'Next →'}
              </button>

            </div>

          </section>

          <p className="text-center text-xs text-slate-600 mt-6">
            This assessment is intended for awareness and early screening,
            not medical diagnosis.
          </p>

        </div>

      </main>

    </div>
  )
}

export default Assessment