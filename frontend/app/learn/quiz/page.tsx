"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageShell from "../../components/Pageshell";
import { api } from "../../lib/api";

type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty?: string;
};

type QuizData = {
  title?: string;
  description?: string;
  questions: QuizQuestion[];
};

type AIQuizResponse = {
  success: boolean;
  data?: QuizData;
  message?: string;
};

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const topic = searchParams.get("topic") || "General Knowledge";
  const resourceTitle = searchParams.get("resourceTitle") || topic;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quiz, setQuiz] = useState<QuizData | null>(null);

  /* Quiz state */
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number>(0);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      setError("");
      setSubmitted(false);
      setUserAnswers({});

      const response = await api.post<AIQuizResponse>("/ai/quiz", {
        topic,
        description: resourceTitle,
        difficulty: "INTERMEDIATE",
        questionCount: 5,
      });

      if (!response.success || !response.data?.questions?.length) {
        throw new Error(response.message || "Failed to generate AI quiz.");
      }

      setQuiz(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate AI quiz.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [topic]);

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionIdx]: optionIdx,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!quiz) return;

    let correct = 0;
    quiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        correct++;
      }
    });

    const finalScore = Math.round((correct / quiz.questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);
  };

  const isSatisfactory = score >= 70;

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#181818] border-t-transparent" />
        <h2 className="font-display text-2xl">Generating AI Quiz...</h2>
        <p className="text-sm text-[#777469]">Creating questions customized for &quot;{topic}&quot;</p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-sm font-semibold text-red-700">{error || "Could not load quiz."}</p>
        <button
          type="button"
          onClick={fetchQuiz}
          className="mt-5 rounded-xl bg-[#181818] px-6 py-3 text-xs font-bold text-white transition hover:bg-[#303030]"
        >
          Try Again 🔄
        </button>
      </div>
    );
  }

  const answeredCount = Object.keys(userAnswers).length;
  const allAnswered = answeredCount === quiz.questions.length;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-xs font-bold text-[#777469] hover:underline"
        >
          ← Back to Learning Path
        </button>

        <div className="mt-4 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="rounded-full bg-[#a98cff] px-3 py-1 text-[9px] font-bold text-white">
              AI KNOWLEDGE CHECK
            </span>
            <h1 className="mt-3 font-display text-4xl">{topic}</h1>
            <p className="mt-1 text-sm text-[#6f6c63]">Quiz on: {resourceTitle}</p>
          </div>

          {!submitted && (
            <div className="rounded-2xl bg-[#f0eee5] px-4 py-2 text-right">
              <p className="text-[9px] font-bold uppercase tracking-[1px] text-[#777]">Answered</p>
              <p className="font-display text-xl">{answeredCount} / {quiz.questions.length}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── RESULT SCREEN ──────────────────────── */}
      {submitted ? (
        <div className="space-y-6">
          <div
            className={`rounded-[32px] p-8 text-white ${
              isSatisfactory ? "bg-[#181818]" : "bg-[#ef4444]"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <span className="text-5xl">{isSatisfactory ? "🎉" : "📚"}</span>
              <h2 className="mt-4 font-display text-4xl">
                {isSatisfactory ? "Quiz Passed!" : "Needs Improvement"}
              </h2>
              <p className="mt-2 text-6xl font-extrabold text-[#c8e86b]">{score}%</p>
              <p className="mt-3 max-w-md text-sm leading-6 opacity-90">
                {isSatisfactory
                  ? "Great job! You demonstrated strong understanding of this topic. You are ready to move on to the next topic in your path."
                  : "Your score was below the 70% passing threshold. Please review the resource materials again and retake the quiz to master this topic."}
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {isSatisfactory ? (
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-xl bg-[#c8e86b] px-6 py-3.5 text-xs font-bold text-[#181818] transition hover:opacity-90"
                  >
                    Continue Learning Path →
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="rounded-xl bg-white px-6 py-3.5 text-xs font-bold text-[#181818] transition hover:bg-gray-100"
                    >
                      Review Resource Again 📖
                    </button>
                    <button
                      type="button"
                      onClick={fetchQuiz}
                      className="rounded-xl bg-[#181818] px-6 py-3.5 text-xs font-bold text-white transition hover:bg-[#303030]"
                    >
                      Retake Quiz 🔄
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Breakdown */}
          <div className="rounded-[28px] border border-[#d3d0c4] bg-white p-7">
            <h3 className="font-display text-2xl">Question Review</h3>
            <div className="mt-6 space-y-6">
              {quiz.questions.map((q, qIdx) => {
                const userAns = userAnswers[qIdx];
                const isCorrect = userAns === q.correctAnswer;

                return (
                  <div key={qIdx} className="rounded-2xl border border-[#e5e2d9] p-5">
                    <div className="flex items-start gap-3">
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isCorrect ? "bg-[#c8e86b] text-[#181818]" : "bg-red-500 text-white"
                        }`}
                      >
                        {isCorrect ? "✓" : "✕"}
                      </span>
                      <div>
                        <p className="text-sm font-semibold">{qIdx + 1}. {q.question}</p>

                        <div className="mt-3 space-y-1.5">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = userAns === optIdx;
                            const isRight = optIdx === q.correctAnswer;

                            return (
                              <div
                                key={optIdx}
                                className={`rounded-xl px-4 py-2 text-xs font-medium ${
                                  isRight
                                    ? "bg-[#c8e86b]/40 text-[#181818] font-bold"
                                    : isSelected
                                    ? "bg-red-100 text-red-800"
                                    : "bg-[#f7f5ef] text-[#777]"
                                }`}
                              >
                                {opt} {isRight && "✓ (Correct)"} {isSelected && !isRight && "✕ (Your Choice)"}
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-3 rounded-xl bg-[#f0eee5] p-3 text-xs leading-5 text-[#555]">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* ── QUESTION LIST ────────────────────────── */
        <div className="space-y-6">
          {quiz.questions.map((q, qIdx) => {
            const selectedOption = userAnswers[qIdx];

            return (
              <div key={qIdx} className="rounded-[28px] border border-[#d3d0c4] bg-white p-7 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
                  Question {qIdx + 1} of {quiz.questions.length}
                </p>
                <h3 className="mt-2 text-base font-bold text-[#181818]">{q.question}</h3>

                <div className="mt-5 space-y-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOption === optIdx;

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`w-full rounded-2xl border p-4 text-left text-sm font-medium transition ${
                          isSelected
                            ? "border-[#181818] bg-[#181818] text-white"
                            : "border-[#e5e2d9] bg-[#fffef9] hover:bg-[#f7f5ef]"
                        }`}
                      >
                        <span className="mr-3 font-bold opacity-60">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmitQuiz}
            className="w-full rounded-2xl bg-[#181818] py-4 text-sm font-bold text-white transition hover:bg-[#303030] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {allAnswered ? "Submit Quiz →" : `Answer all questions (${answeredCount}/${quiz.questions.length})`}
          </button>
        </div>
      )}
    </div>
  );
}

export default function AIQuizPage() {
  return (
    <PageShell>
      <Suspense fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-sm text-[#777469]">
          Loading quiz...
        </div>
      }>
        <QuizContent />
      </Suspense>
    </PageShell>
  );
}
