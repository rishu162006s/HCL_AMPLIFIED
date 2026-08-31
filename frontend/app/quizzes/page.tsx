"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";
import PageShell from "../components/Pageshell";
import { api } from "../lib/api";

type Quiz = {
  id: string;
  title?: string | null;
  difficulty?: string | null;
  topic?: {
    id: string;
    name: string;
  } | null;
  questions?: unknown[];
};

type QuizzesResponse = {
  success: boolean;
  data: Quiz[];
};

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<QuizzesResponse>("/quizzes");

        if (!response.success) {
          throw new Error("Unable to load quizzes.");
        }

        setQuizzes(response.data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load quizzes."
        );
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  if (loading) {
    return (
      <AuthGuard>
        <PageShell>
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-sm text-[#777469]">
              Loading quizzes...
            </p>
          </div>
        </PageShell>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <PageShell>
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {error}
          </div>
        </PageShell>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <PageShell>
        <section className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
            Knowledge check
          </p>

          <h1 className="mt-4 font-display text-5xl md:text-7xl">
            Test what
            <br />
            <i>you know.</i>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#6f6c63]">
            Take quizzes based on the topics in your
            learning journey and measure your understanding.
          </p>
        </section>

        {quizzes.length === 0 ? (
          <div className="rounded-[28px] border border-[#d4d1c6] bg-white p-8">
            <h2 className="font-display text-2xl">
              No quizzes available yet.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#777469]">
              Quizzes will appear here when they are
              available for your learning topics.
            </p>

            <Link
              href="/learning-paths"
              className="mt-6 inline-block rounded-xl bg-[#181818] px-5 py-3 text-xs font-bold text-white"
            >
              View learning paths →
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="rounded-[26px] border border-[#d4d1c6] bg-white p-6 transition hover:-translate-y-1"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-full bg-[#eee8f4] px-3 py-1 text-[9px] font-bold text-[#695b72]">
                    {quiz.difficulty || "INTERMEDIATE"}
                  </span>

                  <span className="text-[10px] text-[#777469]">
                    {quiz.questions?.length ?? 0} questions
                  </span>
                </div>

                <h2 className="mt-8 font-display text-2xl">
                  {quiz.title ||
                    quiz.topic?.name ||
                    "Learning Quiz"}
                </h2>

                {quiz.topic?.name && (
                  <p className="mt-3 text-sm text-[#777469]">
                    Topic: {quiz.topic.name}
                  </p>
                )}

                <Link
                  href={`/quizzes/${quiz.id}`}
                  className="mt-7 inline-block rounded-xl bg-[#181818] px-5 py-3 text-xs font-bold text-white"
                >
                  Start quiz →
                </Link>
              </div>
            ))}
          </div>
        )}
      </PageShell>
    </AuthGuard>
  );
}