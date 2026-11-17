import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

const BACKDROP_TILES = [
  { title: "Deep Sleep", tag: "Audio Series", gradient: "from-emerald-100 via-green-50 to-white" },
  { title: "Anxiety Reset", tag: "7-Day Course", gradient: "from-teal-100 via-emerald-50 to-white" },
  { title: "Morning Clarity", tag: "Daily Ritual", gradient: "from-lime-100 via-green-50 to-white" },
  { title: "Focus Flow", tag: "Soundscapes", gradient: "from-green-100 via-teal-50 to-white" },
  { title: "Letting Go", tag: "Guided Breath", gradient: "from-emerald-100 via-slate-50 to-white" },
  { title: "Inner Calm", tag: "Mindfulness", gradient: "from-green-200/70 via-emerald-50 to-white" },
  { title: "Night Wind Down", tag: "Sleep Stories", gradient: "from-teal-100 via-cyan-50 to-white" },
  { title: "Self Compassion", tag: "Audio Journal", gradient: "from-lime-100 via-emerald-50 to-white" },
  { title: "Stress Relief", tag: "Quick Reset", gradient: "from-emerald-100 via-green-50 to-white" },
  { title: "Emotional Balance", tag: "Masterclass", gradient: "from-green-100 via-slate-50 to-white" },
  { title: "Quiet Mind", tag: "Meditation", gradient: "from-teal-100 via-green-50 to-white" },
  { title: "Renewal", tag: "Evening Routine", gradient: "from-emerald-200/60 via-lime-50 to-white" },
];

function BackdropGrid() {
  return (
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
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/95" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.55)_0%,rgba(255,255,255,0.96)_100%)]" />
    </div>
  );
}

function Summary() {
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please log in to view your assessment.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/assessment/latest",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load assessment");
        }

        setAssessment(data.assessment);
      } catch (err) {
        console.error("Error fetching assessment:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-slate-900 relative overflow-x-hidden selection:bg-[#22C55E] selection:text-white">
        <BackdropGrid />
        <Sidebar />

        <main className="relative z-10 ml-64 min-h-screen flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-2 border-emerald-200 border-t-[#22C55E] rounded-full animate-spin" />
          <p className="text-slate-500 text-sm font-medium">
            Loading your results...
          </p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white text-slate-900 relative overflow-x-hidden selection:bg-[#22C55E] selection:text-white">
        <BackdropGrid />
        <Sidebar />

        <main className="relative z-10 ml-64 min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md shadow-[0_20px_60px_rgba(15,23,42,0.06)] p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-3">
              Unable to load results
            </h1>

            <p className="text-slate-500 mb-6">{error}</p>

            <button
              onClick={() => navigate("/assessment")}
              className="px-6 py-3 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] active:bg-[#15803D] text-white shadow-md shadow-emerald-500/20 transition font-semibold text-sm"
            >
              Take Assessment
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!assessment) {
    return null;
  }

  // Results are available only after both assessments are complete and analyzed.
  const optionAssessmentCompleted =
    assessment.optionAssessmentCompleted === true;
  const textAssessmentCompleted =
    assessment.textAssessmentCompleted === true;
  const resultsReady =
    optionAssessmentCompleted &&
    textAssessmentCompleted &&
    assessment.riskLevel &&
    assessment.riskLevel !== "Pending" &&
    assessment.burnoutProbability !== null &&
    assessment.burnoutProbability !== undefined;

  if (!resultsReady) {
    const missingAssessment = !optionAssessmentCompleted
      ? "option"
      : !textAssessmentCompleted
        ? "text"
        : null;

    const nextPath =
      missingAssessment === "text"
        ? "/assessment/text"
        : "/assessment/option";

    const title = missingAssessment
      ? "Complete both assessments"
      : "Your results are not ready yet";

    const message = missingAssessment
      ? `You've completed one assessment. Please complete the ${missingAssessment === "text" ? "text-based" : "option-based"} assessment before viewing your results.`
      : "Both assessments have been submitted, but the analysis is not complete yet. Please return to your dashboard and check again shortly.";

    return (
      <div className="min-h-screen bg-white text-slate-900 relative overflow-x-hidden selection:bg-[#22C55E] selection:text-white">
        <BackdropGrid />
        <Sidebar />

        <main className="relative z-10 ml-64 min-h-screen flex items-center justify-center p-6 md:p-10">
          <section className="relative max-w-lg w-full text-center rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md shadow-[0_20px_60px_rgba(15,23,42,0.06)] p-8 md:p-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-[#16A34A]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 8v4" />
                <path d="M12 16h.01" />
                <circle cx="12" cy="12" r="10" />
              </svg>
            </div>

            <p className="text-[#16A34A] text-xs font-bold uppercase tracking-[0.16em] mb-2">
              MindAlign Assessment
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              {title}
            </h1>
            <p className="text-slate-600 leading-7 mb-7">{message}</p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              {missingAssessment && (
                <button
                  onClick={() => navigate(nextPath)}
                  className="px-6 py-3 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] active:bg-[#15803D] text-white shadow-md shadow-emerald-500/20 transition font-semibold text-sm"
                >
                  Complete{" "}
                  {missingAssessment === "text" ? "Text-Based" : "Option-Based"}{" "}
                  Assessment
                </button>
              )}
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-700 hover:bg-white hover:border-[#22C55E] hover:text-[#16A34A] transition font-semibold text-sm"
              >
                Back to Dashboard
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Actual ML result
  const burnoutProbability = (assessment.burnoutProbability ?? 0) * 100;

  const riskLevel = assessment.riskLevel || "Pending";

  const stress = (assessment.nlpScores?.stress ?? 0) * 100;

  const anxiety = (assessment.nlpScores?.anxiety ?? 0) * 100;

  const depression = (assessment.nlpScores?.depression ?? 0) * 100;

  let riskDescription;

  if (riskLevel === "Low") {
    riskDescription =
      "Your assessment indicates a relatively low level of burnout-related risk.";
  } else if (riskLevel === "Medium") {
    riskDescription =
      "Your assessment indicates a moderate level of burnout-related risk. Some areas of your current routine may deserve attention.";
  } else if (riskLevel === "High") {
    riskDescription =
      "Your assessment indicates a higher level of burnout-related risk. Consider reviewing your workload, recovery, and sources of stress.";
  } else {
    riskDescription = "Your assessment is still being processed.";
  }

  const riskBadgeStyle =
    riskLevel === "High"
      ? "bg-rose-50 border-rose-200 text-rose-700"
      : riskLevel === "Medium"
        ? "bg-amber-50 border-amber-200 text-amber-700"
        : "bg-emerald-50 border-emerald-200 text-[#16A34A]";

  const ringColor =
    riskLevel === "High"
      ? "#F43F5E"
      : riskLevel === "Medium"
        ? "#F59E0B"
        : "#22C55E";

  return (
    <div className="min-h-screen bg-white text-slate-900 relative overflow-x-hidden selection:bg-[#22C55E] selection:text-white">
      <BackdropGrid />
      <Sidebar />

      <main className="relative z-10 ml-64 min-h-screen p-6 md:p-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200 bg-emerald-50/90 text-[#16A34A] text-[11px] font-semibold tracking-[0.14em] mb-4">
              MINDALIGN ASSESSMENT
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Your Results<span className="text-[#22C55E]">.</span>
            </h1>

            <p className="text-slate-500 mt-2">
              Here&apos;s a summary of your latest burnout assessment.
            </p>
          </div>

          {/* Burnout Result */}
          <section className="rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md shadow-[0_20px_60px_rgba(15,23,42,0.06)] p-8 md:p-10 mb-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Probability */}
              <div>
                <p className="text-[#16A34A] text-xs font-bold uppercase tracking-[0.16em] mb-3">
                  Burnout Probability
                </p>

                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold tracking-tight text-slate-900">
                    {burnoutProbability.toFixed(1)}
                  </span>

                  <span className="text-2xl font-semibold text-slate-400">
                    %
                  </span>
                </div>

                <p className="text-slate-600 mt-4 leading-7">{riskDescription}</p>
              </div>

              {/* Risk Ring */}
              <div className="flex flex-col items-center justify-center">
                <div
                  className="w-40 h-40 rounded-full flex items-center justify-center shadow-md shadow-emerald-500/10"
                  style={{
                    background: `conic-gradient(from 220deg, ${ringColor} 0deg ${
                      Math.min(Math.max(burnoutProbability, 0), 100) * 3.6
                    }deg, #E2E8F0 ${
                      Math.min(Math.max(burnoutProbability, 0), 100) * 3.6
                    }deg 360deg)`,
                  }}
                >
                  <div className="w-[calc(100%-14px)] h-[calc(100%-14px)] rounded-full bg-white border border-slate-100 flex flex-col items-center justify-center text-center shadow-inner">
                    <p className="text-4xl font-bold leading-none text-slate-900">
                      {burnoutProbability.toFixed(0)}%
                    </p>
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      Risk
                    </p>
                  </div>
                </div>

                <div
                  className={`mt-5 px-5 py-1.5 rounded-full border ${riskBadgeStyle}`}
                >
                  <span className="text-sm font-semibold">{riskLevel} Risk</span>
                </div>
              </div>
            </div>
          </section>

          {/* Mental Health Indicators */}
          <section className="rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md shadow-[0_20px_60px_rgba(15,23,42,0.06)] p-8 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              Mental Health Indicators
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {/* Stress */}
              <div className="rounded-xl bg-slate-50/80 border border-slate-200/80 p-5 transition-all hover:border-[#22C55E]/40 hover:bg-white hover:shadow-sm">
                <p className="text-slate-500 font-medium text-sm mb-2">
                  Stress
                </p>

                <p className="text-3xl font-bold text-slate-900">
                  {stress.toFixed(1)}%
                </p>

                <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full"
                    style={{
                      width: `${Math.min(stress, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Anxiety */}
              <div className="rounded-xl bg-slate-50/80 border border-slate-200/80 p-5 transition-all hover:border-teal-400/50 hover:bg-white hover:shadow-sm">
                <p className="text-slate-500 font-medium text-sm mb-2">
                  Anxiety
                </p>

                <p className="text-3xl font-bold text-slate-900">
                  {anxiety.toFixed(1)}%
                </p>

                <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                    style={{
                      width: `${Math.min(anxiety, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Depression */}
              <div className="rounded-xl bg-slate-50/80 border border-slate-200/80 p-5 transition-all hover:border-lime-500/40 hover:bg-white hover:shadow-sm">
                <p className="text-slate-500 font-medium text-sm mb-2">
                  Depression
                </p>

                <p className="text-3xl font-bold text-slate-900">
                  {depression.toFixed(1)}%
                </p>

                <div className="mt-4 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-lime-500 to-[#16A34A] rounded-full"
                    style={{
                      width: `${Math.min(depression, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-5">
              These indicators are outputs from the text-response analysis and
              are intended for awareness rather than clinical diagnosis.
            </p>
          </section>

          {/* Interpretation */}
          <section className="rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-md shadow-[0_20px_60px_rgba(15,23,42,0.06)] p-8 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Understanding Your Result
            </h2>

            <p className="text-slate-600 leading-7">
              Your burnout probability is generated using the structured
              assessment responses together with the stress, anxiety, and
              depression indicators obtained from your text responses. The
              final risk level is produced by the machine learning models used
              by MindAlign.
            </p>
          </section>

          {/* Recommendations */}
          <section className="rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 backdrop-blur-md shadow-sm p-8 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              What You Can Do
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/90 border border-slate-200/80 p-5 shadow-2xs transition-all hover:border-[#22C55E]/40">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Take regular breaks
                </h3>

                <p className="text-sm text-slate-500 leading-6">
                  Give yourself short periods away from work or study
                  throughout the day.
                </p>
              </div>

              <div className="rounded-xl bg-white/90 border border-slate-200/80 p-5 shadow-2xs transition-all hover:border-[#22C55E]/40">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Review your workload
                </h3>

                <p className="text-sm text-slate-500 leading-6">
                  Identify tasks that can be postponed, delegated, or broken
                  into smaller steps.
                </p>
              </div>

              <div className="rounded-xl bg-white/90 border border-slate-200/80 p-5 shadow-2xs transition-all hover:border-[#22C55E]/40">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Prioritize recovery
                </h3>

                <p className="text-sm text-slate-500 leading-6">
                  Make sufficient time for sleep, rest, hobbies, and activities
                  outside work or academics.
                </p>
              </div>

              <div className="rounded-xl bg-white/90 border border-slate-200/80 p-5 shadow-2xs transition-all hover:border-[#22C55E]/40">
                <h3 className="font-semibold text-slate-900 mb-2">
                  Talk to someone
                </h3>

                <p className="text-sm text-slate-500 leading-6">
                  If stress is becoming difficult to manage, consider talking
                  with someone you trust or a qualified professional.
                </p>
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-lg bg-[#22C55E] hover:bg-[#16A34A] active:bg-[#15803D] text-white shadow-md shadow-emerald-500/20 transition font-semibold text-sm"
            >
              Back to Dashboard
            </button>

            <button
              onClick={() => navigate("/assessment")}
              className="px-6 py-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-700 hover:bg-white hover:border-[#22C55E] hover:text-[#16A34A] transition font-semibold text-sm"
            >
              Retake Assessment
            </button>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            MindAlign is an awareness and self-reflection tool and does not
            provide a medical diagnosis.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Summary;