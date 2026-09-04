import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'

const questions = [
  {
    question: 'How often do you feel emotionally exhausted by your studies or work?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost always'],
  },
  {
    question: 'How often do you feel overwhelmed by the amount of work you have to complete?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost always'],
  },
  {
    question: 'How often do you find it difficult to concentrate on your tasks?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost always'],
  },
  {
    question: 'How often do you feel that you are not getting enough time to rest or recover?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost always'],
  },
  {
    question: 'How often do you lose motivation to complete your usual responsibilities?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost always'],
  },
  {
    question: 'How often do you feel irritable or frustrated because of your workload?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost always'],
  },
  {
    question: 'How often do you feel disconnected from your studies or work?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost always'],
  },
  {
    question: 'How often do you continue working or studying even when you feel mentally exhausted?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost always'],
  },
  {
    question: 'How often does your workload interfere with your personal life?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost always'],
  },
  {
    question: 'How often do you feel that your current routine is difficult to maintain?',
    options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost always'],
  },
]

function Assessment() {
  const navigate = useNavigate()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState(Array(questions.length).fill(null))
  const [completed, setCompleted] = useState(false)

  const question = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  const selectAnswer = (optionIndex) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = optionIndex + 1
    setAnswers(newAnswers)
  }

  const nextQuestion = async () => {
  if (answers[currentQuestion] === null) return

  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(currentQuestion + 1)
    return
  }

  const score = answers.reduce((total, answer) => total + answer, 0)

  try {
    const token = localStorage.getItem("token")

    const response = await fetch("http://localhost:5000/api/assessment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        answers,
        score,
        total: questions.length * 5,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to submit assessment")
    }

    // Keep this temporarily so Summary can still work
    localStorage.setItem(
      "mindalignAssessment",
      JSON.stringify({
        answers,
        score,
        total: questions.length * 5,
        riskLevel: data.assessment.riskLevel,
      })
    )

    setCompleted(true)
  } catch (error) {
    console.error("Assessment submission error:", error)
    alert("Unable to submit assessment. Please try again.")
  }
}

  const previousQuestion = () => {
    if (currentQuestion > 0) {
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
              Your assessment has been completed. You can now view your
              preliminary results and insights.
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
              Burnout Risk Assessment
            </h1>

            <p className="text-slate-400 mt-2 max-w-2xl">
              Answer each question based on how you have generally been
              feeling recently. There are no right or wrong answers.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-slate-400">
                Question {currentQuestion + 1} of {questions.length}
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
                Question {currentQuestion + 1}
              </p>

              <h2 className="text-xl md:text-2xl font-semibold leading-relaxed text-white">
                {question.question}
              </h2>
            </div>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const selected = answers[currentQuestion] === index + 1

                return (
                  <button
                    key={option}
                    onClick={() => selectAnswer(index)}
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

                      <span>{option}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/10">
              <button
                onClick={previousQuestion}
                disabled={currentQuestion === 0}
                className={`px-5 py-3 rounded-xl font-medium transition-all ${
                  currentQuestion === 0
                    ? 'text-slate-700 cursor-not-allowed'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                ← Previous
              </button>

              <button
                onClick={nextQuestion}
                disabled={answers[currentQuestion] === null}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  answers[currentQuestion] === null
                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/20'
                }`}
              >
                {currentQuestion === questions.length - 1
                  ? 'Submit Assessment'
                  : 'Next →'}
              </button>
            </div>

          </section>

          <p className="text-center text-xs text-slate-600 mt-6">
            This assessment is intended for awareness and self-reflection,
            not medical diagnosis.
          </p>

        </div>
      </main>
    </div>
  )
}

export default Assessment