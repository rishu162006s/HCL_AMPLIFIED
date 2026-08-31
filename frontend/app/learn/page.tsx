"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageShell from "../components/Pageshell";
import ProgressBar from "../components/ProgressBar";
import { api } from "../lib/api";

type LearningStep = {
  id: number;
  order: number;
  milestone?: string | null;
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

type ProgressRecord = {
  resourceId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
};

type ProgressResponse = {
  success: boolean;
  data: ProgressRecord[];
};

function pathProgress(
  path: LearningPath,
  progressRecords: ProgressRecord[]
) {
  const steps = path.steps ?? [];
  const completed = steps.filter((step) => {
    const resourceId = step.resource?.id;
    if (!resourceId) return false;
    return progressRecords.some(
      (record) =>
        record.resourceId === resourceId &&
        record.status === "COMPLETED"
    );
  }).length;

  const total = steps.length;

  return {
    completed,
    total,
    percent:
      total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export default function LearnPage() {
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(
    []
  );
  const [progressRecords, setProgressRecords] = useState<
    ProgressRecord[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [pathsResponse, progressResponse] = await Promise.all([
          api.get<LearningPathsResponse>("/learning-paths"),
          api.get<ProgressResponse>("/progress"),
        ]);

        if (!pathsResponse.success) {
          throw new Error("Unable to load learning paths.");
        }

        setLearningPaths(pathsResponse.data || []);
        setProgressRecords(progressResponse.data ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your learning section."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-[#777469]">
            Loading your learning paths...
          </p>
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      </PageShell>
    );
  }

  const currentPath = learningPaths[0] ?? null;
  const currentStats = currentPath
    ? pathProgress(currentPath, progressRecords)
    : null;

  return (
    <PageShell>
      <section className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-[#777469]">
          Learn
        </p>

        <h1 className="mt-4 font-display text-5xl leading-[.95] tracking-[-2px] md:text-7xl">
          Continue
          <br />
          <i>your path.</i>
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-[#6f6c63]">
          This is the same learning path generated for your goals.
          Complete resources in order and your progress will update
          across Goals and Analytics.
        </p>
      </section>

      {currentPath && currentStats ? (
        <section className="mb-8 overflow-hidden rounded-[30px] bg-[#181818] p-7 text-white md:p-10">
          {currentPath.goal && (
            <span className="rounded-full bg-[#c8e86b] px-3 py-1.5 text-[9px] font-bold text-[#181818]">
              {currentPath.goal.title}
            </span>
          )}

          <h2 className="mt-6 font-display text-4xl md:text-5xl">
            {currentPath.title || "Learning path"}
          </h2>

          {currentPath.description && (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#aaa9a2]">
              {currentPath.description}
            </p>
          )}

          <div className="mt-8 max-w-xl">
            <div className="mb-2 flex justify-between text-[10px] text-[#888]">
              <span>
                {currentStats.completed} of {currentStats.total}{" "}
                resources completed
              </span>
              <span>{currentStats.percent}%</span>
            </div>
            <ProgressBar value={currentStats.percent} dark />
          </div>

          <Link
            href={`/learn/${currentPath.id}`}
            className="mt-8 inline-block rounded-xl bg-[#c8e86b] px-5 py-3 text-xs font-bold text-[#181818]"
          >
            Continue learning →
          </Link>
        </section>
      ) : (
        <section className="mb-8 rounded-[28px] border border-[#d4d1c6] bg-white p-8">
          <h2 className="font-display text-2xl">
            No learning path yet.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#777469]">
            Create a goal and generate a path. Once it exists, it will
            appear here, on the goal page, and in Analytics.
          </p>
          <Link
            href="/goals"
            className="mt-6 inline-block rounded-xl bg-[#181818] px-5 py-3 text-xs font-bold text-white"
          >
            View your goals →
          </Link>
        </section>
      )}

      {learningPaths.length > 0 && (
        <section>
          <p className="mb-5 text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
            All learning paths
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            {learningPaths.map((path) => {
              const stats = pathProgress(path, progressRecords);

              return (
                <div
                  key={path.id}
                  className="rounded-[28px] border border-[#d4d1c6] bg-white p-7"
                >
                  {path.goal && (
                    <span className="rounded-full bg-[#eee8f4] px-3 py-1 text-[9px] font-bold text-[#695b72]">
                      {path.goal.title}
                    </span>
                  )}

                  <h3 className="mt-5 font-display text-3xl">
                    {path.title || "Learning path"}
                  </h3>

                  {path.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#777469]">
                      {path.description}
                    </p>
                  )}

                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-[10px] text-[#777469]">
                      <span>
                        {stats.completed} / {stats.total} steps
                      </span>
                      <span>{stats.percent}%</span>
                    </div>
                    <ProgressBar value={stats.percent} />
                  </div>

                  <Link
                    href={`/learn/${path.id}`}
                    className="mt-7 inline-block rounded-xl bg-[#181818] px-5 py-3 text-xs font-bold text-white"
                  >
                    Open path →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </PageShell>
  );
}
