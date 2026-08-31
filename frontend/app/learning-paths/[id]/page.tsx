"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import PageShell from "../../components/Pageshell";
import ProgressBar from "../../components/ProgressBar";
import { api } from "../../lib/api";

type LearningStep = {
  id: number;
  order: number;
  milestone: string | null;
  resource: {
    id: string;
    title: string;
    type: string;
    url: string;
  };
};

type LearningPath = {
  id: string;
  title: string;
  description: string | null;
  goal: {
    id: string;
    title: string;
  } | null;
  steps: LearningStep[];
};

type LearningPathResponse = {
  success: boolean;
  data: LearningPath;
};

type ProgressRecord = {
  id: string;
  resourceId: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  progress: number;
};

type ProgressResponse = {
  success: boolean;
  data: ProgressRecord[];
};

type SingleProgressResponse = {
  success: boolean;
  data: ProgressRecord;
};

export default function LearningPathDetailPage() {
  const params = useParams<{ id: string }>();
  const learningPathId = params.id;

  const [path, setPath] = useState<LearningPath | null>(null);
  const [progressRecords, setProgressRecords] = useState<ProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingResourceId, setUpdatingResourceId] = useState<string | null>(null);

  useEffect(() => {
    if (!learningPathId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [pathRes, progressRes] = await Promise.all([
          api.get<LearningPathResponse>(`/learning-paths/${learningPathId}`),
          api.get<ProgressResponse>("/progress"),
        ]);

        if (!pathRes.success || !pathRes.data) {
          throw new Error("Unable to load learning path.");
        }

        setPath(pathRes.data);
        setProgressRecords(progressRes.data ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load learning path.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [learningPathId]);

  const progressMap = useMemo(() => {
    const map = new Map<string, ProgressRecord>();
    for (const record of progressRecords) {
      map.set(record.resourceId, record);
    }
    return map;
  }, [progressRecords]);

  const completedStepsCount = path
    ? path.steps.filter((step) => progressMap.get(step.resource.id)?.status === "COMPLETED").length
    : 0;

  const totalSteps = path?.steps.length ?? 0;
  const overallProgress = totalSteps === 0 ? 0 : Math.round((completedStepsCount / totalSteps) * 100);

  const handleMarkComplete = async (resourceId: string) => {
    try {
      setUpdatingResourceId(resourceId);
      setError("");

      const existing = progressMap.get(resourceId);
      let response: SingleProgressResponse;

      if (!existing) {
        response = await api.post<SingleProgressResponse>("/progress", {
          resourceId,
          status: "COMPLETED",
          progress: 100,
        });
      } else if (existing.status !== "COMPLETED") {
        response = await api.patch<SingleProgressResponse>(`/progress/${existing.id}`, {
          status: "COMPLETED",
          progress: 100,
        });
      } else {
        return;
      }

      if (!response.success) {
        throw new Error("Unable to update progress.");
      }

      setProgressRecords((curr) => [
        ...curr.filter((r) => r.resourceId !== resourceId),
        response.data,
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update progress.");
    } finally {
      setUpdatingResourceId(null);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-sm text-[#777469]">Loading your learning path...</p>
        </div>
      </PageShell>
    );
  }

  if (error || !path) {
    return (
      <PageShell>
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error || "Learning path not found."}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Link href="/learning-paths" className="mb-6 inline-block text-xs font-bold text-[#777469] hover:underline">
        ← All learning paths
      </Link>

      {/* Hero */}
      <section className="mb-8 overflow-hidden rounded-[32px] bg-[#181818] p-7 text-white md:p-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-3xl">
            {path.goal && (
              <span className="rounded-full bg-[#c8e86b] px-3 py-1.5 text-[9px] font-bold text-[#181818]">
                {path.goal.title}
              </span>
            )}
            <h1 className="mt-5 font-display text-4xl leading-tight md:text-6xl">
              {path.title}
            </h1>
            {path.description && (
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#aaa9a2]">
                {path.description}
              </p>
            )}
          </div>

          <div className="shrink-0 rounded-2xl bg-[#292929] p-6 text-right">
            <p className="text-[9px] font-bold uppercase tracking-[2px] text-[#888]">Overall Progress</p>
            <p className="mt-2 font-display text-5xl text-[#c8e86b]">{overallProgress}%</p>
            <p className="mt-1 text-xs text-[#aaa]">{completedStepsCount} of {totalSteps} steps completed</p>
          </div>
        </div>

        <div className="mt-8 max-w-full">
          <ProgressBar value={overallProgress} dark />
        </div>
      </section>

      {/* Sequence */}
      <section className="space-y-4">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#777469]">
            Learning path sequence
          </p>
          <h2 className="mt-2 font-display text-3xl">Your topics & resources</h2>
        </div>

        {path.steps.map((step, idx) => {
          const record = progressMap.get(step.resource.id);
          const isCompleted = record?.status === "COMPLETED";
          const isUpdating = updatingResourceId === step.resource.id;
          const isCurrentActive = !isCompleted && (idx === 0 || progressMap.get(path.steps[idx - 1]?.resource.id)?.status === "COMPLETED");

          return (
            <div
              key={step.id}
              className={`rounded-[26px] border p-6 transition-all ${
                isCompleted
                  ? "border-[#c8e86b] bg-[#f9fdf2]"
                  : isCurrentActive
                  ? "border-[#181818] bg-white shadow-md ring-2 ring-[#181818]/10"
                  : "border-[#d6d3c8] bg-white opacity-80"
              }`}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isCompleted
                          ? "bg-[#c8e86b] text-[#181818]"
                          : isCurrentActive
                          ? "bg-[#181818] text-white"
                          : "bg-[#e5e2d9] text-[#777]"
                      }`}
                    >
                      {isCompleted ? "✓" : step.order}
                    </span>
                    <div>
                      {step.milestone && (
                        <p className="text-[10px] font-bold uppercase tracking-[1.5px] text-[#777469]">
                          {step.milestone}
                        </p>
                      )}
                      <h3 className="text-lg font-bold">{step.resource.title}</h3>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f0eee5] px-3 py-1 text-[9px] font-bold uppercase tracking-[1px] text-[#777]">
                    {step.resource.type}
                  </span>

                  <a
                    href={step.resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-[#d2cfc1] bg-white px-4 py-2.5 text-xs font-bold transition hover:bg-[#f7f5ef]"
                  >
                    Open Resource ↗
                  </a>

                  <button
                    type="button"
                    disabled={isCompleted || isUpdating}
                    onClick={() => handleMarkComplete(step.resource.id)}
                    className={`rounded-xl px-5 py-2.5 text-xs font-bold transition ${
                      isCompleted
                        ? "bg-[#c8e86b] text-[#181818]"
                        : "bg-[#181818] text-white hover:bg-[#303030]"
                    } disabled:opacity-80`}
                  >
                    {isUpdating ? "Saving..." : isCompleted ? "Completed ✓" : "Mark Complete"}
                  </button>

                  {isCompleted && (
                    <Link
                      href={`/learn/quiz?topic=${encodeURIComponent(step.resource.title)}&resourceTitle=${encodeURIComponent(step.resource.title)}`}
                      className="rounded-xl bg-[#a98cff] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#9675fa]"
                    >
                      Take Quiz 📝
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* AI Coach Banner */}
      <section className="mt-10 rounded-[28px] bg-[#a98cff] p-7 text-white md:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[2px] text-white/80">AI Learning Assistant</p>
            <h3 className="mt-2 font-display text-3xl">Stuck on a concept?</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/90">
              Ask your AI Coach to explain any topic from this learning path in simple terms.
            </p>
          </div>
          <Link
            href="/ai"
            className="w-fit shrink-0 rounded-xl bg-[#181818] px-6 py-3.5 text-xs font-bold text-white transition hover:bg-[#303030]"
          >
            Ask AI Coach →
          </Link>
        </div>
      </section>
    </PageShell>
  );
}