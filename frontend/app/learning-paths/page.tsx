
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AuthGuard from "../components/AuthGuard";
import PageShell from "../components/Pageshell";
import { api } from "../lib/api";

type LearningStep = {
  id: string;
  title?: string | null;
  description?: string | null;
  order?: number | null;
  topic?: {
    id: string;
    name: string;
  } | null;
  resource?: {
    id: string;
    title: string;
    url?: string | null;
  } | null;
};

type LearningPath = {
  id: string;
  title?: string | null;
  description?: string | null;
  status?: string | null;
  progress?: number | null;
  steps?: LearningStep[];
  goal?: {
    id: string;
    title: string;
  } | null;
};

type LearningPathsResponse = {
  success: boolean;
  data: LearningPath[];
};

export default function LearningPathsPage() {
  const [learningPaths, setLearningPaths] = useState<
    LearningPath[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLearningPaths = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<LearningPathsResponse>(
            "/learning-paths"
          );

        if (!response.success) {
          throw new Error(
            "Unable to load learning paths."
          );
        }

        setLearningPaths(response.data || []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load learning paths."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLearningPaths();
  }, []);

  if (loading) {
    return (
      <AuthGuard>
        <PageShell>
          <div className="flex min-h-[60vh] items-center justify-center">
            <p className="text-sm text-[#777469]">
              Loading learning paths...
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
            Learning paths
          </p>

          <h1 className="mt-4 font-display text-5xl md:text-7xl">
            Your path
            <br />
            <i>to mastery.</i>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[#6f6c63]">
            Follow structured learning paths generated
            around your goals, skills and progress.
          </p>
        </section>

        {learningPaths.length === 0 ? (
          <div className="rounded-[28px] border border-[#d4d1c6] bg-white p-8">
            <h2 className="font-display text-2xl">
              No learning paths yet.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#777469]">
              Create a goal and analyze it to generate a
              personalized learning path.
            </p>

            <Link
              href="/goals"
              className="mt-6 inline-block rounded-xl bg-[#181818] px-5 py-3 text-xs font-bold text-white"
            >
              View your goals →
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {learningPaths.map((path) => {
              const steps = path.steps || [];

              const completedSteps = steps.filter(
                (step) =>
                  step.order !== null &&
                  step.order !== undefined
              ).length;

              const progress =
                typeof path.progress === "number"
                  ? Math.max(
                      0,
                      Math.min(100, path.progress)
                    )
                  : 0;

              return (
                <div
                  key={path.id}
                  className="rounded-[28px] border border-[#d4d1c6] bg-white p-7 transition hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full bg-[#eee8f4] px-3 py-1 text-[9px] font-bold text-[#695b72]">
                      {path.status || "ACTIVE"}
                    </span>

                    <span className="text-xs text-[#777469]">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <h2 className="mt-6 font-display text-3xl">
                    {path.title || "Learning path"}
                  </h2>

                  {path.description && (
                    <p className="mt-3 text-sm leading-6 text-[#777469]">
                      {path.description}
                    </p>
                  )}

                  {path.goal && (
                    <div className="mt-5 rounded-2xl bg-[#f7f5ef] p-4">
                      <p className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#777469]">
                        Goal
                      </p>

                      <p className="mt-2 text-sm font-medium">
                        {path.goal.title}
                      </p>
                    </div>
                  )}

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-[10px] text-[#777469]">
                      <span>Progress</span>
                      <span>
                        {Math.round(progress)}%
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-[#e5e2d9]">
                      <div
                        className="h-full rounded-full bg-[#9b84ae] transition-all"
                        style={{
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-xs text-[#777469]">
                      {steps.length}{" "}
                      {steps.length === 1
                        ? "step"
                        : "steps"}
                    </p>

                    {completedSteps > 0 && (
                      <p className="text-xs text-[#777469]">
                        {completedSteps} tracked
                      </p>
                    )}
                  </div>

                  <Link
                    href={`/learning-paths/${path.id}`}
                    className="mt-7 inline-block rounded-xl bg-[#181818] px-5 py-3 text-xs font-bold text-white"
                  >
                    Open learning path →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </PageShell>
    </AuthGuard>
  );
}

