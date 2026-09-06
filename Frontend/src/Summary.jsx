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
          <p className="text-slate-400">
            Loading your results...
          </p>
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

  if (!assessment) {
    return null;
  }

  // Actual ML result
  const burnoutProbability =
    (assessment.burnoutProbability ?? 0) * 100;

  const riskLevel = assessment.riskLevel || "Pending";

  const stress =
    (assessment.nlpScores?.stress ?? 0) * 100;

  const anxiety =
    (assessment.nlpScores?.anxiety ?? 0) * 100;

  const depression =
    (assessment.nlpScores?.depression ?? 0) * 100;

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
    riskDescription =
      "Your assessment is still being processed.";
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

          {/* Burnout Result */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl p-8 md:p-10 mb-6">

            <div className="grid md:grid-cols-2 gap-8 items-center">

              {/* Probability */}
              <div>
                <p className="text-slate-400 text-sm mb-3">
                  Burnout Probability
                </p>

                <div className="flex items-baseline gap-2">
                  <span className="text-6xl font-bold">
                    {burnoutProbability.toFixed(1)}
                  </span>

                  <span className="text-2xl text-slate-500">
                    %
                  </span>
                </div>

                <p className="text-slate-400 mt-4 leading-7">
                  {riskDescription}
                </p>
              </div>

              {/* Risk */}
              <div className="flex flex-col items-center justify-center">

                <div className="w-40 h-40 rounded-full border-8 border-indigo-500/20 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold">
                      {burnoutProbability.toFixed(0)}%
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      Risk
                    </p>
                  </div>
                </div>

                <div className="mt-5 px-5 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20">
                  <span className="text-indigo-400 font-semibold">
                    {riskLevel} Risk
                  </span>
                </div>

              </div>

            </div>
          </section>

          {/* Mental Health Indicators */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl p-8 mb-6">

            <h2 className="text-xl font-semibold mb-6">
              Mental Health Indicators
            </h2>

            <div className="grid md:grid-cols-3 gap-4">

              {/* Stress */}
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                <p className="text-slate-400 text-sm mb-2">
                  Stress
                </p>

                <p className="text-3xl font-bold">
                  {stress.toFixed(1)}%
                </p>

                <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${Math.min(stress, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Anxiety */}
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                <p className="text-slate-400 text-sm mb-2">
                  Anxiety
                </p>

                <p className="text-3xl font-bold">
                  {anxiety.toFixed(1)}%
                </p>

                <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${Math.min(anxiety, 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Depression */}
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5">
                <p className="text-slate-400 text-sm mb-2">
                  Depression
                </p>

                <p className="text-3xl font-bold">
                  {depression.toFixed(1)}%
                </p>

                <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${Math.min(depression, 100)}%`,
                    }}
                  />
                </div>
              </div>

            </div>

            <p className="text-xs text-slate-500 mt-5">
              These indicators are outputs from the text-response analysis
              and are intended for awareness rather than clinical diagnosis.
            </p>

          </section>

          {/* Interpretation */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.07] backdrop-blur-xl p-8 mb-6">

            <h2 className="text-xl font-semibold mb-3">
              Understanding Your Result
            </h2>

            <p className="text-slate-400 leading-7">
              Your burnout probability is generated using the structured
              assessment responses together with the stress, anxiety, and
              depression indicators obtained from your text responses.
              The final risk level is produced by the machine learning
              models used by MindAlign.
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