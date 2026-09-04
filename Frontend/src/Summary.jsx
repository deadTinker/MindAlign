import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

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
      <div className="min-h-screen bg-slate-950 text-white">
        <Sidebar />

        <main className="ml-64 min-h-screen flex items-center justify-center">
          <p className="text-slate-400">Loading your results...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Sidebar />

        <main className="ml-64 min-h-screen flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl p-8">
            <h1 className="text-2xl font-bold mb-3">
              Unable to load results
            </h1>

            <p className="text-slate-400 mb-6">
              {error}
            </p>

            <button
              onClick={() => navigate("/assessment")}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-semibold"
            >
              Take Assessment
            </button>
          </div>
        </main>
      </div>
    );
  }

  const score = assessment.score;
  const total = assessment.total;
  const percentage = Math.round((score / total) * 100);

  let riskDescription;

  if (assessment.riskLevel === "Low") {
    riskDescription =
      "Your responses indicate relatively low levels of burnout-related concerns.";
  } else if (assessment.riskLevel === "Moderate") {
    riskDescription =
      "Your responses indicate some burnout-related concerns that may be worth paying attention to.";
  } else {
    riskDescription =
      "Your responses indicate a higher level of burnout-related concerns. Consider taking steps to reduce stress and workload.";
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed top-[-180px] left-[-180px] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="fixed bottom-[-180px] right-[-180px] w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <Sidebar />

      <main className="ml-64 min-h-screen p-6 md:p-10 relative">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-10">
            <p className="text-indigo-400 text-sm font-medium mb-2">
              MindAlign Assessment
            </p>

            <h1 className="text-3xl md:text-4xl font-bold">
              Your Results
            </h1>

            <p className="text-slate-400 mt-2">
              Here's a summary of your latest burnout assessment.
            </p>
          </div>

          {/* Score */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl p-8 md:p-10 mb-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">

              <div>
                <p className="text-slate-400 text-sm mb-3">
                  Burnout Risk Score
                </p>

                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold">
                    {score}
                  </span>

                  <span className="text-xl text-slate-500">
                    / {total}
                  </span>
                </div>

                <p className="text-slate-400 mt-4 leading-7">
                  {riskDescription}
                </p>
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-40 h-40 rounded-full border-8 border-indigo-500/20 flex items-center justify-center relative">
                  <div className="text-center">
                    <p className="text-4xl font-bold">
                      {percentage}%
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Score
                    </p>
                  </div>
                </div>

                <div className="mt-5 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20">
                  <span className="text-indigo-400 font-semibold">
                    {assessment.riskLevel} Risk
                  </span>
                </div>
              </div>

            </div>
          </section>

          {/* Interpretation */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl p-8 mb-6">
            <h2 className="text-xl font-semibold mb-3">
              Understanding Your Result
            </h2>

            <p className="text-slate-400 leading-7">
              This result is based on your responses to the MindAlign
              burnout awareness assessment. It is intended to help you
              reflect on your current situation and identify areas that
              may deserve attention.
            </p>
          </section>

          {/* Recommendations */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl p-8 mb-6">
            <h2 className="text-xl font-semibold mb-6">
              What You Can Do
            </h2>

            <div className="grid md:grid-cols-2 gap-4">

              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                <h3 className="font-semibold mb-2">
                  Take regular breaks
                </h3>

                <p className="text-sm text-slate-400 leading-6">
                  Give yourself short periods away from work or study
                  throughout the day.
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                <h3 className="font-semibold mb-2">
                  Review your workload
                </h3>

                <p className="text-sm text-slate-400 leading-6">
                  Identify tasks that can be postponed, delegated, or
                  broken into smaller steps.
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                <h3 className="font-semibold mb-2">
                  Prioritize recovery
                </h3>

                <p className="text-sm text-slate-400 leading-6">
                  Make sufficient time for sleep, rest, hobbies, and
                  activities outside work or academics.
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                <h3 className="font-semibold mb-2">
                  Talk to someone
                </h3>

                <p className="text-sm text-slate-400 leading-6">
                  If stress is becoming difficult to manage, consider
                  talking with someone you trust or a qualified professional.
                </p>
              </div>

            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition font-semibold"
            >
              Back to Dashboard
            </button>

            <button
              onClick={() => navigate("/assessment")}
              className="px-6 py-3 rounded-xl bg-white/[0.06] border border-white/10 hover:bg-white/[0.1] transition font-semibold"
            >
              Retake Assessment
            </button>
          </div>

          <p className="text-center text-xs text-slate-600 mt-8">
            MindAlign is an awareness and self-reflection tool and does
            not provide a medical diagnosis.
          </p>

        </div>
      </main>
    </div>
  );
}

export default Summary;